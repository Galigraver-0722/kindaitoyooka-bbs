import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Role } from "@prisma/client";
import type { SessionUser } from "@/lib/auth";
import { type Locale, t } from "@/lib/i18n";

const ROLE_STYLES: Record<Role, string> = {
  ADMIN: "bg-rose-100 text-rose-700 ring-rose-200",
  MODERATOR: "bg-amber-100 text-amber-800 ring-amber-200",
  STUDENT: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function SiteHeader({ user, locale }: { user: SessionUser | null; locale: Locale }) {
  const m = t(locale);
  const canModerate = user?.role === "MODERATOR" || user?.role === "ADMIN";

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
          Toyooka <span className="text-indigo-600">BBS</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <Link href="/" className="text-slate-600 transition hover:text-slate-900">
            {m.nav.boards}
          </Link>
          <Link href="/new" className="text-slate-600 transition hover:text-slate-900">
            {m.nav.newThread}
          </Link>
          <Link href="/search" className="text-slate-600 transition hover:text-slate-900">
            {m.nav.search}
          </Link>
          {user ? (
            <Link href="/bookmarks" className="text-slate-600 transition hover:text-slate-900">
              {m.nav.bookmarks}
            </Link>
          ) : null}
          {canModerate ? (
            <Link href="/moderation" className="text-slate-600 transition hover:text-slate-900">
              {m.nav.moderation}
            </Link>
          ) : null}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 text-slate-700">
                <Link href={`/u/${user.username}`} className="hover:text-indigo-700">
                  {user.username}
                </Link>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${ROLE_STYLES[user.role]}`}
                >
                  {m.roles[user.role]}
                </span>
              </span>
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-slate-700 transition hover:bg-slate-50"
                >
                  {m.nav.logOut}
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-md border border-slate-300 px-3 py-1.5 text-slate-700 transition hover:bg-slate-50"
              >
                {m.nav.logIn}
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-indigo-600 px-3 py-1.5 font-medium text-white transition hover:bg-indigo-700"
              >
                {m.nav.register}
              </Link>
            </div>
          )}

          <LanguageSwitcher locale={locale} />
        </nav>
      </div>
    </header>
  );
}
