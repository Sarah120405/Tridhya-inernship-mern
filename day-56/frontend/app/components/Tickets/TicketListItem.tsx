import { Ticket } from "../../store/slice/ticketSlice";
import {
  getTicketStatusClass,
  PRIORITY_STYLES,
} from "../../utils/ticketStyles";

interface TicketListItemProps {
  ticket: Ticket;
  selected: boolean;
  userRole?: string;
  isUpdatingStatus: boolean;
  onSelect: () => void;
  onStartDevelopment: () => void;
  onResolve: () => void;
  onClose: () => void;
  onReopen: () => void;
}

export default function TicketListItem({
  ticket,
  selected,
  userRole,
  isUpdatingStatus,
  onSelect,
  onStartDevelopment,
  onResolve,
  onClose,
  onReopen,
}: TicketListItemProps) {
  return (
    <div
      key={ticket.id}
      className={`w-full rounded-xl border p-4 transition-all ${
        selected
          ? "border-blue-400 bg-blue-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/40"
      }`}
    >
      {/* Ticket Information */}
      <button type="button" onClick={onSelect} className="w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {/* Ticket Number */}
            <p className="text-xs font-semibold text-slate-500">
              #TK-{ticket.ticketNumber}
            </p>

            {/* Title */}
            <h2 className="mt-1 truncate font-semibold text-slate-800">
              {ticket.title}
            </h2>

            {/* Description */}
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">
              {ticket.description}
            </p>
          </div>

          {/* Status */}
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getTicketStatusClass(
              ticket.status,
            )}`}
          >
            {ticket.status.replaceAll("_", " ")}
          </span>
        </div>
      </button>

      {/* Bottom Section */}
      <div className="mt-3 flex items-center justify-between gap-3">
        {/* Category + Priority */}
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
            {ticket.category}
          </span>

          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              PRIORITY_STYLES[ticket.priority] ?? "bg-slate-100 text-slate-600"
            }`}
          >
            {ticket.priority}
          </span>
        </div>

        {/* Role Based Actions */}
        <div className="flex flex-wrap gap-2">
          {/* Developer → Start Development */}
          {userRole === "Developer" && ticket.status === "ESCALATED" && (
            <button
              type="button"
              onClick={onStartDevelopment}
              disabled={isUpdatingStatus}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdatingStatus ? "Updating..." : "Start Development"}
            </button>
          )}

          {userRole === "SupportAgent" && ticket.status === "IN_PROGRESS" && (
            <button
              type="button"
              onClick={onResolve}
              disabled={isUpdatingStatus}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdatingStatus ? "Resolving..." : "Mark as Resolved"}
            </button>
          )}

          {/* Developer → Resolve */}
          {userRole === "Developer" && ticket.status === "IN_DEVELOPMENT" && (
            <button
              type="button"
              onClick={onResolve}
              disabled={isUpdatingStatus}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdatingStatus ? "Resolving..." : "Mark as Resolved"}
            </button>
          )}

          {userRole === "Customer" && ticket.status === "RESOLVED" && (
            <div className="flex gap-4 items-center">
              <button
                type="button"
                onClick={onClose}
                disabled={isUpdatingStatus}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdatingStatus ? "Closing..." : "Issue Resolved"}
              </button>
              <button
                type="button"
                onClick={onReopen}
                disabled={isUpdatingStatus}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdatingStatus ? "Updating..." : "Issue still exists"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
