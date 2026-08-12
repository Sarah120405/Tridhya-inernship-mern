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

  const myEventIds = await Event.distinct("_id", { createdBy: organizerId });
  const [upcomingEvents, totalBookings] = await Promise.all([
    Event.countDocuments({
      createdBy: organizerId,
      date: { $gte: now },
    }),
    Booking.countDocuments({ event: { $in: myEventIds } }),
  ]);

  return { totalEvents: myEventIds.length, upcomingEvents, totalBookings };
}

export async function getAdminStats() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const endOfLastMonth = new Date(startOfMonth.getTime() - 1);
  const lastMonthDate = new Date(currentYear, currentMonth - 1);

  function percentChange(current, previous) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  const [
    currentMonthEvents,
    lastMonthEvents,
    currentMonthBookings,
    lastMonthBookings,
    currentMonthUsers,
    lastMonthUsers,
    totalEvents,
    upcomingEvents,
    totalBookings,
    totalUsers,
  ] = await Promise.all([
    Event.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: now },
    }),
    Event.countDocuments({
      createdAt: { $gte: lastMonthDate, $lte: endOfLastMonth },
    }),
    Booking.countDocuments({
      createdAt: {
        $gte: startOfMonth,
        $lte: now,
      },
    }),
    Booking.countDocuments({
      createdAt: {
        $gte: lastMonthDate,
        $lte: endOfLastMonth,
      },
    }),
    User.countDocuments({
      createdAt: {
        $gte: startOfMonth,
        $lte: now,
      },
    }),
    User.countDocuments({
      createdAt: {
        $gte: lastMonthDate,
        $lte: endOfLastMonth,
      },
    }),
    Event.countDocuments(),
    Event.countDocuments({ date: { $gte: now } }),
    Booking.countDocuments(),
    User.countDocuments({ role: "user" }),
  ]);

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
  const bookings = await Booking.aggregate([
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return bookings.map((r) => ({
    month: `${monthNames[r._id.month - 1]} ${r._id.year}`,
    count: r.count,
  }));
}

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
