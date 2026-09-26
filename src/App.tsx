import React, { useState, useEffect } from 'react';
import { tenantStore } from './services/tenantStore';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { InvoiceModal } from './components/InvoiceModal';
import { NewSaleModal } from './components/NewSaleModal';
import { NewProductModal } from './components/NewProductModal';
import { NewBusinessModal } from './components/NewBusinessModal';
import { NewExpenseModal } from './components/NewExpenseModal';
import { NewPurchaseModal } from './components/NewPurchaseModal';
import { NewCustomerModal } from './components/NewCustomerModal';
import { NewSupplierModal } from './components/NewSupplierModal';
import { StockAdjustModal } from './components/StockAdjustModal';
import { InviteMemberModal } from './components/InviteMemberModal';
import { XamppExportModal } from './components/XamppExportModal';
import { LandingPage } from './components/LandingPage';

import { DashboardView } from './views/DashboardView';
import { ProductsView } from './views/ProductsView';
import { InventoryView } from './views/InventoryView';
import { SalesView } from './views/SalesView';
import { PurchasesView } from './views/PurchasesView';
import { CustomersView } from './views/CustomersView';
import { SuppliersView } from './views/SuppliersView';
import { ExpensesView } from './views/ExpensesView';
import { ReportsView } from './views/ReportsView';
import { TeamView } from './views/TeamView';
import { RolesView } from './views/RolesView';
import { AuditLogsView } from './views/AuditLogsView';
import { SettingsView } from './views/SettingsView';
import { BusinessesView } from './views/BusinessesView';
import { PricingView } from './views/PricingView';
import { Sale, Product } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Tenant state synced from tenantStore
  const [business, setBusiness] = useState(tenantStore.getActiveBusiness());
  const [currentUser, setCurrentUser] = useState(tenantStore.getCurrentUser());
  const [products, setProducts] = useState(tenantStore.getProducts());
  const [categories, setCategories] = useState(tenantStore.getCategories());
  const [customers, setCustomers] = useState(tenantStore.getCustomers());
  const [suppliers, setSuppliers] = useState(tenantStore.getSuppliers());
  const [sales, setSales] = useState(tenantStore.getSales());
  const [purchases, setPurchases] = useState(tenantStore.getPurchases());
  const [expenses, setExpenses] = useState(tenantStore.getExpenses());
  const [expenseCategories, setExpenseCategories] = useState(tenantStore.getExpenseCategories());
  const [inventoryTransactions, setInventoryTransactions] = useState(tenantStore.getInventoryTransactions());
  const [members, setMembers] = useState(tenantStore.getMembers());
  const [auditLogs, setAuditLogs] = useState(tenantStore.getAuditLogs());
  const [userBusinesses, setUserBusinesses] = useState(tenantStore.getUserBusinesses());

  // Modals state
  const [selectedInvoice, setSelectedInvoice] = useState<Sale | null>(null);
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [isNewBusinessOpen, setIsNewBusinessOpen] = useState(false);
  const [isNewExpenseOpen, setIsNewExpenseOpen] = useState(false);
  const [isNewPurchaseOpen, setIsNewPurchaseOpen] = useState(false);
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
  const [isNewSupplierOpen, setIsNewSupplierOpen] = useState(false);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [isInviteMemberOpen, setIsInviteMemberOpen] = useState(false);
  const [isXamppExportOpen, setIsXamppExportOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = tenantStore.subscribe(() => {
      setBusiness(tenantStore.getActiveBusiness());
      setCurrentUser(tenantStore.getCurrentUser());
      setProducts(tenantStore.getProducts());
      setCategories(tenantStore.getCategories());
      setCustomers(tenantStore.getCustomers());
      setSuppliers(tenantStore.getSuppliers());
      setSales(tenantStore.getSales());
      setPurchases(tenantStore.getPurchases());
      setExpenses(tenantStore.getExpenses());
      setExpenseCategories(tenantStore.getExpenseCategories());
      setInventoryTransactions(tenantStore.getInventoryTransactions());
      setMembers(tenantStore.getMembers());
      setAuditLogs(tenantStore.getAuditLogs());
      setUserBusinesses(tenantStore.getUserBusinesses());
    });
    return unsubscribe;
  }, []);

  const handleSaleCompleted = (sale: Sale) => {
    setIsNewSaleOpen(false);
    setSelectedInvoice(sale);
  };

  // If user chooses public landing page view
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage
          onEnterApp={() => setCurrentView('dashboard')}
          onOpenXamppModal={() => setIsXamppExportOpen(true)}
        />
        {isXamppExportOpen && (
          <XamppExportModal onClose={() => setIsXamppExportOpen(false)} />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8CF] text-neutral-900 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <Header
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onOpenNewSale={() => setIsNewSaleOpen(true)}
          onOpenNewProduct={() => setIsNewProductOpen(true)}
          onOpenNewBusiness={() => setIsNewBusinessOpen(true)}
          onOpenXamppExport={() => setIsXamppExportOpen(true)}
          onSelectView={setCurrentView}
        />

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              business={business}
              sales={sales}
              expenses={expenses}
              products={products}
              customers={customers}
              auditLogs={auditLogs}
              onOpenNewSale={() => setIsNewSaleOpen(true)}
              onOpenNewProduct={() => setIsNewProductOpen(true)}
              onOpenNewExpense={() => setIsNewExpenseOpen(true)}
              onViewInvoice={sale => setSelectedInvoice(sale)}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'businesses' && (
            <BusinessesView
              businesses={userBusinesses}
              activeBusiness={business}
              currentUser={currentUser}
              onOpenNewBusiness={() => setIsNewBusinessOpen(true)}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'products' && (
            <ProductsView
              business={business}
              products={products}
              categories={categories}
              suppliers={suppliers}
              onOpenNewProduct={() => setIsNewProductOpen(true)}
              onAdjustStock={prod => setAdjustingProduct(prod)}
            />
          )}

          {currentView === 'inventory' && (
            <InventoryView
              business={business}
              products={products}
              transactions={inventoryTransactions}
              onAdjustStock={prod => setAdjustingProduct(prod)}
            />
          )}

          {currentView === 'sales' && (
            <SalesView
              business={business}
              sales={sales}
              onOpenNewSale={() => setIsNewSaleOpen(true)}
              onViewInvoice={sale => setSelectedInvoice(sale)}
            />
          )}

          {currentView === 'purchases' && (
            <PurchasesView
              business={business}
              purchases={purchases}
              suppliers={suppliers}
              onOpenNewPurchase={() => setIsNewPurchaseOpen(true)}
            />
          )}

          {currentView === 'customers' && (
            <CustomersView
              business={business}
              customers={customers}
              onOpenNewCustomer={() => setIsNewCustomerOpen(true)}
            />
          )}

          {currentView === 'suppliers' && (
            <SuppliersView
              business={business}
              suppliers={suppliers}
              onOpenNewSupplier={() => setIsNewSupplierOpen(true)}
            />
          )}

          {currentView === 'expenses' && (
            <ExpensesView
              business={business}
              expenses={expenses}
              categories={expenseCategories}
              onOpenNewExpense={() => setIsNewExpenseOpen(true)}
            />
          )}

          {currentView === 'reports' && (
            <ReportsView
              business={business}
              sales={sales}
              expenses={expenses}
              purchases={purchases}
              products={products}
            />
          )}

          {currentView === 'team' && (
            <TeamView
              business={business}
              members={members}
              onOpenInvite={() => setIsInviteMemberOpen(true)}
            />
          )}

          {currentView === 'roles' && <RolesView />}

          {currentView === 'audit' && (
            <AuditLogsView business={business} logs={auditLogs} />
          )}

          {currentView === 'settings' && <SettingsView business={business} />}

          {currentView === 'pricing' && <PricingView business={business} />}
        </main>
      </div>

      {/* Global Modals */}
      {selectedInvoice && (
        <InvoiceModal
          sale={selectedInvoice}
          business={business}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {isNewSaleOpen && (
        <NewSaleModal
          business={business}
          products={products}
          customers={customers}
          onClose={() => setIsNewSaleOpen(false)}
          onSaleCompleted={handleSaleCompleted}
        />
      )}

      {isNewProductOpen && (
        <NewProductModal
          business={business}
          categories={categories}
          suppliers={suppliers}
          onClose={() => setIsNewProductOpen(false)}
          onSuccess={() => {}}
        />
      )}

      {isNewBusinessOpen && (
        <NewBusinessModal
          onClose={() => setIsNewBusinessOpen(false)}
          onSuccess={() => setCurrentView('dashboard')}
        />
      )}

      {isNewExpenseOpen && (
        <NewExpenseModal
          business={business}
          categories={expenseCategories}
          onClose={() => setIsNewExpenseOpen(false)}
          onSuccess={() => {}}
        />
      )}

      {isNewPurchaseOpen && (
        <NewPurchaseModal
          business={business}
          suppliers={suppliers}
          products={products}
          onClose={() => setIsNewPurchaseOpen(false)}
          onSuccess={() => {}}
        />
      )}

      {isNewCustomerOpen && (
        <NewCustomerModal
          business={business}
          onClose={() => setIsNewCustomerOpen(false)}
          onSuccess={() => {}}
        />
      )}

      {isNewSupplierOpen && (
        <NewSupplierModal
          business={business}
          onClose={() => setIsNewSupplierOpen(false)}
          onSuccess={() => {}}
        />
      )}

      {adjustingProduct && (
        <StockAdjustModal
          business={business}
          product={adjustingProduct}
          onClose={() => setAdjustingProduct(null)}
          onSuccess={() => {}}
        />
      )}

      {isInviteMemberOpen && (
        <InviteMemberModal
          business={business}
          onClose={() => setIsInviteMemberOpen(false)}
          onSuccess={() => {}}
        />
      )}

      {isXamppExportOpen && (
        <XamppExportModal onClose={() => setIsXamppExportOpen(false)} />
      )}
    </div>
  );
}
