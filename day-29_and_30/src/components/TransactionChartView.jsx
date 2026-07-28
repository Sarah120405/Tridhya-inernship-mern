import ExpensePieChart from "./Recharts/ExpensePieChart";
import CumulativeSpendChart from "./Recharts/BudgetLineChart";
import CategoryBarChart from "./Recharts/CategoryBarChart";
import { CATEGORY_ICONS } from "../utils/constants";
export default function TransactionChartView({
  paymentBreakdown,
  dailySpending,
  categoryData,
  topExpenses,
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Payment Method Breakdown
          </h2>
          <ExpensePieChart data={paymentBreakdown} />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Cumulative Spend
          </h2>
          <div className="flex items-center justify-center">
            <CumulativeSpendChart data={dailySpending} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Spending by Category
          </h2>
          <CategoryBarChart data={categoryData} />
        </div>
        <div className="flex flex-col gap-3 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Top Expenses
          </h2>

          {topExpenses.map((t) => (
            <div key={t.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                  {CATEGORY_ICONS[t.category] || CATEGORY_ICONS.Other}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-slate-800">
                    {t.paidTo}
                  </p>
                  <p className="text-xs text-slate-400">
                    {t.category} ·{" "}
                    {new Date(t.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </p>
                </div>
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
