import { useSelector } from "react-redux";
import {
  getCategoryBreakdown,
  getMonthlyComparison,
  getMonthOverMonthTrend,
  getRecentTransactions,
  getSummaryStats,
  getTopCategories,
} from "../utils/dashboardStats";
import { MetricCard } from "../components/MetricCard";
import ExpensePieChart from "../components/Recharts/ExpensePieChart";
import IncomeExpenseBarChart from "../components/Recharts/IncomeExpenseBarChart";
import {
  FiCreditCard,
  FiArrowDownCircle,
  FiArrowUpCircle,
  FiList,
  FiDollarSign,
  FiPieChart,
  FiTrendingUp,
  FiActivity,
  FiShoppingCart,
} from "react-icons/fi";
import { CATEGORY_BAR_COLORS } from "../utils/constants";

export default function Dashboard() {
  const transactions = useSelector(
    (state) => state.transactionSlice.transactions,
  );
  const summaryStats = getSummaryStats(transactions);
  const categoryBreakdown = getCategoryBreakdown(transactions);
  const monthlyComparison = getMonthlyComparison(transactions);
  const trends = getMonthOverMonthTrend(transactions);
  const recentTransactions = getRecentTransactions(transactions, 5);
  const categories = getTopCategories(transactions);

  return (
    <div className="flex flex-col justify-center gap-4">
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          icon={<FiDollarSign />}
          icon_2={<FiPieChart />}
          title="Total Balance"
          value={`₹${summaryStats.netBalance.toLocaleString()}`}
          trend={`${Math.abs(trends.balance).toFixed(1)}% from last month`}
          trendDirection={trends.balance >= 0 ? "up" : "down"}
        />
        <MetricCard
          icon={<FiArrowDownCircle />}
          title="Total Income"
          value={`₹${summaryStats.totalIncome.toLocaleString()}`}
          trend={`${Math.abs(trends.income).toFixed(1)}% from last month`}
          trendDirection={trends.income >= 0 ? "up" : "down"}
          icon_2={<FiTrendingUp />}
        />
        <MetricCard
          icon={<FiArrowUpCircle />}
          title="Total Expenses"
          value={`₹${summaryStats.totalExpenses.toLocaleString()}`}
          trend={`${Math.abs(trends.expenses).toFixed(1)}% from last month`}
          trendDirection={trends.expenses <= 0 ? "up" : "down"}
          icon_2={<FiShoppingCart />}
        />
        <MetricCard
          icon={<FiList />}
          title="Transaction count"
          value={summaryStats.transactionCount}
          trend={`${Math.abs(trends.transactionCount).toFixed(1)}% from last month`}
          trendDirection={trends.transactionCount >= 0 ? "up" : "down"}
          icon_2={<FiCreditCard />}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Expense Breakdown
          </h2>
          <ExpensePieChart data={categoryBreakdown} />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Income vs Expenses
          </h2>
          <IncomeExpenseBarChart data={monthlyComparison} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Recent Transactions
          </h2>
          <div className="flex flex-col gap-3">
            {recentTransactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold">
                    {t.paidTo?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {t.paidTo}
                    </p>
                    <p className="text-xs text-slate-400">
                      {t.category} ·{" "}
                      {new Date(t.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${t.type === "income" ? "text-emerald-600" : "text-rose-600"}`}
                >
                  {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Top Categories
          </h2>

          <div className="flex flex-col gap-4">
            {categories.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{c.name}</span>
                  <span className="text-slate-500">
                    ₹{c.value.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${CATEGORY_BAR_COLORS[c.name] || "bg-slate-400"}`}
                    style={{ width: `${c.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
