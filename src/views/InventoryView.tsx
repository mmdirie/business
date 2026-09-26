import React, { useState } from 'react';
import { Product, InventoryTransaction, Business } from '../types';
import { Layers, AlertTriangle, ArrowDownRight, ArrowUpRight, SlidersHorizontal, Search } from 'lucide-react';

interface InventoryViewProps {
  business: Business;
  products: Product[];
  transactions: InventoryTransaction[];
  onAdjustStock: (product: Product) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  business,
  products,
  transactions,
  onAdjustStock
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'stock' | 'ledger'>('stock');

  const lowStock = products.filter(p => p.quantity <= p.minimum_stock);

  const filteredProducts = products.filter(
    p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#2A7C13]" />
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">Inventory & Stock Tracking</h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time movement ledger and stock adjustment audit for {business.name}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-neutral-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'stock' ? 'bg-white text-neutral-900 font-bold shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Current Stock ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'ledger' ? 'bg-white text-neutral-900 font-bold shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Movement Audit Trail ({transactions.length})
          </button>
        </div>
      </div>

      {/* Low Stock Warning Banner */}
      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold text-amber-900">
                {lowStock.length} items require replenishment in {business.name}
              </p>
              <p className="text-amber-700 mt-0.5">
                {lowStock.map(p => `${p.name} (${p.quantity} on shelf)`).join(' · ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Current Stock */}
      {activeTab === 'stock' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-3 border border-neutral-200 shadow-2xs">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search stock by SKU or name..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-600 font-semibold">
                    <th className="py-3 px-4">Item & Code</th>
                    <th className="py-3 px-4 text-center">Current Quantity</th>
                    <th className="py-3 px-4 text-center">Alert Threshold</th>
                    <th className="py-3 px-4 text-right">Unit Value</th>
                    <th className="py-3 px-4 text-right">Total Asset Value</th>
                    <th className="py-3 px-4 text-right">Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredProducts.map(p => {
                    const isLow = p.quantity <= p.minimum_stock;
                    const totalAsset = p.quantity * p.purchase_price;
                    return (
                      <tr key={p.id} className="hover:bg-neutral-50/60">
                        <td className="py-3 px-4">
                          <p className="font-semibold text-neutral-900">{p.name}</p>
                          <span className="font-mono text-[10px] text-neutral-400">{p.sku}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                              isLow ? 'bg-amber-100 text-amber-900' : 'bg-neutral-100 text-neutral-800'
                            }`}
                          >
                            {p.quantity} units
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-neutral-500">
                          {p.minimum_stock} units
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-neutral-600">
                          {business.currency_symbol}{p.purchase_price.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-neutral-900">
                          {business.currency_symbol}{totalAsset.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onAdjustStock(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#2A7C13] bg-[#FFF8CF] hover:bg-[#faeea2] border border-[#76C457]/40 rounded-lg cursor-pointer"
                          >
                            <SlidersHorizontal className="w-3 h-3" />
                            Adjust
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Movement Ledger */}
      {activeTab === 'ledger' && (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-600 font-semibold">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Movement Type</th>
                  <th className="py-3 px-4 text-center">Qty Change</th>
                  <th className="py-3 px-4 text-center">Balance After</th>
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4">Reference / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-neutral-400">
                      No stock movement transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map(tx => {
                    const isPositive = tx.quantity > 0;
                    return (
                      <tr key={tx.id} className="hover:bg-neutral-50/60">
                        <td className="py-3 px-4 font-mono text-neutral-500 whitespace-nowrap">
                          {tx.created_at}
                        </td>
                        <td className="py-3 px-4 font-medium text-neutral-900">
                          {tx.product_name}
                        </td>
                        <td className="py-3 px-4">
                          <span className="uppercase text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                            {tx.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold">
                          <span className={isPositive ? 'text-[#2A7C13]' : 'text-red-600'}>
                            {isPositive ? `+${tx.quantity}` : tx.quantity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-neutral-800">
                          {tx.balance_after}
                        </td>
                        <td className="py-3 px-4 text-neutral-600">
                          {tx.user_name}
                        </td>
                        <td className="py-3 px-4 text-neutral-500 max-w-xs truncate">
                          {tx.notes || tx.reference_id || 'System record'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
