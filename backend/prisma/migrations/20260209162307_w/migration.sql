/*
  Warnings:

  - Made the column `actionType` on table `notifications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `message` on table `notifications` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "notifications" ALTER COLUMN "actionType" SET NOT NULL,
ALTER COLUMN "message" SET NOT NULL;
