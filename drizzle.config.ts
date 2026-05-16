import { defineConfig } from "drizzle-kit";

// Drizzle Kit config — used for generating and running migrations against Neon Postgres.
// Reads DATABASE_URL from .env.local (or Vercel env vars in production).
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
