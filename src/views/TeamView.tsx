import React from 'react';
import { BusinessMember, RoleSlug, Business } from '../types';
import { tenantStore } from '../services/tenantStore';
import { UserCheck, UserPlus, Shield, Trash2, CheckCircle2 } from 'lucide-react';

interface TeamViewProps {
  business: Business;
  members: BusinessMember[];
  onOpenInvite: () => void;
}

export const TeamView: React.FC<TeamViewProps> = ({ business, members, onOpenInvite }) => {
  const currentRole = tenantStore.getCurrentUserRole();
  const canManageUsers = tenantStore.hasPermission('manage_users');

  const handleRoleChange = (memberId: number, newRole: RoleSlug) => {
    const ok = tenantStore.updateMemberRole(memberId, newRole);
    if (!ok) {
      alert('Cannot change this member role. Tenant owner cannot be demoted.');
    }
  };

  const handleRemove = (memberId: number, name: string) => {
    if (confirm(`Revoke access for ${name} from ${business.name}?`)) {
      const ok = tenantStore.removeMember(memberId);
      if (!ok) {
        alert('Cannot remove the primary business owner.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#2A7C13]" />
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">Tenant Team & Member Access</h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Access delegation and role authorization strictly for {business.name}
          </p>
        </div>

        {canManageUsers && (
          <button
            onClick={onOpenInvite}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2A7C13] hover:bg-[#205e0e] rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </button>
        )}
      </div>

      {/* Security Note */}
      <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs flex items-start gap-3">
        <Shield className="w-5 h-5 text-[#2A7C13] shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-neutral-900">Zero-Leakage Multi-Tenant Isolation</p>
          <p className="text-neutral-600 mt-0.5 leading-relaxed">
            Members assigned to <strong>{business.name}</strong> can only access records where{' '}
            <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">business_id = {business.id}</code>.
            Users assigned as Staff here cannot inspect accounting reports, manage settings, or switch into businesses they haven't been assigned to.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-600 font-semibold">
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Email Identity</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {members.map(m => {
                const isOwner = m.role === 'owner';
                return (
                  <tr key={m.id} className="hover:bg-neutral-50/60">
                    <td className="py-3 px-4 font-semibold text-neutral-900">
                      {m.user_name}
                      {isOwner && (
                        <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-[#FFF8CF] text-[#2A7C13] font-bold border border-[#76C457]/40">
                          Tenant Owner
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-neutral-600 font-mono text-[11px]">
                      {m.user_email}
                    </td>
                    <td className="py-3 px-4">
                      {isOwner || !canManageUsers ? (
                        <span className="font-semibold capitalize text-neutral-800">{m.role}</span>
                      ) : (
                        <select
                          value={m.role}
                          onChange={e => handleRoleChange(m.id, e.target.value as RoleSlug)}
                          className="px-2 py-1 bg-white border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-[#2A7C13]"
                        >
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="staff">Staff</option>
                        </select>
                      )}
                    </td>
                    <td className="py-3 px-4 text-neutral-500 font-mono">
                      {m.joined_at}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[#2A7C13] font-medium text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {!isOwner && canManageUsers && (
                        <button
                          onClick={() => handleRemove(m.id, m.user_name)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Revoke access"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
