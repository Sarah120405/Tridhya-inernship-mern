"use client";
import { FiMessageSquare, FiRefreshCw, FiZap } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/store";
import { useEffect, useRef, useState } from "react";
import {
  addMessage,
  createTicketMessage,
  fetchTicketMessage,
  Message,
} from "../../../../store/slice/messageSlice";
import { useParams } from "next/navigation";
import { fetchTicketDetails } from "../../../../store/slice/ticketSlice";
import {
  agentAssistance,
  clearAgentAssistance,
  fetchDeveloperAssistance,
} from "../../../../store/slice/aiSlice";
import { socket } from "../../../../lib/socket";
import TicketSummary from "../../../../components/Tickets/TicketSummary";
import TicketAssignment from "../../../../components/Tickets/TicketAssignment";
import {
  getTicketStatusClass,
  PRIORITY_STYLES,
} from "../../../../utils/ticketStyles";
import MessagePanel from "../../../../components/Message/MessagePanel";
import AgentAssistance from "../../../../components/Message/AgentAssistance";
import DeveloperAssistance from "../../../../components/Message/DeveloperAssistance";
import MessageComposer from "../../../../components/Message/MessageComposer";
import MessageTabs, {
  MessageMode,
} from "../../../../components/Message/MessageTabs";
import {
  addInternalMsg,
  createTicketInternalMsg,
  fetchTicketInternalMsg,
  InternalMsg,
} from "../../../../store/slice/internalMsgSlice";

const CHIP = "rounded-full px-3 sm:px-2 py-1 text-xs font-medium";
const FALLBACK = "bg-slate-100 text-slate-600";

export default function MessagePage() {
  const [messageContent, setMessageContent] = useState("");
  const [isAiDraftUsed, setIsAiDraftUsed] = useState(false);
  const [messageMode, setMessageMode] = useState<MessageMode | "INTERNAL">(
    "EXTERNAL",
  );
  const [isAiErrorDismissed, setIsAiErrorDismissed] = useState(false);
  const params = useParams<{ ticketId: string }>();
  const ticketId = params.ticketId;
  const { messages, isLoading, fetchError, isSending, sendError } = useSelector(
    (state: RootState) => state.message,
  );
  const {
    messages: internalMessages,
    isLoading: isInternalLoading,
    fetchError: internalFetchError,
    sendError: internalSendError,
    isSending: isInternalSending,
  } = useSelector((state: RootState) => state.internalMsg);
  const { user } = useSelector((state: RootState) => state.auth);
  const { ticketDetails } = useSelector((state: RootState) => state.ticket);
  const aiDraft = useSelector((state: RootState) =>
    state.ai.agentAssistanceTicketId === ticketId
      ? state.ai.agentAssistance
      : null,
  );
  const {
    isAgentAssistanceLoading,
    agentAssistanceError,
    developerAssistance,
    isLoadingDeveloperAssistance,
    developerAssistanceError,
  } = useSelector((state: RootState) => state.ai);
  const dispatch = useDispatch<AppDispatch>();
  const currentUserId = user?.id;
  const canViewInternal =
    user?.role === "SupportAgent" ||
    user?.role === "Developer" ||
    user?.role === "Admin";

  const effectiveMode: MessageMode = canViewInternal ? messageMode : "EXTERNAL";

  const displayedMessages =
    effectiveMode === "EXTERNAL" ? messages : internalMessages;

  useEffect(() => {
    dispatch(fetchTicketDetails(ticketId));
    dispatch(fetchTicketMessage(ticketId));
  }, [dispatch, ticketId]);

  useEffect(() => {
    if (canViewInternal && messageMode === "INTERNAL") {
      dispatch(fetchTicketInternalMsg(ticketId));
    }
  }, [dispatch, ticketId, messageMode, canViewInternal]);

  useEffect(() => {
    if (!ticketId) return;

    const handleTicketJoined = (data: { ticketId: string; room: string }) => {
      console.log("🔥 JOINED TICKET ROOM:", data);
    };

    const handleTicketError = (error: { message: string }) => {
      console.error("🔥 SOCKET TICKET ERROR:", error.message);
    };

    // External/customer conversation message
    const handleNewMessage = (message: Message) => {
      console.log("🔥 NEW EXTERNAL MESSAGE RECEIVED:", message);

      dispatch(addMessage(message));
    };

    // Internal staff-only message
    const handleNewInternalMessage = (message: InternalMsg) => {
      console.log("🔥 NEW INTERNAL MESSAGE RECEIVED:", message);

      dispatch(addInternalMsg(message));
    };

    const joinRoom = () => {
      console.log("🔥 EMITTING JOIN TICKET:", ticketId);
      socket.emit("joinTicket", ticketId);
    };

    socket.on("ticketJoined", handleTicketJoined);
    socket.on("ticketError", handleTicketError);
    socket.on("newMessage", handleNewMessage);
    socket.on("newInternalMessage", handleNewInternalMessage);
    socket.on("connect", joinRoom);

    if (socket.connected) joinRoom();

    return () => {
      socket.off("ticketJoined", handleTicketJoined);
      socket.off("ticketError", handleTicketError);
      socket.off("newMessage", handleNewMessage);
      socket.off("newInternalMessage", handleNewInternalMessage);
      socket.off("connect", joinRoom);
      if (socket.connected) socket.emit("leaveTicket", ticketId);
    };
  }, [ticketId, dispatch]);

  useEffect(() => {
    const handleReconnect = () => {
      dispatch(fetchTicketMessage(ticketId));
      if (canViewInternal && messageMode === "INTERNAL") {
        dispatch(fetchTicketInternalMsg(ticketId));
      }
    };
    socket.io.on("reconnect", handleReconnect);
    return () => {
      socket.io.off("reconnect", handleReconnect);
    };
  }, [dispatch, ticketId, canViewInternal, messageMode]);

  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [displayedMessages]);

  const displayAIError =
    agentAssistanceError && !aiDraft
      ? "AI suggestion is currently unavailable. Please select the category and priority manually."
      : "";

  const handleSendMessage = async () => {
    const content = messageContent.trim();

    if (!content) return;

    try {
      if (effectiveMode === "EXTERNAL") {
        await dispatch(
          createTicketMessage({
            ticketId,
            content,
            aiSuggestionUsed: isAiDraftUsed,
            ...(isAiDraftUsed && aiDraft ? { aiSuggestion: aiDraft } : {}),
          }),
        ).unwrap();
      } else {
        await dispatch(
          createTicketInternalMsg({
            ticketId,
            content,
          }),
        ).unwrap();
      }

      setMessageContent("");
      setIsAiDraftUsed(false);
      dispatch(clearAgentAssistance());
    } catch {
      // Redux stores the appropriate error
    }
  };

  return (
    <div className="h-full min-h-0 p-4 lg:p-6 space-y-2">
      <div className="mb-4 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-12 w-12 sm:h-8 sm:h-8 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-700">
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
                className={`${CHIP} ${getTicketStatusClass(ticketDetails?.status ?? "") ?? FALLBACK}`}
              >
                {ticketDetails?.status?.replace("_", " ")}
              </span>
            </div>
          </div>
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

                {messageMode === "EXTERNAL" &&
                  user?.role === "SupportAgent" && (
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
              {canViewInternal && (
                <MessageTabs
                  mode={effectiveMode}
                  onChange={setMessageMode}
                  canViewInternal={canViewInternal}
                />
              )}
            </div>
            {user?.role === "SupportAgent" &&
              agentAssistanceError &&
              !isAiErrorDismissed &&
              messageMode === "EXTERNAL" && (
                <div className="mx-4 mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {displayAIError}
                </div>
              )}
            {/* AI Assistance */}
            {messageMode === "EXTERNAL" && !isAiDraftUsed && (
              <AgentAssistance
                user={user}
                aiDraft={aiDraft}
                aiDraftUsed={() => {
                  setMessageContent(aiDraft.suggestedResponse);
                  setIsAiDraftUsed(true);
                }}
                regenerateDraft={() => {
                  setIsAiDraftUsed(false);
                  dispatch(agentAssistance(ticketId));
                }}
                loading={isAgentAssistanceLoading}
              />
            )}
            {/* Message panel */}
            <MessagePanel
              listRef={listRef}
              isLoading={
                effectiveMode === "EXTERNAL" ? isLoading : isInternalLoading
              }
              fetchError={
                effectiveMode === "EXTERNAL" ? fetchError : internalFetchError
              }
              messages={displayedMessages}
              userId={currentUserId}
              mode={effectiveMode}
            />
            {/* Message Composer */}
            <MessageComposer
              messageContent={messageContent}
              sendError={
                effectiveMode === "EXTERNAL" ? sendError : internalSendError
              }
              isSending={
                effectiveMode === "EXTERNAL" ? isSending : isInternalSending
              }
              setMessageContent={setMessageContent}
              handleSendMessage={handleSendMessage}
              mode={effectiveMode}
              onTyping={() => setIsAiErrorDismissed(true)}
            />
          </div>
        </div>
        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <div className="border-b border-slate-200 px-4 py-4">
            {ticketDetails ? (
              <TicketSummary ticketDetails={ticketDetails} />
            ) : (
              <p className="text-sm text-slate-500">
                Loading ticket details...
              </p>
            )}
          </div>
          <div className="space-y-6 p-5">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                People & Assignment
              </h3>

              <TicketAssignment
                ticket={ticketDetails}
                user={user}
                agents={[]}
                developers={[]}
                isAssigning={false}
                onAssign={() => {}}
                isAssigningAgent={false}
                onAgentAssign={() => {}}
                agentAssistance={null}
                showAssignmentControls={false}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Developer Assistance */}
      <DeveloperAssistance
        user={user}
        loading={isLoadingDeveloperAssistance}
        developerAssistance={developerAssistance}
        developerAssistanceError={developerAssistanceError}
        fetchDeveloperAssistance={() =>
          dispatch(fetchDeveloperAssistance(ticketId))
        }
      />
    </div>
  );
}
