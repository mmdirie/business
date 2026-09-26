import React, { useState, useRef, useEffect } from 'react';
import {
  Building2,
  ChevronDown,
  Plus,
  Bell,
  Search,
  Check,
  User as UserIcon,
  LogOut,
  Server,
  ShoppingCart,
  Menu,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { tenantStore } from '../services/tenantStore';
import { Business, User, NotificationItem } from '../types';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  onOpenNewSale: () => void;
  onOpenNewProduct: () => void;
  onOpenNewBusiness: () => void;
  onOpenXamppExport: () => void;
  onSelectView: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileSidebar,
  onOpenNewSale,
  onOpenNewProduct,
  onOpenNewBusiness,
  onOpenXamppExport,
  onSelectView
}) => {
  const [activeBiz, setActiveBiz] = useState<Business>(tenantStore.getActiveBusiness());
  const [currentUser, setCurrentUser] = useState<User>(tenantStore.getCurrentUser());
  const [userBusinesses, setUserBusinesses] = useState<Business[]>(tenantStore.getUserBusinesses());
  const [notifications, setNotifications] = useState<NotificationItem[]>(tenantStore.getNotifications());
  const [currentRole, setCurrentRole] = useState(tenantStore.getCurrentUserRole());

  const [bizMenuOpen, setBizMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const bizRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = tenantStore.subscribe(() => {
      setActiveBiz(tenantStore.getActiveBusiness());
      setCurrentUser(tenantStore.getCurrentUser());
      setUserBusinesses(tenantStore.getUserBusinesses());
      setNotifications(tenantStore.getNotifications());
      setCurrentRole(tenantStore.getCurrentUserRole());
    });
    return unsubscribe;
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bizRef.current && !bizRef.current.contains(event.target as Node)) {
        setBizMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleSwitchBiz = (id: number) => {
    tenantStore.setActiveBusiness(id);
    setBizMenuOpen(false);
  };

  const handleSwitchUser = (userId: number) => {
    tenantStore.setCurrentUser(userId);
    setUserMenuOpen(false);
  };

  const handleMarkAllRead = () => {
    tenantStore.markAllNotificationsAsRead();
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-neutral-200 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Toggle & Business Switcher */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 text-neutral-600 hover:text-neutral-900 rounded-lg lg:hidden hover:bg-neutral-100 cursor-pointer"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Business Switcher Dropdown [ Sahal Electronics ▼ ] */}
        <div className="relative" ref={bizRef}>
          <button
            onClick={() => setBizMenuOpen(!bizMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-300 bg-white hover:border-[#2A7C13] transition-colors cursor-pointer text-left shadow-2xs group"
          >
            <div className="w-6 h-6 rounded-md bg-[#2A7C13] text-white font-bold flex items-center justify-center text-xs">
              {activeBiz.name.charAt(0)}
            </div>
            <div className="min-w-0 max-w-[130px] sm:max-w-[200px]">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-neutral-900 truncate group-hover:text-[#2A7C13]">
                  {activeBiz.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#2A7C13] shrink-0" />
              </div>
              <p className="text-[10px] text-neutral-500 truncate leading-none mt-0.5">
                {activeBiz.type} · {currentRole.toUpperCase()}
              </p>
            </div>
          </button>

          {/* Business Switcher Dropdown Menu */}
          {bizMenuOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Assigned Businesses ({userBusinesses.length})
              </div>

              <div className="max-h-60 overflow-y-auto divide-y divide-neutral-100">
                {userBusinesses.map(biz => {
                  const isActive = biz.id === activeBiz.id;
                  return (
                    <button
                      key={biz.id}
                      onClick={() => handleSwitchBiz(biz.id)}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer ${
                        isActive ? 'bg-[#FFF8CF]/60 text-neutral-900' : 'text-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs ${
                            isActive ? 'bg-[#2A7C13] text-white' : 'bg-neutral-200 text-neutral-700'
                          }`}
                        >
                          {biz.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate">{biz.name}</p>
                          <p className="text-[10px] text-neutral-500">
                            {biz.type} · {biz.currency}
                          </p>
                        </div>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-[#2A7C13] shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 mt-1 border-t border-neutral-100 px-2">
                <button
                  onClick={() => {
                    setBizMenuOpen(false);
                    onOpenNewBusiness();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#2A7C13] hover:bg-[#FFF8CF] rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  + Create New Business
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center Search (Hidden on small mobile) */}
      <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search records in tenant..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-100 border border-transparent rounded-lg focus:bg-white focus:border-[#2A7C13] focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Right: Quick POS, XAMPP Export, Notifications, Role Badge, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick New Sale button */}
        <button
          onClick={onOpenNewSale}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A7C13] hover:bg-[#205e0e] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Sale</span>
        </button>

        {/* XAMPP Export Code & SQL Package */}
        <button
          onClick={onOpenXamppExport}
          title="Download PHP & MySQL XAMPP Source Code"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-lg transition-colors cursor-pointer"
        >
          <Server className="w-3.5 h-3.5 text-[#2A7C13]" />
          <span className="hidden md:inline font-mono">XAMPP / SQL</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifMenuOpen(!notifMenuOpen)}
            className="relative p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {notifMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-neutral-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Notifications</h4>
                  <p className="text-[10px] text-neutral-500">Tenant: {activeBiz.name}</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-[#2A7C13] hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100">
                {notifications.length === 0 ? (
                  <p className="p-4 text-center text-xs text-neutral-400">No notifications in this tenant.</p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        tenantStore.markNotificationAsRead(n.id);
                        if (n.link) onSelectView(n.link);
                        setNotifMenuOpen(false);
                      }}
                      className={`p-3 text-xs hover:bg-neutral-50 transition-colors cursor-pointer ${
                        !n.is_read ? 'bg-[#FFF8CF]/40' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-neutral-900">{n.title}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {n.created_at.substring(11, 16)}
                        </span>
                      </div>
                      <p className="text-neutral-600 text-[11px] leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Demo Role Switcher */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#76C457] text-[#000000] font-bold flex items-center justify-center text-xs border border-white shadow-2xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-neutral-900 leading-tight">{currentUser.name}</p>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#2A7C13]" />
                <span className="text-[10px] text-neutral-500 font-medium capitalize">{currentRole}</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 hidden lg:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-neutral-100">
                <p className="text-xs font-bold text-neutral-900">{currentUser.name}</p>
                <p className="text-[11px] text-neutral-500 truncate">{currentUser.email}</p>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FFF8CF] text-[#2A7C13] text-[10px] font-semibold">
                  Active Tenant: {activeBiz.name} ({currentRole})
                </div>
              </div>

              {/* Role Switcher for Testing Auth */}
              <div className="px-4 py-2 border-b border-neutral-100">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Test User Login (Multi-Role)
                </p>
                <div className="space-y-1">
                  <button
                    onClick={() => handleSwitchUser(1)}
                    className={`w-full text-left px-2 py-1 rounded text-xs flex justify-between ${
                      currentUser.id === 1 ? 'bg-[#2A7C13] text-white font-medium' : 'hover:bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    <span>Ahmed Sahal</span>
                    <span className="text-[10px] opacity-80">Owner</span>
                  </button>
                  <button
                    onClick={() => handleSwitchUser(2)}
                    className={`w-full text-left px-2 py-1 rounded text-xs flex justify-between ${
                      currentUser.id === 2 ? 'bg-[#2A7C13] text-white font-medium' : 'hover:bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    <span>Fatima Noor</span>
                    <span className="text-[10px] opacity-80">Admin</span>
                  </button>
                  <button
                    onClick={() => handleSwitchUser(4)}
                    className={`w-full text-left px-2 py-1 rounded text-xs flex justify-between ${
                      currentUser.id === 4 ? 'bg-[#2A7C13] text-white font-medium' : 'hover:bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    <span>Amina Ali</span>
                    <span className="text-[10px] opacity-80">Staff</span>
                  </button>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onSelectView('settings');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  Tenant Settings
                </button>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    tenantStore.resetAll();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset to Seed Demo State
                </button>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onSelectView('landing');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out / SaaS Landing Page
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
