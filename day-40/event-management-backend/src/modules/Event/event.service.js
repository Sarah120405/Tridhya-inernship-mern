import Event from "../../models/Event.js";
import Booking from "../../models/Booking.js";
import Favorite from "../../models/Favorite.js";
import { sendEventCancellationNotice } from "../../services/email.service.js";

export async function createEvent(eventData, adminId) {
  const event = await Event.findOne({ title: eventData.title });
  if (event) {
    const error = new Error("An event with this title already exists");
    error.status = 409;
    throw error;
  }
  const newEvent = await Event.create({
    title: eventData.title,
    description: eventData.description,
    date: eventData.date,
    location: eventData.location,
    capacity: eventData.capacity,
    createdBy: adminId,
    price: eventData.price,
    category: eventData.category,
    eventBanner: eventData.eventBanner,
  });
  return newEvent;
}

export async function getEventById(eventId) {
  const event = await Event.findById(eventId);
  if (!event) {
    const notFoundError = new Error("Event not found");
    notFoundError.status = 404;
    throw notFoundError;
  }
  const bookings = await Booking.find({ event: eventId });
  const favoriteCount = await Favorite.countDocuments({ event: eventId });
  return {
    ...event.toObject(),
    bookings: bookings.length,
    favoriteCount: favoriteCount,
  };
}

export async function getAllEvents() {
  try {
    const events = await Event.find();

    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const bookedCount = await Booking.countDocuments({ event: event._id });
        return { ...event.toObject(), bookedCount };
      }),
    );

    return eventsWithCounts;
  } catch (error) {
    throw new Error("Error fetching events");
  }
}
export async function updateEvent(
  eventId,
  userId,
  userRole,
  body,
  newBannerPath,
) {
  const event = await Event.findById(eventId);
  if (!event) {
    const notFoundError = new Error("Event not found");
    notFoundError.status = 404;
    throw notFoundError;
  }
  const isOwner = event.createdBy.equals(userId);
  const isAdmin = userRole === "admin";

  if (!isOwner && !isAdmin) {
    const error = new Error("You can only update your own events");
    error.status = 403;
    throw error;
  }
  const updates = { ...body };
  if (newBannerPath) {
    updates.eventBanner = newBannerPath; // only overwrite if a new file was actually uploaded
  }

  const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, {
    new: true,
  });
  return updatedEvent;
}

export async function deleteEvent(eventId, userId, userRole) {
  const event = await Event.findById(eventId);
  if (!event) {
    const notFoundError = new Error("Event not found");
    notFoundError.status = 404;
    throw notFoundError;
  }
  const isOwner = event.createdBy.equals(userId);
  const isAdmin = userRole === "admin";

  if (!isOwner && !isAdmin) {
    const error = new Error("You can only delete your own events");
    error.status = 403;
    throw error;
  }
  const bookings = await Booking.find({ event: eventId }).populate(
    "bookedBy",
    "email",
  );
  bookings.forEach((booking) => {
    sendEventCancellationNotice(booking.bookedBy.email, event.title).catch(
      (err) => {
        console.error("Failed to send cancellation email:", err.message);
      },
    );
  });
  await Booking.deleteMany({ event: eventId });
  const deletedEvent = await Event.findByIdAndDelete(eventId);
  return { message: "Event deleted successfully" };
}

export async function getMyRecentEvents(organizerId, limit = 5) {
  return Event.find({ createdBy: organizerId })
    .sort({ createdAt: -1 })
    .limit(limit);
}
