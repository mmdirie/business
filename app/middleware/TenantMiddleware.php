<?php
declare(strict_types=1);

/**
 * TenantMiddleware: Core Multi-Tenant Security Guard
 * Enforces business context isolation, session validation, and RBAC authorization.
 */

class TenantMiddleware {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Resolves and verifies the authenticated tenant context.
     * Returns the validated business object and the user's role/permissions.
     */
    public function resolveTenantContext(): array {
        if (empty($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Unauthenticated session']);
            exit;
        }

        $userId = (int)$_SESSION['user_id'];
        $activeBusinessId = $_SESSION['active_business_id'] ?? null;

        // If no active business in session, find the first business the user belongs to
        if (!$activeBusinessId) {
            $stmt = $this->db->prepare("
                SELECT bm.business_id 
                FROM business_members bm
                WHERE bm.user_id = ? AND bm.status = 'active'
                ORDER BY bm.id ASC LIMIT 1
            ");
            $stmt->execute([$userId]);
            $first = $stmt->fetch();
            if ($first) {
                $activeBusinessId = (int)$first['business_id'];
                $_SESSION['active_business_id'] = $activeBusinessId;
            } else {
                http_response_code(403);
                echo json_encode(['success' => false, 'message' => 'User does not belong to any active business.']);
                exit;
            }
        }

        // Validate that user is genuinely an active member of this business
        $stmt = $this->db->prepare("
            SELECT b.*, bm.role_id, r.name as role_name, r.slug as role_slug
            FROM businesses b
            JOIN business_members bm ON bm.business_id = b.id
            JOIN roles r ON r.id = bm.role_id
            WHERE b.id = ? AND bm.user_id = ? AND bm.status = 'active' AND b.status = 'active'
        ");
        $stmt->execute([$activeBusinessId, $userId]);
        $business = $stmt->fetch();

        if (!$business) {
            http_response_code(403);
            echo json_encode([
                'success' => false, 
                'message' => 'Access Denied: You are not authorized to access this business tenant.'
            ]);
            exit;
        }

        // Fetch user permissions for this role
        $permStmt = $this->db->prepare("
            SELECT p.slug
            FROM permissions p
            JOIN role_permissions rp ON rp.permission_id = p.id
            WHERE rp.role_id = ?
        ");
        $permStmt->execute([(int)$business['role_id']]);
        $permissions = $permStmt->fetchAll(PDO::FETCH_COLUMN);

        return [
            'user_id'     => $userId,
            'business'    => $business,
            'business_id' => (int)$business['id'],
            'role_slug'   => $business['role_slug'],
            'permissions' => $permissions
        ];
    }

    /**
     * Checks if current user in tenant has a specific permission
     */
    public function authorize(string $permissionSlug, array $context): void {
        if (!in_array($permissionSlug, $context['permissions'], true) && $context['role_slug'] !== 'owner') {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'message' => "Forbidden: You do not possess the '{$permissionSlug}' permission."
            ]);
            exit;
        }
    }

    /**
     * Writes an audit log record
     */
    public function logAudit(int $businessId, int $userId, string $action, string $module, ?string $recordId = null, ?string $details = null): void {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $agent = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 250);

        $stmt = $this->db->prepare("
            INSERT INTO audit_logs (business_id, user_id, action, module, record_id, ip_address, user_agent, details)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$businessId, $userId, $action, $module, $recordId, $ip, $agent, $details]);
    }
}
