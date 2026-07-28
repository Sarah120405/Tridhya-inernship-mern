import { useState } from "react";
import { useDispatch } from "react-redux";
import { setBudget } from "../store/slice/budgetSlice";
import { CATEGORIES } from "../utils/constants";

export default function BudgetForm() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    category: "",
    amount: 0,
    alertThreshold: 0,
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
    if (!formData.category) {
      newErrors.category = "Select a category";
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = "Enter an amount greater than 0";
    }
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    dispatch(
      setBudget({
        category: formData.category,
        monthlyLimit: Number(formData.amount),
        alertThreshold: Number(formData.alertThreshold) || 90,
      }),
    );

    setFormData({
      category: "",
      amount: 0,
      alertThreshold: 0,
    });
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4"
      >
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
          <label className="text-sm font-medium text-slate-600">
            Alert Threshold (Optional)
          </label>
          <input
            type="number"
            name="alertThreshold"
            value={formData.alertThreshold}
            onChange={handleChange}
            placeholder="0"
            className="rounded-lg border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition"
          />
        </div>
        <button
          type="submit"
          className="mt-1 rounded-xl bg-emerald-600 text-white font-semibold py-3 hover:bg-emerald-700 transition"
        >
          Create Budget
        </button>
      </form>
    </>
  );
}
