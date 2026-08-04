import Event from "../../models/Event.js";
import Booking from "../../models/Booking.js";
import Favorite from "../../models/Favorite.js";

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
    return events;
  } catch (error) {
    throw new Error("Error fetching events");
  }
}
