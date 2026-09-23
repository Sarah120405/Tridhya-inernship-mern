import { PRIORITY_STYLES } from "../../utils/ticketStyles";

export default function TicketMetaCards({ ticketDetails }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-blue-100 bg-white p-4">
          <p className="text-xs font-medium text-slate-500">Priority</p>
          <span
            className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
              PRIORITY_STYLES[ticketDetails.priority] ??
              "bg-slate-100 text-slate-600"
            }`}
          >
            {ticketDetails.priority}
          </span>
        </div>

        <div className="rounded-xl border border-blue-100 bg-white p-4">
          <p className="text-xs font-medium text-slate-500">Category</p>
          <p className="mt-2 font-semibold text-slate-800">
            {ticketDetails.category}
          </p>
        </div>
      </div>
      <div className="rounded-2xl border border-blue-100 bg-white p-5">
        <h3 className="font-semibold text-slate-900">Description</h3>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
          {ticketDetails.description}
        </p>
      </div>
    </div>
  );
}
