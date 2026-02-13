/*
  Warnings:

  - You are about to drop the column `platform_name` on the `social_login` table. All the data in the column will be lost.
  - You are about to drop the column `platform_user_id` on the `social_login` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[provider_user_id]` on the table `social_login` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider` to the `social_login` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider_user_id` to the `social_login` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `social_login` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "social_login" DROP COLUMN "platform_name",
DROP COLUMN "platform_user_id",
ADD COLUMN     "access_token" TEXT,
ADD COLUMN     "expires_at" TIMESTAMP(3),
ADD COLUMN     "provider" TEXT NOT NULL,
ADD COLUMN     "provider_user_id" TEXT NOT NULL,
ADD COLUMN     "refresh_token" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "profiles_phone_key" ON "profiles"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "social_login_provider_user_id_key" ON "social_login"("provider_user_id");
