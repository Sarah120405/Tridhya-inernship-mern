import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getBookingsForEvents,
} from "./booking.service.js";

export async function createBookingController(req, res) {
  try {
    console.log("req.params:", req.params);
    console.log("req.body:", req.body);
    const booking = await createBooking(req.user.id, req.params.id);
    res.status(201).json(booking);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getMyBookingsController(req, res) {
  try {
    const bookings = await getMyBookings(req.user.id);
    res.status(200).json(bookings);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function cancelBookingController(req, res) {
  try {
    const deletedBooking = await cancelBooking(
      req.user.id,
      req.params.bookingId,
    );
    res.status(200).json(deletedBooking);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getBookingsForEventsController(req, res) {
  try {
    const bookings = await getBookingsForEvents(req.params.eventId);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}
