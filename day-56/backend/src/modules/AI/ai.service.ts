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
    7. Do not invent information that is not present in the ticket.`;
  try {
    const AIresponse = await gemini.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",

        responseSchema: {
          type: "object",

          properties: {
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
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw { status: 404, message: "Ticket not found" };
  }

  if (userRole !== "SupportAgent") {
    throw { status: 403, message: "Unauthorized" };
  }
  if (userId !== ticket.assignedAgentId) {
    throw { status: 403, message: "Unauthorized" };
  }
  const ticketMessages = await prisma.message.findMany({
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
  });

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

  const prompt = `You are an AI assistant helping a customer support agent.

    Analyze the ticket and conversation.

    Your tasks:
    1. Draft a professional response that the support agent can send to the customer.
    2. Determine whether the ticket should be escalated to a developer.
    3. If escalation is recommended, explain the reason.
    4. Use only information available in the ticket and conversation.
    5. Do not invent technical details, solutions, policies, timelines, or promises.
    6. Do not directly perform any action such as sending a message or escalating the ticket.
    7. The suggested response should be clear, polite, professional, and relevant to the latest customer message.
    8. If there is not enough information to provide a solution, draft a response asking the customer for the necessary information.
    9. Escalation should be recommended when the issue requires developer/technical investigation or cannot reasonably be handled by the support agent.

    Ticket:
    ${JSON.stringify(ticketContext, null, 2)}

    Conversation:
    ${JSON.stringify(conversationContext, null, 2)}
  `;
  const AIresponse = await gemini.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
    config: {
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
}

export async function developerAssistance(
  ticketId: string,
  userId: string,
  userRole: string,
) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw { status: 404, message: "Ticket not found" };
  }

  if (userRole !== "Developer") {
    throw { status: 403, message: "Unauthorized" };
  }
  if (userId !== ticket.assignedDeveloperId) {
    throw { status: 403, message: "Unauthorized" };
  }
  const ticketMessages = await prisma.message.findMany({
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
  });

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

    Ticket:
    ${JSON.stringify(ticketContext, null, 2)}

    Conversation:
    ${JSON.stringify(conversationContext, null, 2)}
  `;
  const AIresponse = await gemini.models.generateContent({
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
