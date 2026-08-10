import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Date must be a valid date string",
  }),
  location: z.string().min(1, "Location is required"),
  capacity: z.number().int().positive().optional(),
  price: z.number().nonnegative().optional(),
  category: z
    .enum(["Music", "Tech", "Sports", "Arts", "Food", "Other"])
    .optional(),
});
