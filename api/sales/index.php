<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../app/middleware/TenantMiddleware.php';

$db = Database::getConnection();
$middleware = new TenantMiddleware($db);
$tenant = $middleware->resolveTenantContext();
$businessId = $tenant['business_id'];

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $middleware->authorize(PERM_MANAGE_SALES, $tenant);
        $stmt = $db->prepare("
            SELECT s.*, c.name as customer_name, u.name as cashier_name
            FROM sales s
            LEFT JOIN customers c ON c.id = s.customer_id
            JOIN users u ON u.id = s.user_id
            WHERE s.business_id = ?
            ORDER BY s.id DESC LIMIT 100
        ");
        $stmt->execute([$businessId]);
        $sales = $stmt->fetchAll();

        jsonResponse(true, 'Sales retrieved successfully', $sales);
        break;

    case 'POST':
        $middleware->authorize(PERM_MANAGE_SALES, $tenant);
        $payload = json_decode(file_get_contents('php://input'), true);

        if (empty($payload['items']) || !is_array($payload['items'])) {
            jsonResponse(false, 'Sale must include at least one item', null, 422);
        }

        try {
            $db->beginTransaction();

            $invoiceNumber = 'INV-' . date('Ymd') . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 5));
            $customerId = !empty($payload['customer_id']) ? (int)$payload['customer_id'] : null;
            $discount = (float)($payload['discount_amount'] ?? 0);
            $paymentMethod = $payload['payment_method'] ?? 'Cash';
            $notes = $payload['notes'] ?? '';

            $subtotal = 0;
            $itemsToInsert = [];

            foreach ($payload['items'] as $item) {
                $productId = (int)$item['product_id'];
                $qty = (int)$item['quantity'];

                // Verify product belongs to current tenant and has sufficient stock
                $pStmt = $db->prepare("SELECT id, name, selling_price, purchase_price, quantity FROM products WHERE id = ? AND business_id = ? FOR UPDATE");
                $pStmt->execute([$productId, $businessId]);
                $prod = $pStmt->fetch();

                if (!$prod) {
                    throw new Exception("Product ID {$productId} not found in this business.");
                }
                if ($prod['quantity'] < $qty) {
                    throw new Exception("Insufficient stock for '{$prod['name']}'. Available: {$prod['quantity']}, requested: {$qty}.");
                }

                $itemSubtotal = $prod['selling_price'] * $qty;
                $subtotal += $itemSubtotal;

                $itemsToInsert[] = [
                    'product_id' => $productId,
                    'qty' => $qty,
                    'unit_price' => $prod['selling_price'],
                    'unit_cost' => $prod['purchase_price'],
                    'subtotal' => $itemSubtotal,
                    'old_qty' => $prod['quantity']
                ];
            }

            // Calculate tax
            $taxRate = (float)$tenant['business']['tax_rate'];
            $taxAmount = round(($subtotal - $discount) * ($taxRate / 100), 2);
            $grandTotal = max(0, ($subtotal - $discount) + $taxAmount);
            $paidAmount = isset($payload['paid_amount']) ? (float)$payload['paid_amount'] : $grandTotal;
            $balanceDue = max(0, $grandTotal - $paidAmount);

            // Insert sale record
            $saleStmt = $db->prepare("
                INSERT INTO sales (business_id, customer_id, user_id, invoice_number, subtotal, discount_amount, tax_amount, grand_total, paid_amount, balance_due, payment_method, status, notes, sale_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', ?, CURDATE())
            ");
            $saleStmt->execute([
                $businessId, $customerId, $tenant['user_id'], $invoiceNumber,
                $subtotal, $discount, $taxAmount, $grandTotal, $paidAmount, $balanceDue,
                $paymentMethod, $notes
            ]);
            $saleId = (int)$db->lastInsertId();

            // Insert items and decrement inventory
            $itemInsert = $db->prepare("
                INSERT INTO sale_items (business_id, sale_id, product_id, quantity, unit_price, unit_cost, subtotal)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            $stockUpdate = $db->prepare("
                UPDATE products SET quantity = quantity - ? WHERE id = ? AND business_id = ?
            ");
            $invTx = $db->prepare("
                INSERT INTO inventory_transactions (business_id, product_id, user_id, type, quantity, balance_after, unit_cost, reference_id, notes)
                VALUES (?, ?, ?, 'sale', ?, ?, ?, ?, ?)
            ");

            foreach ($itemsToInsert as $itm) {
                $itemInsert->execute([$businessId, $saleId, $itm['product_id'], $itm['qty'], $itm['unit_price'], $itm['unit_cost'], $itm['subtotal']]);
                $stockUpdate->execute([$itm['qty'], $itm['product_id'], $businessId]);
                $balanceAfter = $itm['old_qty'] - $itm['qty'];
                $invTx->execute([$businessId, $itm['product_id'], $tenant['user_id'], -$itm['qty'], $balanceAfter, $itm['unit_cost'], $invoiceNumber, "Sale: {$invoiceNumber}"]);
            }

            // If customer has balance due, update customer debt
            if ($customerId && $balanceDue > 0) {
                $custDebt = $db->prepare("UPDATE customers SET balance = balance + ? WHERE id = ? AND business_id = ?");
                $custDebt->execute([$balanceDue, $customerId, $businessId]);
            }

            $middleware->logAudit($businessId, $tenant['user_id'], 'Created Sale', 'sales', (string)$saleId, "Invoice {$invoiceNumber} total \${$grandTotal}");

            $db->commit();
            jsonResponse(true, 'Sale created successfully', ['sale_id' => $saleId, 'invoice_number' => $invoiceNumber], 201);
        } catch (Exception $e) {
            $db->rollBack();
            jsonResponse(false, 'Transaction failed: ' . $e->getMessage(), null, 400);
        }
        break;

    default:
        jsonResponse(false, 'Method not allowed', null, 405);
}
