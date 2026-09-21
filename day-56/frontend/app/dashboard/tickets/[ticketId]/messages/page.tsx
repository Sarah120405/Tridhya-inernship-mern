"use client";
import { FiMessageSquare, FiRefreshCw, FiSend, FiZap } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/store";
import { useEffect, useRef, useState } from "react";
import {
  createTicketMessage,
  fetchTicketMessage,
} from "../../../../store/slice/messageSlice";
import { useParams } from "next/navigation";
import { fetchTicketDetails } from "../../../../store/slice/ticketSlice";
import {
  agentAssistance,
  clearAgentAssistance,
} from "../../../../store/slice/aiSlice";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="break-words text-sm font-medium text-slate-800 sm:max-w-[65%] sm:text-right">
        {value}
      </span>
    </div>
  );
}

function getMessageDateKey(date: string | Date) {
  const messageDate = new Date(date);

  return [
    messageDate.getFullYear(),
    messageDate.getMonth(),
    messageDate.getDate(),
  ].join("-");
}

function formatMessageDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatMessageTime(date: string | Date) {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const STATUS_STYLES: Record<string, string> = {
  OPEN: "bg-blue-50 text-blue-700",
  IN_PROGRESS: "bg-violet-50 text-violet-700",
  RESOLVED: "bg-emerald-50 text-emerald-700",
  CLOSED: "bg-slate-100 text-slate-600",
};
const PRIORITY_STYLES: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-amber-50 text-amber-700",
  HIGH: "bg-orange-50 text-orange-700",
  URGENT: "bg-red-50 text-red-700",
};
const CHIP = "rounded-full px-3 py-1 text-xs font-medium";
const FALLBACK = "bg-slate-100 text-slate-600";

export default function MessagePage() {
  const [messageContent, setMessageContent] = useState("");
  const [isAiDraftUsed, setIsAiDraftUsed] = useState(false);
  const params = useParams<{ ticketId: string }>();
  const ticketId = params.ticketId;
  const { messages, isLoading, fetchError, isSending, sendError } = useSelector(
    (state: RootState) => state.message,
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const { ticketDetails } = useSelector((state: RootState) => state.ticket);
  const aiDraft = useSelector((state: RootState) => state.ai.agentAssistance);
  const { isAgentAssistanceLoading, agentAssistanceError } = useSelector(
    (state: RootState) => state.ai,
  );
  const dispatch = useDispatch<AppDispatch>();
  const currentUserId = user?.id;
  useEffect(() => {
    dispatch(fetchTicketDetails(ticketId));
    dispatch(fetchTicketMessage(ticketId));
  }, [dispatch, ticketId]);

  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleSendMessage = async () => {
    const content = messageContent.trim();

    if (!content || isSending) return;

    try {
      dispatch(
        createTicketMessage({
          ticketId,
          content,
          aiSuggestionUsed: isAiDraftUsed,
          ...(isAiDraftUsed && aiDraft ? { aiSuggestion: aiDraft } : {}),
        }),
      );

      setMessageContent("");
      setIsAiDraftUsed(false);
      dispatch(clearAgentAssistance());
    } catch {}
  };
  return (
    <div className="h-full min-h-0 p-4 lg:p-6">
      <div className="mb-4 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-700">
            <FiMessageSquare />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Ticket #{ticketDetails?.ticketNumber}
            </p>

            <h2 className="mt-1 truncate text-lg font-semibold text-slate-900">
              {ticketDetails?.title}
            </h2>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`${CHIP} bg-slate-100 text-slate-700`}>
                {ticketDetails?.category}
              </span>
              <span
                className={`${CHIP} ${PRIORITY_STYLES[ticketDetails?.priority ?? ""] ?? FALLBACK}`}
              >
                {ticketDetails?.priority}
              </span>
              <span
                className={`${CHIP} ${STATUS_STYLES[ticketDetails?.status ?? ""] ?? FALLBACK}`}
              >
                {ticketDetails?.status?.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0">
          {/* Keep your View Attachments link here */}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 items-stretch lg:grid-cols-5 mb-4">
        <div className="relative lg:col-span-3 lg:min-h-[28rem]">
          <div className="flex h-[32rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:absolute lg:inset-0 lg:h-auto">
            <div className="shrink-0 border-b border-slate-100 px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Conversation
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Messages related to this ticket
                  </p>
                </div>

                {user?.role === "SupportAgent" && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAiDraftUsed(false);
                      dispatch(agentAssistance(ticketId));
                    }}
                    disabled={isAgentAssistanceLoading}
                    className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isAgentAssistanceLoading ? (
                      <>
                        <FiRefreshCw className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FiZap />
                        Generate AI Reply
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
            {user?.role === "SupportAgent" && agentAssistanceError && (
              <div className="mx-4 mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {agentAssistanceError}
              </div>
            )}

            {user?.role === "SupportAgent" && aiDraft && (
              <div className="mx-4 mt-4 rounded-xl border border-indigo-200 bg-indigo-50/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-semibold text-indigo-900">
                    <FiZap />
                    AI Reply Draft
                  </div>

                  <span className="text-xs text-indigo-700">
                    Confidence: {Math.round(aiDraft.confidence * 100)}%
                  </span>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {aiDraft.suggestedResponse}
                </p>

                {aiDraft.escalationRecommended && (
                  <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                    <p className="font-semibold">Escalation recommended</p>
                    {aiDraft.escalationReason && (
                      <p className="mt-1">{aiDraft.escalationReason}</p>
                    )}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMessageContent(aiDraft.suggestedResponse);
                      setIsAiDraftUsed(true);
                    }}
                    className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                  >
                    Use this draft
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAiDraftUsed(false);
                      dispatch(agentAssistance(ticketId));
                    }}
                    disabled={isAgentAssistanceLoading}
                    className="rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50 disabled:opacity-50"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            )}
            <div
              ref={listRef}
              className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] bg-slate-50 p-4 sm:p-6"
            >
              {isLoading ? (
                <div className="flex h-full min-h-40 items-center justify-center">
                  <p className="text-sm font-medium text-slate-500">
                    Loading messages...
                  </p>
                </div>
              ) : fetchError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {fetchError}
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full min-h-40 flex-col items-center justify-center text-center">
                  <FiMessageSquare className="mb-3 text-3xl text-blue-300" />
                  <p className="font-medium text-slate-700">No messages yet</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Start the conversation by sending a message.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {messages.map((message, index) => {
                    const currentDateKey = getMessageDateKey(message.createdAt);

                    const previousMessage = messages[index - 1];

                    const isNewDay =
                      index === 0 ||
                      getMessageDateKey(previousMessage.createdAt) !==
                        currentDateKey;
                    const isOwnMessage = message.senderId === currentUserId;

                    return (
                      <div key={message.id}>
                        {isNewDay && (
                          <div className="mb-4 flex items-center gap-3">
                            <div className="h-px flex-1 bg-slate-200" />

                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
                              {formatMessageDate(message.createdAt)}
                            </span>

                            <div className="h-px flex-1 bg-slate-200" />
                          </div>
                        )}

                        <div
                          className={`flex w-full ${
                            isOwnMessage ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`flex max-w-[95%] gap-3 sm:max-w-[85%] ${
                              isOwnMessage ? "flex-row-reverse" : "flex-row"
                            }`}
                          >
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                                isOwnMessage
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {message.sender?.name
                                .trim()
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            {/* Message */}
                            <div
                              className={`flex min-w-0 flex-col ${isOwnMessage ? "items-end" : "items-start"}`}
                            >
                              <div
                                className={`mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 ${
                                  isOwnMessage ? "justify-end" : "justify-start"
                                }`}
                              >
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                  <span className="text-sm font-semibold text-slate-800">
                                    {isOwnMessage ? "You" : message.sender.name}
                                  </span>
                                  {!isOwnMessage && (
                                    <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                                      {message.sender.role}
                                    </span>
                                  )}
                                  <span className="text-xs text-slate-400">
                                    {formatMessageTime(message.createdAt)}
                                  </span>
                                </div>
                                {message.isAIGenerated && (
                                  <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
                                    AI Generated
                                  </span>
                                )}
                              </div>

                              <div
                                className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                                  isOwnMessage
                                    ? "rounded-tr-sm bg-blue-50 border border-blue-100 text-slate-800"
                                    : "rounded-tl-sm border border-slate-200 bg-white text-slate-700"
                                }`}
                              >
                                {message.content}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="shrink-0 border-t border-slate-200 bg-white p-4 flex items-end gap-3">
              <textarea
                id="content"
                name="content"
                value={messageContent}
                onChange={(event) => setMessageContent(event.target.value)}
                placeholder="Explain what happened, what you expected, and any steps you've already tried..."
                rows={2}
                maxLength={500}
                className="flex-1 min-w-0 resize-none rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              {sendError && (
                <p className="mt-2 text-sm text-red-600">{sendError}</p>
              )}
              <div className="flex shrink-0 flex-col items-center justify-between gap-2">
                <span className="text-xs text-slate-400">
                  {messageContent.length}/500
                </span>

                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!messageContent.trim() || isSending}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={isSending ? "Sending message" : "Send message"}
                >
                  {isSending ? "..." : <FiSend />}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <div className="border-b border-slate-200 px-5 py-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Ticket Details
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {ticketDetails?.createdAt
                ? `Created ${formatMessageDate(ticketDetails.createdAt)}, ${formatMessageTime(ticketDetails.createdAt)}`
                : "Loading…"}
            </p>
          </div>
          <div className="space-y-6 p-5">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {ticketDetails?.title}
              </h2>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Description
              </h3>
              <p className="mt-2 max-h-60 overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {ticketDetails?.description}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                People & Assignment
              </h3>

              <div className="mt-3 space-y-3">
                <DetailRow
                  label="Customer"
                  value={
                    ticketDetails?.customer?.name ??
                    ticketDetails?.customerId ??
                    "Not available"
                  }
                />

                <DetailRow
                  label="Assigned Agent"
                  value={
                    ticketDetails?.assignedAgent?.name ??
                    ticketDetails?.assignedAgentId ??
                    "Not assigned"
                  }
                />

                <DetailRow
                  label="Assigned Developer"
                  value={
                    ticketDetails?.assignedDeveloper?.name ??
                    ticketDetails?.assignedDeveloperId ??
                    "Not assigned"
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
