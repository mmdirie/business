import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Package,
  Layers,
  ShoppingCart,
  Truck,
  Users,
  Building,
  Receipt,
  BarChart3,
  UserCheck,
  ShieldAlert,
  ClipboardList,
  Settings,
  CreditCard,
  Globe,
  X
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  mobileOpen,
  onCloseMobile
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'businesses', label: 'My Businesses', icon: Building2 },
    { id: 'products', label: 'Products & Catalog', icon: Package },
    { id: 'inventory', label: 'Inventory & Stock', icon: Layers },
    { id: 'sales', label: 'Sales & POS', icon: ShoppingCart },
    { id: 'purchases', label: 'Purchases (PO)', icon: Truck },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'suppliers', label: 'Suppliers', icon: Building },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'reports', label: 'Reports & P&L', icon: BarChart3 },
    { id: 'team', label: 'Team Members', icon: UserCheck },
    { id: 'roles', label: 'Roles & Permissions', icon: ShieldAlert },
    { id: 'audit', label: 'Audit Logs', icon: ClipboardList },
    { id: 'settings', label: 'Business Settings', icon: Settings },
    { id: 'pricing', label: 'Subscription Plans', icon: CreditCard },
    { id: 'landing', label: 'Public SaaS Landing', icon: Globe }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-2xs"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-neutral-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-neutral-200 flex items-center justify-between bg-[#FFF8CF]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2A7C13] flex items-center justify-center text-white font-black text-base shadow-xs">
              Ω
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-neutral-900 block leading-tight">
                OmniBiz SaaS
              </span>
              <span className="text-[10px] text-[#2A7C13] font-medium tracking-wide uppercase">
                Multi-Tenant Engine
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg lg:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Operational Modules
          </div>

          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#2A7C13] text-white font-semibold shadow-2xs'
                    : 'text-neutral-700 hover:bg-[#FFF8CF]/60 hover:text-neutral-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#2A7C13]'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer / Tenant isolation guarantee */}
        <div className="p-3 border-t border-neutral-200 bg-neutral-50/50">
          <div className="p-2.5 rounded-lg bg-[#FFF8CF] border border-[#76C457]/40 text-[11px]">
            <p className="font-semibold text-[#2A7C13] flex items-center gap-1">
              <span>●</span> Multi-Tenant Guard
            </p>
            <p className="text-neutral-600 mt-0.5 leading-snug">
              Every query isolated strictly by <code className="font-mono text-[10px]">business_id</code>.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
