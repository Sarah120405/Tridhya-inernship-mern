"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Heart, Calendar, MapPin, Users, Tag } from "lucide-react";
import Link from "next/link";

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [booking, setBooking] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/event/${id}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [id, bookingStatus]);

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

  async function handleBook() {
    setBooking(true);
    setBookingStatus(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/booking/events/${id}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setBookingStatus({
          type: "error",
          message: data.error || "Booking failed",
        });
        return;
      }

      setBookingStatus({ type: "success", message: "Booked successfully!" });
    } catch (err) {
      setBookingStatus({
        type: "error",
        message: "Something went wrong. Try again.",
      });
    } finally {
      setBooking(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="h-56 rounded-2xl bg-zinc-200 animate-pulse mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            <div className="h-8 bg-zinc-200 rounded w-2/3 animate-pulse" />
            <div className="h-4 bg-zinc-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-zinc-200 rounded w-5/6 animate-pulse" />
          </div>
          <div className="h-64 bg-zinc-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="max-w-6xl mx-auto py-16 px-4 text-center">
        <p className="text-rose-500 text-sm">
          Couldn't load this event — {error.message}
        </p>
      </div>
    );

  if (!event) return null;

  const isFavorited = favorites.has(event._id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <div className="text-sm text-slate-500 mb-4">
        <Link href="/dashboard/events" className="hover:text-indigo-600">
          Events
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{event.title}</span>
      </div>
      <div className="grid lg:grid-cols-3 gap-8 flex flex-col items-start">
        <div className="lg:col-span-2 bg-white rounded-2xl border p-6 relative h-full">
          {event.category && (
            <span className="absolute top-4 left-4 flex items-center gap-1 bg-purple-600 text-white-700 text-xs font-medium px-3 py-1 rounded-full">
              <Tag className="w-3 h-3" />
              {event.category}
            </span>
          )}
          <button
            onClick={async (e) => {
              e.preventDefault();
              await handleFavoriteClick(event._id);
            }}
            className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center hover:scale-105 transition"
            aria-label="Save event"
          >
            <Heart
              className={`w-4 h-4 text-pink-500 ${isFavorited ? "fill-current" : ""}`}
            />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-700 mt-10 mb-4 leading-tight">
            {event.title}
          </h1>
          <h2 className="text-sm font-semibold uppercase text-zinc-400 mb-3">
            About this event
          </h2>
          <p className="text-zinc-600 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
          <div className="flex items-center justify-between pt-4 mt-2 border-t">
            <div className="flex items-center gap-1.5 text-sm text-zinc-500">
              <Heart className="w-3.5 h-3.5 text-pink-400 fill-current" />
              <span>{event.favoriteCount ?? 0} favorited</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-semibold text-purple-700 shrink-0">
                  {event.createdBy?.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Organized by</p>
                  <p className="text-sm font-medium text-zinc-700">
                    {event.createdBy?.name || "Unknown"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Date</p>
                  <p className="text-zinc-700 font-medium">
                    {new Date(event.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking sidebar */}
        <div className="lg:sticky lg:top-6 bg-white rounded-2xl border p-6 flex flex-col gap-4 h-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-zinc-400">Location</p>
                <p className="text-zinc-700 font-medium">{event.location}</p>
              </div>
            </div>
            {event.capacity != null && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Capacity</p>
                  <p className="text-zinc-700 font-medium">{event.capacity}</p>
                </div>
              </div>
            )}
          </div>
          {event.bookings != null &&
            event.capacity != null &&
            event.capacity > 0 && (
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-zinc-400">Tickets Sold</p>
                      <p className="text-zinc-700 font-medium text-xs">
                        {event.bookings} / {event.capacity}
                      </p>
                    </div>
                  </div>
                </div>

                {(() => {
                  const percent = Math.min(
                    100,
                    Math.round((event.bookings / event.capacity) * 100),
                  );
                  const isAlmostFull = percent >= 80;

                  return (
                    <div>
                      <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isAlmostFull
                              ? "bg-gradient-to-r from-orange-500 to-rose-500"
                              : "bg-gradient-to-r from-purple-600 to-pink-500"
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      {isAlmostFull && (
                        <p className="text-xs text-rose-500 mt-1">
                          {percent >= 100
                            ? "Sold out"
                            : "Almost full — book soon"}
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          {event.price != null && (
            <div className="flex items-center justify-between pt-2 border-t text-sm">
              <span className="text-zinc-400">Price</span>
              <span className="text-lg font-bold text-zinc-900">
                {event.price === 0 ? "Free" : `₹${event.price}`}
              </span>
            </div>
          )}
          <button
            onClick={handleBook}
            disabled={booking}
            className="w-full rounded-full text-white font-medium py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 disabled:opacity-50 transition"
          >
            {booking ? "Booking..." : "Book Now"}
          </button>
          {bookingStatus && (
            <p
              className={`text-sm text-center ${
                bookingStatus.type === "success"
                  ? "text-emerald-600"
                  : "text-rose-600"
              }`}
            >
              {bookingStatus.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
