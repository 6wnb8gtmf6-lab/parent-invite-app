-- AlterTable
ALTER TABLE "Slot" ADD COLUMN "hideEndTime" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SlotTemplate" ADD COLUMN "hideEndTime" BOOLEAN NOT NULL DEFAULT false;
