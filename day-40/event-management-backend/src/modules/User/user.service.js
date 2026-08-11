import { Event, Booking, User } from "../../models/index.js";

export async function getAllUsers() {
  const users = await User.find().select("-passwordHash");
  const usersWithCounts = await Promise.all(
    users.map(async (user) => {
      const eventCount = await Event.countDocuments({ createdBy: user._id });
      return { ...user.toObject(), eventCount };
    }),
  );
  return usersWithCounts;
}

export async function getOrganizerStats(organizerId) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const myEvents = await Event.find({ createdBy: organizerId });
  const myEventIds = myEvents.map((e) => e._id);

  const myBookings = await Booking.find({ event: { $in: myEventIds } });

  const totalEvents = myEvents.length;
  const upcomingEvents = myEvents.filter((e) => new Date(e.date) >= now).length;
  const totalBookings = myBookings.length;

  return { totalEvents, upcomingEvents, totalBookings };
}

export async function getAdminStats() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonthDate = new Date(currentYear, currentMonth - 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  function isInMonth(date, month, year) {
    const d = new Date(date);
    return d.getMonth() === month && d.getFullYear() === year;
  }

  function percentChange(current, previous) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  const [allEvents, allBookings, allUsers] = await Promise.all([
    Event.find(),
    Booking.find(),
    User.find(),
  ]);

  const currentMonthEvents = allEvents.filter((e) =>
    isInMonth(e.createdAt, currentMonth, currentYear),
  ).length;
  const lastMonthEvents = allEvents.filter((e) =>
    isInMonth(e.createdAt, lastMonth, lastMonthYear),
  ).length;

  const currentMonthBookings = allBookings.filter((b) =>
    isInMonth(b.createdAt, currentMonth, currentYear),
  ).length;
  const lastMonthBookings = allBookings.filter((b) =>
    isInMonth(b.createdAt, lastMonth, lastMonthYear),
  ).length;

  const currentMonthUsers = allUsers.filter((u) =>
    isInMonth(u.createdAt, currentMonth, currentYear),
  ).length;
  const lastMonthUsers = allUsers.filter((u) =>
    isInMonth(u.createdAt, lastMonth, lastMonthYear),
  ).length;

  const totalEvents = allEvents.length;
  const upcomingEvents = allEvents.filter(
    (e) => new Date(e.date) >= now,
  ).length;
  const totalBookings = allBookings.length;
  const totalUsers = allUsers.length;

  return {
    totalEvents,
    upcomingEvents,
    totalBookings,
    totalUsers,
    trends: {
      event: percentChange(currentMonthEvents, lastMonthEvents),
      bookings: percentChange(currentMonthBookings, lastMonthBookings),
      users: percentChange(currentMonthUsers, lastMonthUsers),
    },
  };
}

export async function getRecentActivity(limit = 5) {
  return Booking.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("bookedBy", "name")
    .populate("event", "title");
}

export async function getBookingTrends() {
  const bookings = await Booking.find();

  const trends = {};
  bookings.forEach((b) => {
    const month = new Date(b.createdAt).toLocaleString("default", {
      month: "short",
    });
    trends[month] = (trends[month] || 0) + 1;
  });

  return Object.entries(trends).map(([month, count]) => ({ month, count }));
}

// user.service.js
export async function updateUserRole(targetUserId, newRole, requestingUserId) {
  if (targetUserId === requestingUserId) {
    const error = new Error("You cannot change your own role");
    error.status = 403;
    throw error;
  }
  const user = await User.findById(targetUserId);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  user.role = newRole;
  await user.save();

  const { passwordHash, ...safeUser } = user.toObject();
  return safeUser;
}
