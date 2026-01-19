-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'users';
