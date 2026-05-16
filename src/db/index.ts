import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Create a Neon SQL client using the DATABASE_URL env var.
// In production on Vercel this is set automatically by the Neon integration.
// Locally, it comes from .env.local.
const sql = neon(process.env.DATABASE_URL!);

// Export the Drizzle ORM instance with full schema typing.
// All queries throughout the app use this single instance.
export const db = drizzle(sql, { schema });
