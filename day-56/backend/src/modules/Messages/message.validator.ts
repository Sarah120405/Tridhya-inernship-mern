import z from "zod";

const aiSuggestionSchema = z.object({
  suggestedResponse: z.string(),
  escalationRecommended: z.boolean(),
  escalationReason: z.string().nullable(),
  confidence: z.number(),
});

export const messageSchema = z
  .object({
    content: z.string().trim().min(1).max(500).optional(),
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
      if (!data.content) {
        ctx.addIssue({
          code: "custom",
          path: ["content"],
          message:
            "Message content is required when AI suggestion is not used.",
        });
      }
    }
  });
