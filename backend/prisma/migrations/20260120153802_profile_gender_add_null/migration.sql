-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "gender" SET DEFAULT 'male';
