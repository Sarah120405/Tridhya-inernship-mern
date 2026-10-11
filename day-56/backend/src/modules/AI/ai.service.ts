import prisma from "../../config/db.config";
import gemini from "../../config/gemini.config";

const category = [
  "TECHNICAL",
  "BILLING",
  "ACCOUNT",
  "FEATURE_REQUEST",
  "GENERAL_INQUIRY",
  "OTHER",
];
const priority = ["LOW", "MEDIUM", "HIGH", "URGENT"];

async function generateAI(
  params: Parameters<typeof gemini.models.generateContent>[0],
) {
  try {
    return await gemini.models.generateContent(params);
  } catch (err) {
    console.error("Gemini request failed:", err);
    throw { status: 503, message: "AI assistance is temporarily unavailable." };
  }
}

export async function ticketSuggestion(ticketData: any) {
  const { title, description, customerCategory } = ticketData;
  if (!title?.trim()) {
    throw {
      status: 400,
      message: "Add title",
    };
  }

  if (!description?.trim()) {
    throw {
      status: 400,
      message: "Add description",
    };
  }

  if (!customerCategory) {
    throw {
      status: 400,
      message: "Add category",
    };
  }
  const prompt = `You are an AI ticket classification assistant for a customer support system.
    Analyze the customer's support ticket and suggest the most appropriate category and priority.
    Customer selected category:
    ${customerCategory}
    Ticket title:
    ${title}
    Ticket description:
    ${description}

    Allowed categories:
    - TECHNICAL
    - BILLING
    - ACCOUNT
    - FEATURE_REQUEST
    - GENERAL_INQUIRY
    - OTHER
    
    Allowed priorities:
    - LOW
    - MEDIUM
    - HIGH
    - URGENT

    Rules:
    1. Choose the category that best describes the actual issue.
    2. Compare the customer's selected category with your analysis.
    3. Suggest the most appropriate priority based on urgency and impact.
    4. HIGH or URGENT should only be used when the issue has meaningful impact, critical functionality failure, security concerns, payment problems, or significant business/customer impact.
    5. Give a confidence score between 0 and 1.
    6. Give a short explanation for your decision.
    7. Do not invent information that is not present in the ticket.
    
    Before suggesting a category or priority, determine whether the ticket
    title and description contain meaningful information about a real customer
    issue.

    Meaningless input includes, but is not limited to:
    - Only special characters or symbols
    - Random letters or keyboard gibberish
    - Random combinations of letters and numbers without understandable meaning
    - Repeated meaningless words or characters
    - Nonsensical phrases that do not describe a problem
    - Placeholder or test text that does not describe an actual issue,
      such as "asdf", "qwerty", or "test" when used without meaningful
      supporting information.
    - Content that is too vague to identify an actual customer problem
    - Do not determine meaningfulness based only on whether the text contains
      dictionary words. Random combinations of valid-looking words can still
      be meaningless if they do not communicate an understandable issue.
      
    Meaningful input should describe an understandable issue, request, question,
    error, failure, or problem that a customer could reasonably submit as a
    support ticket.

    If the title or description is meaningless:
    1. Set isMeaningful to false.
    2. Do not attempt to infer a category or priority from the meaningless content.
    3. Set suggestedCategory to OTHER.
    4. Set suggestedPriority to LOW only as a neutral fallback.
    5. Set confidence to 0.
    6. Explain briefly that the provided content does not contain enough
      meaningful information to classify the ticket.

    If the content is meaningful:
    1. Set isMeaningful to true.
    2. Suggest the most appropriate category.
    3. Suggest the appropriate priority based only on the information provided.
    4. Provide a confidence score between 0 and 1.
    5. Explain the reasoning briefly.
    `;
  try {
    const AIresponse = await generateAI({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",

        responseSchema: {
          type: "object",

          properties: {
            isMeaningful: {
              type: "boolean",
            },
            suggestedCategory: {
              type: "string",
              enum: category,
            },

            suggestedPriority: {
              type: "string",
              enum: priority,
            },
            confidence: {
              type: "number",
            },

            reasoning: {
              type: "string",
            },
          },

          required: [
            "isMeaningful",
            "suggestedCategory",
            "suggestedPriority",
            "confidence",
            "reasoning",
          ],
        },
      },
    });
    if (!AIresponse.text) {
      throw {
        status: 502,
        message: "Gemini returned an empty response.",
      };
    }
    const result = JSON.parse(AIresponse.text);
    if (typeof result.isMeaningful !== "boolean") {
      throw {
        status: 502,
        message: "Gemini returned an invalid meaningful-content result.",
      };
    }
    if (!category.includes(result.suggestedCategory)) {
      throw {
        status: 502,
        message: "Gemini returned an invalid category.",
      };
    }

    if (!priority.includes(result.suggestedPriority)) {
      throw {
        status: 502,
        message: "Gemini returned an invalid priority.",
      };
    }

    if (
      typeof result.confidence !== "number" ||
      result.confidence < 0 ||
      result.confidence > 1
    ) {
      throw {
        status: 502,
        message: "Gemini returned an invalid confidence score.",
      };
    }

    return {
      isMeaningful: result.isMeaningful,
      suggestedCategory: result.suggestedCategory,
      suggestedPriority: result.suggestedPriority,
      confidence: result.confidence,
      reasoning: result.reasoning,
    };
  } catch (error) {
    console.error("Gemini ticket suggestion error:", error);

    if (typeof error === "object" && error !== null && "status" in error) {
      throw error;
    }

    throw {
      status: 502,
      message: "Unable to analyze ticket using AI.",
    };
  }
}

export async function agentAssistance(
  ticketId: string,
  userId: string,
  userRole: string,
) {
  const [ticket, ticketMessages] = await Promise.all([
    prisma.ticket.findUnique({
      where: { id: ticketId },
    }),
    prisma.message.findMany({
      where: { ticketId: ticketId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    }),
  ]);

  if (!ticket) {
    throw { status: 404, message: "Ticket not found" };
  }

  if (userRole !== "SupportAgent") {
    throw { status: 403, message: "Unauthorized" };
  }
  if (userId !== ticket.assignedAgentId) {
    throw { status: 403, message: "Unauthorized" };
  }

  const ticketContext = {
    title: ticket.title,
    description: ticket.description,
    category: ticket.category,
    priority: ticket.priority,
    status: ticket.status,
  };

  const conversationContext = ticketMessages.map((message) => ({
    senderRole: message.sender.role,
    content: message.content,
    createdAt: message.createdAt,
  }));

  const prompt = `You are an AI assistant helping a customer support agent.

    Analyze the ticket and the conversation, then do two things:
    1. Draft a reply the agent can send to the customer.
    2. Decide whether the ticket needs a developer.

    REPLY RULES
    - Use only information in the ticket and conversation. Do not invent technical details, solutions, policies, timelines or promises.
    - Be clear, polite and professional, and respond to the customer's latest message (senderRole "Customer").
    - If information is missing (error message, steps to reproduce, screenshots, account details), ask the customer for it.
    - Do not perform any action yourself, such as sending a message or escalating.

    ESCALATION RULES
    Default to NOT recommending escalation. Support agents are expected to resolve most tickets themselves: how-to and usage questions, account and profile changes,
     billing explanations, feature requests, general inquiries, and anything answerable with standard guidance or by asking the customer for more details.
    
    Set escalationRecommended to true ONLY when at least one of these is clearly true:
    - The customer describes a likely defect, error or integration/API failure that needs investigation of code, logs or data to diagnose.
    - There is data loss, data corruption, a security concern, or an outage affecting the service.
    - The agent has already replied with standard troubleshooting or requested details, and the customer reports the problem persists.

    If escalation is recommended, explain the reason.
    
    Do NOT recommend escalation just because:
    - the category is TECHNICAL or the priority is HIGH or URGENT,
    - the customer sounds frustrated or in a hurry,
    - details are missing (ask the customer first),
    - the ticket is a how-to question or a feature request.

    If you are unsure, set escalationRecommended to false and use the reply to gather the missing information.

    OUTPUT FIELDS
    - suggestedResponse: the draft reply.
    - escalationRecommended: true or false.
    - escalationReason: one or two sentences. If false, briefly say why the agent can handle it.
    - confidence: a number between 0 and 1 (for example 0.85) showing your confidence in the escalation decision.

    Ticket:
    ${JSON.stringify(ticketContext, null, 2)}

    Conversation:
    ${JSON.stringify(conversationContext, null, 2)}
  `;
  const AIresponse = await generateAI({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
    config: {
      temperature: 0.2,
      responseMimeType: "application/json",

      responseSchema: {
        type: "object",

        properties: {
          suggestedResponse: {
            type: "string",
          },
          escalationRecommended: {
            type: "boolean",
          },
          escalationReason: {
            type: "string",
          },
          confidence: {
            type: "number",
          },
        },

        required: [
          "suggestedResponse",
          "escalationRecommended",
          "escalationReason",
          "confidence",
        ],
      },
    },
  });

  try {
    if (!AIresponse.text) {
      throw {
        status: 502,
        message: "Gemini returned an empty response.",
      };
    }
    const result = JSON.parse(AIresponse.text);
    if (
      typeof result.confidence !== "number" ||
      result.confidence < 0 ||
      result.confidence > 1
    ) {
      throw {
        status: 502,
        message: "Gemini returned an invalid confidence score.",
      };
    }

    return {
      suggestedResponse: result.suggestedResponse,
      escalationRecommended: result.escalationRecommended,
      escalationReason: result.escalationReason,
      confidence: result.confidence,
    };
  } catch (error) {
    throw { status: 502, message: "AI returned an unreadable response." };
  }
}

export async function developerAssistance(
  ticketId: string,
  userId: string,
  userRole: string,
) {
  const [ticket, ticketMessages] = await Promise.all([
    prisma.ticket.findUnique({
      where: { id: ticketId },
    }),
    prisma.message.findMany({
      where: { ticketId: ticketId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    }),
  ]);

  if (!ticket) {
    throw { status: 404, message: "Ticket not found" };
  }

  if (userRole !== "Developer") {
    throw { status: 403, message: "Unauthorized" };
  }
  if (userId !== ticket.assignedDeveloperId) {
    throw { status: 403, message: "Unauthorized" };
  }
  const ticketContext = {
    title: ticket.title,
    description: ticket.description,
    category: ticket.category,
    priority: ticket.priority,
    status: ticket.status,
  };

  const conversationContext = ticketMessages.map((message) => ({
    senderId: message.senderId,
    content: message.content,
    createdAt: message.createdAt,
  }));

  const prompt = `You are an AI assistant helping a developer to understand problem customer is facing.

    Analyze the ticket and conversation to convert the entire ticket conversation into a concise technical handoff that helps the developer understand the problem without reading the entire conversation..

    Your tasks:
    1. Provide a summary of the issue customer is facing.
    2. Explain what customer and the support agent observed while analyzing the issue.
    3. Methods or ways they have already tried for trouble shooting.
    4. Identify the most likely area of the system involved, but clearly distinguish evidence-based observations from assumptions. Do not claim a root cause unless the conversation provides sufficient evidence. 
    5. Technical details that developer should know before working.
    6. Suggest developer investigation to start trouble shooting 
    7. The summary should be concise, factual, technical, and useful for a developer investigating the issue.
    8. confidence: a number between 0 and 1 (for example 0.85) showing how confident you are in the accuracy of this summary.

    Ticket:
    ${JSON.stringify(ticketContext, null, 2)}

    Conversation:
    ${JSON.stringify(conversationContext, null, 2)}
  `;
  const AIresponse = await generateAI({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",

      responseSchema: {
        type: "object",

        properties: {
          issueSummary: {
            type: "string",
          },
          observedBehavior: {
            type: "string",
          },
          troubleshootingAttempted: {
            type: "string",
          },
          relevantTechnicalDetails: {
            type: "string",
          },
          customerImpact: {
            type: "string",
          },
          developerInvestigation: {
            type: "string",
          },
          confidence: {
            type: "number",
          },
        },

        required: [
          "issueSummary",
          "observedBehavior",
          "troubleshootingAttempted",
          "relevantTechnicalDetails",
          "customerImpact",
          "developerInvestigation",
          "confidence",
        ],
      },
    },
  });
  if (!AIresponse.text) {
    throw {
      status: 502,
      message: "Gemini returned an empty response.",
    };
  }
  let result;

  try {
    result = JSON.parse(AIresponse.text);
  } catch (error) {
    throw {
      status: 502,
      message: "Gemini returned an invalid JSON response.",
    };
  }
  const requiredStringFields = [
    "issueSummary",
    "observedBehavior",
    "troubleshootingAttempted",
    "relevantTechnicalDetails",
    "customerImpact",
    "developerInvestigation",
  ];

  for (const field of requiredStringFields) {
    if (typeof result[field] !== "string" || result[field].trim() === "") {
      throw {
        status: 502,
        message: `Gemini returned an invalid ${field}.`,
      };
    }
  }
  if (
    typeof result.confidence !== "number" ||
    result.confidence < 0 ||
    result.confidence > 1
  ) {
    throw {
      status: 502,
      message: "Gemini returned an invalid confidence score.",
    };
  }

  const aiSummary = await prisma.aIAnalysis.create({
    data: {
      ticketId: ticket.id,
      type: "DEVELOPER_SUMMARY",
      issueSummary: result.issueSummary,
      observedBehavior: result.observedBehavior,
      troubleshootingAttempted: result.troubleshootingAttempted,
      relevantTechnicalDetails: result.relevantTechnicalDetails,
      customerImpact: result.customerImpact,
      developerInvestigation: result.developerInvestigation,
      confidence: result.confidence,
      summaryUsed: true,
    },
  });

  return aiSummary;
}
