import z from "zod";

export const internalMsgSchema = z.object({
  content: z.string().trim().min(1).max(500),
});
