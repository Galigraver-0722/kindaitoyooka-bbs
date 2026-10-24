import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { RoleChip } from "@/components/role-chip";
import type { SessionUser } from "@/lib/auth";
import { type Locale, t } from "@/lib/i18n";

const linkClass = "text-muted transition-colors duration-150 hover:text-ink";

export function SiteHeader({ user, locale }: { user: SessionUser | null; locale: Locale }) {
  const m = t(locale);
  const canModerate = user?.role === "MODERATOR" || user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur-sm">
      <div className="shell flex flex-wrap items-center gap-x-8 gap-y-3 py-3.5">
        <Link href="/" className="flex items-baseline gap-1.5">
          <span className="text-[15px] font-semibold tracking-[-0.03em] text-ink">
            Toyooka <span className="text-accent">BBS</span>
          </span>
        </Link>

        <nav
          className="order-3 flex w-full items-center gap-x-5 gap-y-2 border-t border-line pt-3 text-[12px] sm:order-none sm:w-auto sm:border-0 sm:pt-0"
        >
          <Link href="/" className={linkClass}>
            {m.nav.boards}
          </Link>
          <Link href="/new" className={linkClass}>
            {m.nav.newThread}
          </Link>
          <Link href="/search" className={linkClass}>
            {m.nav.search}
          </Link>
          {user ? (
            <Link href="/bookmarks" className={linkClass}>
              {m.nav.bookmarks}
            </Link>
          ) : null}
          {canModerate ? (
            <Link href="/moderation" className={linkClass}>
              {m.nav.moderation}
            </Link>
          ) : null}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <LanguageSwitcher locale={locale} />

          {user ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2">
                <Link
                  href={`/u/${user.username}`}
                  className="font-mono text-[11px] text-ink transition-colors duration-150 hover:text-accent"
                >
                  {user.username}
                </Link>
                <RoleChip role={user.role} locale={locale} />
              </span>
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="text-[11px] text-muted transition-colors duration-150 hover:text-ink"
                >
                  {m.nav.logOut}
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-[12px] text-muted hover:text-ink">
                {m.nav.logIn}
              </Link>
              <Link href="/register" className="btn btn-primary px-3 py-2 text-[12px]">
                {m.nav.register}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
