import z from "zod";

const analyzeTicketSchema = z.object({
  title: z.string().trim().min(4).max(100),
  description: z.string().trim().min(1).max(1000),
  category: z.enum([
    "TECHNICAL",
    "BILLING",
    "ACCOUNT",
    "FEATURE_REQUEST",
    "GENERAL_INQUIRY",
    "OTHER",
  ]),
});
const aiTicketIdParamsSchema = z.object({
  ticketId: z.string().min(1),
});

export { analyzeTicketSchema, aiTicketIdParamsSchema };
