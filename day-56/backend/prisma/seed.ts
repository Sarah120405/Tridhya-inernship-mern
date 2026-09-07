import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // --------------------------------------------------
  // Password
  // --------------------------------------------------

  const password = await bcrypt.hash("Password@123", 10);

  // --------------------------------------------------
  // Users
  // --------------------------------------------------

  const customer1 = await prisma.user.upsert({
    where: { email: "alice@gmail.com" },
    update: {},
    create: {
      name: "Alice",
      email: "alice@gmail.com",
      password,
      role: "Customer",
    },
  });

  const customer2 = await prisma.user.upsert({
    where: { email: "bob@gmail.com" },
    update: {},
    create: {
      name: "Bob",
      email: "bob@gmail.com",
      password,
      role: "Customer",
    },
  });

  const customer3 = await prisma.user.upsert({
    where: { email: "charlie@gmail.com" },
    update: {},
    create: {
      name: "Charlie",
      email: "charlie@gmail.com",
      password,
      role: "Customer",
    },
  });

  const agent1 = await prisma.user.upsert({
    where: { email: "agent1@gmail.com" },
    update: {},
    create: {
      name: "John Agent",
      email: "agent1@gmail.com",
      password,
      role: "SupportAgent",
    },
  });

  const agent2 = await prisma.user.upsert({
    where: { email: "agent2@gmail.com" },
    update: {},
    create: {
      name: "Sarah Agent",
      email: "agent2@gmail.com",
      password,
      role: "SupportAgent",
    },
  });

  const developer1 = await prisma.user.upsert({
    where: { email: "developer1@gmail.com" },
    update: {},
    create: {
      name: "David Developer",
      email: "developer1@gmail.com",
      password,
      role: "Developer",
    },
  });

  const developer2 = await prisma.user.upsert({
    where: { email: "developer2@gmail.com" },
    update: {},
    create: {
      name: "Emma Developer",
      email: "developer2@gmail.com",
      password,
      role: "Developer",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@gmail.com",
      password,
      role: "Admin",
    },
  });

  console.log("✅ Users created");

  // --------------------------------------------------
  // Tickets
  // --------------------------------------------------

  const ticket1 = await prisma.ticket.create({
    data: {
      title: "Unable to login",
      description:
        "I cannot login to my account even with the correct password.",
      category: "ACCOUNT",
      priority: "HIGH",
      status: "OPEN",
      customerId: customer1.id,
      assignedAgentId: agent1.id,
    },
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      title: "Payment failed",
      description: "My payment failed while purchasing the subscription.",
      category: "BILLING",
      priority: "URGENT",
      status: "IN_PROGRESS",
      customerId: customer1.id,
      assignedAgentId: agent1.id,
    },
  });

  const ticket3 = await prisma.ticket.create({
    data: {
      title: "Profile update issue",
      description: "I am unable to update my profile information.",
      category: "ACCOUNT",
      priority: "MEDIUM",
      status: "RESOLVED",
      customerId: customer2.id,
      assignedAgentId: agent2.id,
    },
  });

  const ticket4 = await prisma.ticket.create({
    data: {
      title: "Application crashes after login",
      description: "The application crashes immediately after I log in.",
      category: "TECHNICAL",
      priority: "HIGH",
      status: "ESCALATED",
      customerId: customer2.id,
      assignedAgentId: agent2.id,
      assignedDeveloperId: developer1.id,
    },
  });

  const ticket5 = await prisma.ticket.create({
    data: {
      title: "Dashboard loading slowly",
      description: "The dashboard takes more than 30 seconds to load.",
      category: "OTHER",
      priority: "MEDIUM",
      status: "IN_DEVELOPMENT",
      customerId: customer3.id,
      assignedAgentId: agent1.id,
      assignedDeveloperId: developer1.id,
    },
  });

  const ticket6 = await prisma.ticket.create({
    data: {
      title: "Email notification not received",
      description:
        "I did not receive the confirmation email after registration.",
      category: "GENERAL_INQUIRY",
      priority: "LOW",
      status: "OPEN",
      customerId: customer3.id,
      assignedAgentId: agent2.id,
    },
  });

  const ticket7 = await prisma.ticket.create({
    data: {
      title: "Incorrect invoice amount",
      description: "The amount shown on my invoice is incorrect.",
      category: "BILLING",
      priority: "HIGH",
      status: "CLOSED",
      customerId: customer1.id,
      assignedAgentId: agent1.id,
    },
  });

  const ticket8 = await prisma.ticket.create({
    data: {
      title: "API returning 500 error",
      description:
        "The API returns an internal server error for some requests.",
      category: "TECHNICAL",
      priority: "URGENT",
      status: "IN_DEVELOPMENT",
      customerId: customer2.id,
      assignedAgentId: agent2.id,
      assignedDeveloperId: developer2.id,
    },
  });

  console.log("✅ Tickets created");

  // --------------------------------------------------
  // Summary
  // --------------------------------------------------

  console.log("\n🎉 Seed completed successfully!\n");

  console.log("Users:");
  console.log("Customer 1: alice@gmail.com");
  console.log("Customer 2: bob@gmail.com");
  console.log("Customer 3: charlie@gmail.com");
  console.log("Agent 1: agent1@gmail.com");
  console.log("Agent 2: agent2@gmail.com");
  console.log("Developer 1: developer1@gmail.com");
  console.log("Developer 2: developer2@gmail.com");
  console.log("Admin: admin@gmail.com");
  console.log("\nPassword for all users: Password@123");

  console.log("\nTickets:");
  console.log(ticket1.id, ticket1.status);
  console.log(ticket2.id, ticket2.status);
  console.log(ticket3.id, ticket3.status);
  console.log(ticket4.id, ticket4.status);
  console.log(ticket5.id, ticket5.status);
  console.log(ticket6.id, ticket6.status);
  console.log(ticket7.id, ticket7.status);
  console.log(ticket8.id, ticket8.status);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
