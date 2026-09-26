import React, { useState } from 'react';
import { CreditCard, Check, Sparkles } from 'lucide-react';
import { Business } from '../types';

interface PricingViewProps {
  business: Business;
}

export const PricingView: React.FC<PricingViewProps> = ({ business }) => {
  const [annual, setAnnual] = useState(false);

  const tiers = [
    {
      id: 'free',
      name: 'Free Tier',
      price: 0,
      desc: 'Ideal for sole proprietors starting their first storefront.',
      features: [
        '1 Business Entity',
        'Up to 50 Products',
        'Basic POS Checkout',
        'Single User Access',
        'Standard Community Support'
      ],
      highlight: false
    },
    {
      id: 'starter',
      name: 'Starter',
      price: annual ? 19 : 24,
      desc: 'For growing businesses expanding catalog and stock transactions.',
      features: [
        'Up to 3 Businesses',
        'Unlimited Products & SKUs',
        'Inventory Adjustments & Tracking',
        'Up to 5 Team Members',
        'Email Support & Invoicing'
      ],
      highlight: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: annual ? 49 : 59,
      desc: 'Comprehensive multi-branch operations with full team delegation.',
      features: [
        'Up to 10 Businesses',
        'Multi-Tenant Roles & RBAC',
        'Supplier POs & Stock In',
        'Profit & Loss Statements',
        'Audit Logging & Receivables',
        'Priority Technical Support'
      ],
      highlight: true
    },
    {
      id: 'business',
      name: 'Business',
      price: annual ? 99 : 119,
      desc: 'Franchise and serial entrepreneurs managing high transactional volume.',
      features: [
        'Up to 25 Businesses',
        'Unlimited Team Members',
        'Advanced POS Barcode Scanner',
        'Custom Tax & Currencies',
        'Automated Low-Stock Alerts',
        'Dedicated Account Manager'
      ],
      highlight: false
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: annual ? 249 : 299,
      desc: 'Large conglomerates needing bespoke integration and SLA guarantees.',
      features: [
        'Unlimited Business Tenants',
        'Dedicated MySQL Database Sharding',
        'Custom Webhooks & REST API',
        '99.99% Uptime Guarantee',
        'On-Premise XAMPP / Cloud Deployment'
      ],
      highlight: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto pt-2 pb-4">
        <h1 className="text-2xl font-bold text-neutral-900">Scalable Multi-Tenant Subscription Architecture</h1>
        <p className="text-xs text-neutral-600 mt-2">
          Manage multiple business entities under one centralized billing account. Switch plans as your enterprise scales.
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-3 mt-4 p-1 bg-white border border-neutral-200 rounded-lg text-xs font-semibold shadow-2xs">
          <button
            onClick={() => setAnnual(false)}
            className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
              !annual ? 'bg-[#2A7C13] text-white' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors flex items-center gap-1.5 ${
              annual ? 'bg-[#2A7C13] text-white' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>Annual (Save 20%)</span>
            <span className="text-[10px] bg-[#FFF8CF] text-[#2A7C13] px-1 rounded font-bold">20% OFF</span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {tiers.map(t => {
          const isCurrent = business.subscription_tier === t.id;
          return (
            <div
              key={t.id}
              className={`bg-white rounded-xl border p-5 flex flex-col justify-between transition-all ${
                t.highlight
                  ? 'border-[#2A7C13] shadow-md ring-2 ring-[#76C457]/50 relative'
                  : 'border-neutral-200 shadow-2xs hover:border-neutral-300'
              }`}
            >
              <div>
                {t.highlight && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#2A7C13] text-white rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="font-bold text-sm text-neutral-900 mt-1">{t.name}</h3>
                <p className="text-[11px] text-neutral-500 mt-1 min-h-[32px]">{t.desc}</p>

                <div className="my-4 font-mono">
                  <span className="text-2xl font-bold text-neutral-900">
                    {t.price === 0 ? 'Free' : `$${t.price}`}
                  </span>
                  {t.price > 0 && <span className="text-xs text-neutral-400">/mo</span>}
                </div>

                <div className="space-y-2 border-t border-neutral-100 pt-3 text-[11px]">
                  {t.features.map((f, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-neutral-600">
                      <Check className="w-3.5 h-3.5 text-[#2A7C13] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-100">
                <button
                  disabled={isCurrent}
                  className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    isCurrent
                      ? 'bg-[#FFF8CF] text-[#2A7C13] border border-[#76C457]/50 cursor-default'
                      : t.highlight
                      ? 'bg-[#2A7C13] hover:bg-[#205e0e] text-white shadow-2xs'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : 'Select Plan'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
