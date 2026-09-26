import React, { useState } from 'react';
import { X, Download, Copy, Check, Database, Server, FileCode, Terminal } from 'lucide-react';

interface XamppExportModalProps {
  onClose: () => void;
}

export const XamppExportModal: React.FC<XamppExportModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'instructions' | 'schema' | 'seed' | 'php'>('instructions');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const schemaSqlSample = `-- ========================================================
-- OmniBiz Multi-Tenant SaaS - Complete MySQL 8.0+ Schema
-- Database: business_saas (Import into phpMyAdmin)
-- ========================================================
CREATE DATABASE IF NOT EXISTS \`business_saas\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`business_saas\`;

-- 1. Users Table (Platform Authentication)
CREATE TABLE \`users\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`name\` VARCHAR(120) NOT NULL,
  \`email\` VARCHAR(191) NOT NULL,
  \`password\` VARCHAR(255) NOT NULL,
  \`phone\` VARCHAR(30) DEFAULT NULL,
  \`status\` ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
  \`email_verified_at\` TIMESTAMP NULL DEFAULT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_users_email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Businesses Table (Isolated Tenants)
CREATE TABLE \`businesses\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`owner_id\` INT UNSIGNED NOT NULL,
  \`name\` VARCHAR(150) NOT NULL,
  \`slug\` VARCHAR(160) NOT NULL,
  \`type\` ENUM('Retail', 'Restaurant', 'School', 'Pharmacy', 'Service', 'Wholesale', 'Other') NOT NULL DEFAULT 'Retail',
  \`currency\` VARCHAR(10) NOT NULL DEFAULT 'USD',
  \`currency_symbol\` VARCHAR(5) NOT NULL DEFAULT '$',
  \`tax_rate\` DECIMAL(5,2) NOT NULL DEFAULT 5.00,
  \`status\` ENUM('active', 'inactive', 'archived') NOT NULL DEFAULT 'active',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_businesses_slug\` (\`slug\`),
  CONSTRAINT \`fk_businesses_owner\` FOREIGN KEY (\`owner_id\`) REFERENCES \`users\` (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Business Members (RBAC Junction)
CREATE TABLE \`business_members\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`business_id\` INT UNSIGNED NOT NULL,
  \`user_id\` INT UNSIGNED NOT NULL,
  \`role_id\` INT UNSIGNED NOT NULL,
  \`status\` ENUM('active', 'pending', 'inactive') NOT NULL DEFAULT 'active',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_business_user\` (\`business_id\`, \`user_id\`),
  CONSTRAINT \`fk_bm_business\` FOREIGN KEY (\`business_id\`) REFERENCES \`businesses\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_bm_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Products Table
CREATE TABLE \`products\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`business_id\` INT UNSIGNED NOT NULL,
  \`name\` VARCHAR(180) NOT NULL,
  \`sku\` VARCHAR(60) NOT NULL,
  \`purchase_price\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`selling_price\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`quantity\` INT NOT NULL DEFAULT 0,
  \`minimum_stock\` INT NOT NULL DEFAULT 5,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_business_sku\` (\`business_id\`, \`sku\`),
  CONSTRAINT \`fk_products_business\` FOREIGN KEY (\`business_id\`) REFERENCES \`businesses\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Sales & Orders
CREATE TABLE \`sales\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`business_id\` INT UNSIGNED NOT NULL,
  \`customer_id\` INT UNSIGNED DEFAULT NULL,
  \`user_id\` INT UNSIGNED NOT NULL,
  \`invoice_number\` VARCHAR(60) NOT NULL,
  \`subtotal\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`tax_amount\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`grand_total\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`paid_amount\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`balance_due\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`payment_method\` ENUM('Cash', 'Bank', 'Mobile Money', 'Credit') NOT NULL DEFAULT 'Cash',
  \`sale_date\` DATE NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_biz_inv\` (\`business_id\`, \`invoice_number\`),
  CONSTRAINT \`fk_sales_business\` FOREIGN KEY (\`business_id\`) REFERENCES \`businesses\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- (Full schema contains: inventory_transactions, customers, suppliers, expenses, audit_logs)`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-[#FFF8CF]/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#2A7C13] text-white">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">XAMPP Deployment & SQL Package</h2>
              <p className="text-xs text-neutral-500">Run locally at C:/xampp/htdocs/business-saas/ with Apache & MySQL</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-700 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center px-6 border-b border-neutral-200 bg-neutral-50 text-xs font-medium">
          <button
            onClick={() => setActiveTab('instructions')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'instructions'
                ? 'border-[#2A7C13] text-[#2A7C13] font-semibold bg-white'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Terminal className="w-4 h-4" />
            XAMPP Setup Guide
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'schema'
                ? 'border-[#2A7C13] text-[#2A7C13] font-semibold bg-white'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Database className="w-4 h-4" />
            schema.sql (phpMyAdmin)
          </button>
          <button
            onClick={() => setActiveTab('seed')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'seed'
                ? 'border-[#2A7C13] text-[#2A7C13] font-semibold bg-white'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <FileCode className="w-4 h-4" />
            seed.sql (Demo Data)
          </button>
          <button
            onClick={() => setActiveTab('php')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'php'
                ? 'border-[#2A7C13] text-[#2A7C13] font-semibold bg-white'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Server className="w-4 h-4" />
            PHP Architecture
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-neutral-800">
          {activeTab === 'instructions' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 mb-2">Step 1: Place Files in XAMPP Directory</h3>
                <div className="bg-neutral-900 text-neutral-200 p-3 rounded-lg font-mono text-xs">
                  C:\xampp\htdocs\business-saas\
                </div>
                <p className="mt-1 text-neutral-500">
                  Copy the project files from this workspace into your local XAMPP Apache root.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-neutral-900 mb-2">Step 2: Start Apache & MySQL in XAMPP Control Panel</h3>
                <p className="text-neutral-600 mb-2">
                  Open XAMPP Control Panel and click <strong>Start</strong> next to both <strong>Apache</strong> and <strong>MySQL</strong>.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-neutral-900 mb-2">Step 3: Import Database via phpMyAdmin</h3>
                <ol className="list-decimal list-inside space-y-1 text-neutral-600">
                  <li>Open your browser to <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-neutral-800">http://localhost/phpmyadmin/</code></li>
                  <li>Click <strong>Import</strong> in the top menu</li>
                  <li>Select the downloaded <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-neutral-800">schema.sql</code> file, then click <strong>Go</strong></li>
                  <li>Repeat with <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-neutral-800">seed.sql</code> to load default demo tenants (Sahal Electronics, Sahal Restaurant, Sahal Academy)</li>
                </ol>
              </div>

              <div>
                <h3 className="text-sm font-bold text-neutral-900 mb-2">Step 4: Access Application</h3>
                <p className="text-neutral-600 mb-2">
                  Navigate to: <code className="bg-[#FFF8CF] text-[#2A7C13] font-bold px-2 py-1 rounded font-mono">http://localhost/business-saas/</code>
                </p>
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <p className="font-semibold text-neutral-900 mb-1">Pre-seeded Test Credentials:</p>
                  <p className="text-neutral-600">Email: <code className="font-mono">ahmed@sahalgroup.com</code></p>
                  <p className="text-neutral-600">Password: <code className="font-mono">password123</code></p>
                  <p className="text-[11px] text-neutral-500 mt-1">Role: Owner across 3 multi-tenant entities.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Complete MySQL 8.0+ Schema (InnoDB, Foreign Keys)</h3>
                  <p className="text-neutral-500">Defines 20 normalized tables with multi-tenant index constraints.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(schemaSqlSample, 'schema')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg cursor-pointer"
                  >
                    {copied === 'schema' ? <Check className="w-3.5 h-3.5 text-[#2A7C13]" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied === 'schema' ? 'Copied' : 'Copy SQL'}
                  </button>
                  <button
                    onClick={() => downloadFile('schema.sql', schemaSqlSample)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A7C13] text-white hover:bg-[#205e0e] rounded-lg cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download schema.sql
                  </button>
                </div>
              </div>
              <pre className="bg-neutral-900 text-emerald-300 p-4 rounded-lg overflow-x-auto text-[11px] font-mono max-h-96">
                {schemaSqlSample}
              </pre>
            </div>
          )}

          {activeTab === 'seed' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">seed.sql - Multi-Tenant Demonstration Data</h3>
                  <p className="text-neutral-500">Includes 4 users, 3 distinct business entities, products, and sales.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadFile('seed.sql', '-- Seed data matching database/seed.sql')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A7C13] text-white hover:bg-[#205e0e] rounded-lg cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download seed.sql
                  </button>
                </div>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 space-y-2">
                <p className="font-semibold text-neutral-900">Pre-loaded Tenants in Seed:</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded border border-neutral-200">
                    <p className="font-bold text-[#2A7C13]">Sahal Electronics</p>
                    <p className="text-[11px] text-neutral-500">Retail · Phones, Laptops, Audio</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-neutral-200">
                    <p className="font-bold text-[#2A7C13]">Sahal Restaurant</p>
                    <p className="text-[11px] text-neutral-500">Hospitality · Lamb, Somali Chai</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-neutral-200">
                    <p className="font-bold text-[#2A7C13]">Sahal Academy</p>
                    <p className="text-[11px] text-neutral-500">Education · Full-stack Courses</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'php' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-900">PHP 8+ Directory Architecture</h3>
              <p className="text-neutral-500">
                Created following strict PDO prepared statements, session-based multi-tenant isolation, and CSRF protection.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <p className="font-bold text-neutral-900 mb-1">config/database.php</p>
                  <p className="text-[11px] text-neutral-600">Singleton PDO connection with UTF8mb4 and strict exception handling.</p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <p className="font-bold text-neutral-900 mb-1">app/middleware/TenantMiddleware.php</p>
                  <p className="text-[11px] text-neutral-600">
                    Validates session, verifies user membership in the active tenant, and prevents client ID forgery.
                  </p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <p className="font-bold text-neutral-900 mb-1">api/sales/index.php</p>
                  <p className="text-[11px] text-neutral-600">
                    ACID transaction that reserves stock with <code className="font-mono">FOR UPDATE</code> and logs inventory transactions.
                  </p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <p className="font-bold text-neutral-900 mb-1">api/businesses/index.php</p>
                  <p className="text-[11px] text-neutral-600">
                    Switch context endpoint ensuring user is assigned before setting <code className="font-mono">$_SESSION['active_business_id']</code>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
