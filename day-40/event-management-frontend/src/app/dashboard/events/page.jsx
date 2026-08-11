"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { MapPin, Users, Heart } from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/event/", {
          credentials: "include",
        });
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/favorite", { credentials: "include" })
      .then((res) => res.json())
      .then((favorites) => {
        setFavorites(new Set(favorites.map((f) => f.event._id || f.event)));
      });
  }, []);

  async function handleFavoriteClick(eventId) {
    const response = await fetch(
      `http://localhost:5000/api/favorite/${eventId}`,
      {
        method: "POST",
        credentials: "include",
      },
    );
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json();
    console.log("Favorite status updated:", data);
    setFavorites((prev) => {
      const updated = new Set(prev);
      if (data.favorited) {
        updated.add(eventId);
      } else {
        updated.delete(eventId);
      }
      return updated;
    });
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      <header className="relative overflow-hidden bg-gradient-to-r from-purple-100 to-indigo-50 px-4 py-10">
        <h1 className="text-3xl font-bold text-zinc-900">Explore Events</h1>
        <p className="text-zinc-500 mt-1">
          Discover amazing events happening around you.
        </p>
        <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-purple-200/40 blur-3xl" />
      </header>

      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-zinc-500">
            {loading ? "Loading events..." : `${events.length} Events Found`}
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border overflow-hidden animate-pulse"
              >
                <div className="h-36 bg-zinc-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-zinc-200 rounded w-3/4" />
                  <div className="h-3 bg-zinc-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500">
            Couldn't load events — {error.message}
          </p>
        )}

        {!loading && !error && events.length === 0 && (
          <p className="text-sm text-zinc-400">No events found yet.</p>
        )}

        {!loading && !error && events.length > 0 && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {events.map((event) => {
              const dateObj = new Date(event.date);
              const day = dateObj.getDate();
              const month = dateObj
                .toLocaleString("en-US", { month: "short" })
                .toUpperCase();

              return (
                <li key={event._id}>
                  <Link
                    href={`/dashboard/events/${event._id}`}
                    className="block rounded-2xl border bg-white overflow-hidden hover:shadow-md transition"
                  >
                    <div className="relative  w-full h-40 bg-slate-100">
                      {event.eventBanner ? (
                        <img
                          src={`http://localhost:5000${event.eventBanner}`}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm">
                          No image
                        </div>
                      )}
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          await handleFavoriteClick(event._id);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full px-2 py-1 shadow flex items-center justify-center"
                        aria-label="Save event"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${favorites.has(event._id) ? "fill-current" : ""} text-pink-500`}
                        />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm leading-snug">
                        {event.title}
                      </h3>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col items-start">
                          <p className="flex items-center gap-1 text-xs text-zinc-400 mt-1">
                            <MapPin className="w-3 h-3" /> {event.location}
                          </p>
                          {event.capacity && (
                            <p className="flex items-center gap-1 text-xs text-zinc-400 mt-1">
                              <Users className="w-3 h-3" /> Capacity:
                              {event.capacity}
                            </p>
                          )}
                        </div>
                        <div className="bg-white text-center leading-none">
                          <div className="text-sm font-bold">{day}</div>
                          <div className="text-[10px] text-zinc-500">
                            {month}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 border border-purple-500 text-purple-600 text-xs font-medium text-center rounded-full py-2 hover:bg-purple-50">
                        View Details
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
