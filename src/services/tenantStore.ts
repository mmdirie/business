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
  PermissionSlug,
  BusinessType
} from '../types';

import {
  INITIAL_USERS,
  INITIAL_BUSINESSES,
  INITIAL_MEMBERS,
  INITIAL_CATEGORIES,
  INITIAL_SUPPLIERS,
  INITIAL_CUSTOMERS,
  INITIAL_PRODUCTS,
  INITIAL_SALES,
  INITIAL_EXPENSE_CATEGORIES,
  INITIAL_EXPENSES,
  INITIAL_PURCHASES,
  INITIAL_INVENTORY_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  ROLE_PERMISSIONS
} from './mockData';

const STORAGE_KEY = 'omnibiz_saas_state_v1';

export interface SaaSState {
  users: User[];
  businesses: Business[];
  members: BusinessMember[];
  categories: Category[];
  suppliers: Supplier[];
  customers: Customer[];
  products: Product[];
  sales: Sale[];
  expenseCategories: ExpenseCategory[];
  expenses: Expense[];
  purchases: Purchase[];
  inventoryTransactions: InventoryTransaction[];
  notifications: NotificationItem[];
  auditLogs: AuditLogItem[];
  currentUserId: number;
  activeBusinessId: number;
}

class TenantStore {
  private state: SaaSState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): SaaSState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }

    return {
      users: INITIAL_USERS,
      businesses: INITIAL_BUSINESSES,
      members: INITIAL_MEMBERS,
      categories: INITIAL_CATEGORIES,
      suppliers: INITIAL_SUPPLIERS,
      customers: INITIAL_CUSTOMERS,
      products: INITIAL_PRODUCTS,
      sales: INITIAL_SALES,
      expenseCategories: INITIAL_EXPENSE_CATEGORIES,
      expenses: INITIAL_EXPENSES,
      purchases: INITIAL_PURCHASES,
      inventoryTransactions: INITIAL_INVENTORY_TRANSACTIONS,
      notifications: INITIAL_NOTIFICATIONS,
      auditLogs: INITIAL_AUDIT_LOGS,
      currentUserId: 1, // Ahmed Sahal
      activeBusinessId: 1 // Sahal Electronics
    };
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Ignore quota error
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  public resetAll() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = {
      users: INITIAL_USERS,
      businesses: INITIAL_BUSINESSES,
      members: INITIAL_MEMBERS,
      categories: INITIAL_CATEGORIES,
      suppliers: INITIAL_SUPPLIERS,
      customers: INITIAL_CUSTOMERS,
      products: INITIAL_PRODUCTS,
      sales: INITIAL_SALES,
      expenseCategories: INITIAL_EXPENSE_CATEGORIES,
      expenses: INITIAL_EXPENSES,
      purchases: INITIAL_PURCHASES,
      inventoryTransactions: INITIAL_INVENTORY_TRANSACTIONS,
      notifications: INITIAL_NOTIFICATIONS,
      auditLogs: INITIAL_AUDIT_LOGS,
      currentUserId: 1,
      activeBusinessId: 1
    };
    this.saveState();
  }

  // --- Auth & Tenant Context ---

  public getCurrentUser(): User {
    const user = this.state.users.find(u => u.id === this.state.currentUserId);
    return user || this.state.users[0];
  }

  public setCurrentUser(userId: number) {
    this.state.currentUserId = userId;
    // Auto-adjust active business if user is not in the current active business
    const userBusinesses = this.getUserBusinesses(userId);
    if (!userBusinesses.some(b => b.id === this.state.activeBusinessId)) {
      if (userBusinesses.length > 0) {
        this.state.activeBusinessId = userBusinesses[0].id;
      }
    }
    this.saveState();
  }

  public getActiveBusiness(): Business {
    const biz = this.state.businesses.find(b => b.id === this.state.activeBusinessId);
    return biz || this.state.businesses[0];
  }

  public setActiveBusiness(businessId: number): boolean {
    const user = this.getCurrentUser();
    // Validate membership
    const membership = this.state.members.find(
      m => m.business_id === businessId && m.user_id === user.id && m.status === 'active'
    );
    if (!membership && this.state.businesses.find(b => b.id === businessId)?.owner_id !== user.id) {
      return false; // Unauthorized
    }

    this.state.activeBusinessId = businessId;
    this.logAudit('Switched Business', 'businesses', String(businessId), `User switched context to business ID ${businessId}`);
    this.saveState();
    return true;
  }

  public getUserBusinesses(userId: number = this.state.currentUserId): Business[] {
    const memberBizIds = this.state.members
      .filter(m => m.user_id === userId && m.status === 'active')
      .map(m => m.business_id);

    return this.state.businesses.filter(
      b => b.status !== 'archived' && (b.owner_id === userId || memberBizIds.includes(b.id))
    );
  }

  public getCurrentUserRole(): RoleSlug {
    const user = this.getCurrentUser();
    const activeBizId = this.state.activeBusinessId;

    const biz = this.getActiveBusiness();
    if (biz.owner_id === user.id) return 'owner';

    const member = this.state.members.find(
      m => m.business_id === activeBizId && m.user_id === user.id
    );

    return member ? member.role : 'staff';
  }

  public hasPermission(permission: PermissionSlug): boolean {
    const role = this.getCurrentUserRole();
    if (role === 'owner') return true;
    const allowed = ROLE_PERMISSIONS[role] || [];
    return allowed.includes(permission);
  }

  // --- Multi-Tenant Data Queries (Strictly isolated by businessId) ---

  public getProducts(): Product[] {
    return this.state.products.filter(p => p.business_id === this.state.activeBusinessId);
  }

  public getCategories(): Category[] {
    return this.state.categories.filter(c => c.business_id === this.state.activeBusinessId);
  }

  public getCustomers(): Customer[] {
    return this.state.customers.filter(c => c.business_id === this.state.activeBusinessId);
  }

  public getSuppliers(): Supplier[] {
    return this.state.suppliers.filter(s => s.business_id === this.state.activeBusinessId);
  }

  public getSales(): Sale[] {
    return this.state.sales.filter(s => s.business_id === this.state.activeBusinessId);
  }

  public getPurchases(): Purchase[] {
    return this.state.purchases.filter(p => p.business_id === this.state.activeBusinessId);
  }

  public getExpenses(): Expense[] {
    return this.state.expenses.filter(e => e.business_id === this.state.activeBusinessId);
  }

  public getExpenseCategories(): ExpenseCategory[] {
    return this.state.expenseCategories.filter(ec => ec.business_id === this.state.activeBusinessId);
  }

  public getInventoryTransactions(): InventoryTransaction[] {
    return this.state.inventoryTransactions.filter(t => t.business_id === this.state.activeBusinessId);
  }

  public getMembers(): BusinessMember[] {
    return this.state.members.filter(m => m.business_id === this.state.activeBusinessId);
  }

  public getNotifications(): NotificationItem[] {
    return this.state.notifications.filter(n => n.business_id === this.state.activeBusinessId);
  }

  public getAuditLogs(): AuditLogItem[] {
    return this.state.auditLogs.filter(l => l.business_id === this.state.activeBusinessId);
  }

  // --- Multi-Tenant Actions ---

  public logAudit(action: string, module: string, recordId?: string, details?: string) {
    const user = this.getCurrentUser();
    const newLog: AuditLogItem = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      business_id: this.state.activeBusinessId,
      user_id: user.id,
      user_name: user.name,
      action,
      module,
      record_id: recordId,
      ip_address: '127.0.0.1',
      details: details || `${action} on module ${module}`,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    this.state.auditLogs.unshift(newLog);
  }

  public addNotification(title: string, message: string, type: NotificationItem['type'], link?: string) {
    const newNotif: NotificationItem = {
      id: Date.now(),
      business_id: this.state.activeBusinessId,
      title,
      message,
      type,
      link,
      is_read: false,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    this.state.notifications.unshift(newNotif);
  }

  public markNotificationAsRead(id: number) {
    const notif = this.state.notifications.find(n => n.id === id);
    if (notif) {
      notif.is_read = true;
      this.saveState();
    }
  }

  public markAllNotificationsAsRead() {
    this.state.notifications
      .filter(n => n.business_id === this.state.activeBusinessId)
      .forEach(n => {
        n.is_read = true;
      });
    this.saveState();
  }

  // Business Management
  public createBusiness(data: {
    name: string;
    type: BusinessType;
    phone?: string;
    email?: string;
    address?: string;
    currency: string;
    currency_symbol: string;
    tax_rate?: number;
  }): Business {
    const user = this.getCurrentUser();
    const newId = this.state.businesses.length + 1;
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);

    const newBiz: Business = {
      id: newId,
      owner_id: user.id,
      name: data.name,
      slug,
      type: data.type,
      phone: data.phone,
      email: data.email,
      address: data.address,
      currency: data.currency || 'USD',
      currency_symbol: data.currency_symbol || '$',
      timezone: 'UTC',
      tax_rate: data.tax_rate ?? 5.0,
      status: 'active',
      subscription_tier: 'starter',
      created_at: new Date().toISOString().split('T')[0]
    };

    this.state.businesses.push(newBiz);

    // Add owner membership
    const newMember: BusinessMember = {
      id: this.state.members.length + 1,
      business_id: newId,
      user_id: user.id,
      role: 'owner',
      user_name: user.name,
      user_email: user.email,
      status: 'active',
      joined_at: newBiz.created_at
    };
    this.state.members.push(newMember);

    // Add default category
    this.state.categories.push({
      id: this.state.categories.length + 1,
      business_id: newId,
      name: 'General Items',
      slug: 'general-items',
      description: 'Default category for products'
    });

    this.state.activeBusinessId = newId;
    this.logAudit('Created Business', 'businesses', String(newId), `Tenant created: ${newBiz.name}`);
    this.saveState();
    return newBiz;
  }

  public updateBusiness(data: Partial<Business>): boolean {
    if (!this.hasPermission('manage_settings')) return false;

    const biz = this.state.businesses.find(b => b.id === this.state.activeBusinessId);
    if (!biz) return false;

    Object.assign(biz, data);
    this.logAudit('Updated Business Settings', 'settings', String(biz.id), `Updated configurations for ${biz.name}`);
    this.saveState();
    return true;
  }

  // Product Management
  public createProduct(data: {
    name: string;
    sku: string;
    barcode?: string;
    category_id?: number;
    supplier_id?: number;
    purchase_price: number;
    selling_price: number;
    quantity: number;
    minimum_stock: number;
  }): Product | null {
    if (!this.hasPermission('manage_products')) return null;

    const bizId = this.state.activeBusinessId;
    const newId = this.state.products.length + 1;

    const newProd: Product = {
      id: newId,
      business_id: bizId,
      name: data.name,
      sku: data.sku,
      barcode: data.barcode,
      category_id: data.category_id,
      supplier_id: data.supplier_id,
      purchase_price: Number(data.purchase_price),
      selling_price: Number(data.selling_price),
      quantity: Number(data.quantity),
      minimum_stock: Number(data.minimum_stock),
      status: 'active',
      created_at: new Date().toISOString().split('T')[0]
    };

    this.state.products.unshift(newProd);

    // Log initial inventory entry
    if (newProd.quantity > 0) {
      this.state.inventoryTransactions.unshift({
        id: Date.now(),
        business_id: bizId,
        product_id: newId,
        product_name: newProd.name,
        user_id: this.getCurrentUser().id,
        user_name: this.getCurrentUser().name,
        type: 'stock_in',
        quantity: newProd.quantity,
        balance_after: newProd.quantity,
        unit_cost: newProd.purchase_price,
        notes: 'Initial inventory stock upon product creation',
        reference_id: `INIT-${newProd.sku}`,
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
      });
    }

    this.logAudit('Created Product', 'products', String(newId), `Added ${newProd.name} (${newProd.sku})`);
    this.saveState();
    return newProd;
  }

  public updateProduct(id: number, data: Partial<Product>): boolean {
    if (!this.hasPermission('manage_products')) return false;

    const prod = this.state.products.find(p => p.id === id && p.business_id === this.state.activeBusinessId);
    if (!prod) return false;

    Object.assign(prod, data);
    this.logAudit('Updated Product', 'products', String(id), `Updated catalog item ${prod.name}`);
    this.saveState();
    return true;
  }

  public deleteProduct(id: number): boolean {
    if (!this.hasPermission('manage_products')) return false;

    const index = this.state.products.findIndex(p => p.id === id && p.business_id === this.state.activeBusinessId);
    if (index === -1) return false;

    const name = this.state.products[index].name;
    this.state.products.splice(index, 1);
    this.logAudit('Deleted Product', 'products', String(id), `Removed catalog item: ${name}`);
    this.saveState();
    return true;
  }

  // Inventory Adjustment
  public adjustStock(productId: number, delta: number, type: 'stock_in' | 'stock_out' | 'adjustment', reason: string): boolean {
    if (!this.hasPermission('manage_products')) return false;

    const prod = this.state.products.find(p => p.id === productId && p.business_id === this.state.activeBusinessId);
    if (!prod) return false;

    const newQty = Math.max(0, prod.quantity + delta);
    prod.quantity = newQty;

    const user = this.getCurrentUser();
    this.state.inventoryTransactions.unshift({
      id: Date.now(),
      business_id: this.state.activeBusinessId,
      product_id: prod.id,
      product_name: prod.name,
      user_id: user.id,
      user_name: user.name,
      type,
      quantity: delta,
      balance_after: newQty,
      notes: reason,
      reference_id: `ADJ-${Date.now().toString().slice(-4)}`,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });

    if (newQty <= prod.minimum_stock) {
      this.addNotification(
        'Low Stock Warning',
        `Product "${prod.name}" has reached ${newQty} units (minimum: ${prod.minimum_stock}).`,
        'low_stock',
        'inventory'
      );
    }

    this.logAudit('Stock Adjustment', 'inventory', String(prod.id), `${type.toUpperCase()} by ${delta > 0 ? '+' + delta : delta} for ${prod.name} (${reason})`);
    this.saveState();
    return true;
  }

  // Sales & POS Checkout
  public createSale(data: {
    customer_id?: number;
    items: { product_id: number; quantity: number }[];
    discount_amount: number;
    payment_method: 'Cash' | 'Bank' | 'Mobile Money' | 'Credit';
    paid_amount?: number;
    notes?: string;
  }): Sale | null {
    if (!this.hasPermission('manage_sales')) return null;

    const bizId = this.state.activeBusinessId;
    const biz = this.getActiveBusiness();
    const user = this.getCurrentUser();

    // Verify stock
    const saleItems = [];
    let subtotal = 0;

    for (const item of data.items) {
      const prod = this.state.products.find(p => p.id === item.product_id && p.business_id === bizId);
      if (!prod || prod.quantity < item.quantity) {
        return null; // Insufficient stock
      }
      const itemSubtotal = prod.selling_price * item.quantity;
      subtotal += itemSubtotal;
      saleItems.push({
        id: Date.now() + Math.random(),
        product_id: prod.id,
        product_name: prod.name,
        sku: prod.sku,
        quantity: item.quantity,
        unit_price: prod.selling_price,
        unit_cost: prod.purchase_price,
        subtotal: itemSubtotal
      });
    }

    const discount = Number(data.discount_amount || 0);
    const taxableSubtotal = Math.max(0, subtotal - discount);
    const taxAmount = Number(((taxableSubtotal * biz.tax_rate) / 100).toFixed(2));
    const grandTotal = Number((taxableSubtotal + taxAmount).toFixed(2));
    const paidAmount = data.paid_amount !== undefined ? Number(data.paid_amount) : grandTotal;
    const balanceDue = Number(Math.max(0, grandTotal - paidAmount).toFixed(2));

    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(this.state.sales.length + 1).padStart(4, '0')}`;
    const customer = data.customer_id ? this.state.customers.find(c => c.id === data.customer_id) : undefined;

    const newSale: Sale = {
      id: Date.now(),
      business_id: bizId,
      customer_id: customer?.id,
      customer_name: customer?.name,
      user_id: user.id,
      cashier_name: user.name,
      invoice_number: invoiceNumber,
      subtotal,
      discount_amount: discount,
      tax_amount: taxAmount,
      grand_total: grandTotal,
      paid_amount: paidAmount,
      balance_due: balanceDue,
      payment_method: data.payment_method,
      status: 'completed',
      notes: data.notes,
      sale_date: new Date().toISOString().split('T')[0],
      items: saleItems,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    // Decrement inventory & record transactions
    for (const item of saleItems) {
      const prod = this.state.products.find(p => p.id === item.product_id)!;
      prod.quantity -= item.quantity;

      this.state.inventoryTransactions.unshift({
        id: Date.now() + Math.random(),
        business_id: bizId,
        product_id: prod.id,
        product_name: prod.name,
        user_id: user.id,
        user_name: user.name,
        type: 'sale',
        quantity: -item.quantity,
        balance_after: prod.quantity,
        unit_cost: prod.purchase_price,
        notes: `Sale checkout: ${invoiceNumber}`,
        reference_id: invoiceNumber,
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
      });

      // Low stock trigger
      if (prod.quantity <= prod.minimum_stock) {
        this.addNotification(
          'Low Stock Warning',
          `Product "${prod.name}" has reached ${prod.quantity} units remaining after sale.`,
          'low_stock',
          'inventory'
        );
      }
    }

    // Customer balance update if credit
    if (customer && balanceDue > 0) {
      customer.balance += balanceDue;
      this.addNotification(
        'Customer Debt Recorded',
        `${customer.name} has balance due of ${biz.currency_symbol}${balanceDue.toFixed(2)} on invoice ${invoiceNumber}`,
        'outstanding_balance',
        'customers'
      );
    }

    this.state.sales.unshift(newSale);
    this.addNotification(
      'New Sale Recorded',
      `Invoice ${invoiceNumber} completed for ${biz.currency_symbol}${grandTotal.toFixed(2)} (${data.payment_method})`,
      'new_sale',
      'sales'
    );
    this.logAudit('Recorded Sale', 'sales', String(newSale.id), `Generated ${invoiceNumber} for ${biz.currency_symbol}${grandTotal.toFixed(2)}`);
    this.saveState();
    return newSale;
  }

  // Purchases
  public createPurchase(data: {
    supplier_id: number;
    items: { product_id: number; quantity: number; unit_cost: number }[];
    payment_method: 'Cash' | 'Bank' | 'Mobile Money' | 'Credit';
    paid_amount?: number;
    notes?: string;
  }): Purchase | null {
    if (!this.hasPermission('manage_purchases')) return null;

    const bizId = this.state.activeBusinessId;
    const biz = this.getActiveBusiness();
    const user = this.getCurrentUser();
    const supplier = this.state.suppliers.find(s => s.id === data.supplier_id && s.business_id === bizId);
    if (!supplier) return null;

    let grandTotal = 0;
    const purchaseItems = [];

    for (const item of data.items) {
      const prod = this.state.products.find(p => p.id === item.product_id && p.business_id === bizId);
      if (!prod) continue;
      const subtotal = item.quantity * item.unit_cost;
      grandTotal += subtotal;
      purchaseItems.push({
        id: Date.now() + Math.random(),
        product_id: prod.id,
        product_name: prod.name,
        quantity: item.quantity,
        unit_cost: item.unit_cost,
        subtotal
      });

      // Update product cost and quantity
      prod.quantity += item.quantity;
      prod.purchase_price = item.unit_cost;

      // Inventory transaction
      this.state.inventoryTransactions.unshift({
        id: Date.now() + Math.random(),
        business_id: bizId,
        product_id: prod.id,
        product_name: prod.name,
        user_id: user.id,
        user_name: user.name,
        type: 'purchase',
        quantity: item.quantity,
        balance_after: prod.quantity,
        unit_cost: item.unit_cost,
        notes: `PO received from ${supplier.name}`,
        reference_id: `PO-${Date.now().toString().slice(-4)}`,
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
      });
    }

    const paidAmount = data.paid_amount !== undefined ? Number(data.paid_amount) : grandTotal;
    const balanceDue = Math.max(0, grandTotal - paidAmount);
    const poNumber = `PO-${new Date().getFullYear()}-${String(this.state.purchases.length + 1).padStart(4, '0')}`;

    if (balanceDue > 0) {
      supplier.balance += balanceDue;
    }

    const newPurchase: Purchase = {
      id: Date.now(),
      business_id: bizId,
      supplier_id: supplier.id,
      supplier_name: supplier.name,
      user_id: user.id,
      purchase_order_number: poNumber,
      grand_total: grandTotal,
      paid_amount: paidAmount,
      balance_due: balanceDue,
      payment_method: data.payment_method,
      status: 'received',
      purchase_date: new Date().toISOString().split('T')[0],
      notes: data.notes,
      items: purchaseItems,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    this.state.purchases.unshift(newPurchase);
    this.logAudit('Created Purchase Order', 'purchases', String(newPurchase.id), `Received ${poNumber} from ${supplier.name} (${biz.currency_symbol}${grandTotal.toFixed(2)})`);
    this.saveState();
    return newPurchase;
  }

  // Expenses
  public createExpense(data: {
    category_id?: number;
    title: string;
    amount: number;
    expense_date: string;
    payment_method: 'Cash' | 'Bank' | 'Mobile Money' | 'Credit';
    description?: string;
  }): Expense | null {
    if (!this.hasPermission('manage_expenses')) return null;

    const bizId = this.state.activeBusinessId;
    const biz = this.getActiveBusiness();
    const user = this.getCurrentUser();
    const cat = data.category_id ? this.state.expenseCategories.find(c => c.id === data.category_id) : undefined;

    const newExpense: Expense = {
      id: Date.now(),
      business_id: bizId,
      category_id: data.category_id,
      category_name: cat?.name || 'General Expense',
      user_id: user.id,
      user_name: user.name,
      title: data.title,
      amount: Number(data.amount),
      expense_date: data.expense_date || new Date().toISOString().split('T')[0],
      payment_method: data.payment_method,
      description: data.description,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    this.state.expenses.unshift(newExpense);
    this.logAudit('Recorded Expense', 'expenses', String(newExpense.id), `Logged expense: ${newExpense.title} (${biz.currency_symbol}${newExpense.amount.toFixed(2)})`);
    this.saveState();
    return newExpense;
  }

  // Customers & Suppliers
  public createCustomer(data: { name: string; email?: string; phone?: string; address?: string }): Customer {
    const bizId = this.state.activeBusinessId;
    const newCust: Customer = {
      id: Date.now(),
      business_id: bizId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      balance: 0,
      created_at: new Date().toISOString().split('T')[0]
    };
    this.state.customers.unshift(newCust);
    this.logAudit('Added Customer', 'customers', String(newCust.id), `Added customer ${newCust.name}`);
    this.saveState();
    return newCust;
  }

  public createSupplier(data: { name: string; contact_person?: string; email?: string; phone?: string; address?: string }): Supplier {
    const bizId = this.state.activeBusinessId;
    const newSupp: Supplier = {
      id: Date.now(),
      business_id: bizId,
      name: data.name,
      contact_person: data.contact_person,
      email: data.email,
      phone: data.phone,
      address: data.address,
      balance: 0,
      created_at: new Date().toISOString().split('T')[0]
    };
    this.state.suppliers.unshift(newSupp);
    this.logAudit('Added Supplier', 'suppliers', String(newSupp.id), `Added supplier ${newSupp.name}`);
    this.saveState();
    return newSupp;
  }

  // Team & Member management
  public inviteMember(data: { name: string; email: string; role: RoleSlug; phone?: string }): boolean {
    if (!this.hasPermission('manage_users')) return false;

    const bizId = this.state.activeBusinessId;

    // Check if user exists in global users, or create them
    let user = this.state.users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (!user) {
      user = {
        id: this.state.users.length + 1,
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: 'active'
      };
      this.state.users.push(user);
    }

    // Check if already member
    const existing = this.state.members.find(m => m.business_id === bizId && m.user_id === user!.id);
    if (existing) {
      existing.role = data.role;
      existing.status = 'active';
    } else {
      this.state.members.push({
        id: Date.now(),
        business_id: bizId,
        user_id: user.id,
        role: data.role,
        user_name: user.name,
        user_email: user.email,
        user_phone: user.phone,
        status: 'active',
        joined_at: new Date().toISOString().split('T')[0]
      });
    }

    this.logAudit('Invited Team Member', 'team', String(user.id), `Assigned ${data.role} role to ${user.name} (${user.email})`);
    this.saveState();
    return true;
  }

  public updateMemberRole(memberId: number, role: RoleSlug): boolean {
    if (!this.hasPermission('manage_users')) return false;

    const member = this.state.members.find(m => m.id === memberId && m.business_id === this.state.activeBusinessId);
    if (!member) return false;

    // Prevent demoting the owner
    const biz = this.getActiveBusiness();
    if (biz.owner_id === member.user_id && role !== 'owner') {
      return false; // Cannot demote tenant owner
    }

    member.role = role;
    this.logAudit('Updated Member Role', 'team', String(memberId), `Changed role of ${member.user_name} to ${role}`);
    this.saveState();
    return true;
  }

  public removeMember(memberId: number): boolean {
    if (!this.hasPermission('manage_users')) return false;

    const member = this.state.members.find(m => m.id === memberId && m.business_id === this.state.activeBusinessId);
    if (!member) return false;

    const biz = this.getActiveBusiness();
    if (biz.owner_id === member.user_id) {
      return false; // Cannot remove tenant owner
    }

    this.state.members = this.state.members.filter(m => m.id !== memberId);
    this.logAudit('Removed Member', 'team', String(memberId), `Removed ${member.user_name} from business tenant`);
    this.saveState();
    return true;
  }
}

export const tenantStore = new TenantStore();
