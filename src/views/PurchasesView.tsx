import React, { useState } from 'react';
import { Purchase, Supplier, Business } from '../types';
import { Truck, Plus, Search, CheckCircle2, AlertCircle } from 'lucide-react';

interface PurchasesViewProps {
  business: Business;
  purchases: Purchase[];
  suppliers: Supplier[];
  onOpenNewPurchase: () => void;
}

export const PurchasesView: React.FC<PurchasesViewProps> = ({
  business,
  purchases,
  suppliers,
  onOpenNewPurchase
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = purchases.filter(
    p =>
      p.purchase_order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPurchases = purchases.reduce((sum, p) => sum + p.grand_total, 0);
  const totalPayables = purchases.reduce((sum, p) => sum + p.balance_due, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#2A7C13]" />
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">Purchases & Supplier Orders</h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Supplier purchase orders that update product inventories in {business.name}
          </p>
        </div>

        <button
          onClick={onOpenNewPurchase}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2A7C13] hover:bg-[#205e0e] rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Record Purchase Order
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Purchase Volume</span>
          <p className="text-xl font-bold font-mono text-neutral-900 mt-1">
            {business.currency_symbol}{totalPurchases.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Payables Owed to Suppliers</span>
          <p className="text-xl font-bold font-mono text-amber-700 mt-1">
            {business.currency_symbol}{totalPayables.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-3 border border-neutral-200 shadow-2xs">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search PO number or supplier name..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-600 font-semibold">
                <th className="py-3 px-4">PO Number</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Items</th>
                <th className="py-3 px-4 text-right">Order Cost</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-400">
                    No purchase orders recorded for {business.name}.
                  </td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} className="hover:bg-neutral-50/60">
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900">
                      {p.purchase_order_number}
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-600">
                      {p.purchase_date}
                    </td>
                    <td className="py-3 px-4 font-medium text-neutral-800">
                      {p.supplier_name}
                    </td>
                    <td className="py-3 px-4 text-neutral-600">
                      {p.payment_method}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-neutral-600">
                      {p.items.length}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-neutral-900">
                      {business.currency_symbol}{p.grand_total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {p.balance_due === 0 ? (
                        <span className="text-[#2A7C13] font-medium">Cleared</span>
                      ) : (
                        <span className="text-amber-700 font-bold">
                          {business.currency_symbol}{p.balance_due.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#2A7C13] font-semibold uppercase text-[10px]">
                        {p.status}
                      </span>
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
