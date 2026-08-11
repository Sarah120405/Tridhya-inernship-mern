import Link from "next/link";
import { FiCalendar, FiPlus } from "react-icons/fi";
export default function NewEventForm() {
  return (
    <Link
      href="/dashboard/admin/event/new"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="mb-2 text-lg font-semibold text-slate-900">
        Create New Event
      </h2>

      <div className="flex h-[240px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-violet-300 bg-gradient-to-br from-violet-50 via-purple-50 to-white p-4 text-center">
        <div className="relative mb-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg">
            <FiCalendar size={36} />
          </div>
          <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg">
            <FiPlus size={18} />
          </div>
        </div>
        <h3 className="text-md font-semibold text-slate-900">
          Create an Event
        </h3>

        <p className="mt-3 text-xs leading-6 text-slate-500">
          Create and publish a new event in a few simple steps.
        </p>

        <div className="mt-2 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-2 py-1 font-medium text-white text-xs transition-all duration-200 hover:scale-105 hover:shadow-lg">
          <FiPlus />
          Create Event
        </div>
      </div>
    </Link>
  );
}
