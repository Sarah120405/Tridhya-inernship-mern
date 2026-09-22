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
import {
  getTicketStatusClass,
  PRIORITY_STYLES,
} from "../../utils/ticketStyles";
import TicketAssignment from "../../components/Tickets/TicketAssignment";
import {
  assignAgent,
  assignDeveloper,
} from "../../store/slice/assignmentSlice";
import { getDevelopers, getSupportAgents } from "../../store/slice/userSlice";

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

function formatDate(value?: string | Date | null) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

export default function TicketsPage() {
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
    isAssigningDeveloper,
    assignmentError,
    agentAssignmentError,
    isAssigningAgent,
  } = useSelector((state: RootState) => state.assignment);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTickets());
    dispatch(getDevelopers());
    dispatch(getSupportAgents());
  }, [dispatch]);

  const selectedTicket = tickets.find(
    (ticket) => ticket.id === selectedTicketId,
  );

  if (isLoading && tickets.length === 0) {
    return <div className="p-6 text-gray-500">Loading tickets...</div>;
  }

  if (fetchError) {
    return <div className="p-6 text-rose-600">{fetchError}</div>;
  }

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    dispatch(fetchTicketDetails(ticketId));
  };

  const handleAssignDeveloper = async (developerId: string) => {
    if (!ticketDetails) return;

    const result = await dispatch(
      assignDeveloper({
        ticketId: ticketDetails.id,
        developerId,
      }),
    );

    if (assignDeveloper.fulfilled.match(result)) {
      dispatch(fetchTicketDetails(ticketDetails.id));
    }
  };
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
    <div className="h-full min-h-0 p-4 lg:p-4">
      <div
        className={`grid h-full min-h-0 gap-4 ${
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

          <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto p-4">
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
            <div className="min-h-0 flex-1 overflow-y-auto p-5 lg:p-6 scrollbar-none">
              {isDetailsLoading ? (
                <p className="p-6 text-sm text-gray-500">
                  Loading ticket details...
                </p>
              ) : detailsError ? (
                <p className="p-6 text-sm text-rose-600">{detailsError}</p>
              ) : ticketDetails ? (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                          Ticket #{ticketDetails.ticketNumber}
                        </p>

                        <h2 className="mt-2 text-2xl font-bold text-slate-900">
                          {ticketDetails.title}
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                          Created{" "}
                          {new Date(ticketDetails.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${getTicketStatusClass(
                          ticketDetails.status,
                        )}`}
                      >
                        {ticketDetails.status.replaceAll("_", " ")}
                      </span>
                    </div>
                  </div>
                  {/*  priority / category */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-blue-100 bg-white p-4">
                      <p className="text-xs font-medium text-slate-500">
                        Priority
                      </p>
                      <span
                        className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                          PRIORITY_STYLES[ticketDetails.priority] ??
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {ticketDetails.priority}
                      </span>
                    </div>

                    <div className="rounded-xl border border-blue-100 bg-white p-4">
                      <p className="text-xs font-medium text-slate-500">
                        Category
                      </p>
                      <p className="mt-2 font-semibold text-slate-800">
                        {ticketDetails.category}
                      </p>
                    </div>
                  </div>
                  {/* Description */}
                  <div className="rounded-2xl border border-blue-100 bg-white p-5">
                    <h3 className="font-semibold text-slate-900">
                      Description
                    </h3>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                      {ticketDetails.description}
                    </p>
                  </div>

                  {/* People / Assignment */}
                  <div className="rounded-2xl border border-blue-100 bg-white p-5">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        People & Assignment
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Manage the people responsible for this ticket.
                      </p>
                    </div>

                    <TicketAssignment
                      ticket={ticketDetails}
                      user={user}
                      agents={agents}
                      developers={developers}
                      isAssigning={isAssigningDeveloper}
                      onAssign={handleAssignDeveloper}
                      isAssigningAgent={isAssigningAgent}
                      onAgentAssign={handleAssignAgent}
                    />
                  </div>
                  {/* Attachments */}

                  {ticketDetails.attachments &&
                    Array.isArray(ticketDetails.attachments) &&
                    ticketDetails.attachments.length > 0 && (
                      <section className="rounded-xl border border-blue-100 bg-white p-5">
                        <h3 className="mb-4 font-semibold text-slate-900">
                          Attachments
                        </h3>

                        <div className="flex gap-4 overflow-x-auto pb-2">
                          {ticketDetails.attachments.map(
                            (attachment, index) => {
                              // Supports either a string path or an object with a URL/path.
                              const filePath =
                                typeof attachment === "string"
                                  ? attachment
                                  : typeof attachment === "object" &&
                                      attachment !== null &&
                                      "url" in attachment
                                    ? String(attachment.url)
                                    : typeof attachment === "object" &&
                                        attachment !== null &&
                                        "path" in attachment
                                      ? String(attachment.path)
                                      : "";

                              if (!filePath) return null;

                              // Normalize Windows backslashes to forward slashes
                              const normalizedPath = filePath.replace(
                                /\\/g,
                                "/",
                              );

                              // Get only the filename, not the full disk path
                              const fileName =
                                normalizedPath.split("/").pop() ||
                                `Attachment ${index + 1}`;

                              // Build a URL to the Express static uploads route
                              const fileUrl = `http://localhost:5000/uploads/${encodeURIComponent(fileName)}`;

                              const extension = fileName
                                .split(".")
                                .pop()
                                ?.toLowerCase();

                              const isImage = [
                                "jpg",
                                "jpeg",
                                "png",
                                "webp",
                                "gif",
                              ].includes(extension || "");

                              const isPdf = extension === "pdf";

                              return (
                                <div
                                  key={`${filePath}-${index}`}
                                  className="w-64 shrink-0"
                                >
                                  {isImage ? (
                                    <a
                                      href={fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block overflow-hidden rounded-lg border border-blue-100"
                                    >
                                      <img
                                        src={fileUrl}
                                        alt={fileName}
                                        className="h-48 w-full object-cover transition hover:scale-[1.02]"
                                      />
                                    </a>
                                  ) : (
                                    <a
                                      href={fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-3 rounded-lg border border-blue-100 p-3 transition hover:bg-blue-50/40"
                                    >
                                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">
                                        {isPdf ? "PDF" : "FILE"}
                                      </span>
                                      <span className="text-xs text-slate-500">
                                        Open attachment
                                      </span>
                                    </a>
                                  )}
                                </div>
                              );
                            },
                          )}
                        </div>
                      </section>
                    )}

                  {/* Timeline */}
                  <div className="rounded-2xl border border-blue-100 p-5">
                    <h3 className="font-semibold text-slate-900">Timeline</h3>

                    <div className="mt-4 space-y-3">
                      <DetailRow
                        label="Created"
                        value={formatDate(ticketDetails.createdAt)}
                      />
                      <DetailRow
                        label="Last updated"
                        value={formatDate(ticketDetails.updatedAt)}
                      />
                      <DetailRow
                        label="Resolved"
                        value={formatDate(ticketDetails.resolvedAt)}
                      />
                      <DetailRow
                        label="Closed"
                        value={formatDate(ticketDetails.closedAt)}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
