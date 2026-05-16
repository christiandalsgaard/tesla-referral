import { isAuthenticated } from "@/lib/auth";
import LoginForm from "@/components/dashboard/login-form";

// Dashboard layout — wraps all /dashboard/* pages with auth protection.
// If not authenticated, shows the login form instead of the dashboard.
// This runs on the server so the auth check happens before any content renders.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthenticated();

  // Show login form if not authenticated
  if (!authed) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Command center header */}
      <header className="border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Pulsing status dot — indicates the system is live */}
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
            </span>
            <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-white/60">
              Command Center
            </h1>
          </div>
          <a
            href="/"
            className="text-xs text-white/30 transition hover:text-white/60"
          >
            ← Back to Site
          </a>
        </div>
      </header>

      {/* Dashboard content area */}
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
