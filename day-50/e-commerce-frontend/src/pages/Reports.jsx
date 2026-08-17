import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReports } from "../store/slice/reportSlice";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const STATUS_COLORS = {
  pending: "#f59e0b",
  shipped: "#6366f1",
  delivered: "#10b981",
  cancelled: "#f43f5e",
};

export default function Reports() {
  const {
    orderStatus,
    lowStock,
    revenueOverTime,
    bestSellers,
    revenueByCategory,
    loading,
    error,
  } = useSelector((state) => state.reportSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  if (loading)
    return (
      <p className="text-center py-24 text-slate-500">Loading reports...</p>
    );
  if (error)
    return <p className="text-center py-24 text-rose-600">Error: {error}</p>;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-slate-900">Reports Dashboard</h1>

      {/* Revenue Over Time */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Revenue Over Time
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={revenueOverTime}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#ab3aed"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Order Status Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Order Status Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={orderStatus}
                dataKey="count"
                nameKey="_id"
                innerRadius={50}
                outerRadius={80}
              >
                {orderStatus.map((entry) => (
                  <Cell
                    key={entry._id}
                    fill={STATUS_COLORS[entry._id] || "#94a3b8"}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Category */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Revenue by Category
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueByCategory}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip
                formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="#a53aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Best Selling Products */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Best-Selling Products
        </h2>
        <div className="flex flex-col gap-2">
          {bestSellers.map((p) => (
            <div
              key={p._id}
              className="flex justify-between text-sm border-b border-slate-100 pb-2"
            >
              <span className="text-slate-700">{p._id}</span>
              <span className="text-slate-500">
                {p.totalSold} sold · ₹{p.revenue.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alert */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Low Stock Alert
        </h2>
        {lowStock.length === 0 ? (
          <p className="text-sm text-slate-400">
            All products are well-stocked.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {lowStock.map((p) => (
              <div
                key={p._id}
                className="flex justify-between text-sm border-b border-slate-100 pb-2"
              >
                <span className="text-slate-700">{p.name}</span>
                <span className="text-rose-600 font-medium">
                  {p.stock} left
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
