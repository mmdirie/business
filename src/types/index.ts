export type RoleSlug = 'owner' | 'admin' | 'manager' | 'staff';

export type BusinessType = 'Retail' | 'Restaurant' | 'School' | 'Pharmacy' | 'Service' | 'Wholesale' | 'Other';

export type SubscriptionTier = 'free' | 'starter' | 'professional' | 'business' | 'enterprise';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive';
}

export interface Business {
  id: number;
  owner_id: number;
  name: string;
  slug: string;
  type: BusinessType;
  phone?: string;
  email?: string;
  address?: string;
  currency: string;
  currency_symbol: string;
  timezone: string;
  tax_number?: string;
  tax_rate: number;
  logo_url?: string;
  status: 'active' | 'inactive' | 'archived';
  subscription_tier: SubscriptionTier;
  created_at: string;
}

export interface BusinessMember {
  id: number;
  business_id: number;
  user_id: number;
  role: RoleSlug;
  user_name: string;
  user_email: string;
  user_phone?: string;
  status: 'active' | 'pending' | 'inactive';
  joined_at: string;
}

export interface Category {
  id: number;
  business_id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Product {
  id: number;
  business_id: number;
  category_id?: number;
  supplier_id?: number;
  name: string;
  sku: string;
  barcode?: string;
  purchase_price: number;
  selling_price: number;
  quantity: number;
  minimum_stock: number;
  image_url?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface InventoryTransaction {
  id: number;
  business_id: number;
  product_id: number;
  product_name: string;
  user_id: number;
  user_name: string;
  type: 'stock_in' | 'stock_out' | 'adjustment' | 'sale' | 'purchase';
  quantity: number;
  balance_after: number;
  unit_cost?: number;
  notes?: string;
  reference_id?: string;
  created_at: string;
}

export interface Customer {
  id: number;
  business_id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  balance: number; // positive = owed by customer
  created_at: string;
}

export interface Supplier {
  id: number;
  business_id: number;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  balance: number; // positive = owed to supplier
  created_at: string;
}

export interface SaleItem {
  id: number;
  sale_id?: number;
  product_id: number;
  product_name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  unit_cost: number;
  subtotal: number;
}

export interface Sale {
  id: number;
  business_id: number;
  customer_id?: number;
  customer_name?: string;
  user_id: number;
  cashier_name: string;
  invoice_number: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  grand_total: number;
  paid_amount: number;
  balance_due: number;
  payment_method: 'Cash' | 'Bank' | 'Mobile Money' | 'Credit';
  status: 'completed' | 'pending' | 'cancelled';
  notes?: string;
  sale_date: string;
  items: SaleItem[];
  created_at: string;
}

export interface PurchaseItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_cost: number;
  subtotal: number;
}

export interface Purchase {
  id: number;
  business_id: number;
  supplier_id: number;
  supplier_name: string;
  user_id: number;
  purchase_order_number: string;
  grand_total: number;
  paid_amount: number;
  balance_due: number;
  payment_method: 'Cash' | 'Bank' | 'Mobile Money' | 'Credit';
  status: 'received' | 'ordered' | 'pending';
  purchase_date: string;
  notes?: string;
  items: PurchaseItem[];
  created_at: string;
}

export interface ExpenseCategory {
  id: number;
  business_id: number;
  name: string;
  description?: string;
}

export interface Expense {
  id: number;
  business_id: number;
  category_id?: number;
  category_name?: string;
  user_id: number;
  user_name: string;
  title: string;
  amount: number;
  expense_date: string;
  payment_method: 'Cash' | 'Bank' | 'Mobile Money' | 'Credit';
  description?: string;
  created_at: string;
}

export interface NotificationItem {
  id: number;
  business_id: number;
  title: string;
  message: string;
  type: 'low_stock' | 'new_sale' | 'payment_received' | 'outstanding_balance' | 'system';
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLogItem {
  id: number;
  business_id: number;
  user_id: number;
  user_name: string;
  action: string;
  module: string;
  record_id?: string;
  ip_address: string;
  details?: string;
  created_at: string;
}

export type PermissionSlug =
  | 'view_dashboard'
  | 'manage_products'
  | 'manage_sales'
  | 'manage_customers'
  | 'manage_expenses'
  | 'manage_purchases'
  | 'manage_users'
  | 'manage_reports'
  | 'manage_settings';
