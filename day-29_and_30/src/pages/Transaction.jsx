import { useMemo, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { deleteTransaction } from "../store/slice/transactionSlice";
import { FiSearch, FiDownload } from "react-icons/fi";
import { CATEGORIES, PAYMENT_METHOD_LABELS } from "../utils/constants";
import Modal from "../components/Modal";
import { lazy, Suspense } from "react";
import { getDailySpendingTrend } from "../utils/budgetStats";
import {
  getTopExpenses,
  getPaymentMethodBreakdown,
} from "../utils/transactionStats";
import { getCategoryBreakdown } from "../utils/dashboardStats";
import { exportAsCSV, exportAsJSON } from "../utils/exportData";
import useOnClickOutside from "../hooks/useOnClickOutside";
import TransactionRow from "../components/TransactionRow";

export default function Transaction() {
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  useOnClickOutside(menuRef, () => setOpenMenuId(null));
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
  const view = searchParams.get("view") || "table";

  const TransactionChartView = lazy(
    () => import("../components/TransactionChartView"),
  );

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

  const filtered = useMemo(
    () =>
      transactions.filter((t) => {
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
      }),
    [transactions, search, type, category, month, paymentMethod],
  );

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const topExpenses = useMemo(
    () => getTopExpenses(transactions),
    [transactions],
  );
  const paymentBreakdown = useMemo(() => {
    return getPaymentMethodBreakdown(filtered);
  }, [filtered]);
  const dailySpending = useMemo(
    () => getDailySpendingTrend(filtered),
    [filtered],
  );
  const categoryData = useMemo(
    () => getCategoryBreakdown(filtered),
    [filtered],
  );

  const handleToggleMenu = useCallback((id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  }, []);

  const handleDelete = useCallback(
    (id) => {
      dispatch(deleteTransaction(id));
      setOpenMenuId(null);
    },
    [dispatch],
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col gap-4">
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => updateParam("view", "table")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            view === "table"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Table View
        </button>
        <button
          onClick={() => updateParam("view", "charts")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            view === "charts"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Chart View
        </button>
      </div>

      {view === "table" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
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
            <div className="flex flex-wrap items-center gap-3">
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
                    <TransactionRow
                      key={t.id}
                      t={t}
                      isMenuOpen={openMenuId === t.id}
                      onToggleMenu={handleToggleMenu}
                      onDelete={() => handleDelete(t.id)}
                      menuRef={openMenuId === t.id ? menuRef : null}
                    />
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
        </div>
      )}

      {view === "charts" && (
        <Suspense
          fallback={
            <p className="text-center py-12 text-slate-500">
              Loading charts...
            </p>
          }
        >
          <TransactionChartView
            paymentBreakdown={paymentBreakdown}
            dailySpending={dailySpending}
            categoryData={categoryData}
            topExpenses={topExpenses}
          />
        </Suspense>
      )}
    </div>
  );
}
