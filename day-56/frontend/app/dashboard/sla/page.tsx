"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchSLAs } from "../../store/slice/slaSlice";
import { MetricCard } from "../../components/MetricCard";
import {
  FiActivity,
  FiAlertCircle,
  FiAlertTriangle,
  FiCheckCircle,
} from "react-icons/fi";
import useDebounce from "../../hook/useDebounce";

export default function SLAMonitoringPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { slas, pagination, isLoading, error } = useSelector(
    (state: RootState) => state.sla,
  );

  const [page, setPage] = useState(1);
  const limit = 5;
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const debouncedSearch = useDebounce(search, 300);
  useEffect(() => {
    dispatch(
      fetchSLAs({
        page,
        limit,
        priority: priorityFilter,
        search: search,
      }),
    );
  }, [dispatch, page, priorityFilter, debouncedSearch]);
  const totalPages = pagination?.totalPages ?? 1;

  useEffect(() => {
    setPage(1);
  }, [priorityFilter, debouncedSearch, statusFilter]);

  const getSLAStatus = (sla: (typeof slas)[number]) => {
    if (sla.breached) {
      return "BREACHED";
    }

    const now = new Date().getTime();

    const responseDue = sla.firstResponseDueAt
      ? new Date(sla.firstResponseDueAt).getTime()
      : null;
    const resolutionDue = sla.resolutionDueAt
      ? new Date(sla.resolutionDueAt).getTime()
      : null;
    const dueTimes = [responseDue, resolutionDue].filter(
      (time): time is number => time !== null,
    );
    if (dueTimes.length === 0) {
      return "ON_TRACK";
    }

    const nearestDue = Math.min(...dueTimes);
    const totalDuration = Math.max(
      nearestDue - new Date(sla.createdAt).getTime(),
      1,
    );
    const remaining = nearestDue - now;
    const percentageRemaining = (remaining / totalDuration) * 100;

    if (percentageRemaining <= 20) {
      return "AT_RISK";
    }
    return "ON_TRACK";
  };

  const getRemainingTime = (dueAt: string | null) => {
    if (!dueAt) {
      return "—";
    }

    const difference = new Date(dueAt).getTime() - Date.now();

    if (difference <= 0) {
      return "Breached";
    }

    const totalMinutes = Math.floor(difference / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;
    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const filteredSLAs = useMemo(() => {
    return slas.filter((sla) => {
      const slaStatus = getSLAStatus(sla);
      const matchesStatus =
        statusFilter === "ALL" || slaStatus === statusFilter;

      return matchesStatus;
    });
  }, [slas, statusFilter]);

  const totalTickets = slas.length;

  const onTrackCount = slas.filter(
    (sla) => getSLAStatus(sla) === "ON_TRACK",
  ).length;

  const atRiskCount = slas.filter(
    (sla) => getSLAStatus(sla) === "AT_RISK",
  ).length;

  const breachedCount = slas.filter(
    (sla) => getSLAStatus(sla) === "BREACHED",
  ).length;
  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          <p className="font-semibold">Unable to load SLA information</p>

          <p className="mt-1 text-sm">{error}</p>

          <button
            onClick={() =>
              dispatch(
                fetchSLAs({
                  page,
                  limit,
                  priority: priorityFilter,
                  search: search,
                }),
              )
            }
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">SLA Monitoring</h1>

        <p className="mt-1 text-sm text-slate-500">
          Monitor ticket response and resolution deadlines.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          title="Total Active SLAs"
          description="Currently monitored"
          value={totalTickets}
          icon={<FiActivity />}
          icon_2={<FiActivity />}
        />

        <MetricCard
          title="On Track"
          description="Within SLA"
          value={onTrackCount}
          icon={<FiCheckCircle />}
          icon_2={<FiCheckCircle />}
        />

        <MetricCard
          title="At Risk"
          description="Approaching deadline"
          value={atRiskCount}
          icon={<FiAlertTriangle />}
          icon_2={<FiAlertTriangle />}
        />

        <MetricCard
          title="Breached"
          description="SLA deadline exceeded"
          value={breachedCount}
          icon={<FiAlertCircle />}
          icon_2={<FiAlertCircle />}
        />
      </div>
      <div className="rounded-xl border border-blue-200 bg-white p-3">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <input
            type="text"
            placeholder="Search by ticket number or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-blue-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 lg:w-96"
          />

          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-blue-300 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="ALL">All SLA Status</option>
              <option value="ON_TRACK">On Track</option>
              <option value="AT_RISK">At Risk</option>
              <option value="BREACHED">Breached</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-lg border border-blue-300 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-blue-200 bg-white">
        <div className="border-b border-blue-200 px-5 py-4 flex gap-2 items-center">
          <h2 className="font-semibold text-slate-900">SLA Overview</h2>

          <p className="text-sm text-slate-500">
            ({pagination?.total ?? 0} ticket
            {(pagination?.total ?? 0) !== 1 ? "s" : ""})
          </p>
        </div>

        {filteredSLAs.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-medium text-slate-700">No SLA records found</p>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-auto max-h-[500px] relative [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
              {isLoading && (
                <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-[1px]">
                  <div className="flex h-full items-center justify-center">
                    <div className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sm">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-800" />
                      <span className="text-sm font-medium text-gray-600">
                        Loading SLA data...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <table className="w-full min-w-[1000px]">
                <thead className="border-b border-blue-200 bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Ticket
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Priority
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      First Response
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Resolution
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      SLA
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredSLAs.length > 0 ? (
                    filteredSLAs.map((sla) => {
                      const ticket = sla.ticket;
                      const slaStatus = getSLAStatus(sla);

                      return (
                        <tr key={sla.id} className="hover:bg-gray-50">
                          <td className="px-5 py-4">
                            <div>
                              <p className="font-medium text-slate-900">
                                #{ticket.ticketNumber}
                              </p>

                              <p className="mt-1 max-w-xs truncate text-sm text-slate-500">
                                {ticket.title}
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span className="text-sm font-medium text-slate-700">
                              {ticket.priority}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span className="text-sm text-slate-600">
                              {ticket.status}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            {sla.firstRespondedAt ? (
                              <div>
                                <p className="text-sm font-medium text-green-600">
                                  Completed
                                </p>

                                <p className="text-xs text-slate-500">
                                  {new Date(
                                    sla.firstRespondedAt,
                                  ).toLocaleString()}
                                </p>
                              </div>
                            ) : (
                              <div>
                                <p className="text-sm font-medium text-slate-700">
                                  {getRemainingTime(sla.firstResponseDueAt)}
                                </p>

                                {sla.firstResponseDueAt && (
                                  <p className="text-xs text-slate-500">
                                    Due{" "}
                                    {new Date(
                                      sla.firstResponseDueAt,
                                    ).toLocaleString()}
                                  </p>
                                )}
                              </div>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            {sla.resolutionCompletedAt ? (
                              <div>
                                <p className="text-sm font-medium text-green-600">
                                  Completed
                                </p>

                                <p className="text-xs text-slate-500">
                                  {new Date(
                                    sla.resolutionCompletedAt,
                                  ).toLocaleString()}
                                </p>
                              </div>
                            ) : (
                              <div>
                                <p className="text-sm font-medium text-slate-700">
                                  {getRemainingTime(sla.resolutionDueAt)}
                                </p>

                                {sla.resolutionDueAt && (
                                  <p className="text-xs text-slate-500">
                                    Due{" "}
                                    {new Date(
                                      sla.resolutionDueAt,
                                    ).toLocaleString()}
                                  </p>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            {slaStatus === "BREACHED" && (
                              <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                Breached
                              </span>
                            )}

                            {slaStatus === "AT_RISK" && (
                              <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                                At Risk
                              </span>
                            )}

                            {slaStatus === "ON_TRACK" && (
                              <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                On Track
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-10 text-center text-sm text-gray-500"
                      >
                        No SLA records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-blue-200 px-4 py-3">
              <p className="text-sm text-slate-500">
                Page {page} of {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
