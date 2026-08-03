import express from "express";
import {
  createBookingController,
  getMyBookingsController,
  cancelBookingController,
} from "./booking.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/events/:id", requireAuth, createBookingController);
router.get("/my-bookings", requireAuth, getMyBookingsController);
router.delete("/:bookingId", requireAuth, cancelBookingController);

export default router;
