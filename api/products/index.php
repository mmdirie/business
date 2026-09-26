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
        $middleware->authorize(PERM_MANAGE_PRODUCTS, $tenant);
        $search = trim($_GET['search'] ?? '');
        $category = $_GET['category'] ?? '';

        $sql = "
            SELECT p.*, c.name as category_name, s.name as supplier_name
            FROM products p
            LEFT JOIN categories c ON c.id = p.category_id
            LEFT JOIN suppliers s ON s.id = p.supplier_id
            WHERE p.business_id = ?
        ";
        $params = [$businessId];

        if ($search !== '') {
            $sql .= " AND (p.name LIKE ? OR p.sku LIKE ? OR p.barcode LIKE ?)";
            $wildcard = "%{$search}%";
            $params[] = $wildcard;
            $params[] = $wildcard;
            $params[] = $wildcard;
        }

        if ($category !== '') {
            $sql .= " AND p.category_id = ?";
            $params[] = (int)$category;
        }

        $sql .= " ORDER BY p.id DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $products = $stmt->fetchAll();

        jsonResponse(true, 'Products retrieved successfully', $products);
        break;

    case 'POST':
        $middleware->authorize(PERM_MANAGE_PRODUCTS, $tenant);
        $payload = json_decode(file_get_contents('php://input'), true);

        if (empty($payload['name']) || empty($payload['sku'])) {
            jsonResponse(false, 'Product name and SKU are required', null, 422);
        }

        $name = trim($payload['name']);
        $sku = trim($payload['sku']);
        $categoryId = !empty($payload['category_id']) ? (int)$payload['category_id'] : null;
        $supplierId = !empty($payload['supplier_id']) ? (int)$payload['supplier_id'] : null;
        $purchasePrice = (float)($payload['purchase_price'] ?? 0);
        $sellingPrice = (float)($payload['selling_price'] ?? 0);
        $quantity = (int)($payload['quantity'] ?? 0);
        $minStock = (int)($payload['minimum_stock'] ?? 5);

        // Check SKU uniqueness within this tenant
        $chk = $db->prepare("SELECT id FROM products WHERE business_id = ? AND sku = ?");
        $chk->execute([$businessId, $sku]);
        if ($chk->fetch()) {
            jsonResponse(false, 'SKU already exists in your business catalog.', null, 409);
        }

        $stmt = $db->prepare("
            INSERT INTO products (business_id, category_id, supplier_id, name, sku, purchase_price, selling_price, quantity, minimum_stock)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$businessId, $categoryId, $supplierId, $name, $sku, $purchasePrice, $sellingPrice, $quantity, $minStock]);
        $newId = (int)$db->lastInsertId();

        $middleware->logAudit($businessId, $tenant['user_id'], 'Created Product', 'products', (string)$newId, "Added {$name} ({$sku})");

        jsonResponse(true, 'Product created successfully', ['id' => $newId], 201);
        break;

    default:
        jsonResponse(false, 'Method not allowed', null, 405);
}
