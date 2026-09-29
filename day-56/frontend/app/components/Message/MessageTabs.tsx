import { FiMessageSquare, FiFileText } from "react-icons/fi";

export type MessageMode = "EXTERNAL" | "INTERNAL";

interface MessageTabsProps {
  mode: MessageMode;
  onChange: (mode: MessageMode) => void;
  canViewInternal: boolean;
}

export default function MessageTabs({
  mode,
  onChange,
  canViewInternal,
}: MessageTabsProps) {
  return (
    <div className="flex shrink-0 border-b border-slate-200 bg-white px-2 sm:px-6">
      <button
        type="button"
        onClick={() => onChange("EXTERNAL")}
        className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 border-b-2 px-2 py-3 text-center text-xs font-semibold transition sm:gap-2 sm:px-4 sm:text-sm ${
          mode === "EXTERNAL"
            ? "border-blue-600 text-blue-600"
            : "border-transparent text-slate-500 hover:text-slate-700"
        }`}
      >
        <FiMessageSquare className="shrink-0 text-sm sm:text-base" />
        <span>Customer Conversation</span>
      </button>

      {canViewInternal && (
        <button
          type="button"
          onClick={() => onChange("INTERNAL")}
          className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 border-b-2 px-2 py-3 text-center text-xs font-semibold transition sm:gap-2 sm:px-4 sm:text-sm ${
            mode === "INTERNAL"
              ? "border-amber-500 text-amber-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <FiFileText className="shrink-0 text-sm sm:text-base" />
          <span>Internal Notes</span>
        </button>
      )}
    </div>
  );
}
