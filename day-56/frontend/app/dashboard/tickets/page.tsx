"use client";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { useEffect, useState } from "react";
import {
  fetchTicketDetails,
  fetchTickets,
} from "../../store/slice/ticketSlice";
import Link from "next/link";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="break-all text-sm font-medium text-gray-800 sm:max-w-[65%] sm:text-right">
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
  } = useSelector((state: RootState) => state.ticket);

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTickets());
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

  return (
    <div className="h-full min-h-0 p-4 lg:p-6">
      <div
        className={`grid h-full min-h-0 gap-4 ${
          selectedTicketId
            ? "grid-cols-1 lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.6fr)]"
            : "grid-cols-1"
        }`}
      >
        {/* LEFT: Ticket List */}
        <section className="overflow-hidden rounded-2xl border border-violet-100 bg-white flex min-h-0 flex-col">
          <div className="border-b border-violet-100 p-5">
            <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track your support tickets
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto scrollbar-none p-4">
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => handleSelectTicket(ticket.id)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    selectedTicketId === ticket.id
                      ? "border-[#8B7ED8] bg-violet-50"
                      : "border-gray-100 hover:border-violet-200 hover:bg-violet-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-violet-600">
                        #TK-{ticket.ticketNumber}
                      </p>

                      <h2 className="mt-1 truncate font-semibold text-gray-800">
                        {ticket.title}
                      </h2>

                      <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                        {ticket.description}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-violet-100 px-2.5 py-1 text-xs text-violet-700">
                      {ticket.status}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs text-sky-700">
                      {ticket.category}
                    </span>

                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs text-amber-700">
                      {ticket.priority}
                    </span>
                  </div>
                </button>
              ))}
              {tickets.length === 0 && (
                <p className="py-8 text-center text-sm text-gray-500">
                  No tickets found.
                </p>
              )}
            </div>
          </div>
        </section>
        {/* RIGHT: Selected Ticket */}
        {selectedTicketId && (
          <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-violet-100 bg-white">
            <div className="shrink-0 border-b border-violet-100 p-5">
              <button
                type="button"
                onClick={() => setSelectedTicketId(null)}
                className="mb-1 text-sm font-medium text-violet-600 hover:text-violet-800"
              >
                ← Back to Tickets
              </button>

              <h3 className="text-xl font-semibold text-gray-900">
                Ticket Details
              </h3>
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
                  <div className="flex flex-row justify-between">
                    <div>
                      <h2 className="mt-2 text-2xl font-bold text-gray-900">
                        {ticketDetails.title}
                      </h2>

                      <p className="mt-2 text-sm text-gray-500">
                        Created{" "}
                        {new Date(ticketDetails.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-violet-600">
                        Ticket #{ticketDetails.ticketNumber}
                      </p>
                      <Link
                        href={`/dashboard/tickets/${ticketDetails.id}/messages`}
                      >
                        Message
                      </Link>
                    </div>
                  </div>

                  {/* Status / priority / category */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-4">
                      <p className="text-xs font-medium text-gray-500">
                        Status
                      </p>
                      <p className="mt-2 font-semibold text-violet-700">
                        {ticketDetails.status}
                      </p>
                    </div>

                    <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                      <p className="text-xs font-medium text-gray-500">
                        Priority
                      </p>
                      <p className="mt-2 font-semibold text-amber-700">
                        {ticketDetails.priority}
                      </p>
                    </div>

                    <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-4">
                      <p className="text-xs font-medium text-gray-500">
                        Category
                      </p>
                      <p className="mt-2 font-semibold text-sky-700">
                        {ticketDetails.category}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="rounded-2xl border border-gray-100 p-5">
                    <h3 className="font-semibold text-gray-900">Description</h3>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-600">
                      {ticketDetails.description}
                    </p>
                  </div>

                  {/* People / assignment */}
                  <div className="rounded-2xl border border-gray-100 p-5">
                    <h3 className="font-semibold text-gray-900">
                      People & Assignment
                    </h3>

                    <div className="mt-4 space-y-4">
                      <DetailRow
                        label="Customer"
                        value={
                          ticketDetails.customer?.name ??
                          ticketDetails.customerId ??
                          "Not available"
                        }
                      />

                      <DetailRow
                        label="Assigned Agent"
                        value={
                          ticketDetails.assignedAgent?.name ??
                          ticketDetails.assignedAgentId ??
                          "Not assigned"
                        }
                      />

                      <DetailRow
                        label="Assigned Developer"
                        value={
                          ticketDetails.assignedDeveloper?.name ??
                          ticketDetails.assignedDeveloperId ??
                          "Not assigned"
                        }
                      />
                    </div>
                  </div>

                  {/* Attachments */}

                  {ticketDetails.attachments &&
                    Array.isArray(ticketDetails.attachments) &&
                    ticketDetails.attachments.length > 0 && (
                      <section className="rounded-xl border border-[#EAE5F5] bg-white p-5">
                        <h3 className="mb-4 font-semibold text-[#29243A]">
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
                              console.log("FILE PATH: ", filePath);

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
                                      className="block overflow-hidden rounded-lg border border-[#EAE5F5]"
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
                                      className="flex items-center gap-3 rounded-lg border border-[#EAE5F5] p-3 transition hover:bg-[#FAF8FF]"
                                    >
                                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#F0ECFF] text-sm font-bold text-[#6C5DD3]">
                                        {isPdf ? "PDF" : "FILE"}
                                      </span>

                                      <span className="min-w-0">
                                        <span className="text-xs text-[#817A94]">
                                          Open attachment
                                        </span>
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
                  <div className="rounded-2xl border border-gray-100 p-5">
                    <h3 className="font-semibold text-gray-900">Timeline</h3>

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
