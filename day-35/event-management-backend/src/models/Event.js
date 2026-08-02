import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    // your fields here
  },
  { timestamps: true },
);

export default mongoose.model("Event", eventSchema);
