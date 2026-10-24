import Link from "next/link";
import type { SessionUser } from "@/lib/auth";

const ROLE_STYLES: Record<string, string> = {
  ADMIN: "bg-rose-100 text-rose-700 ring-rose-200",
  MODERATOR: "bg-amber-100 text-amber-800 ring-amber-200",
  STUDENT: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function SiteHeader({ user }: { user: SessionUser | null }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
          Toyooka <span className="text-indigo-600">BBS</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <Link href="/" className="text-slate-600 transition hover:text-slate-900">
            Boards
          </Link>
          <Link href="/new" className="text-slate-600 transition hover:text-slate-900">
            New thread
          </Link>
          {user && (user.role === "MODERATOR" || user.role === "ADMIN") ? (
            <Link href="/moderation" className="text-slate-600 transition hover:text-slate-900">
              Moderation
            </Link>
          ) : null}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 text-slate-700">
                {user.username}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                    ROLE_STYLES[user.role] ?? ROLE_STYLES.STUDENT
                  }`}
                >
                  {user.role.toLowerCase()}
                </span>
              </span>
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-slate-700 transition hover:bg-slate-50"
                >
                  Log out
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-md border border-slate-300 px-3 py-1.5 text-slate-700 transition hover:bg-slate-50"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-indigo-600 px-3 py-1.5 font-medium text-white transition hover:bg-indigo-700"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
