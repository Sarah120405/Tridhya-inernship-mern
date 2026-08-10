import express from "express";
import {
  createBookingController,
  getMyBookingsController,
  cancelBookingController,
  getBookingsForEventsController,
} from "./booking.controller.js";
import { requireAuth, requireAdmin } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { objectIdSchema } from "./booking.validator.js";
import z from "zod";

const router = express.Router();
const eventIdParamsSchema = z.object({ id: objectIdSchema });

router.post(
  "/events/:id",
  requireAuth,
  validate(eventIdParamsSchema, "params"),
  createBookingController,
);
router.get("/my-bookings", requireAuth, getMyBookingsController);
router.get(
  "/events/:eventId/attendees",
  requireAuth,
  getBookingsForEventsController,
);
router.delete("/:bookingId", requireAuth, cancelBookingController);

export default router;
