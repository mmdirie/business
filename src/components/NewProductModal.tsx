import React, { useState } from 'react';
import { Category, Supplier, Business } from '../types';
import { tenantStore } from '../services/tenantStore';
import { X, PackagePlus } from 'lucide-react';

interface NewProductModalProps {
  business: Business;
  categories: Category[];
  suppliers: Supplier[];
  onClose: () => void;
  onSuccess: () => void;
}

export const NewProductModal: React.FC<NewProductModalProps> = ({
  business,
  categories,
  suppliers,
  onClose,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState(`PRD-${Math.floor(1000 + Math.random() * 9000)}`);
  const [barcode, setBarcode] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [supplierId, setSupplierId] = useState<number | ''>('');
  const [purchasePrice, setPurchasePrice] = useState('0');
  const [sellingPrice, setSellingPrice] = useState('0');
  const [quantity, setQuantity] = useState('10');
  const [minimumStock, setMinimumStock] = useState('5');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) {
      setError('Product name and SKU are required.');
      return;
    }

    const prod = tenantStore.createProduct({
      name: name.trim(),
      sku: sku.trim(),
      barcode: barcode.trim() || undefined,
      category_id: categoryId ? Number(categoryId) : undefined,
      supplier_id: supplierId ? Number(supplierId) : undefined,
      purchase_price: Number(purchasePrice) || 0,
      selling_price: Number(sellingPrice) || 0,
      quantity: Number(quantity) || 0,
      minimum_stock: Number(minimumStock) || 5
    });

    if (!prod) {
      setError('Failed to add product. You might not have the "manage_products" permission.');
      return;
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-[#FFF8CF]/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#2A7C13] text-white">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Add New Product</h2>
              <p className="text-xs text-neutral-500">Business Tenant: {business.name}</p>
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
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Wireless Noise-Canceling Earbuds"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">SKU / Item Code *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={e => setSku(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13] font-mono uppercase"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Barcode / UPC</label>
              <input
                type="text"
                value={barcode}
                onChange={e => setBarcode(e.target.value)}
                placeholder="Optional scan code"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Category</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
              >
                <option value="">Unassigned</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Preferred Supplier</label>
              <select
                value={supplierId}
                onChange={e => setSupplierId(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
              >
                <option value="">Direct / None</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Purchase Cost ({business.currency_symbol})
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={purchasePrice}
                onChange={e => setPurchasePrice(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Selling Retail Price ({business.currency_symbol}) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={sellingPrice}
                onChange={e => setSellingPrice(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13] font-semibold text-[#2A7C13]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Initial Opening Quantity</label>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Low-Stock Alert Level</label>
              <input
                type="number"
                min="1"
                value={minimumStock}
                onChange={e => setMinimumStock(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
              />
            </div>
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
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
