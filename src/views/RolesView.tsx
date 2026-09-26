import React from 'react';
import { ShieldAlert, Check, X, Shield } from 'lucide-react';
import { ROLE_PERMISSIONS } from '../services/mockData';
import { PermissionSlug, RoleSlug } from '../types';

export const RolesView: React.FC = () => {
  const permissionsList: { slug: PermissionSlug; name: string; module: string; desc: string }[] = [
    { slug: 'view_dashboard', name: 'View Dashboard & KPIs', module: 'Dashboard', desc: 'Read-only access to sales charts and performance' },
    { slug: 'manage_products', name: 'Manage Products & Stock', module: 'Catalog', desc: 'Create, update, and delete catalog items and adjust counts' },
    { slug: 'manage_sales', name: 'Process POS & Sales Orders', module: 'Sales', desc: 'Add cart items, apply discounts, issue official tax receipts' },
    { slug: 'manage_customers', name: 'Customer Directory & Credit', module: 'Customers', desc: 'Manage client accounts and outstanding debts' },
    { slug: 'manage_expenses', name: 'Record Operating Expenses', module: 'Accounting', desc: 'Disburse overheads, rent, utilities, and receipt tracking' },
    { slug: 'manage_purchases', name: 'Purchase Orders & Vendors', module: 'Procurement', desc: 'Issue supplier POs and accept incoming shipments' },
    { slug: 'manage_users', name: 'Manage Team & Member Roles', module: 'Administration', desc: 'Invite staff, promote members, revoke access' },
    { slug: 'manage_reports', name: 'Export P&L Financial Statements', module: 'Finance', desc: 'Audit profit/loss, tax compliance, and CSV ledger' },
    { slug: 'manage_settings', name: 'Tenant Business Configuration', module: 'Settings', desc: 'Configure currency, tax percentages, timezone, and entity deletion' }
  ];

  const roles: { slug: RoleSlug; label: string; desc: string }[] = [
    { slug: 'owner', label: 'Owner', desc: 'Ultimate authority over tenant lifecycle and billing' },
    { slug: 'admin', label: 'Admin', desc: 'Full operational control over products, team, and sales' },
    { slug: 'manager', label: 'Manager', desc: 'Catalog, procurement, inventory adjustment, and reporting' },
    { slug: 'staff', label: 'Staff', desc: 'Cashier checkout, product lookup, and customer recording' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#2A7C13]" />
          <h1 className="text-xl font-bold tracking-tight text-neutral-900">Roles & RBAC Permission Matrix</h1>
        </div>
        <p className="text-xs text-neutral-500 mt-1">
          Server-enforced capability gates matching <code className="font-mono text-[11px]">app/middleware/TenantMiddleware.php</code>
        </p>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-600">
                <th className="py-3.5 px-4 font-semibold w-1/3">System Capability / Permission</th>
                {roles.map(r => (
                  <th key={r.slug} className="py-3.5 px-4 text-center font-bold text-neutral-900">
                    <div>{r.label}</div>
                    <span className="text-[10px] font-normal text-neutral-400 font-sans block mt-0.5">
                      {r.slug}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {permissionsList.map(perm => (
                <tr key={perm.slug} className="hover:bg-neutral-50/60">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-neutral-900">{perm.name}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-mono mt-0.5">
                      <span>{perm.module}</span>
                      <span>·</span>
                      <span>{perm.slug}</span>
                    </div>
                  </td>
                  {roles.map(r => {
                    const has = r.slug === 'owner' || ROLE_PERMISSIONS[r.slug].includes(perm.slug);
                    return (
                      <td key={r.slug} className="py-3 px-4 text-center">
                        {has ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#FFF8CF] text-[#2A7C13]">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 text-neutral-300">
                            <X className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
