-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'Developer';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TicketActivityAction" ADD VALUE 'DEVELOPER_ASSIGNED';
ALTER TYPE "TicketActivityAction" ADD VALUE 'DEVELOPER_REASSIGNED';
ALTER TYPE "TicketActivityAction" ADD VALUE 'TICKET_ESCALATED';
ALTER TYPE "TicketActivityAction" ADD VALUE 'DEVELOPER_UPDATED';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TicketStatus" ADD VALUE 'ESCALATED';
ALTER TYPE "TicketStatus" ADD VALUE 'IN_DEVELOPMENT';

-- AlterTable
ALTER TABLE "AIAnalysis" ADD COLUMN     "suggestedDepartment" TEXT,
ADD COLUMN     "suggestedEscalation" BOOLEAN;

-- AlterTable
ALTER TABLE "SLA" ADD COLUMN     "firstRespondedAt" TIMESTAMP(3),
ADD COLUMN     "firstResponseDueAt" TIMESTAMP(3),
ADD COLUMN     "resolutionCompletedAt" TIMESTAMP(3),
ADD COLUMN     "resolutionDueAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "assignedDeveloperId" TEXT;

-- CreateTable
CREATE TABLE "InternalNote" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternalNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InternalNote_ticketId_idx" ON "InternalNote"("ticketId");

-- CreateIndex
CREATE INDEX "InternalNote_authorId_idx" ON "InternalNote"("authorId");

-- CreateIndex
CREATE INDEX "Ticket_assignedDeveloperId_idx" ON "Ticket"("assignedDeveloperId");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_assignedDeveloperId_fkey" FOREIGN KEY ("assignedDeveloperId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalNote" ADD CONSTRAINT "InternalNote_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalNote" ADD CONSTRAINT "InternalNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
