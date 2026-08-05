"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MetricCard } from "@/app/components/MetricCard";
import {
  FiCalendar,
  FiClock,
  FiUsers,
  FiPlusCircle,
  FiTrendingUp,
  FiPlus,
  FiActivity,
  FiUserPlus,
} from "react-icons/fi";
import BookingTrendsChart from "@/app/components/BookingTrendsChart";
export default function AdminDashboardPage() {
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState(null);
  const [bookingTrends, setBookingTrends] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAdminData() {
      try {
        setLoading(true);
        const [statsRes, activityRes, bookingRes] = await Promise.all([
          fetch("http://localhost:5000/api/user/stats", {
            credentials: "include",
          }),
          fetch("http://localhost:5000/api/user/recent-activity", {
            credentials: "include",
          }),
          fetch("http://localhost:5000/api/user/booking-trends", {
            credentials: "include",
          }),
        ]);
        const [statsData, activityData, bookingData] = await Promise.all([
          statsRes.json(),
          activityRes.json(),
          bookingRes.json(),
        ]);
        setStats(statsData);
        setRecentActivity(activityData);
        setBookingTrends(bookingData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAdminData();
  }, []);
  if (loading) return <p className="text-center py-20">Loading...</p>;
  return (
    <div className="max-w-6xl mx-auto py-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Admin Panel</h1>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Total Events"
            value={stats.totalEvents}
            icon={<FiCalendar />}
            icon_2={<FiPlusCircle />}
            trend={`${Math.abs(stats.trends.event)}% from last month`}
            trendDirection={stats.trends.event >= 0 ? "up" : "down"}
          />

          <MetricCard
            title="Upcoming Events"
            value={stats.upcomingEvents}
            icon={<FiClock />}
            icon_2={<FiTrendingUp />}
          />

          <MetricCard
            title="Bookings"
            value={stats.totalBookings}
            icon_2={<FiActivity />}
            trend={`${Math.abs(stats.trends.bookings)}% from last month`}
            trendDirection={stats.trends.bookings >= 0 ? "up" : "down"}
          />

          <MetricCard
            title="Users"
            value={stats.totalUsers}
            icon={<FiUsers />}
            icon_2={<FiUserPlus />}
            trend={`${Math.abs(stats.trends.users)}% from last month`}
            trendDirection={stats.trends.users >= 0 ? "up" : "down"}
          />
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Booking Trend */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Booking Trends
            </h2>

            <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>

          {/* Recharts */}
          <div className="h-[200px]">
            <BookingTrendsChart data={bookingTrends} />
          </div>
        </div>

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
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3">
          Recent Activity
        </h2>
        <div className="flex flex-col gap-2 mb-8">
          {recentActivity.map((booking) => (
            <div key={booking._id} className="text-sm border rounded-lg p-3">
              <span className="font-medium">{booking.bookedBy?.name}</span>{" "}
              booked <span className="font-medium">{booking.event?.title}</span>
              <span className="text-slate-400 ml-2">
                {new Date(booking.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
