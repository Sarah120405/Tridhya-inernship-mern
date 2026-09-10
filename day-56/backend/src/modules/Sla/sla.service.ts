import prisma from "../../config/db.config";
import { emailService } from "../../utils/email.service";

function calculateRemainingTime(dueAt: Date, now: Date = new Date()) {
  const remainingMs = dueAt.getTime() - now.getTime();

  const remainingMinutes = Math.max(0, Math.ceil(remainingMs / (1000 * 60)));

  const hours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;

  let timeRemaining = "";

  if (hours > 0) {
    timeRemaining += `${hours} hour${hours !== 1 ? "s" : ""}`;
  }

  if (minutes > 0) {
    if (timeRemaining) {
      timeRemaining += " ";
    }

    timeRemaining += `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }

  if (!timeRemaining) {
    timeRemaining = "less than 1 minute";
  }

  return timeRemaining;
}

export async function getSLAByTicketId(
  ticketId: string,
  userId: string,
  userRole: string,
) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw {
      status: 404,
      message: "Ticket not found.",
    };
  }

  if (userRole === "Customer") {
    if (ticket.customerId !== userId) {
      throw {
        status: 403,
        message: "Unauthorized to view this ticket SLA.",
      };
    }
  } else if (userRole === "SupportAgent") {
    if (ticket.assignedAgentId !== userId) {
      throw {
        status: 403,
        message: "Unauthorized to view this ticket SLA.",
      };
    }
  } else if (userRole === "Developer") {
    if (ticket.assignedDeveloperId !== userId) {
      throw {
        status: 403,
        message: "Unauthorized to view this ticket SLA.",
      };
    }
  } else if (userRole === "Admin") {
  } else {
    throw {
      status: 403,
      message: "Unauthorized: Invalid role.",
    };
  }

  const sla = await prisma.sLA.findUnique({
    where: {
      ticketId: ticketId,
    },
  });

  if (!sla) {
    throw {
      status: 404,
      message: "SLA not found for this ticket.",
    };
  }

  return sla;
}

export async function slaBreachCheck(ticketId: string) {
  const slaData = await prisma.sLA.findUnique({
    where: { ticketId },
  });

  if (!slaData) return null;

  const {
    firstRespondedAt,
    firstResponseDueAt,
    resolutionCompletedAt,
    resolutionDueAt,
    breached: alreadyBreached,
    breachedAt: existingBreachedAt,
  } = slaData;

  const now = new Date();

  const breachTimes: Date[] = [];

  // 1. FIRST RESPONSE SLA
  if (firstResponseDueAt) {
    if (firstRespondedAt) {
      // Agent responded, but responded after the deadline
      if (firstRespondedAt > firstResponseDueAt) {
        breachTimes.push(firstResponseDueAt);
      }
    } else {
      // Agent has not responded yet and deadline has passed
      if (now > firstResponseDueAt) {
        breachTimes.push(firstResponseDueAt);
      }
    }
  }

  // 2. RESOLUTION SLA
  if (resolutionDueAt) {
    if (resolutionCompletedAt) {
      // Ticket was resolved, but after the deadline
      if (resolutionCompletedAt > resolutionDueAt) {
        breachTimes.push(resolutionDueAt);
      }
    } else {
      // Ticket is not resolved and deadline has passed
      if (now > resolutionDueAt) {
        breachTimes.push(resolutionDueAt);
      }
    }
  }
  if (breachTimes.length === 0) {
    return slaData;
  }
  const firstBreachAt = breachTimes.reduce((earliest, current) => {
    return current < earliest ? current : earliest;
  });
  const slaUpdate = await prisma.sLA.update({
    where: { ticketId },
    data: {
      breached: true,
      breachedAt:
        alreadyBreached && existingBreachedAt
          ? existingBreachedAt
          : firstBreachAt,
    },
  });

  return slaUpdate;
}

export async function backgroundSlaMonitoring() {
  const threshold = 80;

  const tickets = await prisma.ticket.findMany({
    where: {
      resolvedAt: null,
      status: {
        in: ["IN_PROGRESS", "IN_DEVELOPMENT"],
      },
    },
  });

  await Promise.all(
    tickets.map(async (ticket) => {
      const slaData = await prisma.sLA.findUnique({
        where: {
          ticketId: ticket.id,
        },
      });

      if (!slaData) {
        return;
      }

      const {
        firstRespondedAt,
        firstResponseDueAt,
        resolutionCompletedAt,
        resolutionDueAt,
        firstResponseWarningSentAt,
        resolutionWarningSentAt,
        breached: alreadyBreached,
        breachedAt: existingBreachedAt,
      } = slaData;

      const now = new Date();

      const breachTimes: Date[] = [];

      // 1. FIRST RESPONSE SLA

      if (firstResponseDueAt) {
        if (firstRespondedAt) {
          // Agent responded after the first-response deadline
          if (firstRespondedAt > firstResponseDueAt) {
            breachTimes.push(firstResponseDueAt);
          }
        } else {
          // Calculate 80% warning time
          const slaDuration =
            firstResponseDueAt.getTime() - ticket.createdAt.getTime();

          const warningTime = new Date(
            ticket.createdAt.getTime() + slaDuration * (threshold / 100),
          );

          // First-response warning

          if (
            now >= warningTime &&
            now < firstResponseDueAt &&
            !firstResponseWarningSentAt
          ) {
            const userId = ticket.assignedAgentId;

            if (userId) {
              const user = await prisma.user.findUnique({
                where: {
                  id: userId,
                },
              });

              if (!user) {
                console.log(
                  `Assigned agent not found for ticket #${ticket.ticketNumber}`,
                );
              } else {
                const timeRemaining = calculateRemainingTime(
                  firstResponseDueAt,
                  now,
                );
                try {
                  await emailService(
                    user.email,
                    `SLA Warning: Ticket #${ticket.ticketNumber} is approaching its first-response deadline`,
                    `
                      <h2>SLA Warning</h2>
                      <p>Hello ${user.name},</p>

                      <p>The following ticket is approaching its first-response SLA deadline:</p>

                      <p><strong>Ticket Number:</strong> #${ticket.ticketNumber}</p>
                      <p><strong>Title:</strong> ${ticket.title}</p>
                      <p><strong>Priority:</strong> ${ticket.priority}</p>
                      <p><strong>Status:</strong> ${ticket.status}</p>
                      <p><strong>Time Remaining:</strong> ${timeRemaining}</p>

                      <p>Please respond to the customer before the SLA deadline to avoid a breach.</p>
                      <p>
                        Thank you,<br>
                        Support Desk
                      </p>
                    `,
                  );

                  // Mark warning as sent only after email succeeds
                  await prisma.sLA.update({
                    where: {
                      ticketId: ticket.id,
                    },
                    data: {
                      firstResponseWarningSentAt: now,
                    },
                  });
                } catch (error) {
                  console.error(
                    `Error sending first-response SLA warning for ticket #${ticket.ticketNumber}:`,
                    error,
                  );
                }
              }
            }
          }

          // First-response breach
          if (now >= firstResponseDueAt) {
            breachTimes.push(firstResponseDueAt);
          }
        }
      }

      // 2. RESOLUTION SLA

      if (resolutionDueAt) {
        if (resolutionCompletedAt) {
          // Ticket was resolved after the resolution deadline
          if (resolutionCompletedAt > resolutionDueAt) {
            breachTimes.push(resolutionDueAt);
          }
        } else {
          // Calculate 80% warning time
          const slaDuration =
            resolutionDueAt.getTime() - ticket.createdAt.getTime();

          const warningTime = new Date(
            ticket.createdAt.getTime() + slaDuration * (threshold / 100),
          );

          // Resolution warning

          if (
            now >= warningTime &&
            now < resolutionDueAt &&
            !resolutionWarningSentAt
          ) {
            let userId: string | null = null;

            if (ticket.status === "IN_PROGRESS") {
              userId = ticket.assignedAgentId;
            } else if (ticket.status === "IN_DEVELOPMENT") {
              userId = ticket.assignedDeveloperId;
            }

            if (userId) {
              const user = await prisma.user.findUnique({
                where: {
                  id: userId,
                },
              });

              if (!user) {
                console.log(
                  `Assigned user not found for ticket #${ticket.ticketNumber}`,
                );
              } else {
                const timeRemaining = calculateRemainingTime(
                  resolutionDueAt,
                  now,
                );
                try {
                  await emailService(
                    user.email,
                    `SLA Warning: Ticket #${ticket.ticketNumber} is approaching its resolution deadline`,
                    `
                      <h2>SLA Warning</h2>
                      <p>Hello ${user.name},</p>

                      <p>The following ticket is approaching its resolution SLA deadline:</p>
                      <p><strong>Ticket Number:</strong> #${ticket.ticketNumber}</p>
                      <p><strong>Title:</strong> ${ticket.title}</p>
                      <p><strong>Priority:</strong> ${ticket.priority}</p>
                      <p><strong>Status:</strong> ${ticket.status} </p>
                      <p><strong>Time Remaining:</strong> ${timeRemaining}</p>

                      <p>Please take action to resolve the ticket before the SLA deadline.</p>

                      <p>
                        Thank you,<br>
                        Support Desk
                      </p>
                    `,
                  );

                  // Mark warning as sent only after email succeeds
                  await prisma.sLA.update({
                    where: {
                      ticketId: ticket.id,
                    },
                    data: {
                      resolutionWarningSentAt: now,
                    },
                  });
                } catch (error) {
                  console.error(
                    `Error sending resolution SLA warning for ticket #${ticket.ticketNumber}:`,
                    error,
                  );
                }
              }
            }
          }

          // Resolution breach
          if (now >= resolutionDueAt) {
            breachTimes.push(resolutionDueAt);
          }
        }
      }

      // 3. UPDATE SLA BREACH

      if (breachTimes.length > 0) {
        const firstBreachAt = breachTimes.reduce((earliest, current) =>
          current < earliest ? current : earliest,
        );

        await prisma.sLA.update({
          where: {
            ticketId: ticket.id,
          },
          data: {
            breached: true,
            breachedAt:
              alreadyBreached && existingBreachedAt
                ? existingBreachedAt
                : firstBreachAt,
          },
        });
      }
    }),
  );
}
