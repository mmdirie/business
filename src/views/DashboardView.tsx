import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ShoppingCart,
  Receipt,
  Eye,
  Plus
} from 'lucide-react';
import { Business, Sale, Expense, Product, Customer, AuditLogItem } from '../types';

interface DashboardViewProps {
  business: Business;
  sales: Sale[];
  expenses: Expense[];
  products: Product[];
  customers: Customer[];
  auditLogs: AuditLogItem[];
  onOpenNewSale: () => void;
  onOpenNewProduct: () => void;
  onOpenNewExpense: () => void;
  onViewInvoice: (sale: Sale) => void;
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  business,
  sales,
  expenses,
  products,
  customers,
  auditLogs,
  onOpenNewSale,
  onOpenNewProduct,
  onOpenNewExpense,
  onViewInvoice,
  onNavigate
}) => {
  // Aggregate KPIs strictly for this active business
  const totalSales = sales.reduce((sum, s) => sum + s.grand_total, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalSales - totalExpenses;
  const lowStockProducts = products.filter(p => p.quantity <= p.minimum_stock);

  // Group recent sales
  const recentSales = sales.slice(0, 5);
  const recentExpenses = expenses.slice(0, 5);
  const recentActivities = auditLogs.slice(0, 6);

  // Simple monthly financial trend simulation (Last 6 months)
  const monthlyData = [
    { month: 'Apr', rev: totalSales * 0.55, exp: totalExpenses * 0.6 },
    { month: 'May', rev: totalSales * 0.7, exp: totalExpenses * 0.72 },
    { month: 'Jun', rev: totalSales * 0.82, exp: totalExpenses * 0.68 },
    { month: 'Jul', rev: totalSales * 0.9, exp: totalExpenses * 0.85 },
    { month: 'Aug', rev: totalSales * 0.88, exp: totalExpenses * 0.78 },
    { month: 'Sep', rev: totalSales, exp: totalExpenses }
  ];

  const maxChartVal = Math.max(...monthlyData.map(d => Math.max(d.rev, d.exp)), 100);

  return (
    <div className="space-y-6">
      {/* Welcome Banner / Tenant Status */}
      <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">{business.name}</h1>
            <span className="text-xs px-2.5 py-0.5 rounded bg-[#FFF8CF] text-[#2A7C13] font-semibold border border-[#76C457]/40">
              {business.type}
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Active Multi-Tenant Database Context · Currency: {business.currency} ({business.currency_symbol}) · Tax: {business.tax_rate}%
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewSale}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#2A7C13] hover:bg-[#205e0e] rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            New POS Sale
          </button>
          <button
            onClick={onOpenNewExpense}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Low Stock Alert Banner */}
      {lowStockProducts.length > 0 && (
        <div className="bg-[#FFF8CF] border border-[#76C457]/50 rounded-xl p-4 flex items-center justify-between text-xs text-neutral-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500 text-white shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold">
                Low Inventory Warning: {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's' : ''} below threshold
              </p>
              <p className="text-neutral-600 mt-0.5">
                {lowStockProducts.map(p => `${p.name} (${p.quantity} left)`).join(', ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('inventory')}
            className="px-3 py-1.5 bg-[#2A7C13] hover:bg-[#205e0e] text-white font-medium rounded-lg text-xs shrink-0 cursor-pointer"
          >
            Manage Stock
          </button>
        </div>
      )}

      {/* Key Metric Cards (White Cards on Cream Background) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Sales</span>
            <div className="p-2 rounded-lg bg-[#FFF8CF] text-[#2A7C13]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900">
            {business.currency_symbol}{totalSales.toFixed(2)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#2A7C13] mt-2 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% from last month</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Expenses</span>
            <div className="p-2 rounded-lg bg-neutral-100 text-neutral-700">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900">
            {business.currency_symbol}{totalExpenses.toFixed(2)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-2">
            <span>Operating overheads</span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Net Operating Profit</span>
            <div className={`p-2 rounded-lg ${netProfit >= 0 ? 'bg-[#FFF8CF] text-[#2A7C13]' : 'bg-red-50 text-red-600'}`}>
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-bold font-mono ${netProfit >= 0 ? 'text-[#2A7C13]' : 'text-red-600'}`}>
            {business.currency_symbol}{netProfit.toFixed(2)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-2">
            Margin: {totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : 0}%
          </div>
        </div>

        {/* Catalog & Customers */}
        <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Catalog & Clients</span>
            <div className="p-2 rounded-lg bg-[#FFF8CF] text-[#2A7C13]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold font-mono text-neutral-900">{products.length}</p>
              <p className="text-[10px] text-neutral-500 uppercase">Products</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold font-mono text-neutral-900">{customers.length}</p>
              <p className="text-[10px] text-neutral-500 uppercase">Customers</p>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500">
            {lowStockProducts.length > 0 ? (
              <span className="text-amber-700 font-medium">⚠️ {lowStockProducts.length} low stock</span>
            ) : (
              <span className="text-[#2A7C13]">✓ Stock levels optimal</span>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Charts & Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Revenue vs Expense SVG Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-neutral-900">Revenue & Expense Cashflow</h2>
              <p className="text-xs text-neutral-500">6-Month financial performance for {business.name}</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#2A7C13]" />
                <span className="text-neutral-600">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#76C457]" />
                <span className="text-neutral-600">Expenses</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-56 flex items-end justify-between gap-4 pt-6 px-2 border-b border-neutral-100">
            {monthlyData.map((item, idx) => {
              const revHeight = Math.max(10, Math.round((item.rev / maxChartVal) * 180));
              const expHeight = Math.max(10, Math.round((item.exp / maxChartVal) * 180));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="flex items-end gap-1.5 w-full justify-center">
                    <div
                      style={{ height: `${revHeight}px` }}
                      className="w-5 bg-[#2A7C13] rounded-t-xs transition-all group-hover:brightness-110"
                      title={`Revenue: ${business.currency_symbol}${item.rev.toFixed(0)}`}
                    />
                    <div
                      style={{ height: `${expHeight}px` }}
                      className="w-5 bg-[#76C457] rounded-t-xs transition-all group-hover:brightness-110"
                      title={`Expense: ${business.currency_symbol}${item.exp.toFixed(0)}`}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-neutral-500">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Channels & Distribution (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 mb-1">Sales by Payment Channel</h2>
            <p className="text-xs text-neutral-500 mb-4">Cash, Mobile Money, and Bank Wires</p>

            <div className="space-y-3">
              {[
                { label: 'Cash at Counter', count: sales.filter(s => s.payment_method === 'Cash').length, pct: 45 },
                { label: 'Bank Wire / Card', count: sales.filter(s => s.payment_method === 'Bank').length, pct: 30 },
                { label: 'Mobile Money', count: sales.filter(s => s.payment_method === 'Mobile Money').length, pct: 20 },
                { label: 'Store Credit / Due', count: sales.filter(s => s.payment_method === 'Credit').length, pct: 5 }
              ].map((channel, i) => (
                <div key={i} className="text-xs">
                  <div className="flex justify-between font-medium text-neutral-700 mb-1">
                    <span>{channel.label}</span>
                    <span className="font-mono text-neutral-500">{channel.count} tx</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-[#2A7C13] rounded-full"
                      style={{ width: `${channel.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 mt-4">
            <button
              onClick={() => onNavigate('reports')}
              className="w-full py-2 text-xs font-semibold text-[#2A7C13] hover:bg-[#FFF8CF] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>View Financial Statement</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tables Row: Recent Sales & Recent Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales Table */}
        <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Recent Sales Invoices</h3>
              <p className="text-xs text-neutral-500">Live transactions recorded in {business.name}</p>
            </div>
            <button
              onClick={() => onNavigate('sales')}
              className="text-xs font-medium text-[#2A7C13] hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500">
                  <th className="pb-2 font-semibold">Invoice</th>
                  <th className="pb-2 font-semibold">Customer</th>
                  <th className="pb-2 font-semibold text-right">Total</th>
                  <th className="pb-2 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentSales.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-neutral-400">
                      No sales yet in this business.
                    </td>
                  </tr>
                ) : (
                  recentSales.map(sale => (
                    <tr key={sale.id} className="hover:bg-neutral-50/50">
                      <td className="py-2.5 font-mono font-medium text-neutral-900">
                        {sale.invoice_number}
                        <span className="block text-[10px] text-neutral-400 font-sans">{sale.sale_date}</span>
                      </td>
                      <td className="py-2.5 text-neutral-700">
                        {sale.customer_name || 'Walk-in'}
                        <span className="block text-[10px] text-neutral-400">{sale.payment_method}</span>
                      </td>
                      <td className="py-2.5 text-right font-mono font-bold text-[#2A7C13]">
                        {business.currency_symbol}{sale.grand_total.toFixed(2)}
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => onViewInvoice(sale)}
                          title="Print / View Invoice"
                          className="p-1.5 text-neutral-500 hover:text-[#2A7C13] hover:bg-[#FFF8CF] rounded-md transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Audit Activities */}
        <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Tenant Activity Trail</h3>
              <p className="text-xs text-neutral-500">Audit logs for compliance & security</p>
            </div>
            <button
              onClick={() => onNavigate('audit')}
              className="text-xs font-medium text-[#2A7C13] hover:underline cursor-pointer"
            >
              Full Log
            </button>
          </div>

          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <p className="text-center py-4 text-xs text-neutral-400">No activity recorded yet.</p>
            ) : (
              recentActivities.map(act => (
                <div key={act.id} className="flex items-start justify-between text-xs pb-2 border-b border-neutral-100 last:border-0">
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-neutral-900">{act.action}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{act.details}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-neutral-400 font-mono block">
                      {act.created_at.substring(11, 16)}
                    </span>
                    <span className="text-[10px] text-[#2A7C13] font-medium">{act.user_name}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
