import React, { useState } from 'react';
import { Business, BusinessType } from '../types';
import { tenantStore } from '../services/tenantStore';
import { Settings, Save, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface SettingsViewProps {
  business: Business;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ business }) => {
  const [name, setName] = useState(business.name);
  const [type, setType] = useState<BusinessType>(business.type);
  const [phone, setPhone] = useState(business.phone || '');
  const [email, setEmail] = useState(business.email || '');
  const [address, setAddress] = useState(business.address || '');
  const [currency, setCurrency] = useState(business.currency);
  const [currencySymbol, setCurrencySymbol] = useState(business.currency_symbol);
  const [taxRate, setTaxRate] = useState(String(business.tax_rate));
  const [taxNumber, setTaxNumber] = useState(business.tax_number || '');
  const [saved, setSaved] = useState(false);

  const canManage = tenantStore.hasPermission('manage_settings');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;

    tenantStore.updateBusiness({
      name: name.trim(),
      type,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      currency,
      currency_symbol: currencySymbol,
      tax_rate: Number(taxRate) || 0,
      tax_number: taxNumber.trim() || undefined
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#2A7C13]" />
          <h1 className="text-xl font-bold tracking-tight text-neutral-900">Business Profile & Settings</h1>
        </div>
        <p className="text-xs text-neutral-500 mt-1">
          Configuration parameters for active business entity {business.name}
        </p>
      </div>

      {!canManage && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-700" />
          <span>Read-only: You need Owner or Admin privileges to modify tenant configuration.</span>
        </div>
      )}

      {saved && (
        <div className="p-4 bg-emerald-50 border border-[#76C457] rounded-xl text-xs text-[#2A7C13] flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Settings updated successfully in database.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-neutral-200 shadow-2xs p-6 space-y-6 text-xs">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">
            General Business Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Business Name</label>
              <input
                type="text"
                disabled={!canManage}
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13] disabled:bg-neutral-100"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Industry / Entity Type</label>
              <select
                disabled={!canManage}
                value={type}
                onChange={e => setType(e.target.value as BusinessType)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13] disabled:bg-neutral-100"
              >
                <option value="Retail">Retail</option>
                <option value="Restaurant">Restaurant</option>
                <option value="School">School</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Service">Service</option>
                <option value="Wholesale">Wholesale</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">
            Localization, Currency & Tax
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Currency Code</label>
              <input
                type="text"
                disabled={!canManage}
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13] font-mono disabled:bg-neutral-100"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Currency Symbol</label>
              <input
                type="text"
                disabled={!canManage}
                value={currencySymbol}
                onChange={e => setCurrencySymbol(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13] font-mono disabled:bg-neutral-100"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Default Sales Tax / VAT %</label>
              <input
                type="number"
                step="0.1"
                min="0"
                disabled={!canManage}
                value={taxRate}
                onChange={e => setTaxRate(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13] disabled:bg-neutral-100"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-2 mb-4">
            Official Contact & Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Phone Number</label>
              <input
                type="text"
                disabled={!canManage}
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13] disabled:bg-neutral-100"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled={!canManage}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13] disabled:bg-neutral-100"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-semibold text-neutral-700 mb-1">Physical Location Address</label>
              <textarea
                rows={2}
                disabled={!canManage}
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13] disabled:bg-neutral-100"
              />
            </div>
          </div>
        </div>

        {canManage && (
          <div className="pt-4 border-t border-neutral-200 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#2A7C13] hover:bg-[#205e0e] text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Configuration
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
