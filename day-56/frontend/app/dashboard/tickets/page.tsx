"use client";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { useEffect, useState } from "react";
import {
  closeTicket,
  developerUpdateTicket,
  fetchTicketDetails,
  fetchTickets,
  resolveTicket,
} from "../../store/slice/ticketSlice";
import Link from "next/link";
import TicektList from "../../components/Tickets/TicketListItem";
import TicketAssignment from "../../components/Tickets/TicketAssignment";
import {
  assignAgent,
  assignDeveloper,
} from "../../store/slice/assignmentSlice";
import { getDevelopers, getSupportAgents } from "../../store/slice/userSlice";
import {
  clearEscalationAssistance,
  fetchEscalationAssistance,
} from "../../store/slice/aiSlice";
import TicketSummary from "../../components/Tickets/TicketSummary";
import TicketMetaCards from "../../components/Tickets/TicketMetaCards";
import TicketAttachments from "../../components/Tickets/TicketAttachments";
import {
  clearActivity,
  fetchTicketActivity,
} from "../../store/slice/activitySlice";
import TicketTimeline from "../../components/Tickets/TicketTimeline";
import useDebounce from "../../hook/useDebounce";
import { FiUsers } from "react-icons/fi";

export default function TicketsPage() {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "people" | "attachments" | "activity"
  >("overview");
  const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");

  const debouncedSearch = useDebounce(search, 400);

  const dispatch = useDispatch<AppDispatch>();
  const {
    tickets,
    isLoading,
    fetchError,
    ticketDetails,
    isDetailsLoading,
    detailsError,
    statusUpdateError,
    isUpdatingStatus,
  } = useSelector((state: RootState) => state.ticket);
  const user = useSelector((state: RootState) => state.auth.user);
  const developers = useSelector((state: RootState) => state.user.developers);
  const agents = useSelector((state: RootState) => state.user.supportAgents);
  const {
    escalationAssistance,
    escalationAssistanceTicketId,
    escalationAssistanceError,
  } = useSelector((state: RootState) => state.ai);
  const {
    isAssigningDeveloper,
    assignmentError,
    agentAssignmentError,
    isAssigningAgent,
  } = useSelector((state: RootState) => state.assignment);
  const {
    activities,
    isLoading: activityLoading,
    error,
  } = useSelector((state: RootState) => state.activity);

  useEffect(() => {
    dispatch(
      fetchTickets({ search: debouncedSearch, status, priority, category }),
    );

    if (user?.role === "Admin") {
      dispatch(getDevelopers());
      dispatch(getSupportAgents());
    }

    if (user?.role === "SupportAgent") {
      dispatch(getDevelopers());
    }
  }, [dispatch, debouncedSearch, status, priority, category, user?.role]);

  useEffect(() => {
    if (!ticketDetails?.id) return;

    dispatch(fetchTicketActivity(ticketDetails.id));
  }, [dispatch, ticketDetails?.id]);

  if (isLoading && tickets.length === 0) {
    return <div className="p-6 text-gray-500">Loading tickets...</div>;
  }

  if (fetchError) {
    return (
      <div className="m-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        {fetchError}
      </div>
    );
  }

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setActiveTab("overview");
    dispatch(fetchTicketDetails(ticketId));
    dispatch(clearEscalationAssistance());
    dispatch(clearActivity());
    const selectedTicket = tickets.find((ticket) => ticket.id === ticketId);
    if (
      selectedTicket &&
      ["OPEN", "IN_PROGRESS"].includes(selectedTicket.status)
    ) {
      dispatch(fetchEscalationAssistance(ticketId));
    }
  };

  const handleStartDevelopment = async (ticketId: string) => {
    try {
      setUpdatingTicketId(ticketId);

      await dispatch(developerUpdateTicket(ticketId)).unwrap();
    } catch {
    } finally {
      setUpdatingTicketId(null);
    }
  };

  const handleResolve = async (ticketId: string) => {
    try {
      setUpdatingTicketId(ticketId);

      await dispatch(resolveTicket(ticketId)).unwrap();
    } catch {
    } finally {
      setUpdatingTicketId(null);
    }
  };

  const handleCloseUpdate = async (
    ticketId: string,
    action: "CLOSE" | "REOPEN",
  ) => {
    try {
      setUpdatingTicketId(ticketId);

      await dispatch(
        closeTicket({
          ticketId,
          action,
        }),
      ).unwrap();
    } catch {
    } finally {
      setUpdatingTicketId(null);
    }
  };

  const handleAssignDeveloper = async (developerId: string) => {
    if (!ticketDetails) return;

    const isReassignment = Boolean(ticketDetails.assignedDeveloperId);
    const result = await dispatch(
      assignDeveloper({
        ticketId: ticketDetails.id,
        developerId,
        aiSuggestion: isReassignment ? null : currentTicketAiAssistance,
      }),
    );

    if (assignDeveloper.fulfilled.match(result)) {
      dispatch(fetchTicketDetails(ticketDetails.id));
    }
  };

  const currentTicketAiAssistance =
    escalationAssistanceTicketId === ticketDetails?.id
      ? escalationAssistance
      : null;
  const handleAssignAgent = async (agentId: string) => {
    if (!ticketDetails) return;

    const result = await dispatch(
      assignAgent({
        ticketId: ticketDetails.id,
        agentId,
      }),
    );

    if (assignAgent.fulfilled.match(result)) {
      dispatch(fetchTicketDetails(ticketDetails.id));
    }
  };
  return (
    <div className="min-h-0 h-[calc(120vh-5rem)] space-y-2 flex flex-col gap-4">
      <section>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <FiUsers size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Tickets
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage and track your support tickets
            </p>
          </div>
        </div>
      </section>

      <div
        className={`shrink-0 grid h-full min-h-0 gap-4 ${
          selectedTicketId
            ? "grid-cols-1 md:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.6fr)]"
            : "grid-cols-1"
        }`}
      >
        {/* LEFT: Ticket List */}
        <section
          className={`${
            selectedTicketId ? "hidden md:flex" : "flex"
          } flex min-h-0 flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white`}
        >
          {statusUpdateError && (
            <div className="mx-4 mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {statusUpdateError}
            </div>
          )}

          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-3">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by ticket title, description or ID..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">All Statuses</option>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="ESCALATED">Escalated</option>
                  <option value="IN_DEVELOPMENT">In Development</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>

                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">All Priorities</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">All Categories</option>
                  <option value="TECHNICAL">Technical</option>
                  <option value="BILLING">Billing</option>
                  <option value="ACCOUNT">Account</option>
                  <option value="FEATURE_REQUEST">Feature Request</option>
                  <option value="GENERAL_INQUIRY">General Inquiry</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </div>
          <div
            className={` min-h-0 flex-1 overflow-y-auto p-3 sm:p-4 [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]`}
          >
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <TicektList
                  key={ticket.id}
                  ticket={ticket}
                  selected={selectedTicketId === ticket.id}
                  userRole={user?.role}
                  isUpdatingStatus={updatingTicketId === ticket.id}
                  onSelect={() => handleSelectTicket(ticket.id)}
                  onStartDevelopment={() => handleStartDevelopment(ticket.id)}
                  onResolve={() => handleResolve(ticket.id)}
                  onClose={() => handleCloseUpdate(ticket.id, "CLOSE")}
                  onReopen={() => handleCloseUpdate(ticket.id, "REOPEN")}
                />
              ))}

              {tickets.length === 0 && (
                <p className="py-8 text-center text-sm text-slate-500">
                  No tickets found.
                </p>
              )}
            </div>
          </div>
        </section>
        {/* RIGHT: Selected Ticket */}
        {selectedTicketId && (
          <section
            className={` flex min-h-0 flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white`}
          >
            <div className="shrink-0 border-b border-blue-100 bg-blue-50/30 p-4 sm:p-5 flex justify-between items-center">
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setSelectedTicketId(null)}
                  className="mb-1 text-sm font-medium text-blue-600 transition hover:text-blue-800"
                >
                  ← Back to Tickets
                </button>

                <div className="min-w-0">
                  <h3 className="mt-1 text-xl font-bold text-slate-900">
                    Ticket Details
                  </h3>
                </div>
              </div>
              <div>
                {ticketDetails && (
                  <Link
                    href={`/dashboard/tickets/${ticketDetails.id}/messages`}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-2 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    <span>Message</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </div>
            {ticketDetails && (
              <div className="shrink-0 border-b border-blue-100 p-3 pb-0">
                <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-3">
                  <TicketSummary ticketDetails={ticketDetails} />
                </div>

                <div className="mt-4 flex gap-4 overflow-x-auto">
                  {[
                    { key: "overview", label: "Overview" },
                    { key: "people", label: "People & Assignment" },
                    {
                      key: "attachments",
                      label: "Attachments",
                      count: ticketDetails.attachments?.length,
                    },
                    {
                      key: "activity",
                      label: "Activity",
                      count: activities.length,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key as typeof activeTab)}
                      className={`shrink-0 border-b-2 px-1 pb-3 text-sm font-medium transition ${
                        activeTab === tab.key
                          ? "border-blue-600 text-blue-700"
                          : "border-transparent text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {tab.label}
                      {tab.count != null && tab.count > 0 && (
                        <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Scrollable: active tab only */}
            <div className="min-h-0 flex-1 overflow-y-auto p-3 [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
              {isDetailsLoading ? (
                <p className="p-6 text-sm text-slate-500">
                  Loading ticket details...
                </p>
              ) : detailsError ? (
                <div className="m-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  {detailsError}
                </div>
              ) : ticketDetails ? (
                <>
                  {activeTab === "overview" && (
                    <TicketMetaCards ticketDetails={ticketDetails} />
                  )}

                  {activeTab === "people" && (
                    <div className="rounded-2xl border border-blue-100 bg-white p-3">
                      {(assignmentError || agentAssignmentError) && (
                        <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                          {assignmentError || agentAssignmentError}
                        </div>
                      )}
                      {escalationAssistanceTicketId === ticketDetails?.id &&
                        escalationAssistanceError &&
                        user.role === "SupportAgent" && (
                          <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                            {escalationAssistanceError ||
                              "Failed to fetch AI assistance."}
                          </div>
                        )}
                      <TicketAssignment
                        ticket={ticketDetails}
                        user={user}
                        agents={agents}
                        developers={developers}
                        isAssigning={isAssigningDeveloper}
                        onAssign={handleAssignDeveloper}
                        isAssigningAgent={isAssigningAgent}
                        onAgentAssign={handleAssignAgent}
                        agentAssistance={currentTicketAiAssistance}
                      />
                    </div>
                  )}

                  {activeTab === "attachments" &&
                    (ticketDetails.attachments?.length ? (
                      <section className="rounded-xl border border-blue-100 bg-white p-5">
                        <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
                          <TicketAttachments
                            attachments={
                              Array.isArray(ticketDetails.attachments)
                                ? (ticketDetails.attachments as string[])
                                : []
                            }
                          />
                        </div>
                      </section>
                    ) : (
                      <p className="py-8 text-center text-sm text-slate-500">
                        No attachments on this ticket.
                      </p>
                    ))}

                  {activeTab === "activity" && (
                    <TicketTimeline
                      activities={activities}
                      isLoading={activityLoading}
                      error={error}
                    />
                  )}
                </>
              ) : null}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
