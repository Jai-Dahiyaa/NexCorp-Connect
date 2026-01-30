-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(100) DEFAULT 'null',
    "role" VARCHAR(50) DEFAULT 'users',
    "status" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_login" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "platform_name" VARCHAR(100),
    "platform_user_id" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "social_login_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "full_name" VARCHAR(100) NOT NULL DEFAULT 'null',
    "avatar_url" TEXT,
    "bio" TEXT,
    "phone" VARCHAR(20),
    "manual_name_set" BOOLEAN NOT NULL DEFAULT false,
    "manual_image_set" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "profile_source" VARCHAR(20) NOT NULL DEFAULT 'direct_signup',
    "gender" VARCHAR(20) DEFAULT 'male',
    "dob" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "access_level" TEXT DEFAULT 'null',
    "company_name" TEXT DEFAULT 'null',
    "industry" TEXT DEFAULT 'null',
    "description" TEXT DEFAULT 'null',
    "department" TEXT DEFAULT 'null',
    "experience_year" INTEGER DEFAULT 0,
    "course" TEXT NOT NULL DEFAULT 'null',
    "year" INTEGER DEFAULT 0,
    "college_name" TEXT DEFAULT 'null',

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "social_login" ADD CONSTRAINT "social_login_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
