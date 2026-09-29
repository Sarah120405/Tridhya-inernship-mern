import { FiSend } from "react-icons/fi";
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
    <div className="shrink-0 border-t border-slate-200 bg-white p-3 sm:p-4">
      <div className="flex items-end gap-2 sm:gap-3">
        <div className="min-w-0 flex-1">
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
            className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm leading-5 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          />

          {sendError && (
            <p className="mt-1.5 text-xs text-red-600">{sendError}</p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-center gap-1">
          <span className="text-[11px] text-slate-400">
            {messageContent.length}/500
          </span>

          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!messageContent.trim() || isSending}
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${
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
    </div>
  );
}
