import { Resend } from "resend";

// Singleton Resend client — used for sending emails and managing contacts.
// The API key comes from the RESEND_API_KEY env var (set in .env.local or Vercel).
export const resend = new Resend(process.env.RESEND_API_KEY);
