import { memo } from "react";
import {
  FiDollarSign,
  FiMoreVertical,
  FiPhone,
  FiCreditCard,
} from "react-icons/fi";
import {
  CATEGORY_PILL_COLORS,
  PAYMENT_METHOD_LABELS,
} from "../utils/constants";

const PAYMENT_METHOD_ICONS = {
  upi: <FiPhone />,
  creditCard: <FiCreditCard />,
  cash: <FiDollarSign />,
};
function TransactionRow({ t, isMenuOpen, onToggleMenu, onDelete, menuRef }) {
  return (
    <tr className="border-t border-slate-100 hover:bg-emerald-50 transition">
      <td className="px-4 py-3 text-slate-500">
        {new Date(t.date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </td>
      <td className="px-4 py-3">
        <div className="font-medium text-slate-800">{t.paidTo || "—"}</div>
        {t.note && <div className="text-xs text-slate-400">{t.note}</div>}
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
        {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1.5 text-slate-600 text-sm">
          <span>
            {PAYMENT_METHOD_ICONS[t.paymentMethod] || <FiDollarSign />}
          </span>
          {PAYMENT_METHOD_LABELS[t.paymentMethod] || t.paymentMethod}
        </span>
      </td>
      <td className="px-4 py-3 text-center relative">
        <button
          onClick={() => onToggleMenu(t.id)}
          className="text-slate-400 hover:text-slate-600"
        >
          <FiMoreVertical />
        </button>
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-4 top-10 z-10 w-32 rounded-lg border border-slate-200 bg-white shadow-lg"
          >
            <button
              onClick={onDelete}
              className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 rounded-lg"
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

export default memo(TransactionRow);
