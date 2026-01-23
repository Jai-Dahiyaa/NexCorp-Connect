-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "access_level" TEXT DEFAULT 'null',
ADD COLUMN     "college_name" TEXT DEFAULT 'null',
ADD COLUMN     "company_name" TEXT DEFAULT 'null',
ADD COLUMN     "course" TEXT NOT NULL DEFAULT 'null',
ADD COLUMN     "department" TEXT DEFAULT 'null',
ADD COLUMN     "description" TEXT DEFAULT 'null',
ADD COLUMN     "experience_year" INTEGER DEFAULT 0,
ADD COLUMN     "industry" TEXT DEFAULT 'null',
ADD COLUMN     "year" INTEGER DEFAULT 0;
