import React from 'react';
import { Business, User } from '../types';
import { tenantStore } from '../services/tenantStore';
import { Building2, Plus, CheckCircle, ArrowRight, Shield } from 'lucide-react';

interface BusinessesViewProps {
  businesses: Business[];
  activeBusiness: Business;
  currentUser: User;
  onOpenNewBusiness: () => void;
  onNavigate: (view: string) => void;
}

export const BusinessesView: React.FC<BusinessesViewProps> = ({
  businesses,
  activeBusiness,
  currentUser,
  onOpenNewBusiness,
  onNavigate
}) => {
  const handleSwitch = (id: number) => {
    tenantStore.setActiveBusiness(id);
    onNavigate('dashboard');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#2A7C13]" />
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">Multi-Business Entity Manager</h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Logged in as {currentUser.name} ({currentUser.email}) · Switch between distinct business databases
          </p>
        </div>

        <button
          onClick={onOpenNewBusiness}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2A7C13] hover:bg-[#205e0e] rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Business
        </button>
      </div>

      {/* Grid of Business Cards (White cards on cream background) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map(biz => {
          const isActive = biz.id === activeBusiness.id;
          return (
            <div
              key={biz.id}
              className={`bg-white rounded-xl border p-5 shadow-2xs transition-all flex flex-col justify-between ${
                isActive ? 'border-[#2A7C13] ring-2 ring-[#76C457]/50' : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm text-white ${
                        isActive ? 'bg-[#2A7C13]' : 'bg-neutral-800'
                      }`}
                    >
                      {biz.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900 leading-tight">{biz.name}</h3>
                      <span className="text-[11px] text-neutral-500">{biz.type}</span>
                    </div>
                  </div>
                  {isActive && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2A7C13] bg-[#FFF8CF] px-2 py-0.5 rounded border border-[#76C457]/30">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Active
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-neutral-600 border-t border-neutral-100 pt-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Currency:</span>
                    <span className="font-mono font-medium">{biz.currency} ({biz.currency_symbol})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Sales Tax:</span>
                    <span className="font-mono">{biz.tax_rate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Timezone:</span>
                    <span className="font-mono">{biz.timezone}</span>
                  </div>
                  {biz.phone && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Phone:</span>
                      <span className="font-mono truncate max-w-[150px]">{biz.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                {isActive ? (
                  <div className="w-full py-2 px-3 text-center text-xs font-semibold text-[#2A7C13] bg-[#FFF8CF] rounded-lg border border-[#76C457]/30">
                    Currently Operating in this Context
                  </div>
                ) : (
                  <button
                    onClick={() => handleSwitch(biz.id)}
                    className="w-full py-2 px-3 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-[#2A7C13] hover:text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Switch to this Business</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
