import React, { useState } from 'react';
import { Customer, Business } from '../types';
import { Users, Plus, Search, Phone, Mail, MapPin } from 'lucide-react';

interface CustomersViewProps {
  business: Business;
  customers: Customer[];
  onOpenNewCustomer: () => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  business,
  customers,
  onOpenNewCustomer
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = customers.filter(
    c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm)) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#2A7C13]" />
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">Customer Directory</h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Accounts and receivables ledger for {business.name}
          </p>
        </div>

        <button
          onClick={onOpenNewCustomer}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2A7C13] hover:bg-[#205e0e] rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Customer
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
            placeholder="Search customers by name, phone, or email..."
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
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4 text-right">Account Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-400">
                    No customers found in {business.name}.
                  </td>
                </tr>
              ) : (
                filtered.map(c => (
                  <tr key={c.id} className="hover:bg-neutral-50/60">
                    <td className="py-3 px-4 font-semibold text-neutral-900">
                      {c.name}
                    </td>
                    <td className="py-3 px-4 text-neutral-600">
                      {c.phone ? (
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Phone className="w-3 h-3 text-neutral-400" />
                          {c.phone}
                        </span>
                      ) : (
                        <span className="text-neutral-400 italic">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-neutral-600">
                      {c.email ? (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-neutral-400" />
                          {c.email}
                        </span>
                      ) : (
                        <span className="text-neutral-400 italic">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-neutral-500 max-w-xs truncate">
                      {c.address || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold">
                      {c.balance > 0 ? (
                        <span className="text-amber-700">
                          Owes {business.currency_symbol}{c.balance.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-[#2A7C13]">Cleared</span>
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
