"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Search, Clock, MapPin, Download, Eye, Pencil } from "lucide-react";

const CATEGORY_STYLES = {
  Music: "bg-indigo-50 text-indigo-600",
  "Food & Drink": "bg-orange-50 text-orange-600",
  Comedy: "bg-purple-50 text-purple-600",
  "Art & Culture": "bg-pink-50 text-pink-600",
  Technology: "bg-blue-50 text-blue-600",
  Tech: "bg-blue-50 text-blue-600",
  Sports: "bg-emerald-50 text-emerald-600",
  Arts: "bg-pink-50 text-pink-600",
  Food: "bg-orange-50 text-orange-600",
  Other: "bg-zinc-100 text-zinc-600",
};

export default function ManageEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/event", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setEvents)
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(events.map((e) => e.category).filter(Boolean));
    return ["All Categories", ...Array.from(set)];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.title
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "All Categories" ||
        event.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [events, search, categoryFilter]);

  return (
    <div className="bg-zinc-50">
      <h1 className="text-3xl font-semibold text-slate-500 mb-3">
        Manage Events
      </h1>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white shadow rounded-2xl p-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-violet-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-sm border border-violet-100 rounded-lg px-3 py-2 text-zinc-600"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button className="ml-auto flex items-center gap-2 text-sm font-medium text-purple-600 border border-purple-200 rounded-full px-4 py-2 hover:bg-purple-50">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {loading && <p className="text-slate-400">Loading events...</p>}

      {!loading && (
        <div className="bg-white border border-violet-100 shadow rounded-lg rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-zinc-400 uppercase border-b border-violet-100 rounded-lg bg-white">
                <th className="px-4 py-3 font-medium">Event</th>
                <th className="px-4 py-3 font-medium">Date &amp; Time</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Tickets</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => {
                const dateObj = new Date(event.date);
                const sold = event.bookedCount ?? 0;
                const capacity = event.capacity ?? 0;
                const percent =
                  capacity > 0
                    ? Math.min(100, Math.round((sold / capacity) * 100))
                    : 0;

                return (
                  <tr
                    key={event._id}
                    className="border-b last:border-0 border-violet-100 hover:bg-violet-50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-slate-800">
                            {event.title}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-zinc-600">
                      <p>
                        {dateObj.toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-zinc-400 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {dateObj.toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-zinc-600">
                      <p className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-zinc-400" />
                        {event.location}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      {event.category ? (
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                            CATEGORY_STYLES[event.category] ||
                            CATEGORY_STYLES.Other
                          }`}
                        >
                          {event.category}
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-300">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3 min-w-[110px]">
                      <p className="text-zinc-600 text-xs mb-1">
                        {sold} / {capacity || "—"}
                      </p>
                      {capacity > 0 && (
                        <div className="h-1.5 w-24 bg-zinc-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/admin/event/${event._id}/attendees`}
                          className="flex items-center gap-1 text-xs font-medium text-zinc-500 border rounded-full px-3 py-1.5 hover:bg-zinc-50"
                        >
                          <Eye className="w-3 h-3" /> View
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredEvents.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-zinc-400 text-sm"
                  >
                    No events match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
