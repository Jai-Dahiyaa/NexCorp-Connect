import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url:
      process.env.NODE_ENV === "test"
        ? process.env.TEST_DATABASE_URL!   // test DB
        : process.env.DATABASE_URL!,       // main DB
  },
});
