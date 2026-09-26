import {
  User,
  Business,
  BusinessMember,
  Category,
  Product,
  Customer,
  Supplier,
  Sale,
  Purchase,
  Expense,
  ExpenseCategory,
  InventoryTransaction,
  NotificationItem,
  AuditLogItem,
  RoleSlug,
  PermissionSlug
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: 'Ahmed Sahal',
    email: 'ahmed@sahalgroup.com',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    status: 'active'
  },
  {
    id: 2,
    name: 'Fatima Noor',
    email: 'fatima@sahalgroup.com',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    status: 'active'
  },
  {
    id: 3,
    name: 'Omar Hassan',
    email: 'omar@sahalgroup.com',
    phone: '+1 (555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    status: 'active'
  },
  {
    id: 4,
    name: 'Amina Ali',
    email: 'amina@sahalgroup.com',
    phone: '+1 (555) 567-8901',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    status: 'active'
  }
];

export const INITIAL_BUSINESSES: Business[] = [
  {
    id: 1,
    owner_id: 1,
    name: 'Sahal Electronics',
    slug: 'sahal-electronics',
    type: 'Retail',
    phone: '+1 (555) 100-2001',
    email: 'support@sahalelectronics.com',
    address: '104 Commerce Way, Tech District, Mogadishu',
    currency: 'USD',
    currency_symbol: '$',
    timezone: 'Africa/Mogadishu',
    tax_number: 'TAX-SO-8829',
    tax_rate: 5.0,
    status: 'active',
    subscription_tier: 'business',
    created_at: '2026-01-15'
  },
  {
    id: 2,
    owner_id: 1,
    name: 'Sahal Restaurant',
    slug: 'sahal-restaurant',
    type: 'Restaurant',
    phone: '+1 (555) 100-2002',
    email: 'dining@sahalrestaurant.com',
    address: '45 Ocean View Ave, Beachfront, Mogadishu',
    currency: 'USD',
    currency_symbol: '$',
    timezone: 'Africa/Mogadishu',
    tax_number: 'TAX-SO-4491',
    tax_rate: 8.0,
    status: 'active',
    subscription_tier: 'professional',
    created_at: '2026-02-10'
  },
  {
    id: 3,
    owner_id: 1,
    name: 'Sahal Academy',
    slug: 'sahal-academy',
    type: 'School',
    phone: '+1 (555) 100-2003',
    email: 'admissions@sahalacademy.edu',
    address: '12 Education Lane, University Quarter, Mogadishu',
    currency: 'USD',
    currency_symbol: '$',
    timezone: 'Africa/Mogadishu',
    tax_number: 'TAX-SO-9921',
    tax_rate: 0.0,
    status: 'active',
    subscription_tier: 'starter',
    created_at: '2026-03-01'
  }
];

export const INITIAL_MEMBERS: BusinessMember[] = [
  // Sahal Electronics members
  { id: 1, business_id: 1, user_id: 1, role: 'owner', user_name: 'Ahmed Sahal', user_email: 'ahmed@sahalgroup.com', status: 'active', joined_at: '2026-01-15' },
  { id: 2, business_id: 1, user_id: 2, role: 'admin', user_name: 'Fatima Noor', user_email: 'fatima@sahalgroup.com', status: 'active', joined_at: '2026-01-20' },
  { id: 3, business_id: 1, user_id: 3, role: 'manager', user_name: 'Omar Hassan', user_email: 'omar@sahalgroup.com', status: 'active', joined_at: '2026-02-01' },
  { id: 4, business_id: 1, user_id: 4, role: 'staff', user_name: 'Amina Ali', user_email: 'amina@sahalgroup.com', status: 'active', joined_at: '2026-02-15' },
  // Sahal Restaurant members
  { id: 5, business_id: 2, user_id: 1, role: 'owner', user_name: 'Ahmed Sahal', user_email: 'ahmed@sahalgroup.com', status: 'active', joined_at: '2026-02-10' },
  { id: 6, business_id: 2, user_id: 2, role: 'manager', user_name: 'Fatima Noor', user_email: 'fatima@sahalgroup.com', status: 'active', joined_at: '2026-02-12' },
  { id: 7, business_id: 2, user_id: 4, role: 'staff', user_name: 'Amina Ali', user_email: 'amina@sahalgroup.com', status: 'active', joined_at: '2026-02-14' },
  // Sahal Academy members
  { id: 8, business_id: 3, user_id: 1, role: 'owner', user_name: 'Ahmed Sahal', user_email: 'ahmed@sahalgroup.com', status: 'active', joined_at: '2026-03-01' }
];

export const ROLE_PERMISSIONS: Record<RoleSlug, PermissionSlug[]> = {
  owner: [
    'view_dashboard',
    'manage_products',
    'manage_sales',
    'manage_customers',
    'manage_expenses',
    'manage_purchases',
    'manage_users',
    'manage_reports',
    'manage_settings'
  ],
  admin: [
    'view_dashboard',
    'manage_products',
    'manage_sales',
    'manage_customers',
    'manage_expenses',
    'manage_purchases',
    'manage_users',
    'manage_reports'
  ],
  manager: [
    'view_dashboard',
    'manage_products',
    'manage_sales',
    'manage_customers',
    'manage_expenses',
    'manage_purchases',
    'manage_reports'
  ],
  staff: [
    'view_dashboard',
    'manage_sales',
    'manage_customers'
  ]
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: 1, business_id: 1, name: 'Smartphones & Tablets', slug: 'smartphones-tablets', description: 'Mobile phones and tablets' },
  { id: 2, business_id: 1, name: 'Laptops & Computers', slug: 'laptops-computers', description: 'Ultrabooks and desktops' },
  { id: 3, business_id: 1, name: 'Audio & Accessories', slug: 'audio-accessories', description: 'Headphones and fast chargers' },
  { id: 4, business_id: 2, name: 'Main Entrees', slug: 'main-entrees', description: 'Grilled meats and platters' },
  { id: 5, business_id: 2, name: 'Beverages & Spiced Tea', slug: 'beverages-spiced-tea', description: 'Somali tea and fresh juices' },
  { id: 6, business_id: 3, name: 'Academic Tuition & Courses', slug: 'courses', description: 'Student semester enrollment' }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 1,
    business_id: 1,
    name: 'Global Tech Distro Ltd',
    contact_person: 'Kareem Vance',
    email: 'orders@globaltechdistro.com',
    phone: '+1 (555) 880-1122',
    address: 'Port Industrial Park, Zone 4',
    balance: 0,
    created_at: '2026-01-16'
  },
  {
    id: 2,
    business_id: 1,
    name: 'Prime Accessories Wholesale',
    contact_person: 'Sarah Jenkins',
    email: 'sales@primeaccessories.net',
    phone: '+1 (555) 770-3344',
    address: '88 Logistics Blvd',
    balance: 450,
    created_at: '2026-01-20'
  },
  {
    id: 3,
    business_id: 2,
    name: 'Coastal Farm Fresh Produce',
    contact_person: 'Yusuf Barre',
    email: 'contact@coastalfresh.com',
    phone: '+1 (555) 990-2211',
    address: 'Farm Gate 3, Valley Road',
    balance: 120,
    created_at: '2026-02-11'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 1,
    business_id: 1,
    name: 'Zahra Abdi',
    email: 'zahra.abdi@example.com',
    phone: '+1 (555) 901-2345',
    address: '77 Horizon Tower, Apt 4B',
    balance: 0,
    created_at: '2026-01-25'
  },
  {
    id: 2,
    business_id: 1,
    name: 'Hassan Geedi',
    email: 'hassan.geedi@example.com',
    phone: '+1 (555) 890-3456',
    address: '12 Airport Road',
    balance: 220,
    created_at: '2026-02-02'
  },
  {
    id: 3,
    business_id: 1,
    name: 'Dr. Khalid Warsame',
    email: 'dr.khalid@sommed.org',
    phone: '+1 (555) 789-4567',
    address: 'Medical Center Suite 12',
    balance: 0,
    created_at: '2026-02-14'
  },
  {
    id: 4,
    business_id: 2,
    name: 'Ayan Jama',
    email: 'ayan.jama@example.com',
    phone: '+1 (555) 678-5678',
    address: 'Corner Villa, Ward 3',
    balance: 0,
    created_at: '2026-02-15'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    business_id: 1,
    category_id: 1,
    supplier_id: 1,
    name: 'Galaxy Ultra Pro 5G 256GB',
    sku: 'PHN-GLX-256',
    barcode: '880192837461',
    purchase_price: 750,
    selling_price: 980,
    quantity: 14,
    minimum_stock: 5,
    status: 'active',
    created_at: '2026-01-18'
  },
  {
    id: 2,
    business_id: 1,
    category_id: 2,
    supplier_id: 1,
    name: 'MacBook Air 15" M3 16GB',
    sku: 'LPT-MBA-M3',
    barcode: '194253901824',
    purchase_price: 1050,
    selling_price: 1299,
    quantity: 8,
    minimum_stock: 3,
    status: 'active',
    created_at: '2026-01-19'
  },
  {
    id: 3,
    business_id: 1,
    category_id: 3,
    supplier_id: 2,
    name: 'Wireless ANC Noise-Canceling Headphones',
    sku: 'AUD-ANC-PRO',
    barcode: '693214560912',
    purchase_price: 45,
    selling_price: 85,
    quantity: 32,
    minimum_stock: 10,
    status: 'active',
    created_at: '2026-01-21'
  },
  {
    id: 4,
    business_id: 1,
    category_id: 3,
    supplier_id: 2,
    name: 'Multi-Port 100W GaN Fast Charger',
    sku: 'CHG-GAN-100W',
    barcode: '693214560988',
    purchase_price: 18,
    selling_price: 39,
    quantity: 4, // Low stock alert! (below min 8)
    minimum_stock: 8,
    status: 'active',
    created_at: '2026-01-22'
  },
  {
    id: 5,
    business_id: 1,
    category_id: 1,
    supplier_id: 1,
    name: 'OLED Smart Tablet 11" WiFi 128GB',
    sku: 'TAB-OLED-11',
    barcode: '880192837555',
    purchase_price: 380,
    selling_price: 520,
    quantity: 11,
    minimum_stock: 4,
    status: 'active',
    created_at: '2026-01-25'
  },
  // Restaurant Products
  {
    id: 6,
    business_id: 2,
    category_id: 4,
    supplier_id: 3,
    name: 'Slow-Roasted Lamb & Fragrant Rice Platter',
    sku: 'FOOD-LAMB-PLT',
    purchase_price: 6.5,
    selling_price: 16.0,
    quantity: 48,
    minimum_stock: 10,
    status: 'active',
    created_at: '2026-02-12'
  },
  {
    id: 7,
    business_id: 2,
    category_id: 5,
    supplier_id: 3,
    name: 'Cardamom Spiced Somali Chai (Pot)',
    sku: 'BEV-CHAI-POT',
    purchase_price: 0.8,
    selling_price: 4.5,
    quantity: 115,
    minimum_stock: 20,
    status: 'active',
    created_at: '2026-02-12'
  },
  // Academy Products
  {
    id: 8,
    business_id: 3,
    category_id: 6,
    name: 'Full Stack Web Engineering Term 1',
    sku: 'CRS-FSW-01',
    purchase_price: 100,
    selling_price: 450,
    quantity: 35,
    minimum_stock: 5,
    status: 'active',
    created_at: '2026-03-02'
  }
];

export const INITIAL_SALES: Sale[] = [
  {
    id: 1,
    business_id: 1,
    customer_id: 1,
    customer_name: 'Zahra Abdi',
    user_id: 1,
    cashier_name: 'Ahmed Sahal',
    invoice_number: 'INV-2026-001',
    subtotal: 980,
    discount_amount: 0,
    tax_amount: 49,
    grand_total: 1029,
    paid_amount: 1029,
    balance_due: 0,
    payment_method: 'Bank',
    status: 'completed',
    sale_date: '2026-09-20',
    created_at: '2026-09-20 14:32:00',
    items: [
      { id: 1, product_id: 1, product_name: 'Galaxy Ultra Pro 5G 256GB', sku: 'PHN-GLX-256', quantity: 1, unit_price: 980, unit_cost: 750, subtotal: 980 }
    ]
  },
  {
    id: 2,
    business_id: 1,
    customer_id: 2,
    customer_name: 'Hassan Geedi',
    user_id: 1,
    cashier_name: 'Ahmed Sahal',
    invoice_number: 'INV-2026-002',
    subtotal: 1384,
    discount_amount: 50,
    tax_amount: 66.7,
    grand_total: 1400.7,
    paid_amount: 1180.7,
    balance_due: 220,
    payment_method: 'Cash',
    status: 'completed',
    sale_date: '2026-09-23',
    created_at: '2026-09-23 11:15:00',
    items: [
      { id: 2, product_id: 2, product_name: 'MacBook Air 15" M3 16GB', sku: 'LPT-MBA-M3', quantity: 1, unit_price: 1299, unit_cost: 1050, subtotal: 1299 },
      { id: 3, product_id: 3, product_name: 'Wireless ANC Noise-Canceling Headphones', sku: 'AUD-ANC-PRO', quantity: 1, unit_price: 85, unit_cost: 45, subtotal: 85 }
    ]
  },
  {
    id: 3,
    business_id: 1,
    customer_id: 3,
    customer_name: 'Dr. Khalid Warsame',
    user_id: 2,
    cashier_name: 'Fatima Noor',
    invoice_number: 'INV-2026-003',
    subtotal: 1299,
    discount_amount: 0,
    tax_amount: 64.95,
    grand_total: 1363.95,
    paid_amount: 1363.95,
    balance_due: 0,
    payment_method: 'Mobile Money',
    status: 'completed',
    sale_date: '2026-09-25',
    created_at: '2026-09-25 16:45:00',
    items: [
      { id: 4, product_id: 2, product_name: 'MacBook Air 15" M3 16GB', sku: 'LPT-MBA-M3', quantity: 1, unit_price: 1299, unit_cost: 1050, subtotal: 1299 }
    ]
  },
  // Restaurant sale
  {
    id: 4,
    business_id: 2,
    customer_id: 4,
    customer_name: 'Ayan Jama',
    user_id: 1,
    cashier_name: 'Ahmed Sahal',
    invoice_number: 'INV-REST-010',
    subtotal: 36.5,
    discount_amount: 0,
    tax_amount: 2.92,
    grand_total: 39.42,
    paid_amount: 39.42,
    balance_due: 0,
    payment_method: 'Cash',
    status: 'completed',
    sale_date: '2026-09-24',
    created_at: '2026-09-24 19:10:00',
    items: [
      { id: 5, product_id: 6, product_name: 'Slow-Roasted Lamb & Fragrant Rice Platter', sku: 'FOOD-LAMB-PLT', quantity: 2, unit_price: 16.0, unit_cost: 6.5, subtotal: 32.0 },
      { id: 6, product_id: 7, product_name: 'Cardamom Spiced Somali Chai (Pot)', sku: 'BEV-CHAI-POT', quantity: 1, unit_price: 4.5, unit_cost: 0.8, subtotal: 4.5 }
    ]
  }
];

export const INITIAL_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 1, business_id: 1, name: 'Shop Rent & Lease', description: 'Showroom premises rent' },
  { id: 2, business_id: 1, name: 'Electricity & Utilities', description: 'Power grid and generator diesel' },
  { id: 3, business_id: 1, name: 'Internet & Telecom', description: 'High-speed business fiber' },
  { id: 4, business_id: 1, name: 'Salaries & Payroll', description: 'Staff wages' },
  { id: 5, business_id: 2, name: 'Kitchen Supplies', description: 'Gas, charcoal, and cookware' }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 1,
    business_id: 1,
    category_id: 1,
    category_name: 'Shop Rent & Lease',
    user_id: 1,
    user_name: 'Ahmed Sahal',
    title: 'Commercial Showroom Rent - September',
    amount: 1200,
    expense_date: '2026-09-01',
    payment_method: 'Bank',
    description: 'Wire transferred to Mogadishu Real Estate Corp',
    created_at: '2026-09-01 10:00:00'
  },
  {
    id: 2,
    business_id: 1,
    category_id: 2,
    category_name: 'Electricity & Utilities',
    user_id: 1,
    user_name: 'Ahmed Sahal',
    title: 'Commercial Power & Solar Grid Fee',
    amount: 280,
    expense_date: '2026-09-18',
    payment_method: 'Cash',
    description: 'Billed for September utility consumption',
    created_at: '2026-09-18 11:30:00'
  },
  {
    id: 3,
    business_id: 1,
    category_id: 3,
    category_name: 'Internet & Telecom',
    user_id: 2,
    user_name: 'Fatima Noor',
    title: 'Hormuud Telecom Fiber Dedicated 100Mbps',
    amount: 110,
    expense_date: '2026-09-22',
    payment_method: 'Mobile Money',
    description: 'Monthly office connectivity subscription',
    created_at: '2026-09-22 09:20:00'
  },
  // Restaurant Expense
  {
    id: 4,
    business_id: 2,
    category_id: 5,
    category_name: 'Kitchen Supplies',
    user_id: 1,
    user_name: 'Ahmed Sahal',
    title: 'Commercial Gas Cylinders Refill (x4)',
    amount: 180,
    expense_date: '2026-09-15',
    payment_method: 'Cash',
    description: 'Four 50kg LPG tanks for main kitchen stoves',
    created_at: '2026-09-15 14:00:00'
  }
];

export const INITIAL_PURCHASES: Purchase[] = [
  {
    id: 1,
    business_id: 1,
    supplier_id: 1,
    supplier_name: 'Global Tech Distro Ltd',
    user_id: 1,
    purchase_order_number: 'PO-2026-001',
    grand_total: 4500,
    paid_amount: 4500,
    balance_due: 0,
    payment_method: 'Bank',
    status: 'received',
    purchase_date: '2026-09-10',
    notes: 'Received in full at central warehouse dock',
    created_at: '2026-09-10 10:15:00',
    items: [
      { id: 1, product_id: 1, product_name: 'Galaxy Ultra Pro 5G 256GB', quantity: 6, unit_cost: 750, subtotal: 4500 }
    ]
  },
  {
    id: 2,
    business_id: 1,
    supplier_id: 2,
    supplier_name: 'Prime Accessories Wholesale',
    user_id: 2,
    purchase_order_number: 'PO-2026-002',
    grand_total: 1350,
    paid_amount: 900,
    balance_due: 450,
    payment_method: 'Bank',
    status: 'received',
    purchase_date: '2026-09-17',
    notes: 'Partial deposit paid, 450 due next week',
    created_at: '2026-09-17 13:40:00',
    items: [
      { id: 2, product_id: 3, product_name: 'Wireless ANC Noise-Canceling Headphones', quantity: 20, unit_cost: 45, subtotal: 900 },
      { id: 3, product_id: 4, product_name: 'Multi-Port 100W GaN Fast Charger', quantity: 25, unit_cost: 18, subtotal: 450 }
    ]
  }
];

export const INITIAL_INVENTORY_TRANSACTIONS: InventoryTransaction[] = [
  {
    id: 1,
    business_id: 1,
    product_id: 1,
    product_name: 'Galaxy Ultra Pro 5G 256GB',
    user_id: 1,
    user_name: 'Ahmed Sahal',
    type: 'purchase',
    quantity: 6,
    balance_after: 15,
    unit_cost: 750,
    notes: 'PO-2026-001 Delivery received',
    reference_id: 'PO-2026-001',
    created_at: '2026-09-10 10:15:00'
  },
  {
    id: 2,
    business_id: 1,
    product_id: 1,
    product_name: 'Galaxy Ultra Pro 5G 256GB',
    user_id: 1,
    user_name: 'Ahmed Sahal',
    type: 'sale',
    quantity: -1,
    balance_after: 14,
    notes: 'Sale invoice INV-2026-001',
    reference_id: 'INV-2026-001',
    created_at: '2026-09-20 14:32:00'
  },
  {
    id: 3,
    business_id: 1,
    product_id: 4,
    product_name: 'Multi-Port 100W GaN Fast Charger',
    user_id: 2,
    user_name: 'Fatima Noor',
    type: 'adjustment',
    quantity: -2,
    balance_after: 4,
    notes: 'Damaged packaging during shelf reorganization',
    reference_id: 'ADJ-0922',
    created_at: '2026-09-22 16:00:00'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    business_id: 1,
    title: 'Low Stock Alert',
    message: 'Multi-Port 100W GaN Fast Charger is down to 4 units (threshold: 8). Reorder recommended.',
    type: 'low_stock',
    link: 'inventory',
    is_read: false,
    created_at: '2026-09-25 09:30:00'
  },
  {
    id: 2,
    business_id: 1,
    title: 'New Sale Completed',
    message: 'Invoice INV-2026-003 completed for $1,363.95 via Mobile Money.',
    type: 'new_sale',
    link: 'sales',
    is_read: false,
    created_at: '2026-09-25 16:45:00'
  },
  {
    id: 3,
    business_id: 1,
    title: 'Receivable Due',
    message: 'Customer Hassan Geedi has a pending balance of $220.00 on invoice INV-2026-002.',
    type: 'outstanding_balance',
    link: 'customers',
    is_read: true,
    created_at: '2026-09-23 11:15:00'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 1,
    business_id: 1,
    user_id: 1,
    user_name: 'Ahmed Sahal',
    action: 'Created Business Tenant',
    module: 'businesses',
    record_id: '1',
    ip_address: '192.168.1.101',
    details: 'Initialized tenant Sahal Electronics with USD currency and 5.0% sales tax',
    created_at: '2026-01-15 08:00:00'
  },
  {
    id: 2,
    business_id: 1,
    user_id: 1,
    user_name: 'Ahmed Sahal',
    action: 'Created Product',
    module: 'products',
    record_id: '1',
    ip_address: '192.168.1.101',
    details: 'Catalog item added: Galaxy Ultra Pro 5G 256GB (SKU: PHN-GLX-256)',
    created_at: '2026-01-18 10:20:00'
  },
  {
    id: 3,
    business_id: 1,
    user_id: 1,
    user_name: 'Ahmed Sahal',
    action: 'Created Sale Order',
    module: 'sales',
    record_id: '1',
    ip_address: '192.168.1.101',
    details: 'Generated INV-2026-001 for customer Zahra Abdi ($1,029.00)',
    created_at: '2026-09-20 14:32:00'
  },
  {
    id: 4,
    business_id: 1,
    user_id: 2,
    user_name: 'Fatima Noor',
    action: 'Adjusted Stock Level',
    module: 'inventory',
    record_id: '4',
    ip_address: '192.168.1.105',
    details: 'Adjusted Multi-Port 100W GaN Fast Charger from 6 to 4 units',
    created_at: '2026-09-22 16:00:00'
  },
  {
    id: 5,
    business_id: 1,
    user_id: 2,
    user_name: 'Fatima Noor',
    action: 'Recorded Sale Order',
    module: 'sales',
    record_id: '3',
    ip_address: '192.168.1.105',
    details: 'Generated INV-2026-003 for Dr. Khalid Warsame ($1,363.95)',
    created_at: '2026-09-25 16:45:00'
  }
];
