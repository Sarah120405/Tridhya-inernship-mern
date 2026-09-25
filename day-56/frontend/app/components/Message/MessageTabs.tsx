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
    <div className="flex shrink-0 border-b border-slate-200 bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={() => onChange("EXTERNAL")}
        className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
          mode === "EXTERNAL"
            ? "border-blue-600 text-blue-600"
            : "border-transparent text-slate-500 hover:text-slate-700"
        }`}
      >
        <FiMessageSquare className="text-base" />
        Customer Conversation
      </button>

      {canViewInternal && (
        <button
          type="button"
          onClick={() => onChange("INTERNAL")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            mode === "INTERNAL"
              ? "border-amber-500 text-amber-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <FiFileText className="text-base" />
          Internal Notes
        </button>
      )}
    </div>
  );
}
