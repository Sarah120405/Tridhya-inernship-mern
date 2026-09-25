import { FiSend, FiFileText, FiMessageSquare } from "react-icons/fi";
import { MessageMode } from "./MessageTabs";

interface MessageComposerProps {
  messageContent: string;
  sendError: string | null;
  isSending: boolean;
  setMessageContent: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  mode: MessageMode;
}

export default function MessageComposer({
  messageContent,
  sendError,
  isSending,
  setMessageContent,
  handleSendMessage,
  mode,
}: MessageComposerProps) {
  return (
    <>
      <div className="shrink-0 border-t border-slate-200 bg-white p-4 flex items-end gap-3">
        <textarea
          id="content"
          name="content"
          value={messageContent}
          onChange={(event) => setMessageContent(event.target.value)}
          placeholder={
            mode === "EXTERNAL"
              ? "Reply to the customer..."
              : "Add an internal note for the support team..."
          }
          rows={2}
          maxLength={500}
          className="flex-1 min-w-0 resize-none rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        {sendError && <p className="mt-2 text-sm text-red-600">{sendError}</p>}
        <div className="flex shrink-0 flex-col items-center justify-between gap-2">
          <span className="text-xs text-slate-400">
            {messageContent.length}/500
          </span>

          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!messageContent.trim() || isSending}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${
              mode === "EXTERNAL"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-amber-500 hover:bg-amber-600"
            }`}
            aria-label={
              isSending
                ? mode === "EXTERNAL"
                  ? "Sending message"
                  : "Adding internal note"
                : mode === "EXTERNAL"
                  ? "Send message"
                  : "Add internal note"
            }
          >
            {isSending ? "..." : <FiSend />}
          </button>
        </div>
      </div>
    </>
  );
}
