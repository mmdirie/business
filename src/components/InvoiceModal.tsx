import React from 'react';
import { Sale, Business } from '../types';
import { Printer, X, CheckCircle2 } from 'lucide-react';

interface InvoiceModalProps {
  sale: Sale | null;
  business: Business;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ sale, business, onClose }) => {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-neutral-200">
        {/* Modal Action Bar (hidden on print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-[#FFF8CF]/60">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#2A7C13]">Official Business Receipt</span>
            <span className="text-xs text-neutral-500">·</span>
            <span className="text-xs font-mono text-neutral-600">{sale.invoice_number}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#2A7C13] hover:bg-[#205e0e] rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document */}
        <div className="p-8 text-neutral-900" id="printable-receipt">
          {/* Header */}
          <div className="flex items-start justify-between pb-6 border-b border-neutral-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-[#2A7C13] flex items-center justify-center text-white font-bold text-base">
                  {business.name.charAt(0)}
                </div>
                <h1 className="text-xl font-bold tracking-tight text-neutral-900">{business.name}</h1>
              </div>
              <p className="text-xs text-neutral-600 max-w-xs">{business.address || 'Commercial District, HQ'}</p>
              <p className="text-xs text-neutral-500 mt-1">
                Phone: {business.phone || 'N/A'} · Email: {business.email || 'N/A'}
              </p>
              {business.tax_number && (
                <p className="text-xs text-neutral-500">Tax Reg: {business.tax_number}</p>
              )}
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-[#FFF8CF] text-[#2A7C13] rounded border border-[#76C457]/30">
                TAX INVOICE
              </span>
              <p className="text-base font-mono font-bold mt-2 text-neutral-900">{sale.invoice_number}</p>
              <p className="text-xs text-neutral-500 mt-0.5">Date: {sale.sale_date}</p>
              <p className="text-xs text-neutral-500">Cashier: {sale.cashier_name}</p>
            </div>
          </div>

          {/* Customer & Payment Info */}
          <div className="grid grid-cols-2 gap-4 py-4 border-b border-neutral-200 text-xs">
            <div>
              <span className="font-semibold text-neutral-500 uppercase tracking-wider block text-[10px] mb-1">Billed To</span>
              <p className="text-sm font-semibold text-neutral-900">{sale.customer_name || 'Walk-in Retail Customer'}</p>
              <p className="text-neutral-500">Payment Channel: {sale.payment_method}</p>
            </div>
            <div className="text-right">
              <span className="font-semibold text-neutral-500 uppercase tracking-wider block text-[10px] mb-1">Settlement Status</span>
              <div className="inline-flex items-center gap-1 font-semibold text-[#2A7C13]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {sale.balance_due === 0 ? 'Fully Paid' : `Balance Due: ${business.currency_symbol}${sale.balance_due.toFixed(2)}`}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500">
                  <th className="pb-2 font-semibold">Item & SKU</th>
                  <th className="pb-2 text-center font-semibold">Qty</th>
                  <th className="pb-2 text-right font-semibold">Unit Price</th>
                  <th className="pb-2 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {sale.items.map((item, idx) => (
                  <tr key={idx} className="py-2">
                    <td className="py-2.5">
                      <p className="font-medium text-neutral-900">{item.product_name}</p>
                      <span className="text-[10px] text-neutral-400 font-mono">{item.sku}</span>
                    </td>
                    <td className="py-2.5 text-center font-medium text-neutral-700">{item.quantity}</td>
                    <td className="py-2.5 text-right text-neutral-700 font-mono">
                      {business.currency_symbol}{item.unit_price.toFixed(2)}
                    </td>
                    <td className="py-2.5 text-right font-semibold text-neutral-900 font-mono">
                      {business.currency_symbol}{item.subtotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="pt-4 border-t border-neutral-200 flex justify-end">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span className="font-mono">{business.currency_symbol}{sale.subtotal.toFixed(2)}</span>
              </div>
              {sale.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span className="font-mono">-{business.currency_symbol}{sale.discount_amount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Tax ({business.tax_rate}%):</span>
                <span className="font-mono">{business.currency_symbol}{sale.tax_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-200 text-sm font-bold text-neutral-900">
                <span>Grand Total:</span>
                <span className="font-mono text-[#2A7C13]">{business.currency_symbol}{sale.grand_total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-600 pt-1">
                <span>Amount Paid:</span>
                <span className="font-mono">{business.currency_symbol}{sale.paid_amount.toFixed(2)}</span>
              </div>
              {sale.balance_due > 0 && (
                <div className="flex justify-between text-red-600 font-semibold">
                  <span>Balance Due:</span>
                  <span className="font-mono">{business.currency_symbol}{sale.balance_due.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer & Notes */}
          <div className="mt-8 pt-4 border-t border-neutral-200 text-center text-[11px] text-neutral-500">
            <p className="font-medium text-neutral-700">Thank you for your business with {business.name}!</p>
            <p className="text-[10px] text-neutral-400 mt-1">Generated by OmniBiz Multi-Tenant Cloud Architecture</p>
          </div>
        </div>
      </div>
    </div>
  );
};
