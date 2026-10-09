"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchSLAByTicketId, fetchSLAs } from "../../store/slice/slaSlice";
import { MetricCard } from "../../components/MetricCard";
import {
  FiActivity,
  FiAlertCircle,
  FiAlertTriangle,
  FiCheckCircle,
} from "react-icons/fi";
import useDebounce from "../../hook/useDebounce";
import { formatDate } from "../../utils/date";
import {
  getOverallSLAStatus,
  getStatusClasses,
  PRIORITY_STYLES,
  getTicketStatusClass,
} from "../../utils/ticketStyles";
import SlaModal from "../../components/SlaModal";

type TargetStatus =
  | "COMPLETED"
  | "BREACHED"
  | "AT_RISK"
  | "ON_TRACK"
  | "NOT_APPLICABLE";

export function getTargetStatus(
  completedAt: string | Date | null,
  dueAt: string | Date | null,
  createdAt: string | Date,
  now = new Date(),
): TargetStatus {
  if (!dueAt) return "NOT_APPLICABLE";

  const due = new Date(dueAt).getTime();
  const current = now.getTime();

  if (completedAt) {
    return new Date(completedAt).getTime() > due ? "BREACHED" : "COMPLETED";
  }

  if (current > due) return "BREACHED";

  const start = new Date(createdAt).getTime();
  const duration = Math.max(due - start, 1);
  const percentageRemaining = ((due - current) / duration) * 100;

  return percentageRemaining <= 20 ? "AT_RISK" : "ON_TRACK";
}

export default function SLAMonitoringPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { slas, slaByTicket, pagination, isLoading, error } = useSelector(
    (state: RootState) => state.sla,
  );

  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const debouncedSearch = useDebounce(search, 300);
  const [selectedSLA, setSelectedSLA] = useState<(typeof slas)[number] | null>(
    null,
  );

  const [slaDetails, setSlaDetails] = useState<(typeof slas)[number] | null>(
    null,
  );

  const [isSlaModalOpen, setIsSlaModalOpen] = useState(false);
  const [isSlaDetailsLoading, setIsSlaDetailsLoading] = useState(false);
  const [slaDetailsError, setSlaDetailsError] = useState("");

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

  const handleOpenSLAModal = async (sla: (typeof slas)[number]) => {
    setSelectedSLA(sla);
    setSlaDetails(null);
    setSlaDetailsError("");
    setIsSlaModalOpen(true);
    setIsSlaDetailsLoading(true);

    try {
      dispatch(fetchSLAByTicketId({ ticketId: sla.ticket.id }));
      console.log("SLA details fetched successfully:", slaByTicket);
      setSlaDetails(slaByTicket);
    } catch (error) {
      console.error("Failed to fetch SLA details:", error);
      setSlaDetailsError("Unable to load SLA details. Please try again.");
    } finally {
      setIsSlaDetailsLoading(false);
    }
  };
  const totalPages = pagination?.totalPages ?? 1;

  useEffect(() => {
    setPage(1);
  }, [priorityFilter, debouncedSearch, statusFilter]);

  const getSLAStatus = (sla: (typeof slas)[number]) => {
    const firstResponse = getTargetStatus(
      sla.firstRespondedAt,
      sla.firstResponseDueAt,
      sla.createdAt,
    );

    const resolution = getTargetStatus(
      sla.resolutionCompletedAt,
      sla.resolutionDueAt,
      sla.createdAt,
    );

    if (firstResponse === "BREACHED" || resolution === "BREACHED") {
      return "BREACHED";
    }

    if (firstResponse === "AT_RISK" || resolution === "AT_RISK") {
      return "AT_RISK";
    }

    return "ON_TRACK";
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
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-slate-900">
              SLA Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Monitor response and resolution targets
            </p>
          </div>

          <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
            {pagination?.total ?? 0}{" "}
            {(pagination?.total ?? 0) === 1 ? "ticket" : "tickets"}
          </span>
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
            <div className="overflow-auto max-h-[560px] relative [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
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
              <table className="w-full min-w-[760px] sm:min-w-[900px] lg:min-w-[1000px]">
                <thead className="border-b border-slate-200 bg-slate-50/95 backdrop-blur-sm sticky top-0 z-10">
                  <tr>
                    <th className="sticky left-0 z-20 whitespace-nowrap bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500 sm:px-3">
                      Ticket
                    </th>

                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500 sm:px-5">
                      Status
                    </th>

                    <th className="min-w-[240px] px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      First Response SLA
                    </th>

                    <th className="min-w-[240px] px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Resolution SLA
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Overall SLA
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredSLAs.length > 0 ? (
                    filteredSLAs.map((sla) => {
                      const ticket = sla.ticket;
                      const firstResponseStatus = getTargetStatus(
                        sla.firstRespondedAt,
                        sla.firstResponseDueAt,
                        sla.createdAt,
                      );

                      const resolutionStatus = getTargetStatus(
                        sla.resolutionCompletedAt,
                        sla.resolutionDueAt,
                        sla.createdAt,
                      );

                      const overallStatus = getOverallSLAStatus(
                        firstResponseStatus,
                        resolutionStatus,
                      );

                      const renderTarget = (
                        status: TargetStatus,
                        completedAt: string | Date | null,
                        dueAt: string | Date | null,
                      ) => {
                        const isCompleted = Boolean(completedAt);
                        const isBreached =
                          !isCompleted && status === "BREACHED";

                        const label = isCompleted
                          ? "Completed"
                          : isBreached
                            ? "Deadline passed"
                            : "Due date";

                        const dateValue = completedAt || dueAt;

                        const indicatorClass = isCompleted
                          ? "bg-emerald-500"
                          : isBreached
                            ? "bg-red-500"
                            : status === "AT_RISK"
                              ? "bg-amber-500"
                              : "bg-blue-500";

                        return (
                          <div className="flex min-w-[190px] items-start gap-3">
                            <span
                              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${indicatorClass}`}
                            />

                            <div className="min-w-0">
                              <p className="text-xs font-medium text-slate-500">
                                {dueAt || completedAt ? label : "Deadline"}
                              </p>

                              <p
                                className={`mt-1 text-sm font-medium ${
                                  isBreached
                                    ? "text-red-600"
                                    : isCompleted
                                      ? "text-emerald-700"
                                      : "text-slate-800"
                                }`}
                              >
                                {dateValue
                                  ? formatDate(dateValue)
                                  : "Not configured"}
                              </p>

                              {!isCompleted && dueAt && (
                                <p className="mt-1 text-[11px] text-slate-400">
                                  {isBreached
                                    ? "Requires attention"
                                    : "Target deadline"}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      };
                      return (
                        <tr
                          key={sla.id}
                          onClick={() => handleOpenSLAModal(sla)}
                          className="group cursor-pointer transition-colors duration-150 hover:bg-slate-50/80"
                        >
                          <td className="sticky left-0 z-[5] w-[220px] bg-white px-5 py-4 transition-colors group-hover:bg-slate-50 sm:px-5">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
                                {ticket.ticketNumber}
                              </div>

                              <div className="min-w-0">
                                <span
                                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium  ${PRIORITY_STYLES[ticket.priority]}`}
                                >
                                  {ticket.priority}
                                </span>
                                <p className="mt-1 max-w-[190px] truncate text-sm text-slate-500">
                                  {ticket.title}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium  ${getTicketStatusClass(ticket.status)}`}
                            >
                              {ticket.status.replaceAll("_", " ")}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            {renderTarget(
                              firstResponseStatus,
                              sla.firstRespondedAt,
                              sla.firstResponseDueAt,
                            )}
                          </td>

                          <td className="px-5 py-4">
                            {renderTarget(
                              resolutionStatus,
                              sla.resolutionCompletedAt,
                              sla.resolutionDueAt,
                            )}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(overallStatus)}`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              {overallStatus === "NOT_APPLICABLE"
                                ? "N/A"
                                : overallStatus === "AT_RISK"
                                  ? "At Risk"
                                  : overallStatus === "ON_TRACK"
                                    ? "On Track"
                                    : overallStatus === "COMPLETED"
                                      ? "Completed"
                                      : "Breached"}
                            </span>
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

            <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-sm text-slate-500">
                Page{" "}
                <span className="font-semibold text-slate-800">{page}</span> of{" "}
                <span className="font-semibold text-slate-800">
                  {totalPages}
                </span>
              </p>

              <div className="flex w-full gap-2 sm:w-auto">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="flex flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                >
                  Previous
                </button>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="flex flex-1 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      {isSlaModalOpen && selectedSLA && (
        <SlaModal
          selectedSLA={selectedSLA}
          isSlaDetailsLoading={isSlaDetailsLoading}
          slaDetails={slaDetails}
          slaDetailsError={slaDetailsError}
          setIsSlaModalOpen={setIsSlaModalOpen}
          setSelectedSLA={setSelectedSLA}
          setSlaDetails={setSlaDetails}
          setSlaDetailsError={setSlaDetailsError}
          handleOpenSLAModal={handleOpenSLAModal}
        />
      )}
    </div>
  );
}
