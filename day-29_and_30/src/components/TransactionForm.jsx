import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTransaction } from "../store/slice/transactionSlice";
import { CATEGORIES } from "../utils/constants";

export default function TransactionForm() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    paymentMethod: "",
    category: "",
    date: new Date().toISOString().slice(0, 10),
    paidTo: "",
    note: "",
  });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  }

  function validate() {
    const newErrors = {};
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = "Enter an amount greater than 0";
    }
    if (!formData.category) {
      newErrors.category = "Select a category";
    }
    if (!formData.date) {
      newErrors.date = "Select a date";
    }
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    dispatch(
      addTransaction({
        ...formData,
        amount: Number(formData.amount),
        date: new Date(formData.date).toISOString(),
      }),
    );

    setFormData({
      type: "expense",
      amount: "",
      category: "",
      date: new Date().toISOString().slice(0, 10),
      paidTo: "",
      note: "",
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4"
    >
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setFormData((prev) => ({ ...prev, type: "expense" }))}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
            formData.type === "expense"
              ? "bg-rose-100 text-rose-700"
              : "bg-slate-50 text-slate-500 hover:bg-slate-100"
          }`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setFormData((prev) => ({ ...prev, type: "income" }))}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
            formData.type === "income"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-50 text-slate-500 hover:bg-slate-100"
          }`}
        >
          Income
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-600">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0"
            className="rounded-lg border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition"
          />
          {errors.amount && (
            <span className="text-xs text-rose-500">{errors.amount}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-600">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="rounded-lg border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition bg-white"
          >
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="text-xs text-rose-500">{errors.category}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-600">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="rounded-lg border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition"
          />
          {errors.date && (
            <span className="text-xs text-rose-500">{errors.date}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-600">
            Paid to / from
          </label>
          <input
            type="text"
            name="paidTo"
            value={formData.paidTo}
            onChange={handleChange}
            placeholder="e.g. Amazon, Employer"
            className="rounded-lg border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-600">
            Note (optional)
          </label>
          <input
            type="text"
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Add a note..."
            className="rounded-lg border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-600">
            Payment method
          </label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="rounded-lg border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition bg-white"
          >
            <option value="">Select payment method</option>

            <option value="upi">UPI</option>

            <option value="creditCard">Credit card</option>

            <option value="cash">Cash</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="mt-1 rounded-xl bg-emerald-600 text-white font-semibold py-3 hover:bg-emerald-700 transition"
      >
        Add Transaction
      </button>
    </form>
  );
}
