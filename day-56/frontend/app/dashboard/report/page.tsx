"use client";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { FiCheckCircle, FiClock, FiFolder, FiLifeBuoy } from "react-icons/fi";
import { MetricCard } from "../../components/MetricCard";
import {
  Bar,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  BarChart,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useEffect } from "react";
import {
  fetchSLAPerformance,
  fetchTeamPerformance,
  fetchTicketDistribution,
  fetchTicketStatistics,
  fetchTicketTrends,
} from "../../store/slice/reportSlice";
import { formatHours } from "../../utils/date";
import { fetchCurrentUser } from "../../store/slice/authSlice";

export default function AdminReport() {
  const user = useSelector((state: RootState) => state.auth.user);
  const {
    ticketStatistics,
    ticketDistribution,
    ticketTrends,
    teamPerformance,
    slaPerformance,
    isLoadingStatistics,
    isLoadingDistribution,
    isLoadingTrends,
    isLoadingSLA,
    isLoadingTeamPerformance,
    error,
  } = useSelector((state: RootState) => state.report);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchTicketStatistics());
    dispatch(fetchTicketDistribution());
    dispatch(fetchTicketTrends());
    dispatch(fetchSLAPerformance());
    dispatch(fetchTeamPerformance());
  }, [dispatch]);

  console.log(user);

  const metricCards = [
    {
      title: "Total Tickets",
      value: ticketStatistics?.totalTickets ?? 0,
      description: "All tickets you've submitted",
      icon: <FiFolder />,
      icon_2: <FiFolder />,
    },
    {
      title: "Open Tickets",
      value: ticketStatistics?.openTickets ?? 0,
      description: "Tickets currently in progress",
      icon: <FiLifeBuoy />,
      icon_2: <FiLifeBuoy />,
    },
    {
      title: "Tickets In Progress",
      value: ticketStatistics?.inProgress ?? 0,
      description: "Tickets that need your response",
      icon: <FiClock />,
      icon_2: <FiClock />,
    },
    {
      title: "Escalated Tickets",
      value: ticketStatistics?.escalated ?? 0,
      description: "Tickets escalated to technical team",
      icon: <FiClock />,
      icon_2: <FiClock />,
    },
    {
      title: "Resolved Tickets",
      value: ticketStatistics?.resolved ?? 0,
      description: "Tickets marked as resolved",
      icon: <FiCheckCircle />,
      icon_2: <FiCheckCircle />,
    },
    {
      title: "Closed Ticket",
      value: ticketStatistics?.closed ?? 0,
      description: "Tickets that need your response",
      icon: <FiClock />,
      icon_2: <FiClock />,
    },
    {
      title: "SLA Breacher",
      value: slaPerformance?.totalBreaches ?? 0,
      description: "Tickets with breached sla",
      icon: <FiClock />,
      icon_2: <FiClock />,
    },
  ];

  const normalizeDate = (dateStr: string) =>
    new Date(dateStr).toISOString().split("T")[0];

  const trendMap = new Map();

  ticketTrends?.createdAtTrend?.forEach((item) => {
    const key = normalizeDate(item.date);
    trendMap.set(key, {
      date: key,
      created: item.tickets,
      resolved: 0,
      closed: 0,
    });
  });

  ticketTrends?.resolvedAtTrend?.forEach((item) => {
    const key = normalizeDate(item.date);
    if (!trendMap.has(key)) {
      trendMap.set(key, { date: key, created: 0, resolved: 0, closed: 0 });
    }
    trendMap.get(key).resolved = item.tickets;
  });

  ticketTrends?.closedAtTrend?.forEach((item) => {
    const key = normalizeDate(item.date);
    if (!trendMap.has(key)) {
      trendMap.set(key, { date: key, created: 0, resolved: 0, closed: 0 });
    }
    trendMap.get(key).closed = item.tickets;
  });

  const trendData = Array.from(trendMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const categoryData =
    ticketDistribution?.ticketByCategory?.map((item) => ({
      name: item.category,
      tickets: item._count.id,
    })) ?? [];

  const priorityData =
    ticketDistribution?.ticketByPriority?.map((item) => ({
      name: item.priority,
      tickets: item._count.id,
    })) ?? [];

  const statusData =
    ticketDistribution?.ticketByStatus?.map((item) => ({
      name: item.status,
      tickets: item._count.id,
    })) ?? [];

  const slaChartData = [
    {
      name: "Breached",
      value: slaPerformance?.totalBreaches ?? 0,
    },
    {
      name: "Within SLA",
      value: Math.max(
        0,
        (slaPerformance?.totalSLAs ?? 0) - (slaPerformance?.totalBreaches ?? 0),
      ),
    },
  ];

  const SLA_COLORS = ["#ef4444", "#22c55e"];

  const teamData =
    teamPerformance?.map((member) => ({
      userId: member.userId,
      name: member.name,
      role: member.role,
      email: member.email,
      assigned: member.totalAssigned,
      resolved: member.resolvedTickets.length,
      closed: member.closedTickets.length,
      active: member.activeTickets.length,
      slaBreaches: member.slaBreaches,
      avgResolution: Number(member.averageResolutionHours.toFixed(1)),
    })) ?? [];

  const resolutionRate = (totalAssigned: number, completedCount: number) => {
    return totalAssigned > 0
      ? Math.round((completedCount / totalAssigned) * 100)
      : 0;
  };

  const slaComplianceRate = (totalAssigned: number, slaBreaches: number) => {
    return totalAssigned > 0
      ? Math.round(((totalAssigned - slaBreaches) / totalAssigned) * 100)
      : 100;
  };

  return (
    <main className="min-h-screen bg-[#EOFFFF] p-2">
      <div className="mx-auto max-w-8xl space-y-6">
        {/* Header */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Welcome back, {user.name}!
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Here's an overview of your support tickets.
            </p>
          </div>
        </section>
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
            {error}
          </div>
        )}

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {isLoadingStatistics
            ? [...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-2xl bg-slate-100"
                />
              ))
            : metricCards.map((card) => (
                <MetricCard
                  key={card.title}
                  title={card.title}
                  value={card.value}
                  description={card.description}
                  icon={card.icon}
                  icon_2={card.icon_2}
                />
              ))}
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-between items-center">
          <section className="h-full rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
            {/* Chart of Tickets Trends */}
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-800">
                Ticket Trends
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Ticket creation, resolution and closure over time.
              </p>
            </div>
            {isLoadingTrends ? (
              <div className="flex h-[350px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
              </div>
            ) : trendData.length === 0 ? (
              <div className="flex h-[350px] items-center justify-center text-sm text-slate-500">
                No trend data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={trendData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: -40,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid strokeDasharray={`3 3`} stroke="#E8E1F5" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value: string | number) =>
                      new Date(String(value)).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })
                    }
                  />

                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />

                  <Tooltip
                    labelFormatter={(value: string | number) =>
                      new Date(String(value)).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    }
                  />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="created"
                    name="Created"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="resolved"
                    name="Resolved"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="closed"
                    name="Closed"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </section>
          <section className="h-full rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
            {/* SLA Performance */}
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-800">
                SLA Performance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Overview of SLA compliance and breaches.
              </p>
            </div>

            {isLoadingSLA ? (
              <div className="flex h-[300px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
              </div>
            ) : (
              <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-2">
                <div className="relative h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={slaChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={75}
                        outerRadius={105}
                        paddingAngle={3}
                      >
                        {slaChartData.map((entry, index) => (
                          <Cell key={entry.name} fill={SLA_COLORS[index]} />
                        ))}
                      </Pie>

                      <Tooltip />

                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-slate-800">
                        {slaPerformance?.breachPercentage ?? 0}%
                      </p>

                      <p className="text-xs text-slate-500">Breach Rate</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl bg-slate-50 p-2">
                    <p className="text-sm text-slate-500">Total SLAs</p>

                    <p className="mt-1 text-2xl font-bold text-slate-800">
                      {slaPerformance?.totalSLAs ?? 0}
                    </p>
                  </div>

                  <div className="rounded-xl bg-red-50 p-2">
                    <p className="text-sm text-red-600">Total Breaches</p>

                    <p className="mt-1 text-2xl font-bold text-red-700">
                      {slaPerformance?.totalBreaches ?? 0}
                    </p>
                  </div>

                  <div className="rounded-xl bg-orange-50 p-2">
                    <p className="text-sm text-orange-600">
                      First Response Breaches
                    </p>

                    <p className="mt-1 text-2xl font-bold text-orange-700">
                      {slaPerformance?.firstResponseBreaches ?? 0}
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-50 p-2">
                    <p className="text-sm text-blue-600">Resolution Breaches</p>

                    <p className="mt-1 text-2xl font-bold text-blue-700">
                      {slaPerformance?.resolutionBreaches ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
        <section className="h-full rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
          {/* Bar Chart of Ticket Distribution */}
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-800">
              Ticket Distribution
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Tickets grouped by category, priority and status.
            </p>
          </div>

          {isLoadingDistribution ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 ">
              {/* Category */}
              <div className="flex flex-col justify-center gap-3 items-center">
                <h3 className="text-sm font-semibold text-slate-700">
                  By Category
                </h3>

                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E1F5" />

                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      interval={0}
                      angle={-30}
                      textAnchor="end"
                      height={70}
                    />

                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />

                    <Tooltip />

                    <Bar
                      dataKey="tickets"
                      name="Tickets"
                      fill="#6366f1"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Priority */}
              <div className="flex flex-col justify-center gap-3 items-center">
                <h3 className="text-sm font-semibold text-slate-700">
                  By Priority
                </h3>

                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={priorityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E1F5" />

                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />

                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />

                    <Tooltip />

                    <Bar
                      dataKey="tickets"
                      name="Tickets"
                      fill="#f59e0b"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-3 items-center justify-center">
                <h3 className="text-sm font-semibold text-slate-700">
                  By Status
                </h3>

                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E1F5" />

                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      interval={0}
                      angle={-30}
                      textAnchor="end"
                      height={70}
                    />

                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />

                    <Tooltip />

                    <Bar
                      dataKey="tickets"
                      name="Tickets"
                      fill="#22c55e"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </section>
        <section className="h-full rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
          {/* Team Performance */}
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-800">
              Team Performance
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Overview of workload and resolution performance
            </p>
          </div>
          <div className="max-h-[500px] overflow-auto [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
            <table className="min-w-[1000px] w-full text-left text-sm">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="px-5 py-5">Team Member</th>
                  <th className="px-5 py-5">Role</th>
                  <th className="px-5 py-5">Assigned</th>
                  <th className="px-5 py-5">Active</th>
                  <th className="px-5 py-5">Resolved</th>
                  <th className="px-5 py-5">Completed</th>
                  <th className="px-5 py-5">SLA Compliance</th>
                  <th className="px-5 py-5">Avg. Resolution</th>
                </tr>
              </thead>

              <tbody>
                {teamData.map((member) => {
                  const completedCount = member.resolved + member.closed;
                  return (
                    <tr
                      key={member.userId}
                      className="border-b border-gray-100"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">
                          {member.name}
                        </p>
                        <p className="text-xs text-slate-500">{member.email}</p>
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            member.role === "SupportAgent"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-purple-50 text-purple-700"
                          }`}
                        >
                          {member.role === "SupportAgent"
                            ? "Support Agent"
                            : "Developer"}
                        </span>
                      </td>

                      <td className="px-5 py-5">{member.assigned}</td>
                      <td className="px-5 py-5">{member.active}</td>

                      <td className="px-5 py-5">{member.resolved}</td>
                      <td className="px-5 py-5 text-sm text-slate-700">
                        {completedCount}
                        <span className="ml-1 text-xs text-slate-400">
                          ({resolutionRate(member.assigned, completedCount)}%)
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            slaComplianceRate(
                              member.assigned,
                              member.slaBreaches,
                            ) >= 80
                              ? "bg-emerald-100 text-emerald-700"
                              : slaComplianceRate(
                                    member.assigned,
                                    member.slaBreaches,
                                  ) >= 50
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {slaComplianceRate(
                            member.assigned,
                            member.slaBreaches,
                          )}
                          %
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        {formatHours(member.avgResolution)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
