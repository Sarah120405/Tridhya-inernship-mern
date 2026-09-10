import z from "zod";

const createTicketSchema = z.object({
  title: z.string().trim().min(4).max(20),
  description: z.string().trim().min(1).max(100),
  category: z.enum([
    "TECHNICAL",
    "BILLING",
    "ACCOUNT",
    "FEATURE_REQUEST",
    "GENERAL_INQUIRY",
    "OTHER",
  ]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});

const ticketIdParamsSchema = z.object({ id: z.string().min(1) });

/* const assignAgentSchema = z.object({
  agentId: z.string().min(1),
});

const assignDeveloperSchema = z.object({
  developerId: z.string().min(1),
});
 */
export {
  createTicketSchema,
  ticketIdParamsSchema,
  /* assignAgentSchema,
  assignDeveloperSchema, */
};
