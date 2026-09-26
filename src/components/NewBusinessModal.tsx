import React, { useState } from 'react';
import { BusinessType } from '../types';
import { tenantStore } from '../services/tenantStore';
import { X, Building2 } from 'lucide-react';

interface NewBusinessModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const NewBusinessModal: React.FC<NewBusinessModalProps> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<BusinessType>('Retail');
  const [currency, setCurrency] = useState('USD');
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [taxRate, setTaxRate] = useState('5.0');
  const [error, setError] = useState('');

  const handleCurrencyChange = (curr: string) => {
    setCurrency(curr);
    if (curr === 'USD') setCurrencySymbol('$');
    else if (curr === 'EUR') setCurrencySymbol('€');
    else if (curr === 'GBP') setCurrencySymbol('£');
    else if (curr === 'SOS') setCurrencySymbol('Sh');
    else if (curr === 'KES') setCurrencySymbol('KSh');
    else if (curr === 'AED') setCurrencySymbol('AED');
    else setCurrencySymbol('$');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Business entity name is required.');
      return;
    }

    try {
      tenantStore.createBusiness({
        name: name.trim(),
        type,
        currency,
        currency_symbol: currencySymbol,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        address: address.trim() || undefined,
        tax_rate: Number(taxRate) || 0
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create business tenant');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-[#FFF8CF]/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#2A7C13] text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Create New Business Tenant</h2>
              <p className="text-xs text-neutral-500">100% Isolated database and operational context</p>
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
            <label className="block font-semibold text-neutral-700 mb-1">Business Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Sahal Logistics & Freight"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Industry / Type *</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as BusinessType)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
              >
                <option value="Retail">Retail</option>
                <option value="Restaurant">Restaurant</option>
                <option value="School">School / Academy</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Service">Professional Service</option>
                <option value="Wholesale">Wholesale & Trade</option>
                <option value="Other">Other Enterprise</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Operating Currency</label>
              <select
                value={currency}
                onChange={e => handleCurrencyChange(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="SOS">SOS (Sh)</option>
                <option value="KES">KES (KSh)</option>
                <option value="AED">AED</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Official Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Sales Tax / VAT %</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={taxRate}
                onChange={e => setTaxRate(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Business Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="billing@example.com"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Physical Address</label>
            <textarea
              rows={2}
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Suite, Building, Street, City"
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
              Create Business Tenant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
