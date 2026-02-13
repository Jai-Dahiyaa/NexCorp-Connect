/*
  Warnings:

  - You are about to drop the column `accessType` on the `notification` table. All the data in the column will be lost.
  - Added the required column `actionType` to the `notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notification" DROP COLUMN "accessType",
ADD COLUMN     "actionType" TEXT NOT NULL;
