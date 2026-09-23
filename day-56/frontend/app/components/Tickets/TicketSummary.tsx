import { getTicketStatusClass } from "../../utils/ticketStyles";

export default function TicketSummary({ ticketDetails }) {
  return (
    <>
      <div className="min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Ticket #{ticketDetails.ticketNumber}
          </p>
          <span
            className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${getTicketStatusClass(
              ticketDetails.status,
            )}`}
          >
            {ticketDetails.status.replaceAll("_", " ")}
          </span>
        </div>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          {ticketDetails.title}
        </h2>

        <p className="text-sm text-slate-500">
          Created {new Date(ticketDetails.createdAt).toLocaleString()}
        </p>
      </div>
    </>
  );
}
