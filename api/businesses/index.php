<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../app/middleware/TenantMiddleware.php';

$db = Database::getConnection();
$userId = $_SESSION['user_id'] ?? null;

if (!$userId) {
    jsonResponse(false, 'Unauthorized', null, 401);
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Retrieve all businesses accessible by this user
        $stmt = $db->prepare("
            SELECT b.*, bm.role_id, r.name as role_name, r.slug as role_slug
            FROM businesses b
            JOIN business_members bm ON bm.business_id = b.id
            JOIN roles r ON r.id = bm.role_id
            WHERE bm.user_id = ? AND bm.status = 'active'
            ORDER BY b.name ASC
        ");
        $stmt->execute([(int)$userId]);
        $businesses = $stmt->fetchAll();

        jsonResponse(true, 'Businesses retrieved', [
            'businesses' => $businesses,
            'active_business_id' => $_SESSION['active_business_id'] ?? null
        ]);
        break;

    case 'POST':
        $payload = json_decode(file_get_contents('php://input'), true);
        $action = $payload['action'] ?? 'create';

        if ($action === 'switch') {
            $targetId = (int)($payload['business_id'] ?? 0);
            // Verify user belongs to this target business
            $chk = $db->prepare("
                SELECT id FROM business_members 
                WHERE business_id = ? AND user_id = ? AND status = 'active'
            ");
            $chk->execute([$targetId, $userId]);
            if (!$chk->fetch()) {
                jsonResponse(false, 'Unauthorized tenant switch attempt.', null, 403);
            }

            $_SESSION['active_business_id'] = $targetId;
            jsonResponse(true, 'Active business switched successfully', ['active_business_id' => $targetId]);
        }

        if ($action === 'create') {
            $name = trim($payload['name'] ?? '');
            $type = $payload['type'] ?? 'Retail';
            $currency = $payload['currency'] ?? 'USD';
            $currencySymbol = $payload['currency_symbol'] ?? '$';
            $phone = trim($payload['phone'] ?? '');
            $email = trim($payload['email'] ?? '');
            $address = trim($payload['address'] ?? '');

            if ($name === '') {
                jsonResponse(false, 'Business name is required', null, 422);
            }

            $slug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $name)) . '-' . bin2hex(random_bytes(2));

            $db->beginTransaction();
            try {
                $bStmt = $db->prepare("
                    INSERT INTO businesses (owner_id, name, slug, type, phone, email, address, currency, currency_symbol, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
                ");
                $bStmt->execute([$userId, $name, $slug, $type, $phone, $email, $address, $currency, $currencySymbol]);
                $bizId = (int)$db->lastInsertId();

                // Add owner membership
                $mStmt = $db->prepare("
                    INSERT INTO business_members (business_id, user_id, role_id, status)
                    VALUES (?, ?, 1, 'active')
                ");
                $mStmt->execute([$bizId, $userId]);

                // Create default categories
                $catStmt = $db->prepare("INSERT INTO categories (business_id, name, slug) VALUES (?, 'General Products', 'general')");
                $catStmt->execute([$bizId]);

                $_SESSION['active_business_id'] = $bizId;
                $db->commit();

                jsonResponse(true, 'Business created successfully', ['business_id' => $bizId], 201);
            } catch (Exception $e) {
                $db->rollBack();
                jsonResponse(false, 'Failed to create business: ' . $e->getMessage(), null, 500);
            }
        }
        break;

    default:
        jsonResponse(false, 'Method not allowed', null, 405);
}
