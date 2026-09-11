import z from "zod";

const categories = [
  "TECHNICAL",
  "BILLING",
  "ACCOUNT",
  "FEATURE_REQUEST",
  "GENERAL_INQUIRY",
  "OTHER",
] as const;

const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

const aiSuggestionSchema = z.object({
  suggestedCategory: z.enum(categories),
  suggestedPriority: z.enum(priorities),
  confidence: z.number().min(0).max(1),
  reasoning: z.string().trim().min(1),
});

const createTicketSchema = z
  .object({
    title: z.string().trim().min(4).max(100),
    description: z.string().trim().min(1).max(1000),
    category: z.enum(categories).optional(),
    priority: z.enum(priorities).optional(),

    aiSuggestionUsed: z.preprocess((value) => {
      if (value === "true") return true;
      if (value === "false") return false;

      return value;
    }, z.boolean().default(false)),

    aiSuggestion: aiSuggestionSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.aiSuggestionUsed) {
      if (!data.aiSuggestion) {
        ctx.addIssue({
          code: "custom",
          path: ["aiSuggestion"],
          message: "AI suggestion is required when aiSuggestionUsed is true.",
        });
      }
    } else {
      if (!data.category) {
        ctx.addIssue({
          code: "custom",
          path: ["category"],
          message: "Category is required when AI suggestion is not used.",
        });
      }

      if (!data.priority) {
        ctx.addIssue({
          code: "custom",
          path: ["priority"],
          message: "Priority is required when AI suggestion is not used.",
        });
      }
    }
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
