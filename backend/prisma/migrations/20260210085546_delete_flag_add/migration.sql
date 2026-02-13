/*
  Warnings:

  - Made the column `postId` on table `notifications` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_postId_fkey";

-- AlterTable
ALTER TABLE "notifications" ALTER COLUMN "postId" SET NOT NULL;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "isDelete" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
