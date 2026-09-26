import React, { useState } from 'react';
import { RoleSlug, Business } from '../types';
import { tenantStore } from '../services/tenantStore';
import { X, UserPlus, Shield } from 'lucide-react';

interface InviteMemberModalProps {
  business: Business;
  onClose: () => void;
  onSuccess: () => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  business,
  onClose,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<RoleSlug>('staff');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }

    const ok = tenantStore.inviteMember({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      role
    });

    if (!ok) {
      setError('Permission denied: only Owners and Admins can invite team members.');
      return;
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-[#FFF8CF]/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#2A7C13] text-white">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Invite Team Member</h2>
              <p className="text-xs text-neutral-500">Tenant: {business.name}</p>
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
            <label className="block font-semibold text-neutral-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Maryan Adan"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Email Address (Login Identity) *</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="maryan@company.com"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Contact Phone</label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Assigned Tenant Role *</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as RoleSlug)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
            >
              <option value="admin">Admin - Can manage all business modules, sales, products, users</option>
              <option value="manager">Manager - Can manage catalog, inventory, purchases, expenses & reports</option>
              <option value="staff">Staff - Can operate POS checkout, search products & view customers</option>
            </select>
          </div>

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-start gap-2">
            <Shield className="w-4 h-4 text-[#2A7C13] shrink-0 mt-0.5" />
            <p className="text-[11px] text-neutral-600">
              This invitation grants isolated access <strong>only</strong> to {business.name}. The user will not have access to any other businesses unless explicitly assigned.
            </p>
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
              Send Invitation & Grant Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
