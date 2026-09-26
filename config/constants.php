<?php
declare(strict_types=1);

/**
 * OmniBiz Multi-Tenant SaaS - App Constants & Permissions
 */

define('APP_NAME', 'OmniBiz SaaS');
define('APP_VERSION', '1.0.0');
define('BASE_URL', '/business-saas');

// Roles
define('ROLE_OWNER', 'owner');
define('ROLE_ADMIN', 'admin');
define('ROLE_MANAGER', 'manager');
define('ROLE_STAFF', 'staff');

// Permissions
define('PERM_VIEW_DASHBOARD', 'view_dashboard');
define('PERM_MANAGE_PRODUCTS', 'manage_products');
define('PERM_MANAGE_SALES', 'manage_sales');
define('PERM_MANAGE_CUSTOMERS', 'manage_customers');
define('PERM_MANAGE_EXPENSES', 'manage_expenses');
define('PERM_MANAGE_PURCHASES', 'manage_purchases');
define('PERM_MANAGE_USERS', 'manage_users');
define('PERM_MANAGE_REPORTS', 'manage_reports');
define('PERM_MANAGE_SETTINGS', 'manage_settings');
