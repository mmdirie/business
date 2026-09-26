import React, { useState } from 'react';
import { Supplier, Product, Business } from '../types';
import { tenantStore } from '../services/tenantStore';
import { X, Truck, Plus, Trash2 } from 'lucide-react';

interface NewPurchaseModalProps {
  business: Business;
  suppliers: Supplier[];
  products: Product[];
  onClose: () => void;
  onSuccess: () => void;
}

export const NewPurchaseModal: React.FC<NewPurchaseModalProps> = ({
  business,
  suppliers,
  products,
  onClose,
  onSuccess
}) => {
  const [supplierId, setSupplierId] = useState<number | ''>(suppliers[0]?.id || '');
  const [items, setItems] = useState<{ product_id: number; quantity: number; unit_cost: number }[]>([
    { product_id: products[0]?.id || 0, quantity: 10, unit_cost: products[0]?.purchase_price || 0 }
  ]);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank' | 'Mobile Money' | 'Credit'>('Bank');
  const [paidAmount, setPaidAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const addItemRow = () => {
    if (products.length > 0) {
      setItems([...items, { product_id: products[0].id, quantity: 5, unit_cost: products[0].purchase_price }]);
    }
  };

  const removeItemRow = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateItem = (idx: number, field: string, value: number) => {
    const next = [...items];
    if (field === 'product_id') {
      const prod = products.find(p => p.id === value);
      next[idx] = {
        ...next[idx],
        product_id: value,
        unit_cost: prod ? prod.purchase_price : 0
      };
    } else {
      next[idx] = { ...next[idx], [field]: value };
    }
    setItems(next);
  };

  const grandTotal = items.reduce((sum, item) => sum + item.quantity * item.unit_cost, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId) {
      setError('Please choose a supplier.');
      return;
    }
    if (items.length === 0) {
      setError('Add at least one item to the purchase order.');
      return;
    }

    const effectivePaid = paidAmount === '' ? grandTotal : Number(paidAmount);

    const purchase = tenantStore.createPurchase({
      supplier_id: Number(supplierId),
      items,
      payment_method: paymentMethod,
      paid_amount: effectivePaid,
      notes: notes.trim() || undefined
    });

    if (!purchase) {
      setError('Failed to record purchase. Check permissions.');
      return;
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-[#FFF8CF]/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#2A7C13] text-white">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Record Stock Purchase Order</h2>
              <p className="text-xs text-neutral-500">Automatically increments product inventory counts</p>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Supplier *</label>
              <select
                required
                value={supplierId}
                onChange={e => setSupplierId(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
              >
                <option value="">Select Supplier</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
              >
                <option value="Bank">Bank Wire</option>
                <option value="Cash">Cash</option>
                <option value="Mobile Money">Mobile Money</option>
                <option value="Credit">Credit (Owed to Supplier)</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-neutral-700">Order Line Items</label>
              <button
                type="button"
                onClick={addItemRow}
                className="flex items-center gap-1 text-[11px] font-medium text-[#2A7C13] hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {items.map((row, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-neutral-50 p-2 rounded-lg border border-neutral-200">
                  <select
                    value={row.product_id}
                    onChange={e => updateItem(idx, 'product_id', Number(e.target.value))}
                    className="flex-1 px-2 py-1 bg-white border border-neutral-300 rounded text-xs"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.sku})
                      </option>
                    ))}
                  </select>
                  <div className="w-20">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={row.quantity}
                      onChange={e => updateItem(idx, 'quantity', Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-neutral-300 rounded text-xs"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Unit Cost"
                      value={row.unit_cost}
                      onChange={e => updateItem(idx, 'unit_cost', Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-neutral-300 rounded text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItemRow(idx)}
                    className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Amount Paid ({business.currency_symbol})
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder={String(grandTotal)}
                value={paidAmount}
                onChange={e => setPaidAmount(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Total Order Cost</label>
              <div className="px-3 py-2 bg-neutral-100 rounded-lg font-mono font-bold text-neutral-900 text-sm">
                {business.currency_symbol}{grandTotal.toFixed(2)}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Delivery / Waybill Notes</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Received at container terminal batch #492"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
            />
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
              Record Purchase & Stock In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
