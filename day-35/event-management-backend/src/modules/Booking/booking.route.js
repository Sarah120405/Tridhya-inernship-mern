import express from "express";
import {
  createBookingController,
  getMyBookingsController,
  cancelBookingController,
  getBookingsForEventsController,
} from "./booking.controller.js";
import { requireAuth, requireAdmin } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/events/:id", requireAuth, createBookingController);
router.get("/my-bookings", requireAuth, getMyBookingsController);
router.get(
  "/events/:eventId/attendees",
  requireAuth,
  getBookingsForEventsController,
);
router.delete(
  "/:bookingId",
  requireAuth,
  requireAdmin,
  cancelBookingController,
);

export default router;
