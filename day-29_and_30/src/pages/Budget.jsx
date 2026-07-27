import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteBudget } from "../store/slice/budgetSlice";
import {
  getBudgetProgress,
  getBudgetSummary,
  getDailySpendingTrend,
  getCategoryInsights,
} from "../utils/budgetStats";
import { CATEGORY_BAR_COLORS } from "../utils/constants";
import BudgetForm from "../components/BudgetForm";
import ExpensePieChart from "../components/Recharts/ExpensePieChart";

import BudgetRadialChart from "../components/Recharts/BudgetRadialChart";
import { MetricCard } from "../components/MetricCard";
import {
  FiPlus,
  FiDollarSign,
  FiTrendingDown,
  FiPieChart,
  FiAlertCircle,
  FiMoreVertical,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import CumulativeSpendChart from "../components/Recharts/BudgetLineChart";
import Modal from "../components/Modal";

export default function Budgets() {
  const dispatch = useDispatch();
  const transactions = useSelector(
    (state) => state.transactionSlice.transactions,
  );
  const budgets = useSelector((state) => state.budgetSlice.budgets);
  const [showForm, setShowForm] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const budgetProgress = getBudgetProgress(transactions, budgets);
  const spendingTrend = getDailySpendingTrend(transactions);
  const summary = getBudgetSummary(budgetProgress);
  const insights = getCategoryInsights(transactions, budgetProgress);

  function getStatusStyle(b) {
    if (b.isOverBudget) return "bg-rose-100 text-rose-700";
    if (b.percentUsed >= (b.alertThreshold || 90))
      return "bg-amber-100 text-amber-700";
    return "bg-emerald-100 text-emerald-700";
  }

  function getStatusLabel(b) {
    if (b.isOverBudget) return "Over Budget";
    if (b.percentUsed >= (b.alertThreshold || 90)) return "Near Limit";
    return "On Track";
  }

  function getBarColor(b) {
    if (b.isOverBudget) return "bg-rose-500";
    if (b.percentUsed >= (b.alertThreshold || 90)) return "bg-amber-500";
    return "bg-emerald-500";
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          icon={<FiDollarSign />}
          title="Total Budget"
          value={`₹${summary.totalBudget.toLocaleString()}`}
        />
        <MetricCard
          icon={<FiTrendingDown />}
          title="Total Spent"
          value={`₹${summary.totalSpent.toLocaleString()}`}
        />
        <MetricCard
          icon={<FiPieChart />}
          title="Remaining"
          value={`₹${summary.remaining.toLocaleString()}`}
        />
        <MetricCard
          icon={<FiAlertCircle />}
          title="Over Budget"
          value={summary.overBudgetCount}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">All Budgets</h2>
            </div>
            <div className="max-h-[250px] overflow-y-auto scrollbar-none">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10 bg-slate-50 text-slate-500 uppercase tracking-wide text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Budget</th>
                    <th className="px-4 py-3 text-left">Spent</th>
                    <th className="px-4 py-3 text-left">Progress</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetProgress.map((b) => (
                    <tr
                      key={b.category}
                      className="border-t border-slate-100 hover:bg-slate-50 transition"
                    >
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {b.category}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        ₹{b.monthlyLimit.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        ₹{b.spent.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getBarColor(b)}`}
                              style={{
                                width: `${Math.min(b.percentUsed, 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-slate-500">
                            {b.percentUsed}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(b)}`}
                        >
                          {getStatusLabel(b)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center relative">
                        <button
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === b.category ? null : b.category,
                            )
                          }
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <FiMoreVertical />
                        </button>
                        {openMenuId === b.category && (
                          <div className="absolute right-4 top-10 z-10 w-32 rounded-lg border border-slate-200 bg-white shadow-lg">
                            <button
                              onClick={() => {
                                dispatch(deleteBudget(b.category));
                                setOpenMenuId(null);
                              }}
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
            {budgetProgress.length === 0 && (
              <div className="py-14 text-center">
                <h3 className="text-lg font-semibold text-slate-600">
                  No budgets yet
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Create your first budget to start tracking.
                </p>
              </div>
            )}
          </div>
          {/* <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <CumulativeSpendChart data={spendingTrend} />
          </div> */}
          <div className="h-full bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              Quick Insights
            </h2>
            {summary.overBudgetCategories.length > 0 ? (
              <div className="rounded-lg bg-rose-50 p-3 m-2 text-sm text-rose-700">
                You've overspent in {summary.overBudgetCategories.length}{" "}
                {summary.overBudgetCategories.length === 1
                  ? "category"
                  : "categories"}
                : {summary.overBudgetCategories.join(", ")}
              </div>
            ) : (
              <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
                Great job! You're within budget across all categories.
              </div>
            )}

            <div className="flex flex-col gap-2">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {insight.type === "positive" ? (
                    <FiCheckCircle className="text-emerald-500 shrink-0" />
                  ) : (
                    <FiAlertTriangle className="text-amber-500 shrink-0" />
                  )}
                  <span className="text-slate-700">{insight.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="h-hull bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800">
              Budget Overview
            </h2>
            <ExpensePieChart
              data={budgets.map((b) => ({
                name: b.category,
                value: b.monthlyLimit,
              }))}
            />
          </div>
          <div className="h-full bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800">
              Budget Vs Actual
            </h2>
            <BudgetRadialChart budgetProgress={budgetProgress} />
          </div>
        </div>
      </div>
    </div>
  );
}
