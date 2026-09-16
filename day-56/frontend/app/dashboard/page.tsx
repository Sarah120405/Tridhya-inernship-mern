"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

import { AppDispatch, RootState } from "../store/store";
import { fetchCurrentUser } from "../store/slice/authSlice";
import { MetricCard } from "../components/MetricCard";
import Modal from "../components/Modal";
import CreateTicket from "../components/CreateTicket";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [openCreateTicket, setOpenCreateTicket] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      setError(null);

      try {
        await dispatch(fetchCurrentUser()).unwrap();

        const res = await fetch("http://localhost:5000/api/report/dashboard", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Unable to load dashboard data.");
        }

        const result = await res.json();
        setDashboardData(result.data ?? result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="animate-pulse text-[#6C5DD3] font-semibold">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-6 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
        {error}
      </div>
    );
  }

  if (!user || !dashboardData) return null;

  const metrics = dashboardData.metrics ?? {};

  const metricCards = [
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
      description: "Tickets currently in progress",
      icon: <FiLifeBuoy />,
      icon_2: <FiLifeBuoy />,
    },
    {
      title: "Awaiting Your Reply",
      value: metrics.awaitingReply ?? 0,
      description: "Tickets that need your response",
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

  const recentTickets = dashboardData.recentTickets ?? [];
  const needsAttention = dashboardData.needsAttention ?? [];
  const recentNotifications = dashboardData.recentNotifications ?? [];

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  const statusStyles = {
    OPEN: "bg-blue-50 text-blue-700",
    IN_PROGRESS: "bg-amber-50 text-amber-700",
    WAITING_FOR_CUSTOMER: "bg-fuchsia-50 text-fuchsia-700",
    WAITING_FOR_AGENT: "bg-violet-50 text-violet-700",
    RESOLVED: "bg-emerald-50 text-emerald-700",
    CLOSED: "bg-slate-100 text-slate-600",
  };

  const priorityStyles = {
    LOW: "bg-slate-100 text-slate-600",
    MEDIUM: "bg-blue-50 text-blue-700",
    HIGH: "bg-orange-50 text-orange-700",
    URGENT: "bg-rose-50 text-rose-700",
  };

  const formatLabel = (value = "") =>
    value
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <main className="min-h-screen bg-[#FAF8FF] p-2">
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

          <button
            onClick={() => setOpenCreateTicket(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6C5DD3] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-[#5949C4]"
          >
            <FiPlus />
            Create New Ticket
          </button>
        </section>

        {openCreateTicket && (
          <Modal
            title={`Create Ticket`}
            subtitle={`Tell us what you need help with. Our support team will review your
              request and get back to you.`}
            onClose={() => setOpenCreateTicket(false)}
          >
            <CreateTicket />
          </Modal>
        )}
        {/* Metric Cards */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-4">
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

        <div className="grid grid-cols-2 gap-4 justify-between items-center">
          {/* Needs Attention */}
          <section className="h-full rounded-2xl border border-[#E8E1F5] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
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

            {needsAttention.length === 0 ? (
              <div className="rounded-xl bg-[#FAF8FF] px-4 py-6 text-center">
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
                      <p className="text-xs font-semibold text-[#8B7ED8]">
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
                      className="inline-flex items-center gap-2 self-start text-sm font-semibold text-[#6C5DD3] hover:text-[#4F3FB7] sm:self-center"
                    >
                      Reply now <FiArrowRight />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent Tickets */}
          <section className="rounded-2xl border border-[#E8E1F5] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-slate-800">Recent Tickets</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Your latest support requests
                </p>
              </div>

              <button
                onClick={() => (window.location.href = "/tickets")}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#6C5DD3] hover:text-[#4F3FB7]"
              >
                View all <FiArrowRight />
              </button>
            </div>

            {recentTickets.length === 0 ? (
              <div className="rounded-xl bg-[#FAF8FF] px-4 py-8 text-center">
                <FiLifeBuoy className="mx-auto mb-2 text-2xl text-[#9B8FE3]" />
                <p className="font-medium text-slate-700">No tickets yet</p>
                <p className="mt-1 text-sm text-slate-500">
                  Your submitted tickets will appear here.
                </p>
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-3">
                {recentTickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    onClick={() =>
                      (window.location.href = `/tickets/${ticket.id}`)
                    }
                    className="min-w-[280px] max-w-[280px] shrink-0 rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-purple-300 hover:shadow-md"
                  >
                    {/* Ticket number + status */}
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#8B7ED8]">
                        Ticket #{ticket.ticketNumber}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          statusStyles[ticket.status] ??
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {formatLabel(ticket.status)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="line-clamp-2 text-sm font-semibold text-slate-800 transition group-hover:text-[#6C5DD3]">
                      {ticket.title}
                    </h3>

                    {/* Footer */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`rounded-md px-2 py-1 text-[11px] font-medium ${
                          priorityStyles[ticket.priority] ??
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {formatLabel(ticket.priority)}
                      </span>

                      <span className="text-xs text-slate-400">
                        Updated {formatDate(ticket.updatedAt)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
        {/* Recent Activity */}
        <section className="rounded-2xl border border-[#E8E1F5] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-[#6C5DD3]">
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
            <p className="rounded-xl bg-[#FAF8FF] px-4 py-6 text-center text-sm text-slate-500">
              Your recent ticket updates will appear here.
            </p>
          ) : (
            <div className="space-y-4">
              {recentNotifications.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 text-[#6C5DD3]">
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
                      className="shrink-0 text-[#6C5DD3] hover:text-[#4F3FB7]"
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
