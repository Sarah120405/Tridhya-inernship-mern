import { Booking, Event } from "../../models/index.js";

export async function createBooking(userId, eventId) {
  const event = await Event.findById(eventId);
  if (!event) {
    const error = new Error("Event not found");
    error.status = 404;
    throw error;
  }

  if (event.capacity != null) {
    const bookingCount = await Booking.countDocuments({ event: eventId });
    if (bookingCount >= event.capacity) {
      const error = new Error("Event is fully booked");
      error.status = 409;
      throw error;
    }
  }

  const booking = await Booking.create({ bookedBy: userId, event: eventId });
  return booking;
}

export async function getMyBookings(userId) {
  // return all bookings for this user, populated with event details
  const bookings = await Booking.find({ bookedBy: userId }).populate("event");
  return bookings;
}

export async function cancelBooking(userId, bookingId) {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    const error = new Error("Booking not found");
    error.status = 404;
    throw error;
  }

  if (!booking.bookedBy.equals(userId)) {
    const error = new Error("You can only cancel your own bookings");
    error.status = 403;
    throw error;
  }

  return Booking.findByIdAndDelete(bookingId);
}
