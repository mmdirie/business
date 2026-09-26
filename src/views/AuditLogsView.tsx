import React, { useState } from 'react';
import { AuditLogItem, Business } from '../types';
import { ClipboardList, Search, ShieldCheck } from 'lucide-react';

interface AuditLogsViewProps {
  business: Business;
  logs: AuditLogItem[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ business, logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');

  const filtered = logs.filter(l => {
    const matchesSearch =
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.details && l.details.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesModule = moduleFilter === 'all' || l.module === moduleFilter;

    return matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-[#2A7C13]" />
          <h1 className="text-xl font-bold tracking-tight text-neutral-900">Tenant Audit & Compliance Logs</h1>
        </div>
        <p className="text-xs text-neutral-500 mt-1">
          Immutable event log for actions taken within {business.name}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search action, user, or details..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
          />
        </div>

        <select
          value={moduleFilter}
          onChange={e => setModuleFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
        >
          <option value="all">All Modules</option>
          <option value="sales">Sales</option>
          <option value="products">Products</option>
          <option value="inventory">Inventory</option>
          <option value="expenses">Expenses</option>
          <option value="team">Team & Access</option>
          <option value="businesses">Businesses</option>
          <option value="settings">Settings</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-600 font-semibold">
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4 font-mono">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400">
                    No matching audit records in {business.name}.
                  </td>
                </tr>
              ) : (
                filtered.map(l => (
                  <tr key={l.id} className="hover:bg-neutral-50/60">
                    <td className="py-3 px-4 font-mono text-neutral-500 whitespace-nowrap">
                      {l.created_at}
                    </td>
                    <td className="py-3 px-4 font-semibold text-neutral-900">
                      {l.user_name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-neutral-800">{l.action}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-neutral-100 font-mono text-[10px] text-neutral-700 uppercase">
                        {l.module}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-600 max-w-sm truncate">
                      {l.details || 'No additional context'}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-400">
                      {l.ip_address}
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
