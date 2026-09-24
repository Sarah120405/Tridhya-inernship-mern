import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../../store/slice/authSlice";
import {
  FiLifeBuoy,
  FiFolder,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiPlus,
  FiMessageCircle,
  FiActivity,
} from "react-icons/fi";

import { MetricCard } from "../MetricCard";
import Link from "next/link";
import {
  getTicketStatusClass,
  PRIORITY_STYLES,
} from "../../utils/ticketStyles";
import { fetchDashboard } from "../../store/slice/reportSlice";

export default function DashboardComponent({ user }) {
  const dispatch = useDispatch<AppDispatch>();
  const { dashboard, dashboardError, isLoadingDashboard } = useSelector(
    (state: RootState) => state.report,
  );

  useEffect(() => {
    dispatch(fetchCurrentUser()).unwrap();
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (isLoadingDashboard) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="animate-pulse text-blue-600 font-semibold">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="m-6 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
        {dashboardError}
      </div>
    );
  }

  if (!user || !dashboard) return null;

  const metrics: any = dashboard?.metrics ?? {};

  const metricCards =
    user?.role === "Customer"
      ? [
          {
            title: "Total Tickets",
            value: metrics.totalTickets ?? 0,
            description: "All tickets you've submitted",
            icon: <FiFolder />,
            icon_2: <FiFolder />,
          },
          {
            title: "Open Tickets",
            value: metrics.openTickets ?? 0,
            description: "Tickets currently open",
            icon: <FiLifeBuoy />,
            icon_2: <FiLifeBuoy />,
          },
          {
            title: "Awaiting Reply",
            value: metrics.awaitingReply ?? 0,
            description: "Tickets waiting for your response",
            icon: <FiClock />,
            icon_2: <FiClock />,
          },
          {
            title: "Resolved Tickets",
            value: metrics.resolvedTickets ?? 0,
            description: "Tickets marked as resolved",
            icon: <FiCheckCircle />,
            icon_2: <FiCheckCircle />,
          },
        ]
      : user?.role === "SupportAgent"
        ? [
            {
              title: "Assigned Tickets",
              value: metrics.totalTickets ?? 0,
              description: "Tickets assigned to you",
              icon: <FiFolder />,
              icon_2: <FiFolder />,
            },
            {
              title: "Open Tickets",
              value: metrics.openTickets ?? 0,
              description: "Tickets currently open",
              icon: <FiLifeBuoy />,
              icon_2: <FiLifeBuoy />,
            },
            {
              title: "Waiting for Customer",
              value: metrics.awaitingReply ?? 0,
              description: "Tickets waiting for customer response",
              icon: <FiClock />,
              icon_2: <FiClock />,
            },
            {
              title: "Resolved Tickets",
              value: metrics.resolvedTickets ?? 0,
              description: "Tickets marked as resolved",
              icon: <FiCheckCircle />,
              icon_2: <FiCheckCircle />,
            },
          ]
        : user?.role === "Developer"
          ? [
              {
                title: "Assigned Tickets",
                value: metrics.totalTickets ?? 0,
                description: "Tickets assigned to you",
                icon: <FiFolder />,
                icon_2: <FiFolder />,
              },
              {
                title: "Open Tickets",
                value: metrics.openTickets ?? 0,
                description: "Tickets currently open",
                icon: <FiLifeBuoy />,
                icon_2: <FiLifeBuoy />,
              },
              {
                title: "Waiting for Customer",
                value: metrics.awaitingReply ?? 0,
                description: "Tickets waiting for customer response",
                icon: <FiClock />,
                icon_2: <FiClock />,
              },
              {
                title: "Resolved Tickets",
                value: metrics.resolvedTickets ?? 0,
                description: "Tickets marked as resolved",
                icon: <FiCheckCircle />,
                icon_2: <FiCheckCircle />,
              },
            ]
          : [
              // Admin
              {
                title: "Total Tickets",
                value: metrics.totalTickets ?? 0,
                description: "All tickets in the system",
                icon: <FiFolder />,
                icon_2: <FiFolder />,
              },
              {
                title: "Open Tickets",
                value: metrics.openTickets ?? 0,
                description: "Tickets currently open",
                icon: <FiLifeBuoy />,
                icon_2: <FiLifeBuoy />,
              },
              {
                title: "In Progress",
                value: metrics.inProgress ?? 0,
                description: "Tickets currently being handled",
                icon: <FiClock />,
                icon_2: <FiClock />,
              },
              {
                title: "Resolved Tickets",
                value: metrics.resolvedTickets ?? 0,
                description: "Tickets marked as resolved",
                icon: <FiCheckCircle />,
                icon_2: <FiCheckCircle />,
              },
            ];

  const recentTickets = dashboard.recentTickets ?? [];
  const needsAttention = dashboard.needsAttention ?? [];
  const recentNotifications = dashboard.recentNotifications ?? [];

  const formatDate = (date: string) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  const formatLabel = (value = "") =>
    value
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  return (
    <main className="min-h-screen p-2">
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

          {user.role === "Customer" && (
            <Link
              href={`dashboard/create-ticket`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              <FiPlus />
              Create New Ticket
            </Link>
          )}
        </section>
        {/* Metric Cards */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metricCards.map((card) => (
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
          {/* Needs Attention */}
          <section className="flex h-[420px] flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex shrink-0 items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                  <FiAlertCircle size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-800">
                    Needs Your Attention
                  </h2>
                  <p className="text-xs text-slate-500">
                    Tickets waiting for your response
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600">
                {needsAttention.length} pending
              </span>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
              {needsAttention.length === 0 ? (
                <div className="rounded-xl bg-blue-50/40 px-4 py-6 text-center">
                  <FiCheckCircle className="mx-auto mb-2 text-2xl text-emerald-500" />
                  <p className="text-sm font-medium text-slate-700">
                    You're all caught up!
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    No tickets currently need your response.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {needsAttention.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex flex-col justify-between gap-3 rounded-xl border border-rose-100 bg-rose-50/40 p-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <p className="text-xs font-semibold text-blue-500">
                          Ticket #{ticket.ticketNumber}
                        </p>
                        <h3 className="mt-1 font-semibold text-slate-800">
                          {ticket.title}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          Updated {formatDate(ticket.updatedAt)}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          (window.location.href = `/tickets/${ticket.id}`)
                        }
                        className="inline-flex items-center gap-2 self-start text-sm font-semibold text-blue-600 hover:text-blue-700 sm:self-center"
                      >
                        Reply now <FiArrowRight />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Recent Tickets */}
          <section className="flex h-[420px] flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex shrink-0 items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-slate-800">Recent Tickets</h2>
                <p className="mt-1 text-xs text-slate-500">
                  {user.role === "Customer"
                    ? "Your latest support requests"
                    : "Tickets recently assigned to you"}
                </p>
              </div>

              <button
                onClick={() => (window.location.href = "/tickets")}
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View all <FiArrowRight />
              </button>
            </div>

            <div className="min-h-0 flex-1">
              {recentTickets.length === 0 ? (
                <div className="rounded-xl bg-blue-50/40 px-4 py-8 text-center">
                  <FiLifeBuoy className="mx-auto mb-2 text-2xl text-blue-300" />
                  <p className="font-medium text-slate-700">No tickets yet</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Your submitted tickets will appear here.
                  </p>
                </div>
              ) : (
                <div className="flex h-full gap-4 overflow-x-auto pb-3 [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
                  {recentTickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      onClick={() =>
                        (window.location.href = `/tickets/${ticket.id}`)
                      }
                      className="min-w-[280px] max-w-[280px] shrink-0 rounded-xl border border-blue-200 bg-white p-4 text-left transition hover:border-blue-300 hover:shadow-md"
                    >
                      {/* Ticket number + status */}
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-bold text-blue-500">
                          Ticket #{ticket.ticketNumber}
                        </span>
                      </div>

                      {/* Title */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="line-clamp-2 text-lg font-semibold text-slate-800 transition group-hover:text-blue-600">
                          {ticket.title}
                        </h3>
                        <span className="text-xs text-slate-400">
                          Updated {formatDate(ticket.updatedAt)}
                        </span>
                      </div>

                      {/* Footer */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`rounded-md px-2 py-1 text-sm font-medium ${
                            PRIORITY_STYLES[ticket.priority] ??
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {formatLabel(ticket.priority)}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-sm font-semibold ${
                            getTicketStatusClass(ticket.status) ??
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {formatLabel(ticket.status)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
        {/* Recent Activity */}
        <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FiActivity size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">Recent Activity</h2>
              <p className="mt-1 text-xs text-slate-500">
                Updates on your support requests
              </p>
            </div>
          </div>

          {recentNotifications.length === 0 ? (
            <p className="rounded-xl bg-blue-50/40 px-4 py-6 text-center text-sm text-slate-500">
              Your recent ticket updates will appear here.
            </p>
          ) : (
            <div className="space-y-4">
              {recentNotifications.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <FiMessageCircle size={16} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-700">
                      {activity.action
                        ? formatLabel(activity.action)
                        : "Ticket updated"}
                      {activity.ticket?.title && (
                        <>
                          {" — "}
                          <span className="font-semibold">
                            {activity.ticket.title}
                          </span>
                        </>
                      )}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(activity.createdAt)}
                    </p>
                  </div>

                  {activity.ticket?.id && (
                    <button
                      onClick={() =>
                        (window.location.href = `/tickets/${activity.ticket.id}`)
                      }
                      className="shrink-0 text-blue-600 hover:text-blue-700"
                      aria-label="View related ticket"
                    >
                      <FiArrowRight />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
