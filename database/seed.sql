-- ========================================================
-- OmniBiz Multi-Tenant SaaS - Initial Seed Data
-- Database: business_saas
-- Target: XAMPP / Apache / MySQL / phpMyAdmin
-- ========================================================

USE `business_saas`;

-- --------------------------------------------------------
-- Roles
-- --------------------------------------------------------
INSERT INTO `roles` (`id`, `name`, `slug`, `description`) VALUES
(1, 'Owner', 'owner', 'Full control over the business, billing, members, and deletion'),
(2, 'Admin', 'admin', 'Can manage all business operations, products, sales, and team members'),
(3, 'Manager', 'manager', 'Can manage products, inventory, customers, suppliers, and view reports'),
(4, 'Staff', 'staff', 'Can record sales, check inventory, and view basic customer details');

-- --------------------------------------------------------
-- Permissions
-- --------------------------------------------------------
INSERT INTO `permissions` (`id`, `name`, `slug`, `module`, `description`) VALUES
(1, 'View Dashboard', 'view_dashboard', 'dashboard', 'Access tenant overview and high-level KPIs'),
(2, 'Manage Products', 'manage_products', 'products', 'Create, update, and manage catalog items'),
(3, 'Manage Sales', 'manage_sales', 'sales', 'Generate invoices, complete checkout, and cancel orders'),
(4, 'Manage Customers', 'manage_customers', 'customers', 'Add, modify, and inspect customer profiles'),
(5, 'Manage Expenses', 'manage_expenses', 'expenses', 'Record operational expenses and receipts'),
(6, 'Manage Purchases', 'manage_purchases', 'purchases', 'Create purchase orders and record supplier deliveries'),
(7, 'Manage Users', 'manage_users', 'team', 'Invite team members and assign roles'),
(8, 'Manage Reports', 'manage_reports', 'reports', 'Export profit & loss, sales, and tax reports'),
(9, 'Manage Settings', 'manage_settings', 'settings', 'Configure business profiles, currency, and tax rates');

-- --------------------------------------------------------
-- Role Permissions
-- --------------------------------------------------------
-- Owner gets all 1..9
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9);

-- Admin gets 1..8
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8);

-- Manager gets 1..6 and 8
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 8);

-- Staff gets 1, 3, 4
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(4, 1), (4, 3), (4, 4);

-- --------------------------------------------------------
-- Seed Users (Passwords hashed using password_hash('password123', PASSWORD_BCRYPT))
-- Hash: $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- --------------------------------------------------------
INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `status`, `email_verified_at`) VALUES
(1, 'Ahmed Sahal', 'ahmed@sahalgroup.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1 (555) 234-5678', 'active', NOW()),
(2, 'Fatima Noor', 'fatima@sahalgroup.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1 (555) 345-6789', 'active', NOW()),
(3, 'Omar Hassan', 'omar@sahalgroup.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1 (555) 456-7890', 'active', NOW()),
(4, 'Amina Ali', 'amina@sahalgroup.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1 (555) 567-8901', 'active', NOW());

-- --------------------------------------------------------
-- Seed Businesses (Tenants owned by Ahmed Sahal)
-- --------------------------------------------------------
INSERT INTO `businesses` (`id`, `owner_id`, `name`, `slug`, `type`, `phone`, `email`, `address`, `currency`, `currency_symbol`, `timezone`, `tax_number`, `tax_rate`, `status`, `subscription_tier`) VALUES
(1, 1, 'Sahal Electronics', 'sahal-electronics', 'Retail', '+1 (555) 100-2001', 'support@sahalelectronics.com', '104 Commerce Way, Tech District, Mogadishu', 'USD', '$', 'Africa/Mogadishu', 'TAX-SO-8829', 5.00, 'active', 'business'),
(2, 1, 'Sahal Restaurant', 'sahal-restaurant', 'Restaurant', '+1 (555) 100-2002', 'dining@sahalrestaurant.com', '45 Ocean View Ave, Beachfront', 'USD', '$', 'Africa/Mogadishu', 'TAX-SO-4491', 8.00, 'active', 'professional'),
(3, 1, 'Sahal Academy', 'sahal-academy', 'School', '+1 (555) 100-2003', 'admissions@sahalacademy.edu', '12 Education Lane, University Quarter', 'USD', '$', 'Africa/Mogadishu', 'TAX-SO-9921', 0.00, 'active', 'starter');

-- --------------------------------------------------------
-- Business Memberships
-- --------------------------------------------------------
-- Ahmed is Owner in all 3
INSERT INTO `business_members` (`business_id`, `user_id`, `role_id`, `status`) VALUES
(1, 1, 1, 'active'),
(2, 1, 1, 'active'),
(3, 1, 1, 'active'),
-- Fatima is Admin in Sahal Electronics and Manager in Sahal Restaurant
(1, 2, 2, 'active'),
(2, 2, 3, 'active'),
-- Omar is Manager in Sahal Electronics
(1, 3, 3, 'active'),
-- Amina is Staff in Sahal Electronics and Sahal Restaurant
(1, 4, 4, 'active'),
(2, 4, 4, 'active');

-- --------------------------------------------------------
-- Categories
-- --------------------------------------------------------
INSERT INTO `categories` (`id`, `business_id`, `name`, `slug`, `description`) VALUES
(1, 1, 'Smartphones & Tablets', 'smartphones-tablets', 'Mobile phones, iPads, and accessories'),
(2, 1, 'Laptops & Computers', 'laptops-computers', 'Ultrabooks, workstations, and monitors'),
(3, 1, 'Audio & Accessories', 'audio-accessories', 'Headphones, earbuds, and speakers'),
(4, 2, 'Main Entrees', 'main-entrees', 'Grilled meats, platters, and rice dishes'),
(5, 2, 'Beverages & Tea', 'beverages-tea', 'Somali spiced tea, fresh juices, drinks'),
(6, 3, 'Courses & Tuition', 'courses-tuition', 'Term enrollment and special tracks');

-- --------------------------------------------------------
-- Suppliers
-- --------------------------------------------------------
INSERT INTO `suppliers` (`id`, `business_id`, `name`, `contact_person`, `email`, `phone`, `address`, `balance`) VALUES
(1, 1, 'Global Tech Distro Ltd', 'Kareem Vance', 'orders@globaltechdistro.com', '+1 (555) 880-1122', 'Port Industrial Park, Zone 4', 0.00),
(2, 1, 'Prime Accessories Wholesale', 'Sarah Jenkins', 'sales@primeaccessories.net', '+1 (555) 770-3344', '88 Logistics Blvd', 450.00),
(3, 2, 'Coastal Farm Fresh Produce', 'Yusuf Barre', 'contact@coastalfresh.com', '+1 (555) 990-2211', 'Farm Gate 3, Valley Road', 120.00);

-- --------------------------------------------------------
-- Customers
-- --------------------------------------------------------
INSERT INTO `customers` (`id`, `business_id`, `name`, `email`, `phone`, `address`, `balance`) VALUES
(1, 1, 'Zahra Abdi', 'zahra.abdi@example.com', '+1 (555) 901-2345', '77 Horizon Tower, Apt 4B', 0.00),
(2, 1, 'Hassan Geedi', 'hassan.geedi@example.com', '+1 (555) 890-3456', '12 Airport Road', 220.00),
(3, 1, 'Dr. Khalid Warsame', 'dr.khalid@sommed.org', '+1 (555) 789-4567', 'Medical Center Suite 12', 0.00),
(4, 2, 'Ayan Jama', 'ayan.jama@example.com', '+1 (555) 678-5678', 'Corner Villa, Ward 3', 0.00);

-- --------------------------------------------------------
-- Products
-- --------------------------------------------------------
INSERT INTO `products` (`id`, `business_id`, `category_id`, `supplier_id`, `name`, `sku`, `barcode`, `purchase_price`, `selling_price`, `quantity`, `minimum_stock`, `status`) VALUES
(1, 1, 1, 1, 'Galaxy Ultra Pro 5G 256GB', 'PHN-GLX-256', '880192837461', 750.00, 980.00, 14, 5, 'active'),
(2, 1, 2, 1, 'MacBook Air 15" M3 16GB', 'LPT-MBA-M3', '194253901824', 1050.00, 1299.00, 8, 3, 'active'),
(3, 1, 3, 2, 'Wireless ANC Noise-Canceling Headphones', 'AUD-ANC-PRO', '693214560912', 45.00, 85.00, 32, 10, 'active'),
(4, 1, 3, 2, 'Multi-Port 100W GaN Fast Charger', 'CHG-GAN-100W', '693214560988', 18.00, 39.00, 4, 8, 'active'), -- Low stock!
(5, 1, 1, 1, 'OLED Smart Tablet 11" WiFi', 'TAB-OLED-11', '880192837555', 380.00, 520.00, 11, 4, 'active'),
-- Sahal Restaurant products
(6, 2, 4, 3, 'Slow-Roasted Lamb & Fragrant Rice Platter', 'FOOD-LAMB-PLT', NULL, 6.50, 16.00, 50, 10, 'active'),
(7, 2, 5, 3, 'Cardamom Spiced Somali Chai (Pot)', 'BEV-CHAI-POT', NULL, 0.80, 4.50, 120, 20, 'active');

-- --------------------------------------------------------
-- Expense Categories
-- --------------------------------------------------------
INSERT INTO `expense_categories` (`id`, `business_id`, `name`, `description`) VALUES
(1, 1, 'Shop Rent', 'Monthly showroom and warehouse rent'),
(2, 1, 'Electricity & Utilities', 'Power generator and grid electric bills'),
(3, 1, 'Internet & Telecom', 'Fiber connection and staff phone stipends'),
(4, 1, 'Staff Salaries', 'Monthly payroll disbursements'),
(5, 2, 'Kitchen Ingredients', 'Meat, rice, spices, and fresh produce');

-- --------------------------------------------------------
-- Expenses
-- --------------------------------------------------------
INSERT INTO `expenses` (`id`, `business_id`, `category_id`, `user_id`, `title`, `amount`, `expense_date`, `payment_method`, `description`) VALUES
(1, 1, 1, 1, 'Showroom Rent - September', 1200.00, CURDATE() - INTERVAL 5 DAY, 'Bank', 'Paid directly to Commercial Properties Co.'),
(2, 1, 2, 1, 'Solar Power & Grid Electricity', 280.00, CURDATE() - INTERVAL 3 DAY, 'Cash', 'Monthly utility clearance'),
(3, 1, 3, 1, 'High-Speed Fiber Business Plan', 110.00, CURDATE() - INTERVAL 1 DAY, 'Bank', 'Hormuud Telecom monthly connection');

-- --------------------------------------------------------
-- Sales
-- --------------------------------------------------------
INSERT INTO `sales` (`id`, `business_id`, `customer_id`, `user_id`, `invoice_number`, `subtotal`, `discount_amount`, `tax_amount`, `grand_total`, `paid_amount`, `balance_due`, `payment_method`, `status`, `sale_date`) VALUES
(1, 1, 1, 1, 'INV-2026-001', 980.00, 0.00, 49.00, 1029.00, 1029.00, 0.00, 'Bank', 'completed', CURDATE() - INTERVAL 4 DAY),
(2, 1, 2, 1, 'INV-2026-002', 1384.00, 50.00, 66.70, 1400.70, 1180.70, 220.00, 'Cash', 'completed', CURDATE() - INTERVAL 2 DAY),
(3, 1, 3, 1, 'INV-2026-003', 1299.00, 0.00, 64.95, 1363.95, 1363.95, 'Mobile Money', 'completed', CURDATE());

-- --------------------------------------------------------
-- Sale Items
-- --------------------------------------------------------
INSERT INTO `sale_items` (`id`, `business_id`, `sale_id`, `product_id`, `quantity`, `unit_price`, `unit_cost`, `subtotal`) VALUES
(1, 1, 1, 1, 1, 980.00, 750.00, 980.00),
(2, 1, 2, 2, 1, 1299.00, 1050.00, 1299.00),
(3, 1, 2, 3, 1, 85.00, 45.00, 85.00),
(4, 1, 3, 2, 1, 1299.00, 1050.00, 1299.00);

-- --------------------------------------------------------
-- Notifications
-- --------------------------------------------------------
INSERT INTO `notifications` (`id`, `business_id`, `user_id`, `title`, `message`, `type`, `link`, `is_read`) VALUES
(1, 1, 1, 'Low Stock Alert', 'Product "Multi-Port 100W GaN Fast Charger" has reached 4 units (minimum is 8).', 'low_stock', '/inventory', 0),
(2, 1, 1, 'New Sale Recorded', 'Invoice INV-2026-003 recorded for $1,363.95 via Mobile Money.', 'new_sale', '/sales', 0),
(3, 1, 1, 'Outstanding Balance', 'Customer Hassan Geedi has an outstanding balance of $220.00 on INV-2026-002.', 'outstanding_balance', '/customers', 1);

-- --------------------------------------------------------
-- Audit Logs
-- --------------------------------------------------------
INSERT INTO `audit_logs` (`id`, `business_id`, `user_id`, `action`, `module`, `record_id`, `ip_address`, `details`) VALUES
(1, 1, 1, 'Created Business Tenant', 'businesses', '1', '127.0.0.1', 'Initialized tenant Sahal Electronics with USD currency'),
(2, 1, 1, 'Created Product', 'products', '1', '127.0.0.1', 'Added product SKU PHN-GLX-256 (Galaxy Ultra Pro 5G)'),
(3, 1, 1, 'Recorded Sale', 'sales', '1', '127.0.0.1', 'Generated invoice INV-2026-001 for customer Zahra Abdi ($1029.00)'),
(4, 1, 2, 'Adjusted Inventory', 'inventory', '4', '127.0.0.1', 'Manager Fatima Noor adjusted stock quantity for CHG-GAN-100W');
