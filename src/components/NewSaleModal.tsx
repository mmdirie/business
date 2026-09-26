import React, { useState } from 'react';
import { Product, Customer, Business, Sale } from '../types';
import { tenantStore } from '../services/tenantStore';
import { X, Plus, Minus, Trash2, ShoppingCart, AlertCircle } from 'lucide-react';

interface NewSaleModalProps {
  business: Business;
  products: Product[];
  customers: Customer[];
  onClose: () => void;
  onSaleCompleted: (sale: Sale) => void;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export const NewSaleModal: React.FC<NewSaleModalProps> = ({
  business,
  products,
  customers,
  onClose,
  onSaleCompleted
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | ''>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank' | 'Mobile Money' | 'Credit'>('Cash');
  const [paidAmount, setPaidAmount] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const activeProducts = products.filter(p => p.status === 'active');
  const filteredProducts = activeProducts.filter(
    p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    setError('');
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      if (existing.quantity >= product.quantity) {
        setError(`Cannot exceed available inventory (${product.quantity} units in stock) for "${product.name}".`);
        return;
      }
      setCart(cart.map(i => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)));
    } else {
      if (product.quantity < 1) {
        setError(`"${product.name}" is currently out of stock.`);
        return;
      }
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: number, delta: number) => {
    setError('');
    setCart(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            if (nextQty > item.product.quantity) {
              setError(`Max stock limit reached (${item.product.quantity}) for ${item.product.name}`);
              return item;
            }
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.selling_price * item.quantity, 0);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Number(((taxableAmount * business.tax_rate) / 100).toFixed(2));
  const grandTotal = Number((taxableAmount + taxAmount).toFixed(2));
  const effectivePaid = paidAmount === '' ? grandTotal : Number(paidAmount);
  const balanceDue = Math.max(0, grandTotal - effectivePaid);

  const handleCompleteSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError('Please add at least one product to the checkout cart.');
      return;
    }

    const payload = {
      customer_id: selectedCustomerId ? Number(selectedCustomerId) : undefined,
      items: cart.map(i => ({ product_id: i.product.id, quantity: i.quantity })),
      discount_amount: discountAmount,
      payment_method: paymentMethod,
      paid_amount: effectivePaid,
      notes: notes.trim()
    };

    const newSale = tenantStore.createSale(payload);
    if (!newSale) {
      setError('Failed to process sale. Check permission and stock availability.');
      return;
    }

    onSaleCompleted(newSale);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-[#FFF8CF]/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#2A7C13] text-white">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">New Point of Sale (POS) Order</h2>
              <p className="text-xs text-neutral-500">Tenant: {business.name} · Live inventory validation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-black/5 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="px-6 py-2 bg-red-50 border-b border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Content: 2 Columns */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Column: Product Catalog (7 cols) */}
          <div className="md:col-span-7 p-5 border-r border-neutral-200 flex flex-col overflow-y-auto bg-neutral-50/50">
            <div className="mb-3">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search products by name or SKU..."
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-xs text-neutral-400">No matching products in catalog.</div>
              ) : (
                filteredProducts.map(prod => {
                  const inCartItem = cart.find(c => c.product.id === prod.id);
                  const remaining = prod.quantity - (inCartItem ? inCartItem.quantity : 0);
                  const isLow = prod.quantity <= prod.minimum_stock;

                  return (
                    <div
                      key={prod.id}
                      onClick={() => remaining > 0 && addToCart(prod)}
                      className={`p-3 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                        remaining <= 0
                          ? 'opacity-50 bg-neutral-100 border-neutral-200 cursor-not-allowed'
                          : 'bg-white hover:border-[#76C457] hover:shadow-xs border-neutral-200'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-semibold text-neutral-900 truncate">{prod.name}</p>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                          <span className="font-mono text-neutral-400">{prod.sku}</span>
                          <span>·</span>
                          <span className={`font-medium ${isLow ? 'text-amber-700' : 'text-neutral-600'}`}>
                            {remaining} in stock
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-[#2A7C13] font-mono">
                          {business.currency_symbol}{prod.selling_price.toFixed(2)}
                        </span>
                        <div className="mt-1">
                          <span className="text-[10px] text-neutral-400 hover:text-[#2A7C13] font-medium">+ Add</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout (5 cols) */}
          <div className="md:col-span-5 p-5 flex flex-col justify-between overflow-y-auto bg-white">
            <div className="space-y-4">
              {/* Customer Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Customer
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={e => setSelectedCustomerId(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
                >
                  <option value="">Walk-in Customer (General)</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.balance > 0 ? `(Owes ${business.currency_symbol}${c.balance})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cart Items List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-neutral-700">Cart Items ({cart.length})</span>
                  {cart.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setCart([])}
                      className="text-[11px] text-red-600 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="max-h-40 overflow-y-auto space-y-2 border-y border-neutral-100 py-2">
                  {cart.length === 0 ? (
                    <p className="text-xs text-neutral-400 italic text-center py-4">No items added yet</p>
                  ) : (
                    cart.map(item => (
                      <div key={item.product.id} className="flex items-center justify-between text-xs py-1">
                        <div className="min-w-0 pr-2">
                          <p className="font-medium text-neutral-800 truncate">{item.product.name}</p>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {business.currency_symbol}{item.product.selling_price.toFixed(2)} × {item.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="p-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center font-semibold text-xs">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="p-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1 text-red-500 hover:text-red-700 ml-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Discount & Payment Controls */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-600 mb-1">Discount Amount ({business.currency_symbol})</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={discountAmount}
                    onChange={e => setDiscountAmount(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-neutral-300 rounded-lg text-xs focus:ring-1 focus:ring-[#2A7C13]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-600 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-neutral-300 rounded-lg text-xs focus:ring-1 focus:ring-[#2A7C13]"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Bank">Bank Wire</option>
                    <option value="Credit">Store Credit / On Account</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-neutral-600 mb-1">
                  Amount Received ({business.currency_symbol}) - default full
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={String(grandTotal)}
                  value={paidAmount}
                  onChange={e => setPaidAmount(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-neutral-300 rounded-lg text-xs focus:ring-1 focus:ring-[#2A7C13]"
                />
              </div>
            </div>

            {/* Total Calculation Card & Submit */}
            <div className="mt-4 pt-3 border-t border-neutral-200">
              <div className="space-y-1 text-xs mb-3">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">{business.currency_symbol}{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span className="font-mono">-{business.currency_symbol}{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Tax ({business.tax_rate}%):</span>
                  <span className="font-mono">{business.currency_symbol}{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-neutral-900 pt-1 border-t border-neutral-100">
                  <span>Total Due:</span>
                  <span className="font-mono text-[#2A7C13]">{business.currency_symbol}{grandTotal.toFixed(2)}</span>
                </div>
                {balanceDue > 0 && (
                  <div className="flex justify-between text-xs font-semibold text-amber-700">
                    <span>Balance Deferred:</span>
                    <span className="font-mono">{business.currency_symbol}{balanceDue.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleCompleteSale}
                disabled={cart.length === 0}
                className="w-full py-2.5 px-4 bg-[#2A7C13] hover:bg-[#205e0e] text-white font-semibold rounded-lg text-xs transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
              >
                Complete Sale & Generate Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
