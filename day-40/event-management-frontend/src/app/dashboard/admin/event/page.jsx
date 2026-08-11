"use client";
import { useEffect, useState, useMemo } from "react";
import {
  Search,
  Clock,
  MapPin,
  Download,
  Eye,
  Pencil,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

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
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [openMenuId, setOpenMenuId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/event", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setEvents)
      .finally(() => setLoading(false));
  }, []);

  const visibleEvents =
    user?.role === "admin"
      ? events
      : events.filter(
          (e) => e.createdBy === user?._id || e.createdBy?._id === user?._id,
        );

  const categories = useMemo(() => {
    const set = new Set(visibleEvents.map((e) => e.category).filter(Boolean));
    return ["All Categories", ...Array.from(set)];
  }, [visibleEvents]);

  const filteredEvents = useMemo(() => {
    return visibleEvents.filter((event) => {
      const matchesSearch = event.title
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "All Categories" ||
        event.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [visibleEvents, search, categoryFilter]);

  function handleView(eventId) {
    router.push(`/dashboard/admin/event/${eventId}/attendees`);
    setOpenMenuId(null);
  }

  function handleEdit(eventId) {
    router.push(`/dashboard/admin/event/${eventId}/edit`);
    setOpenMenuId(null);
  }

  async function handleDelete(eventId) {
    if (
      !confirm(
        "Are you sure you want to delete this event? This cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/event/${eventId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete event");
        return;
      }
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
    } catch (err) {
      alert("Something went wrong. Try again.");
    } finally {
      setOpenMenuId(null);
    }
  }

  return (
    <div className="bg-zinc-50">
      <h1 className="text-3xl font-semibold text-slate-500 mb-3">
        {user?.role === "admin" ? "Manage Events" : "My Events"}
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
        <div className="bg-white border border-violet-100 shadow rounded-lg rounded-2xl overflow-x-auto">
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

                    <td className="px-4 py-3 text-center relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === event._id ? null : event._id,
                          )
                        }
                        className="text-zinc-400 hover:text-zinc-600"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openMenuId === event._id && (
                        <div className="absolute right-4 top-10 z-10 w-36 rounded-lg border border-slate-200 bg-white shadow-lg">
                          <button
                            onClick={() => handleView(event._id)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-50 rounded-t-lg"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                          <button
                            onClick={() => handleEdit(event._id)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-50"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(event._id)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 rounded-b-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
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
