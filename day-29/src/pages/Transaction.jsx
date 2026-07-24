import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { deleteTransaction } from "../store/slice/transactionSlice";
import TransactionForm from "../components/TransactionForm";
import { FiSearch, FiPlus, FiMoreVertical, FiPhone, FiCreditCard, FiDollarSign } from "react-icons/fi";

const CATEGORIES = ["Food", "Transport", "Rent", "Utilities", "Entertainment", "Salary", "Shopping", "Health", "Other"];

const CATEGORY_COLORS = {
  Food: "bg-orange-100 text-orange-700",
  Transport: "bg-emerald-100 text-emerald-700",
  Rent: "bg-blue-100 text-blue-700",
  Utilities: "bg-sky-100 text-sky-700",
  Entertainment: "bg-pink-100 text-pink-700",
  Salary: "bg-emerald-100 text-emerald-700",
  Shopping: "bg-purple-100 text-purple-700",
  Health: "bg-rose-100 text-rose-700",
  Other: "bg-slate-100 text-slate-700",
};

const PAYMENT_METHOD_LABELS = {
  upi: "UPI",
  creditCard: "Credit Card",
  cash: "Cash",
};

const PAYMENT_METHOD_ICONS = {
  upi: <FiPhone/>,
  creditCard: <FiCreditCard />,
  cash: <FiDollarSign />,
};

export default function Transaction() {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactionSlice.transactions);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "";
  const category = searchParams.get("category") || "";

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
    return matchesSearch && matchesType && matchesCategory;
  });

  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

  function handleDelete(id) {
    dispatch(deleteTransaction(id));
    setOpenMenuId(null);
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Transactions</h1>
          <p className="text-slate-500">View and manage all your income and expenses.</p>
        </div>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-white font-medium shadow-sm transition hover:bg-emerald-700"
        >
          <FiPlus /> Add Transaction
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <TransactionForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      {/* Your metric cards go here */}

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
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wide text-xs">
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
          <tbody>
            {sorted.map((t) => (
              <tr key={t.id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                <td className="px-4 py-3 text-slate-500">
                  {new Date(t.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-800">{t.paidTo || "—"}</div>
                  {t.note && <div className="text-xs text-slate-400">{t.note}</div>}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${CATEGORY_COLORS[t.category] || CATEGORY_COLORS.Other}`}>
                    {t.category}
                  </span>
                </td>
                <td className={`px-4 py-3 font-medium capitalize ${t.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                  {t.type}
                </td>
                <td className={`px-4 py-3 text-left font-semibold ${t.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                  {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-slate-600 text-sm">
                    <span>{PAYMENT_METHOD_ICONS[t.paymentMethod] || <FiDollarSign />}</span>
                    {PAYMENT_METHOD_LABELS[t.paymentMethod] || t.paymentMethod}
                  </span>
                </td>
                <td className="px-4 py-3 text-center relative">
                  <button onClick={() => setOpenMenuId(openMenuId === t.id ? null : t.id)} className="text-slate-400 hover:text-slate-600">
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

        {sorted.length === 0 && (
          <div className="py-14 text-center">
            <h3 className="text-lg font-semibold text-slate-600">No transactions found</h3>
            <p className="mt-2 text-sm text-slate-400">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}