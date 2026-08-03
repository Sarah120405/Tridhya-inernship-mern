import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
  },
  { timestamps: true },
);
bookingSchema.index({ bookedBy: 1, event: 1 }, { unique: true });
export default mongoose.model("Booking", bookingSchema);
