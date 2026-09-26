import React, { useState } from 'react';
import { Supplier, Business } from '../types';
import { Building, Plus, Search, Phone, Mail, User } from 'lucide-react';

interface SuppliersViewProps {
  business: Business;
  suppliers: Supplier[];
  onOpenNewSupplier: () => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  business,
  suppliers,
  onOpenNewSupplier
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = suppliers.filter(
    s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.contact_person && s.contact_person.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-[#2A7C13]" />
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">Vendors & Suppliers</h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Supplier accounts and procurement contacts for {business.name}
          </p>
        </div>

        <button
          onClick={onOpenNewSupplier}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2A7C13] hover:bg-[#205e0e] rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Supplier
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-3 border border-neutral-200 shadow-2xs">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search suppliers by company or representative..."
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
                <th className="py-3 px-4">Supplier Entity</th>
                <th className="py-3 px-4">Contact Person</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4 text-right">Balance Payable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-400">
                    No suppliers listed for {business.name}.
                  </td>
                </tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.id} className="hover:bg-neutral-50/60">
                    <td className="py-3 px-4 font-semibold text-neutral-900">
                      {s.name}
                    </td>
                    <td className="py-3 px-4 text-neutral-700">
                      {s.contact_person ? (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-neutral-400" />
                          {s.contact_person}
                        </span>
                      ) : (
                        <span className="text-neutral-400 italic">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-neutral-600 font-mono text-[11px]">
                      {s.phone || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-neutral-600">
                      {s.email || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold">
                      {s.balance > 0 ? (
                        <span className="text-amber-700">
                          Due {business.currency_symbol}{s.balance.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-[#2A7C13]">Settled</span>
                      )}
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
