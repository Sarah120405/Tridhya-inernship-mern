import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { deleteTransaction } from "../store/slice/transactionSlice";
import TransactionForm from "../components/TransactionForm";
import {
  FiSearch,
  FiPlus,
  FiMoreVertical,
  FiPhone,
  FiCreditCard,
  FiDollarSign,
  FiDownload,
} from "react-icons/fi";
import {
  CATEGORIES,
  CATEGORY_PILL_COLORS,
  PAYMENT_METHOD_LABELS,
} from "../utils/constants";
import Modal from "../components/Modal";
import CumulativeSpendChart from "../components/Recharts/BudgetLineChart";
import ExpensePieChart from "../components/Recharts/ExpensePieChart";

import { getDailySpendingTrend } from "../utils/budgetStats";
import {
  getTopExpenses,
  getPaymentMethodBreakdown,
} from "../utils/transactionStats";
import { exportAsCSV, exportAsJSON } from "../utils/exportData";

const PAYMENT_METHOD_ICONS = {
  upi: <FiPhone />,
  creditCard: <FiCreditCard />,
  cash: <FiDollarSign />,
};

export default function Transaction() {
  const dispatch = useDispatch();
  const transactions = useSelector(
    (state) => state.transactionSlice.transactions,
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "";
  const category = searchParams.get("category") || "";
  const month = searchParams.get("month") || "";
  const paymentMethod = searchParams.get("paymentMethod") || "";

  const availableMonths = [
    ...new Set(
      transactions.map((t) => {
        const d = new Date(t.date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      }),
    ),
  ]
    .sort()
    .reverse();

  function formatMonthLabel(monthKey) {
    const [year, month] = monthKey.split("-");
    return new Date(year, month - 1).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  }

  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  }

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.paidTo?.toLowerCase().includes(search.toLowerCase()) ||
      t.note?.toLowerCase().includes(search.toLowerCase());
    const matchesType = type ? t.type === type : true;
    const matchesCategory = category ? t.category === category : true;
    const mathchesMonth = month
      ? `${new Date(t.date).getFullYear()}-${String(new Date(t.date).getMonth() + 1).padStart(2, "0")}` ===
        month
      : true;
    const matchesPaymentMethod = paymentMethod
      ? t.paymentMethod === paymentMethod
      : true;
    return (
      matchesSearch &&
      matchesType &&
      matchesCategory &&
      mathchesMonth &&
      matchesPaymentMethod
    );
  });

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const topExpenses = getTopExpenses(transactions);

  function handleDelete(id) {
    dispatch(deleteTransaction(id));
    setOpenMenuId(null);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => updateParam("search", e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm shadow-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <select
            value={type}
            onChange={(e) => updateParam("type", e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-emerald-400"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={category}
            onChange={(e) => updateParam("category", e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-emerald-400"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => updateParam("month", e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-emerald-400"
          >
            <option value="">All Months</option>
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {formatMonthLabel(m)}
              </option>
            ))}
          </select>

          <select
            value={paymentMethod}
            onChange={(e) => updateParam("paymentMethod", e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-emerald-400"
          >
            <option value="">All Payment Methods</option>
            {Object.entries(PAYMENT_METHOD_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <button
            onClick={() => exportAsCSV(filtered)}
            className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-emerald-400"
          >
            <FiDownload /> CSV
          </button>
          <button
            onClick={() => exportAsJSON(filtered)}
            className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-emerald-400"
          >
            <FiDownload /> JSON
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className=" max-h-[450px] overflow-y-auto scrollbar-none">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-emerald-50 text-slate-500 uppercase tracking-wide text-xs z-10">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Payment method</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="max-h-[500px] overflow-y-auto">
                {sorted.map((t) => (
                  <tr
                    key={t.id}
                    className="border-t border-slate-100 hover:bg-emerald-50 transition"
                  >
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(t.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">
                        {t.paidTo || "—"}
                      </div>
                      {t.note && (
                        <div className="text-xs text-slate-400">{t.note}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${CATEGORY_PILL_COLORS[t.category] || CATEGORY_PILL_COLORS.Other}`}
                      >
                        {t.category}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3 font-medium capitalize ${t.type === "income" ? "text-emerald-600" : "text-rose-600"}`}
                    >
                      {t.type}
                    </td>
                    <td
                      className={`px-4 py-3 text-left font-semibold ${t.type === "income" ? "text-emerald-600" : "text-rose-600"}`}
                    >
                      {t.type === "income" ? "+" : "-"}₹
                      {t.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-slate-600 text-sm">
                        <span>
                          {PAYMENT_METHOD_ICONS[t.paymentMethod] || (
                            <FiDollarSign />
                          )}
                        </span>
                        {PAYMENT_METHOD_LABELS[t.paymentMethod] ||
                          t.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === t.id ? null : t.id)
                        }
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <FiMoreVertical />
                      </button>
                      {openMenuId === t.id && (
                        <div className="absolute right-4 top-10 z-10 w-32 rounded-lg border border-slate-200 bg-white shadow-lg">
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 rounded-lg"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {sorted.length === 0 && (
            <div className="py-14 text-center">
              <h3 className="text-lg font-semibold text-slate-600">
                No transactions found
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Payment Method Breakdown
          </h2>
          <ExpensePieChart data={getPaymentMethodBreakdown(filtered)} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Cumulative Spend
          </h2>
          <CumulativeSpendChart data={getDailySpendingTrend(filtered)} />
        </div>
        <div className="flex flex-col gap-3 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Top Expenses
          </h2>

          {topExpenses.map((t) => (
            <div key={t.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">{t.paidTo}</p>
                <p className="text-xs text-slate-400">
                  {t.category} ·{" "}
                  {new Date(t.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                  })}
                </p>
              </div>
              <span className="text-sm font-semibold text-rose-600">
                -₹{t.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
