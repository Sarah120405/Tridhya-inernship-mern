// components/EventCard.jsx
import Link from "next/link";

export default function EventCard({ event, children }) {
  return (
    <div className="border rounded-xl p-4 hover:shadow-md transition flex flex-col gap-2">
      <Link
        href={`/dashboard/events/${event._id}`}
        className="flex justify-between items-start"
      >
        <div>
          <span className="text-xs text-slate-400">
            {new Date(event.date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
          <h3 className="text-lg font-semibold text-slate-800">
            {event.title}
          </h3>
          <p className="text-sm text-slate-500">{event.location}</p>
        </div>
      </Link>
      {children}
    </div>
  );
}
