import React, { useState } from 'react';
import { Sale, Business } from '../types';
import { ShoppingCart, Plus, Eye, Search, CheckCircle2, Clock } from 'lucide-react';

interface SalesViewProps {
  business: Business;
  sales: Sale[];
  onOpenNewSale: () => void;
  onViewInvoice: (sale: Sale) => void;
}

export const SalesView: React.FC<SalesViewProps> = ({
  business,
  sales,
  onOpenNewSale,
  onViewInvoice
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');

  const filteredSales = sales.filter(s => {
    const matchesSearch =
      s.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.customer_name && s.customer_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMethod = methodFilter === 'all' || s.payment_method === methodFilter;

    return matchesSearch && matchesMethod;
  });

  const totalSalesVolume = sales.reduce((sum, s) => sum + s.grand_total, 0);
  const totalReceivables = sales.reduce((sum, s) => sum + s.balance_due, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#2A7C13]" />
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">Sales & POS Checkout</h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Tenant: {business.name} · Multi-currency invoice ledger
          </p>
        </div>

        <button
          onClick={onOpenNewSale}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2A7C13] hover:bg-[#205e0e] rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New POS Sale
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Orders</span>
          <p className="text-xl font-bold font-mono text-neutral-900 mt-1">{sales.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Gross Sales Revenue</span>
          <p className="text-xl font-bold font-mono text-[#2A7C13] mt-1">
            {business.currency_symbol}{totalSalesVolume.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Outstanding Receivables</span>
          <p className="text-xl font-bold font-mono text-amber-700 mt-1">
            {business.currency_symbol}{totalReceivables.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search invoice number or customer..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
          />
        </div>

        <select
          value={methodFilter}
          onChange={e => setMethodFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
        >
          <option value="all">All Payment Methods</option>
          <option value="Cash">Cash</option>
          <option value="Bank">Bank Wire</option>
          <option value="Mobile Money">Mobile Money</option>
          <option value="Credit">Credit / Due</option>
        </select>
      </div>

      {/* Sales Invoices Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-600 font-semibold">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Items</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-400">
                    No sales invoices found for {business.name}.
                  </td>
                </tr>
              ) : (
                filteredSales.map(sale => (
                  <tr key={sale.id} className="hover:bg-neutral-50/60">
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900">
                      {sale.invoice_number}
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-600">
                      {sale.sale_date}
                    </td>
                    <td className="py-3 px-4 font-medium text-neutral-800">
                      {sale.customer_name || <span className="text-neutral-400 italic">Walk-in</span>}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-neutral-100 font-medium text-[11px] text-neutral-700">
                        {sale.payment_method}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-neutral-600">
                      {sale.items.length}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#2A7C13]">
                      {business.currency_symbol}{sale.grand_total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {sale.balance_due === 0 ? (
                        <span className="text-[#2A7C13] font-medium flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Paid
                        </span>
                      ) : (
                        <span className="text-amber-700 font-bold">
                          {business.currency_symbol}{sale.balance_due.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onViewInvoice(sale)}
                        className="p-1.5 text-neutral-600 hover:text-[#2A7C13] hover:bg-[#FFF8CF] rounded-lg transition-colors cursor-pointer"
                        title="View & Print Official Receipt"
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
    </div>
  );
};
