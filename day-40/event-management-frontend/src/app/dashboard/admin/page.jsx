"use client";
import { useState, useEffect } from "react";
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
import Link from "next/link";
import BookingTrendsChart from "@/app/components/BookingTrendsChart";
import { useAuth } from "@/app/context/AuthContext";
import NewEventForm from "@/app/components/NewEventForm";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState(null);
  const [bookingTrends, setBookingTrends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [organizersRecent, setOrganizersRecent] = useState([]);
  const isAdmin = user.role === "admin";
  useEffect(() => {
    if (!user) return;
    async function fetchDashboardData() {
      try {
        setLoading(true);
        if (isAdmin) {
          const [statsRes, activityRes, bookingRes] = await Promise.all([
            fetch(`http://localhost:5000/api/user/stats`, {
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
        } else {
          const [statsRes, eventsRes] = await Promise.all([
            fetch("http://localhost:5000/api/user/organizer-stats", {
              credentials: "include",
            }),
            fetch("http://localhost:5000/api/event/my-recent", {
              credentials: "include",
            }),
          ]);

          const [statsData, eventsData] = await Promise.all([
            statsRes.json(),
            eventsRes.json(),
          ]);

          setStats(statsData);
          setOrganizersRecent(eventsData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [user]);
  if (loading) return <p className="text-center py-20">Loading...</p>;
  return (
    <div className="max-w-6xl mx-auto py-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          {isAdmin ? "Admin Panel" : "Organizer Panel"}
        </h1>
      </div>

      {stats && (
        <div
          className={`grid grid-cols-2 gap-4 mb-8 ${isAdmin ? "md:grid-cols-4" : "md:grid-cols-3"}`}
        >
          <MetricCard
            title={isAdmin ? "Total Events" : "My Events"}
            value={stats.totalEvents}
            icon={<FiCalendar />}
            icon_2={<FiPlusCircle />}
            trend={
              isAdmin
                ? `${Math.abs(stats.trends.event)}% from last month`
                : undefined
            }
            trendDirection={
              isAdmin ? (stats.trends.event >= 0 ? "up" : "down") : undefined
            }
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
            trend={
              isAdmin
                ? `${Math.abs(stats.trends.bookings)}% from last month`
                : undefined
            }
            trendDirection={
              isAdmin ? (stats.trends.bookings >= 0 ? "up" : "down") : undefined
            }
          />
          {isAdmin && (
            <MetricCard
              title="Users"
              value={stats.totalUsers}
              icon={<FiUsers />}
              icon_2={<FiUserPlus />}
              trend={`${Math.abs(stats.trends.users)}% from last month`}
              trendDirection={stats.trends.users >= 0 ? "up" : "down"}
            />
          )}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {isAdmin ? (
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {/* Booking Trend */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Booking Trends
              </h2>
            </div>

            {/* Recharts */}
            <div className="h-[200px]">
              <BookingTrendsChart data={bookingTrends} />
            </div>
          </div>
        ) : (
          <>
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                My Recent Events
              </h2>
              {organizersRecent.length === 0 ? (
                <p className="text-sm text-slate-400">
                  You haven't created any events yet.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {organizersRecent.map((event) => (
                    <Link
                      key={event._id}
                      href={`/dashboard/events/${event._id}`}
                      className="flex items-center justify-between border rounded-lg p-3 hover:bg-slate-50 transition"
                    >
                      <div>
                        <p className="font-medium text-slate-800">
                          {event.title}
                        </p>
                        <p className="text-sm text-slate-500">
                          {new Date(event.date).toLocaleDateString()}
                          {event.location}
                        </p>
                      </div>
                      <span className="text-xs text-slate-400">
                        {event.category}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        <NewEventForm />
      </div>
      {isAdmin && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3">
            Recent Activity
          </h2>
          <div className="flex flex-col gap-2 mb-8">
            {recentActivity.map((booking) => (
              <div key={booking._id} className="text-sm border rounded-lg p-3">
                <span className="font-medium">{booking.bookedBy?.name}</span>
                booked
                <span className="font-medium">{booking.event?.title}</span>
                <span className="text-slate-400 ml-2">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
