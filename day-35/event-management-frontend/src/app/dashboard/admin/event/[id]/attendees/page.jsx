"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiUsers,
  FiSearch,
  FiDownload,
  FiMail,
  FiCalendar,
  FiArrowLeft,
} from "react-icons/fi";

export default function AttendeesPage() {
  const { id } = useParams();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch(`http://localhost:5000/api/booking/events/${id}/attendees`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setBookings)
      .finally(() => setLoading(false));
  }, [id]);

  const filteredBookings = bookings.filter((booking) =>
    booking.bookedBy.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-32 rounded-2xl bg-slate-100 animate-pulse" />

        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="rounded-2xl bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-600 p-8 text-white shadow-lg">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Event Attendees</h1>

            <p className="text-purple-100 mt-2">
              View everyone registered for this event.
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur rounded-xl px-6 py-4">
            <p className="text-sm text-purple-100">Total Attendees</p>

            <h2 className="text-3xl font-bold">{filteredBookings.length}</h2>
          </div>
        </div>
      </div>

      {/* Toolbar */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-wrap gap-4 justify-between">
        <div className="relative flex-1 min-w-[260px]">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search attendee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-white hover:bg-violet-700 transition"
        >
          <FiArrowLeft />
          Back
        </button>
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50 text-slate-600 uppercase text-sm">
            <tr>
              <th className="px-6 py-4 text-left">Attendee</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Booked On</th>
              <th className="px-6 py-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="border-t hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center font-semibold">
                        {booking.bookedBy.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">
                          {booking.bookedBy.name}
                        </p>

                        <p className="text-sm text-slate-500">Attendee</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-600">
                      <FiMail />
                      {booking.bookedBy.email}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-600">
                      <FiCalendar />

                      {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                      Confirmed
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <FiUsers className="mx-auto text-5xl text-slate-300 mb-4" />

                  <h3 className="text-lg font-semibold text-slate-700">
                    No attendees found
                  </h3>

                  <p className="text-slate-500 mt-2">
                    This event doesn't have any registrations yet.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
