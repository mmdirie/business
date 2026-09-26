import React, { useState } from 'react';
import { Expense, ExpenseCategory, Business } from '../types';
import { Receipt, Plus, Search, Calendar, CreditCard } from 'lucide-react';

interface ExpensesViewProps {
  business: Business;
  expenses: Expense[];
  categories: ExpenseCategory[];
  onOpenNewExpense: () => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  business,
  expenses,
  categories,
  onOpenNewExpense
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const filtered = expenses.filter(e => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCat = selectedCat === 'all' || (e.category_id && e.category_id === Number(selectedCat));

    return matchesSearch && matchesCat;
  });

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#2A7C13]" />
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">Expenses & Overheads</h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Operating costs, utilities, and disbursements for {business.name}
          </p>
        </div>

        <button
          onClick={onOpenNewExpense}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2A7C13] hover:bg-[#205e0e] rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Record Expense
        </button>
      </div>

      {/* KPI Cards */}
      <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-2xs max-w-sm">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Operational Outflow</span>
        <p className="text-2xl font-bold font-mono text-neutral-900 mt-1">
          {business.currency_symbol}{totalExpense.toFixed(2)}
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search expense description or notes..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
          />
        </div>

        <select
          value={selectedCat}
          onChange={e => setSelectedCat(e.target.value)}
          className="px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
        >
          <option value="all">All Expense Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-600 font-semibold">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Title & Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Payment Channel</th>
                <th className="py-3 px-4">Logged By</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400">
                    No expense records found for {business.name}.
                  </td>
                </tr>
              ) : (
                filtered.map(exp => (
                  <tr key={exp.id} className="hover:bg-neutral-50/60">
                    <td className="py-3 px-4 font-mono text-neutral-600 whitespace-nowrap">
                      {exp.expense_date}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-neutral-900">{exp.title}</p>
                      {exp.description && (
                        <p className="text-[11px] text-neutral-500 mt-0.5">{exp.description}</p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-neutral-100 font-medium text-neutral-700 text-[11px]">
                        {exp.category_name || 'General'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-600">
                      {exp.payment_method}
                    </td>
                    <td className="py-3 px-4 text-neutral-500">
                      {exp.user_name}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-neutral-900">
                      {business.currency_symbol}{exp.amount.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
