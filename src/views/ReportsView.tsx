import React, { useState } from 'react';
import { Sale, Expense, Purchase, Product, Business } from '../types';
import { BarChart3, Download, Printer, Calendar, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface ReportsViewProps {
  business: Business;
  sales: Sale[];
  expenses: Expense[];
  purchases: Purchase[];
  products: Product[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  business,
  sales,
  expenses,
  purchases,
  products
}) => {
  const [period, setPeriod] = useState<
    'today' | 'yesterday' | 'this_week' | 'this_month' | 'last_month' | 'this_year' | 'custom'
  >('this_month');

  // Compute metrics
  const totalSales = sales.reduce((sum, s) => sum + s.grand_total, 0);
  const totalTaxCollected = sales.reduce((sum, s) => sum + s.tax_amount, 0);
  const totalDiscounts = sales.reduce((sum, s) => sum + s.discount_amount, 0);

  // Cost of Goods Sold from sale items
  const cogs = sales.reduce((sum, s) => {
    const itemCost = s.items.reduce((iSum, itm) => iSum + itm.unit_cost * itm.quantity, 0);
    return sum + itemCost;
  }, 0);

  const grossProfit = totalSales - cogs;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = grossProfit - totalExpenses;
  const grossMargin = totalSales > 0 ? ((grossProfit / totalSales) * 100).toFixed(1) : '0';
  const netMargin = totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : '0';

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const rows = [
      ['Metric', 'Amount (' + business.currency + ')'],
      ['Gross Sales Revenue', totalSales.toFixed(2)],
      ['Discounts Given', totalDiscounts.toFixed(2)],
      ['Sales Tax Collected', totalTaxCollected.toFixed(2)],
      ['Cost of Goods Sold (COGS)', cogs.toFixed(2)],
      ['Gross Profit', grossProfit.toFixed(2)],
      ['Total Operating Expenses', totalExpenses.toFixed(2)],
      ['Net Operating Income', netProfit.toFixed(2)]
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${business.slug}-financial-report-${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#2A7C13]" />
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">Financial Reports & P&L Statement</h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Tenant: {business.name} · Certified multi-tenant financial summary
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#2A7C13] hover:bg-[#205e0e] rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Statement
          </button>
        </div>
      </div>

      {/* Period Filter Tabs */}
      <div className="bg-white rounded-xl p-3 border border-neutral-200 shadow-2xs overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max text-xs font-medium">
          {[
            { id: 'today', label: 'Today' },
            { id: 'yesterday', label: 'Yesterday' },
            { id: 'this_week', label: 'This Week' },
            { id: 'this_month', label: 'This Month' },
            { id: 'last_month', label: 'Last Month' },
            { id: 'this_year', label: 'This Year' },
            { id: 'custom', label: 'Custom Range' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setPeriod(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                period === tab.id
                  ? 'bg-[#2A7C13] text-white font-bold'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Financial Summary Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Gross Sales</span>
          <p className="text-xl font-bold font-mono text-neutral-900 mt-1">
            {business.currency_symbol}{totalSales.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Cost of Goods Sold (COGS)</span>
          <p className="text-xl font-bold font-mono text-neutral-700 mt-1">
            {business.currency_symbol}{cogs.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Operating Expenses</span>
          <p className="text-xl font-bold font-mono text-neutral-700 mt-1">
            {business.currency_symbol}{totalExpenses.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Net Profit</span>
          <p className={`text-xl font-bold font-mono mt-1 ${netProfit >= 0 ? 'text-[#2A7C13]' : 'text-red-600'}`}>
            {business.currency_symbol}{netProfit.toFixed(2)}
          </p>
          <span className="text-[10px] text-neutral-500 font-mono">Net Margin: {netMargin}%</span>
        </div>
      </div>

      {/* Formal Income Statement Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/60 flex items-center justify-between">
          <h3 className="font-bold text-sm text-neutral-900">Profit & Loss Accounting Statement</h3>
          <span className="text-xs text-neutral-500 font-mono">Reporting Period: {period.replace('_', ' ').toUpperCase()}</span>
        </div>

        <div className="p-6 space-y-6 text-xs">
          {/* Revenue Section */}
          <div>
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider border-b border-neutral-200 pb-1 mb-2">
              1. Operating Revenue
            </h4>
            <div className="space-y-1.5 font-mono">
              <div className="flex justify-between text-neutral-700">
                <span>Gross Point of Sale Invoicing</span>
                <span>{business.currency_symbol}{totalSales.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Less: Customer Discounts Allowed</span>
                <span>-{business.currency_symbol}{totalDiscounts.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-neutral-900 pt-1 border-t border-neutral-100">
                <span>Net Invoiced Revenue</span>
                <span>{business.currency_symbol}{(totalSales - totalDiscounts).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Cost of Goods Sold */}
          <div>
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider border-b border-neutral-200 pb-1 mb-2">
              2. Cost of Sales (COGS)
            </h4>
            <div className="space-y-1.5 font-mono">
              <div className="flex justify-between text-neutral-700">
                <span>Inventory Cost of Sold Items</span>
                <span>{business.currency_symbol}{cogs.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-neutral-900 pt-1 border-t border-neutral-100">
                <span>Gross Operating Margin ({grossMargin}%)</span>
                <span className="text-[#2A7C13]">{business.currency_symbol}{grossProfit.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Operating Overheads */}
          <div>
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider border-b border-neutral-200 pb-1 mb-2">
              3. Operating Overheads & Expenses
            </h4>
            <div className="space-y-1.5 font-mono">
              {expenses.map(e => (
                <div key={e.id} className="flex justify-between text-neutral-600">
                  <span>{e.title} ({e.category_name || 'General'})</span>
                  <span>{business.currency_symbol}{e.amount.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-neutral-900 pt-1 border-t border-neutral-100">
                <span>Total Operating Expenses</span>
                <span>{business.currency_symbol}{totalExpenses.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Bottom Line Net */}
          <div className="p-4 bg-[#FFF8CF] rounded-xl border border-[#76C457]/50 flex justify-between items-center">
            <div>
              <p className="font-bold text-sm text-neutral-900">Net Operating Income</p>
              <p className="text-[11px] text-neutral-600 mt-0.5">Isolated bottom line for {business.name}</p>
            </div>
            <div className="text-right font-mono">
              <p className={`text-xl font-bold ${netProfit >= 0 ? 'text-[#2A7C13]' : 'text-red-600'}`}>
                {business.currency_symbol}{netProfit.toFixed(2)}
              </p>
              <span className="text-[10px] text-neutral-500">Margin: {netMargin}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
