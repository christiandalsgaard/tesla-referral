import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth";

// POST /api/auth — simple password login for the dashboard.
// Compares the submitted password against the DASHBOARD_PASSWORD env var.
// On success, sets an httpOnly cookie that the dashboard layout checks.
export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password !== process.env.DASHBOARD_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Set the auth cookie — persists for 7 days
    await setAuthCookie();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
