import {
  PrismaClient,
  Role,
  TicketCategory,
  TicketPriority,
  TicketStatus,
  TicketActivityAction,
} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // --------------------------------------------------
  // 1. CLEAN EXISTING DATA
  // --------------------------------------------------

  await prisma.aIAnalysis.deleteMany();
  await prisma.sLA.deleteMany();
  await prisma.internalNote.deleteMany();
  await prisma.message.deleteMany();
  await prisma.ticketActivity.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Existing test data cleared.");

  // --------------------------------------------------
  // 2. PASSWORD
  // --------------------------------------------------

  const password = await bcrypt.hash("Password@123", 10);

  // --------------------------------------------------
  // 3. USERS
  // --------------------------------------------------

  const admin = await prisma.user.create({
    data: {
      id: "seed-admin",
      name: "System Admin",
      email: "admin@support.com",
      password,
      role: Role.Admin,
      isActive: true,
    },
  });

  const agent1 = await prisma.user.create({
    data: {
      id: "seed-agent-1",
      name: "Sarah Agent",
      email: "agent1@support.com",
      password,
      role: Role.SupportAgent,
      isActive: true,
    },
  });

  const agent2 = await prisma.user.create({
    data: {
      id: "seed-agent-2",
      name: "John Agent",
      email: "agent2@support.com",
      password,
      role: Role.SupportAgent,
      isActive: true,
    },
  });

  const developer1 = await prisma.user.create({
    data: {
      id: "seed-developer-1",
      name: "Alex Developer",
      email: "developer1@support.com",
      password,
      role: Role.Developer,
      isActive: true,
    },
  });

  const developer2 = await prisma.user.create({
    data: {
      id: "seed-developer-2",
      name: "Mike Developer",
      email: "developer2@support.com",
      password,
      role: Role.Developer,
      isActive: true,
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      id: "seed-customer-1",
      name: "Alice Customer",
      email: "customer1@example.com",
      password,
      role: Role.Customer,
      isActive: true,
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      id: "seed-customer-2",
      name: "Bob Customer",
      email: "customer2@example.com",
      password,
      role: Role.Customer,
      isActive: true,
    },
  });

  const customer3 = await prisma.user.create({
    data: {
      id: "seed-customer-3",
      name: "Charlie Customer",
      email: "customer3@example.com",
      password,
      role: Role.Customer,
      isActive: true,
    },
  });

  console.log("👥 Users created.");

  // --------------------------------------------------
  // 4. DATE HELPERS
  // --------------------------------------------------

  const now = new Date();

  const hoursAgo = (hours: number) =>
    new Date(now.getTime() - hours * 60 * 60 * 1000);

  const hoursFromNow = (hours: number) =>
    new Date(now.getTime() + hours * 60 * 60 * 1000);

  // --------------------------------------------------
  // 5. TICKETS
  // --------------------------------------------------

  /*
    Ticket 1
    OPEN
    No assignment yet
    Healthy SLA
  */

  const ticket1 = await prisma.ticket.create({
    data: {
      id: "seed-ticket-1",
      title: "Unable to reset password",
      description:
        "I am unable to reset my account password. The reset link is not working.",
      customerId: customer1.id,
      category: TicketCategory.ACCOUNT,
      priority: TicketPriority.MEDIUM,
      status: TicketStatus.OPEN,
    },
  });

  /*
    Ticket 2
    IN_PROGRESS
    Agent assigned
    First response completed
    Healthy SLA
  */

  const ticket2 = await prisma.ticket.create({
    data: {
      id: "seed-ticket-2",
      title: "Payment failed during checkout",
      description: "My payment failed while trying to purchase a subscription.",
      customerId: customer1.id,
      assignedAgentId: agent1.id,
      category: TicketCategory.BILLING,
      priority: TicketPriority.HIGH,
      status: TicketStatus.IN_PROGRESS,
    },
  });

  /*
    Ticket 3
    IN_PROGRESS
    Agent was reassigned
    Final agent = agent2
  */

  const ticket3 = await prisma.ticket.create({
    data: {
      id: "seed-ticket-3",
      title: "Dashboard loading slowly",
      description: "The customer dashboard takes more than 20 seconds to load.",
      customerId: customer2.id,
      assignedAgentId: agent2.id,
      category: TicketCategory.TECHNICAL,
      priority: TicketPriority.MEDIUM,
      status: TicketStatus.IN_PROGRESS,
    },
  });

  /*
    Ticket 4
    ESCALATED
    Developer assigned
    Agent assignment happened before escalation
  */

  const ticket4 = await prisma.ticket.create({
    data: {
      id: "seed-ticket-4",
      title: "Application crashes after update",
      description:
        "The application crashes immediately after installing the latest update.",
      customerId: customer2.id,
      assignedAgentId: agent1.id,
      assignedDeveloperId: developer1.id,
      category: TicketCategory.TECHNICAL,
      priority: TicketPriority.URGENT,
      status: TicketStatus.ESCALATED,
    },
  });

  /*
    Ticket 5
    IN_DEVELOPMENT
    Developer assigned
    Developer has started work
  */

  const ticket5 = await prisma.ticket.create({
    data: {
      id: "seed-ticket-5",
      title: "Export report generates incorrect data",
      description:
        "The exported monthly report contains incorrect transaction totals.",
      customerId: customer3.id,
      assignedAgentId: agent2.id,
      assignedDeveloperId: developer2.id,
      category: TicketCategory.TECHNICAL,
      priority: TicketPriority.HIGH,
      status: TicketStatus.IN_DEVELOPMENT,
    },
  });

  /*
    Ticket 6
    RESOLVED
    Resolved within SLA
  */

  const ticket6 = await prisma.ticket.create({
    data: {
      id: "seed-ticket-6",
      title: "Unable to update profile information",
      description: "I could not update my profile phone number.",
      customerId: customer3.id,
      assignedAgentId: agent1.id,
      category: TicketCategory.ACCOUNT,
      priority: TicketPriority.LOW,
      status: TicketStatus.RESOLVED,
      resolvedAt: hoursAgo(2),
    },
  });

  /*
    Ticket 7
    RESOLVED
    Resolved AFTER SLA deadline
    Useful for testing late resolution
  */

  const ticket7 = await prisma.ticket.create({
    data: {
      id: "seed-ticket-7",
      title: "Urgent billing issue",
      description: "A duplicate charge appeared on my account.",
      customerId: customer1.id,
      assignedAgentId: agent2.id,
      category: TicketCategory.BILLING,
      priority: TicketPriority.URGENT,
      status: TicketStatus.RESOLVED,
      resolvedAt: hoursAgo(1),
    },
  });

  /*
    Ticket 8
    CLOSED
    Complete lifecycle
  */

  const ticket8 = await prisma.ticket.create({
    data: {
      id: "seed-ticket-8",
      title: "Feature request for dark mode",
      description:
        "Please consider adding dark mode to the customer dashboard.",
      customerId: customer2.id,
      assignedAgentId: agent1.id,
      category: TicketCategory.FEATURE_REQUEST,
      priority: TicketPriority.LOW,
      status: TicketStatus.CLOSED,
      resolvedAt: hoursAgo(48),
      closedAt: hoursAgo(24),
    },
  });

  console.log("🎫 Tickets created.");

  // --------------------------------------------------
  // 6. SLA RECORDS
  // --------------------------------------------------

  /*
    Ticket 1
    Healthy
  */

  await prisma.sLA.create({
    data: {
      ticketId: ticket1.id,
      dueAt: hoursFromNow(48),
      firstResponseDueAt: hoursFromNow(12),
      resolutionDueAt: hoursFromNow(48),
      breached: false,
    },
  });

  /*
    Ticket 2
    Healthy
    First response already happened
  */

  await prisma.sLA.create({
    data: {
      ticketId: ticket2.id,
      dueAt: hoursFromNow(24),
      firstResponseDueAt: hoursAgo(2),
      firstRespondedAt: hoursAgo(3),
      resolutionDueAt: hoursFromNow(24),
      breached: false,
    },
  });

  /*
    Ticket 3
    Healthy
    Useful for reassignment testing
  */

  await prisma.sLA.create({
    data: {
      ticketId: ticket3.id,
      dueAt: hoursFromNow(36),
      firstResponseDueAt: hoursAgo(1),
      firstRespondedAt: hoursAgo(2),
      resolutionDueAt: hoursFromNow(36),
      breached: false,
    },
  });

  /*
    Ticket 4
    First-response SLA breached
    Resolution still within SLA
  */

  await prisma.sLA.create({
    data: {
      ticketId: ticket4.id,
      dueAt: hoursFromNow(8),
      firstResponseDueAt: hoursAgo(6),
      firstRespondedAt: hoursAgo(4),
      resolutionDueAt: hoursFromNow(8),
      breached: false,
    },
  });

  /*
    Ticket 5
    Resolution SLA breached
    Still unresolved
    This is useful for testing slaBreachCheck()
  */

  await prisma.sLA.create({
    data: {
      ticketId: ticket5.id,
      dueAt: hoursAgo(5),
      firstResponseDueAt: hoursAgo(20),
      firstRespondedAt: hoursAgo(21),
      resolutionDueAt: hoursAgo(5),
      breached: false,
    },
  });

  /*
    Ticket 6
    Resolved within SLA
  */

  await prisma.sLA.create({
    data: {
      ticketId: ticket6.id,
      dueAt: hoursAgo(1),
      firstResponseDueAt: hoursAgo(20),
      firstRespondedAt: hoursAgo(21),
      resolutionDueAt: hoursAgo(4),
      resolutionCompletedAt: hoursAgo(2),
      breached: false,
    },
  });

  /*
    Ticket 7
    Resolved AFTER resolution deadline
    Useful for testing:
    resolutionCompletedAt > resolutionDueAt
  */

  await prisma.sLA.create({
    data: {
      ticketId: ticket7.id,
      dueAt: hoursAgo(2),
      firstResponseDueAt: hoursAgo(12),
      firstRespondedAt: hoursAgo(13),
      resolutionDueAt: hoursAgo(3),
      resolutionCompletedAt: hoursAgo(1),
      breached: false,
    },
  });

  /*
    Ticket 8
    Fully completed and healthy
  */

  await prisma.sLA.create({
    data: {
      ticketId: ticket8.id,
      dueAt: hoursAgo(24),
      firstResponseDueAt: hoursAgo(60),
      firstRespondedAt: hoursAgo(61),
      resolutionDueAt: hoursAgo(48),
      resolutionCompletedAt: hoursAgo(48),
      breached: false,
    },
  });

  console.log("⏱️ SLA records created.");

  // --------------------------------------------------
  // 7. TICKET ACTIVITIES
  // --------------------------------------------------

  await prisma.ticketActivity.createMany({
    data: [
      // Ticket 1
      {
        ticketId: ticket1.id,
        userId: customer1.id,
        action: TicketActivityAction.TICKET_CREATED,
      },

      // Ticket 2
      {
        ticketId: ticket2.id,
        userId: customer1.id,
        action: TicketActivityAction.TICKET_CREATED,
      },
      {
        ticketId: ticket2.id,
        userId: admin.id,
        action: TicketActivityAction.AGENT_ASSIGNED,
      },

      // Ticket 3
      {
        ticketId: ticket3.id,
        userId: customer2.id,
        action: TicketActivityAction.TICKET_CREATED,
      },
      {
        ticketId: ticket3.id,
        userId: admin.id,
        action: TicketActivityAction.AGENT_ASSIGNED,
      },
      {
        ticketId: ticket3.id,
        userId: admin.id,
        action: TicketActivityAction.AGENT_REASSIGNED,
      },

      // Ticket 4
      {
        ticketId: ticket4.id,
        userId: customer2.id,
        action: TicketActivityAction.TICKET_CREATED,
      },
      {
        ticketId: ticket4.id,
        userId: admin.id,
        action: TicketActivityAction.AGENT_ASSIGNED,
      },
      {
        ticketId: ticket4.id,
        userId: admin.id,
        action: TicketActivityAction.DEVELOPER_ASSIGNED,
      },

      // Ticket 5
      {
        ticketId: ticket5.id,
        userId: customer3.id,
        action: TicketActivityAction.TICKET_CREATED,
      },
      {
        ticketId: ticket5.id,
        userId: admin.id,
        action: TicketActivityAction.AGENT_ASSIGNED,
      },
      {
        ticketId: ticket5.id,
        userId: admin.id,
        action: TicketActivityAction.DEVELOPER_ASSIGNED,
      },
      {
        ticketId: ticket5.id,
        userId: developer2.id,
        action: TicketActivityAction.DEVELOPER_UPDATED,
      },

      // Ticket 6
      {
        ticketId: ticket6.id,
        userId: customer3.id,
        action: TicketActivityAction.TICKET_CREATED,
      },
      {
        ticketId: ticket6.id,
        userId: admin.id,
        action: TicketActivityAction.AGENT_ASSIGNED,
      },
      {
        ticketId: ticket6.id,
        userId: agent1.id,
        action: TicketActivityAction.TICKET_RESOLVED,
      },

      // Ticket 7
      {
        ticketId: ticket7.id,
        userId: customer1.id,
        action: TicketActivityAction.TICKET_CREATED,
      },
      {
        ticketId: ticket7.id,
        userId: admin.id,
        action: TicketActivityAction.AGENT_ASSIGNED,
      },
      {
        ticketId: ticket7.id,
        userId: agent2.id,
        action: TicketActivityAction.TICKET_RESOLVED,
      },

      // Ticket 8
      {
        ticketId: ticket8.id,
        userId: customer2.id,
        action: TicketActivityAction.TICKET_CREATED,
      },
      {
        ticketId: ticket8.id,
        userId: admin.id,
        action: TicketActivityAction.AGENT_ASSIGNED,
      },
      {
        ticketId: ticket8.id,
        userId: agent1.id,
        action: TicketActivityAction.TICKET_RESOLVED,
      },
      {
        ticketId: ticket8.id,
        userId: admin.id,
        action: TicketActivityAction.TICKET_CLOSED,
      },
    ],
  });

  console.log("📋 Ticket activities created.");

  // --------------------------------------------------
  // 8. MESSAGES
  // --------------------------------------------------

  await prisma.message.createMany({
    data: [
      {
        ticketId: ticket2.id,
        senderId: customer1.id,
        content:
          "My payment failed while I was trying to purchase the subscription.",
        isAIGenerated: false,
      },
      {
        ticketId: ticket2.id,
        senderId: agent1.id,
        content: "Hello Alice, I am checking the payment issue for you.",
        isAIGenerated: false,
      },

      {
        ticketId: ticket5.id,
        senderId: customer3.id,
        content: "The exported report contains incorrect transaction totals.",
        isAIGenerated: false,
      },
      {
        ticketId: ticket5.id,
        senderId: agent2.id,
        content: "I have escalated this issue to our development team.",
        isAIGenerated: false,
      },

      {
        ticketId: ticket6.id,
        senderId: customer3.id,
        content: "I was unable to update my profile phone number.",
        isAIGenerated: false,
      },
      {
        ticketId: ticket6.id,
        senderId: agent1.id,
        content:
          "The profile issue has been fixed. Please try updating your phone number again.",
        isAIGenerated: false,
      },
    ],
  });

  console.log("💬 Messages created.");

  // --------------------------------------------------
  // 9. INTERNAL NOTES
  // --------------------------------------------------

  await prisma.internalNote.createMany({
    data: [
      {
        ticketId: ticket4.id,
        authorId: agent1.id,
        content:
          "Customer provided crash details. Logs indicate the issue started after the latest deployment.",
      },
      {
        ticketId: ticket4.id,
        authorId: developer1.id,
        content:
          "Investigating the deployment-related crash. Reproduced locally.",
      },
      {
        ticketId: ticket5.id,
        authorId: agent2.id,
        content:
          "Customer report indicates incorrect totals only in exported reports.",
      },
      {
        ticketId: ticket5.id,
        authorId: developer2.id,
        content: "Investigating the report aggregation query.",
      },
    ],
  });

  console.log("📝 Internal notes created.");

  // --------------------------------------------------
  // 10. SUMMARY
  // --------------------------------------------------

  console.log("\n========================================");
  console.log("✅ SEED COMPLETED SUCCESSFULLY");
  console.log("========================================");

  console.log("\nUsers:");
  console.log("Admin:        admin@support.com");
  console.log("Agent 1:      agent1@support.com");
  console.log("Agent 2:      agent2@support.com");
  console.log("Developer 1:  developer1@support.com");
  console.log("Developer 2:  developer2@support.com");
  console.log("Customer 1:   customer1@example.com");
  console.log("Customer 2:   customer2@example.com");
  console.log("Customer 3:   customer3@example.com");

  console.log("\nPassword for all users:");
  console.log("Password@123");

  console.log("\nTicket test scenarios:");
  console.log("Ticket 1 → OPEN");
  console.log("Ticket 2 → IN_PROGRESS + Agent assigned");
  console.log("Ticket 3 → IN_PROGRESS + Agent reassigned");
  console.log(
    "Ticket 4 → ESCALATED + Developer assigned + first-response breach",
  );
  console.log(
    "Ticket 5 → IN_DEVELOPMENT + Developer assigned + resolution breach",
  );
  console.log("Ticket 6 → RESOLVED within SLA");
  console.log("Ticket 7 → RESOLVED after SLA deadline");
  console.log("Ticket 8 → CLOSED");

  console.log("\nSLA test cases:");
  console.log("Ticket 1 → Healthy");
  console.log("Ticket 2 → Healthy");
  console.log("Ticket 3 → Healthy");
  console.log("Ticket 4 → First response breached");
  console.log("Ticket 5 → Resolution breached");
  console.log("Ticket 6 → Resolved within SLA");
  console.log("Ticket 7 → Late resolution");
  console.log("Ticket 8 → Completed successfully");

  console.log("\n========================================");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
