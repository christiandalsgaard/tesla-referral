import { cookies } from "next/headers";

// Simple password-based auth for the MVP dashboard.
// Checks the DASHBOARD_PASSWORD env var against a cookie value.
// Upgrade path: replace with NextAuth + OAuth for multi-user support.

const COOKIE_NAME = "dashboard_auth";

// Check if the current request has a valid auth cookie.
// Returns true if the cookie matches the dashboard password.
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(COOKIE_NAME);
  if (!authCookie) return false;
  return authCookie.value === process.env.DASHBOARD_PASSWORD;
}

// Set the auth cookie after successful login.
// httpOnly + secure + sameSite=lax for basic session security.
export async function setAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, process.env.DASHBOARD_PASSWORD!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    // 7-day session — dashboard is single-user so this is fine for MVP
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}
