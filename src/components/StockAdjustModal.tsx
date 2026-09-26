import React, { useState } from 'react';
import { Product, Business } from '../types';
import { tenantStore } from '../services/tenantStore';
import { X, SlidersHorizontal } from 'lucide-react';

interface StockAdjustModalProps {
  business: Business;
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}

export const StockAdjustModal: React.FC<StockAdjustModalProps> = ({
  business,
  product,
  onClose,
  onSuccess
}) => {
  const [type, setType] = useState<'stock_in' | 'stock_out' | 'adjustment'>('adjustment');
  const [delta, setDelta] = useState('1');
  const [reason, setReason] = useState('Physical inventory recount');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(delta);
    if (!qty || qty <= 0) {
      setError('Please provide a valid quantity.');
      return;
    }

    const actualDelta = type === 'stock_out' ? -qty : qty;
    const ok = tenantStore.adjustStock(product.id, actualDelta, type, reason.trim());
    if (!ok) {
      setError('Failed to adjust stock. Permission denied.');
      return;
    }

    onSuccess();
    onClose();
  };

  const currentStock = product.quantity;
  const previewStock =
    type === 'stock_out' ? Math.max(0, currentStock - (Number(delta) || 0)) : currentStock + (Number(delta) || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-[#FFF8CF]/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#2A7C13] text-white">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Adjust Inventory Stock</h2>
              <p className="text-xs text-neutral-500 font-mono">{product.sku} · {business.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-700 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 mx-6 mt-4 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
            <p className="font-semibold text-neutral-900">{product.name}</p>
            <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t border-neutral-200">
              <span className="text-neutral-500">Current Balance:</span>
              <span className="font-mono font-bold text-neutral-900">{currentStock} units</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setType('stock_in')}
              className={`py-2 px-3 text-center rounded-lg border font-medium cursor-pointer ${
                type === 'stock_in'
                  ? 'border-[#2A7C13] bg-[#2A7C13] text-white'
                  : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              + Stock In
            </button>
            <button
              type="button"
              onClick={() => setType('stock_out')}
              className={`py-2 px-3 text-center rounded-lg border font-medium cursor-pointer ${
                type === 'stock_out'
                  ? 'border-red-600 bg-red-600 text-white'
                  : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              - Stock Out
            </button>
            <button
              type="button"
              onClick={() => setType('adjustment')}
              className={`py-2 px-3 text-center rounded-lg border font-medium cursor-pointer ${
                type === 'adjustment'
                  ? 'border-amber-600 bg-amber-600 text-white'
                  : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              Correction
            </button>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Quantity to Adjust *</label>
            <input
              type="number"
              min="1"
              required
              value={delta}
              onChange={e => setDelta(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Reason / Notes</label>
            <input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. Expired stock, inventory audit discrepancy, damage"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
            />
          </div>

          <div className="p-3 bg-[#FFF8CF]/60 rounded-lg border border-[#76C457]/40 flex justify-between items-center text-xs">
            <span className="text-neutral-700 font-medium">Resulting Stock Level:</span>
            <span className="font-mono font-bold text-neutral-900 text-sm">{previewStock} units</span>
          </div>

          <div className="pt-4 border-t border-neutral-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2A7C13] hover:bg-[#205e0e] text-white font-medium rounded-lg cursor-pointer transition-colors"
            >
              Confirm Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
