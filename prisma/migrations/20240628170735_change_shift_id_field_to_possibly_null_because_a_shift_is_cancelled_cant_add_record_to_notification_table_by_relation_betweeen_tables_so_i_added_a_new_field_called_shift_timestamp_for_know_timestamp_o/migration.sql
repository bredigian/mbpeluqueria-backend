/*
  Warnings:

  - Added the required column `shiftTimestamp` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_shift_id_fkey";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "shiftTimestamp" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "shift_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "Shift"("id") ON DELETE SET NULL ON UPDATE CASCADE;
