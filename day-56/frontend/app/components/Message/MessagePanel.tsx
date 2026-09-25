import { FiMessageSquare, FiFileText } from "react-icons/fi";
import {
  formatMessageDate,
  formatMessageTime,
  getMessageDateKey,
} from "../../utils/date";
import { MessageMode } from "./MessageTabs";

interface MessagePanelProps {
  listRef: React.RefObject<HTMLDivElement | null>;
  isLoading: boolean;
  fetchError: string | null;
  messages: any[];
  userId?: string;
  mode: MessageMode;
}
export default function MessagePanel({
  listRef,
  isLoading,
  fetchError,
  messages,
  userId,
  mode,
}: MessagePanelProps) {
  return (
    <>
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
            {mode === "EXTERNAL" ? (
              <FiMessageSquare className="mb-3 text-3xl text-blue-300" />
            ) : (
              <FiFileText className="mb-3 text-3xl text-amber-300" />
            )}

            <p className="font-medium text-slate-700">
              {mode === "EXTERNAL"
                ? "No messages yet"
                : "No internal notes yet"}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {mode === "EXTERNAL"
                ? "Start the conversation by sending a message."
                : "Add an internal note for the support team."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {messages.map((message, index) => {
              const currentDateKey = getMessageDateKey(message.createdAt);

              const previousMessage = messages[index - 1];

              const isNewDay =
                index === 0 ||
                getMessageDateKey(previousMessage.createdAt) !== currentDateKey;
              const isOwnMessage = message.sender.id === userId;
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
                        {message.sender?.name.trim().charAt(0).toUpperCase()}
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
    </>
  );
}
