import React, { useState } from 'react';
import { Product, Category, Supplier, Business } from '../types';
import { tenantStore } from '../services/tenantStore';
import {
  Package,
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  Trash2,
  AlertTriangle,
  Barcode
} from 'lucide-react';

interface ProductsViewProps {
  business: Business;
  products: Product[];
  categories: Category[];
  suppliers: Supplier[];
  onOpenNewProduct: () => void;
  onAdjustStock: (product: Product) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  business,
  products,
  categories,
  suppliers,
  onOpenNewProduct,
  onAdjustStock
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low'>('all');

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchTerm));

    const matchesCategory =
      selectedCategory === 'all' || (p.category_id && p.category_id === Number(selectedCategory));

    const matchesStock = stockFilter === 'all' || (stockFilter === 'low' && p.quantity <= p.minimum_stock);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from this business?`)) {
      tenantStore.deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#2A7C13]" />
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">Products & Inventory Catalog</h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Tenant: {business.name} · {products.length} products listed
          </p>
        </div>

        <button
          onClick={onOpenNewProduct}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2A7C13] hover:bg-[#205e0e] rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by product name, SKU, barcode..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Low Stock Toggle Button */}
          <button
            onClick={() => setStockFilter(stockFilter === 'all' ? 'low' : 'all')}
            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
              stockFilter === 'low'
                ? 'bg-[#FFF8CF] border-[#76C457] text-[#2A7C13] font-bold'
                : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Stock Only</span>
          </button>
        </div>
      </div>

      {/* Products Table (Responsive) */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-600 font-semibold">
                <th className="py-3 px-4">Item & Code</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Cost</th>
                <th className="py-3 px-4 text-right">Selling Price</th>
                <th className="py-3 px-4 text-right">Margin</th>
                <th className="py-3 px-4 text-center">Stock Level</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400">
                    No products match your filters in {business.name}.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => {
                  const cat = categories.find(c => c.id === p.category_id);
                  const isLow = p.quantity <= p.minimum_stock;
                  const marginPct =
                    p.selling_price > 0
                      ? (((p.selling_price - p.purchase_price) / p.selling_price) * 100).toFixed(1)
                      : '0';

                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-neutral-900">{p.name}</div>
                        <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono mt-0.5">
                          <span>SKU: {p.sku}</span>
                          {p.barcode && (
                            <>
                              <span>·</span>
                              <span className="flex items-center gap-0.5">
                                <Barcode className="w-3 h-3" />
                                {p.barcode}
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-neutral-600">
                        {cat ? cat.name : <span className="text-neutral-400 italic">Uncategorized</span>}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-neutral-600">
                        {business.currency_symbol}{p.purchase_price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#2A7C13]">
                        {business.currency_symbol}{p.selling_price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-neutral-500">
                        {marginPct}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded text-xs ${
                            isLow
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-emerald-50 text-[#2A7C13]'
                          }`}
                        >
                          {p.quantity} units
                          {isLow && <span className="text-[10px] font-sans font-normal">(Low)</span>}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onAdjustStock(p)}
                            title="Adjust inventory level"
                            className="p-1.5 text-neutral-600 hover:text-[#2A7C13] hover:bg-[#FFF8CF] rounded-lg transition-colors cursor-pointer"
                          >
                            <SlidersHorizontal className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            title="Delete item"
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
