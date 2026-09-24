"use client";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { useEffect, useState } from "react";
import {
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
  agentAssistance,
  clearAgentAssistance,
} from "../../store/slice/aiSlice";
import TicketSummary from "../../components/Tickets/TicketSummary";
import TicketMetaCards from "../../components/Tickets/TicketMetaCards";
import TicketAttachments from "../../components/Tickets/TicketAttachments";
import {
  clearActivity,
  fetchTicketActivity,
} from "../../store/slice/activitySlice";
import TicketTimeline from "../../components/Tickets/TicketTimeline";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="break-all text-sm font-medium text-slate-800 sm:max-w-[65%] sm:text-right">
        {value}
      </span>
    </div>
  );
}

export default function TicketsPage() {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "people" | "attachments" | "activity"
  >("overview");
  const dispatch = useDispatch<AppDispatch>();
  const {
    tickets,
    isLoading,
    fetchError,
    ticketDetails,
    isDetailsLoading,
    detailsError,
    isUpdatingStatus,
  } = useSelector((state: RootState) => state.ticket);
  const user = useSelector((state: RootState) => state.auth.user);
  const developers = useSelector((state: RootState) => state.user.developers);
  const agents = useSelector((state: RootState) => state.user.supportAgents);
  const {
    agentAssistance: aiAssistance,
    agentAssistanceTicketId,
    agentAssistanceError,
    isAgentAssistanceLoading,
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
    dispatch(fetchTickets());

    if (user?.role === "Admin") {
      dispatch(getDevelopers());
      dispatch(getSupportAgents());
    }

    if (user?.role === "SupportAgent") {
      dispatch(getDevelopers());
    }
  }, [dispatch, user?.role]);

  useEffect(() => {
    if (!ticketDetails?.id) return;

    dispatch(fetchTicketActivity(ticketDetails.id));
  }, [dispatch, ticketDetails?.id]);

  if (isLoading && tickets.length === 0) {
    return <div className="p-6 text-gray-500">Loading tickets...</div>;
  }

  if (fetchError) {
    return <div className="p-6 text-rose-600">{fetchError}</div>;
  }

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setActiveTab("overview");
    dispatch(fetchTicketDetails(ticketId));
    dispatch(clearAgentAssistance());
    dispatch(clearActivity());
    const selectedTicket = tickets.find((ticket) => ticket.id === ticketId);
    if (
      selectedTicket &&
      ["OPEN", "IN_PROGRESS"].includes(selectedTicket.status)
    ) {
      dispatch(agentAssistance(ticketId));
    }
  };

  const handleAssignDeveloper = async (developerId: string) => {
    if (!ticketDetails) return;

    const isReassignment = Boolean(ticketDetails.assignedDeveloperId);
    const result = await dispatch(
      assignDeveloper({
        ticketId: ticketDetails.id,
        developerId,
        aiSuggestion: isReassignment ? null : aiAssistance,
      }),
    );

    if (assignDeveloper.fulfilled.match(result)) {
      dispatch(fetchTicketDetails(ticketDetails.id));
    }
  };

  const currentTicketAiAssistance =
    agentAssistanceTicketId === ticketDetails?.id ? aiAssistance : null;
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
    <div className="min-h-0 h-[calc(120vh-5rem)] space-y-2 px-2 flex flex-col gap-4">
      <div
        className={`shrink-0 grid h-full min-h-0 gap-4 ${
          selectedTicketId
            ? "grid-cols-1 lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.6fr)]"
            : "grid-cols-1"
        }`}
      >
        {/* LEFT: Ticket List */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white">
          <div className="border-b border-blue-100 bg-blue-50/40 p-5">
            <h1 className="text-2xl font-bold text-slate-900">Tickets</h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage and track your support tickets
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4 [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <TicektList
                  key={ticket.id}
                  ticket={ticket}
                  selected={selectedTicketId === ticket.id}
                  userRole={user?.role}
                  isUpdatingStatus={isUpdatingStatus}
                  onSelect={() => handleSelectTicket(ticket.id)}
                  onStartDevelopment={() =>
                    dispatch(developerUpdateTicket(ticket.id))
                  }
                  onResolve={() => dispatch(resolveTicket(ticket.id))}
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
          <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white">
            <div className="shrink-0 border-b border-blue-100 bg-blue-50/30 p-5 flex justify-between items-center">
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
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
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
            <div className="min-h-0 flex-1 overflow-y-auto p-3 scrollbar-none">
              {isDetailsLoading ? (
                <p className="p-6 text-sm text-slate-500">
                  Loading ticket details...
                </p>
              ) : detailsError ? (
                <p className="p-6 text-sm text-rose-600">{detailsError}</p>
              ) : ticketDetails ? (
                <>
                  {activeTab === "overview" && (
                    <TicketMetaCards ticketDetails={ticketDetails} />
                  )}

                  {activeTab === "people" && (
                    <div className="rounded-2xl border border-blue-100 bg-white p-3">
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
                        <div className="flex gap-4 overflow-x-auto pb-2">
                          <TicketAttachments
                            attachments={ticketDetails.attachments}
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
