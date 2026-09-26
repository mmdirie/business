import React, { useState } from 'react';
import {
  Building2,
  ShoppingCart,
  Layers,
  Users,
  BarChart3,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Server,
  Lock,
  Zap,
  Globe
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenXamppModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onOpenXamppModal }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'How does multi-tenancy isolate data between different businesses?',
      a: 'Every single database table contains a mandatory business_id foreign key indexed with composite constraints. All PHP backend endpoints enforce a TenantMiddleware layer that validates session identity, active business association, and user role before executing queries. No user or tenant can ever read or mutate data outside their assigned business context.'
    },
    {
      q: 'Can one user account switch between businesses without logging out?',
      a: 'Yes! The dashboard header features an instant business switcher [ Sahal Electronics ▼ ]. Switching businesses updates the server session context immediately, altering the catalog, inventory, sales ledger, team, and financial reports without requiring you to re-authenticate.'
    },
    {
      q: 'Does it run locally on XAMPP / Apache / MySQL?',
      a: 'Absolutely. A complete MySQL 8.0+ schema.sql and seed.sql file is bundled together with standard PHP 8+ PDO controllers and REST-style endpoints. You can import schema.sql into phpMyAdmin at http://localhost/phpmyadmin/ and run the project under C:/xampp/htdocs/business-saas/.'
    },
    {
      q: 'What roles and permissions are supported?',
      a: 'The system implements 4 standardized roles: Owner, Admin, Manager, and Staff. Permissions span 9 system capabilities: view_dashboard, manage_products, manage_sales, manage_customers, manage_expenses, manage_purchases, manage_users, manage_reports, and manage_settings.'
    },
    {
      q: 'Can staff access sensitive profit and loss reports?',
      a: 'No. Staff users are restricted to checkout POS operations, product lookups, and basic customer details. P&L financial reports and business settings require Manager, Admin, or Owner capabilities.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFF8CF] text-neutral-900 selection:bg-[#76C457] selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-700">
            <a href="#features" className="hover:text-[#2A7C13] transition-colors">Features</a>
            <a href="#multi-tenant" className="hover:text-[#2A7C13] transition-colors">Multi-Business</a>
            <a href="#pos" className="hover:text-[#2A7C13] transition-colors">Point of Sale</a>
            <a href="#pricing" className="hover:text-[#2A7C13] transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-[#2A7C13] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenXamppModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-lg transition-colors cursor-pointer"
            >
              <Server className="w-3.5 h-3.5 text-[#2A7C13]" />
              <span>XAMPP / SQL</span>
            </button>
            <button
              onClick={onEnterApp}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#2A7C13] hover:bg-[#205e0e] rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Launch Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#76C457]/50 text-xs font-medium text-[#2A7C13] mb-6 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Enterprise Multi-Tenant SaaS · 100% Isolated Databases</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-900 tracking-tight leading-tight">
          Manage All Your Businesses <br />
          <span className="text-[#2A7C13]">in One Place.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-neutral-700 max-w-2xl mx-auto leading-relaxed">
          The all-in-one scalable multi-tenant SaaS platform. Create and manage multiple retail stores, restaurants, academies, or service clinics from a single master account with zero data leakage.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onEnterApp}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#2A7C13] hover:bg-[#205e0e] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Start Free · Launch Live Demo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={onOpenXamppModal}
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 font-bold text-sm rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Server className="w-4 h-4 text-[#2A7C13]" />
            <span>Download XAMPP PHP & MySQL Schema</span>
          </button>
        </div>

        {/* Live Multi-Tenant Entity Demo Pills */}
        <div className="mt-12 bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-neutral-200 max-w-2xl mx-auto text-xs text-neutral-600 flex flex-wrap items-center justify-center gap-2">
          <span className="font-semibold text-neutral-800">Pre-seeded Live Tenants:</span>
          <span className="px-2 py-0.5 bg-[#FFF8CF] text-[#2A7C13] rounded font-bold">Sahal Electronics</span>
          <span>·</span>
          <span className="px-2 py-0.5 bg-[#FFF8CF] text-[#2A7C13] rounded font-bold">Sahal Restaurant</span>
          <span>·</span>
          <span className="px-2 py-0.5 bg-[#FFF8CF] text-[#2A7C13] rounded font-bold">Sahal Academy</span>
        </div>
      </section>

      {/* Feature Grid: White cards on cream background */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            Enterprise Architecture Built for Serial Entrepreneurs
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-xl mx-auto">
            Everything your operations need: Point of Sale, inventory movements, supplier purchase orders, expense vouchers, customer receivables, and financial statements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-[#FFF8CF] text-[#2A7C13] flex items-center justify-center mb-4">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 mb-1">Instant Multi-Tenant Switcher</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Switch between electronics stores, food establishments, and schools in one click. Every query is filtered server-side by <code className="font-mono">business_id</code> with strict session checks.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-[#FFF8CF] text-[#2A7C13] flex items-center justify-center mb-4">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 mb-1">Point of Sale & Tax Invoicing</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              High-speed checkout with live stock locking, auto tax computation, discount limits, multi-tender payment (Cash, Bank, Mobile Money, Credit), and printable receipts.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-[#FFF8CF] text-[#2A7C13] flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 mb-1">Real-Time Inventory Audit Trail</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Trace every single SKU from supplier PO intake down to customer checkout. Automated low-stock thresholds prevent unexpected stockouts.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-[#FFF8CF] text-[#2A7C13] flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 mb-1">Profit & Loss Statements</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Accurate gross profit, Cost of Goods Sold (COGS), operating overheads, and net margins filterable by Today, This Month, or Custom Date range with CSV exports.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-[#FFF8CF] text-[#2A7C13] flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 mb-1">Roles & RBAC Access Control</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Owner, Admin, Manager, and Staff roles with server-enforced permission gates. Staff cannot view accounting statements or alter store settings.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-[#FFF8CF] text-[#2A7C13] flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 mb-1">Immutable Audit Logging</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every sensitive action records actor ID, business entity, timestamp, IP address, and change details for enterprise accountability and audit readiness.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-200/80">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">Transparent Multi-Tenant Pricing</h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2">
            One master subscription covers your entire enterprise portfolio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { name: 'Free', price: '$0', desc: '1 Business', features: ['50 Products', 'POS Invoicing', 'Single User'] },
            { name: 'Starter', price: '$19/mo', desc: 'Up to 3 Businesses', features: ['Unlimited Catalog', 'Inventory Ledger', '5 Team Members'] },
            { name: 'Professional', price: '$49/mo', desc: 'Up to 10 Businesses', features: ['Full RBAC Roles', 'Supplier POs', 'P&L Statements', 'Priority Support'], pop: true },
            { name: 'Business', price: '$99/mo', desc: 'Up to 25 Businesses', features: ['Unlimited Members', 'Custom Taxes', 'Low-Stock Webhooks'] },
            { name: 'Enterprise', price: '$249/mo', desc: 'Unlimited Entities', features: ['Dedicated DB Sharding', 'Custom API', 'SLA 99.99%'] }
          ].map((tier, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-xl p-5 border flex flex-col justify-between ${
                tier.pop ? 'border-[#2A7C13] ring-2 ring-[#76C457]/50 shadow-md relative' : 'border-neutral-200 shadow-2xs'
              }`}
            >
              <div>
                {tier.pop && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#2A7C13] text-white rounded-full">
                    Recommended
                  </span>
                )}
                <h3 className="font-bold text-sm text-neutral-900">{tier.name}</h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">{tier.desc}</p>
                <div className="my-3 font-mono text-2xl font-bold text-neutral-900">{tier.price}</div>
                <ul className="space-y-1.5 border-t border-neutral-100 pt-3 text-[11px] text-neutral-600">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-[#2A7C13] shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={onEnterApp}
                className={`mt-4 w-full py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  tier.pop
                    ? 'bg-[#2A7C13] hover:bg-[#205e0e] text-white shadow-2xs'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                }`}
              >
                Choose {tier.name}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto border-t border-neutral-200/80">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-neutral-900">Frequently Asked Questions</h2>
          <p className="text-xs text-neutral-600 mt-1">
            Technical and architectural considerations for OmniBiz multi-tenancy.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-xs font-bold text-neutral-900 hover:bg-neutral-50 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-neutral-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#2A7C13] text-white font-bold flex items-center justify-center text-xs">
              Ω
            </div>
            <span className="text-white font-bold">OmniBiz Multi-Tenant Business SaaS</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenXamppModal}
              className="text-neutral-300 hover:text-white cursor-pointer"
            >
              XAMPP Deployment Package
            </button>
            <span>·</span>
            <button
              onClick={onEnterApp}
              className="text-[#76C457] hover:underline font-semibold cursor-pointer"
            >
              Enter Dashboard
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-neutral-800 text-[11px] text-neutral-500 text-center">
          &copy; {new Date().getFullYear()} OmniBiz Technologies Inc. Scalable PHP 8+ PDO & MySQL 8.0 Multi-Tenant Business Management System.
        </div>
      </footer>
    </div>
  );
};
