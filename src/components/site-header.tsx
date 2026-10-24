import Link from "next/link";
import { SearchIcon } from "@/components/icons";
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
      <div className="shell flex flex-wrap items-center gap-x-4 gap-y-2 py-2.5">
        <Link href="/" className="flex items-baseline gap-1.5">
          <span className="text-[16px] font-semibold tracking-[-0.03em] text-ink">
            Toyooka <span className="text-accent">BBS</span>
          </span>
        </Link>

        <nav
          className="order-3 flex w-full items-center gap-x-5 gap-y-2 border-t border-line pt-2.5 text-[13.5px] sm:order-none sm:w-auto sm:border-0 sm:pt-0"
        >
          <Link href="/" className={linkClass}>
            {m.nav.boards}
          </Link>
          <Link href="/new" className={linkClass}>
            {m.nav.newThread}
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

        <form
          action="/search"
          method="get"
          role="search"
          className="order-4 flex w-full items-center gap-1.5 border border-line bg-surface px-2.5 py-1 lg:order-none lg:w-auto"
        >
          <button
            type="submit"
            aria-label={m.search.submit}
            className="text-muted transition-colors hover:text-ink"
          >
            <SearchIcon size={14} />
          </button>
          <input
            name="q"
            maxLength={100}
            aria-label={m.search.placeholder}
            placeholder={m.search.submit}
            className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink placeholder:text-muted lg:w-40 lg:flex-none"
          />
        </form>

        <div className="ml-auto flex items-center gap-3">
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
                  className="text-[12px] text-muted transition-colors duration-150 hover:text-ink"
                >
                  {m.nav.logOut}
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-[13px] text-muted hover:text-ink">
                {m.nav.logIn}
              </Link>
              <Link href="/register" className="btn btn-primary px-3 py-2 text-[13px]">
                {m.nav.register}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
