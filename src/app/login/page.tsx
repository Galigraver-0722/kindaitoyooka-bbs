import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getLocale, t } from "@/lib/i18n";
import { errorMessage, noticeMessage } from "@/lib/messages";
import { safeNextPath } from "@/lib/validation";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: t(locale).auth.loginTitle };
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string; next?: string }>;
}) {
  const [{ error, notice, next }, locale] = await Promise.all([searchParams, getLocale()]);
  const m = t(locale);
  const user = await getCurrentUser();

  if (user) {
    redirect(safeNextPath(next));
  }

  const errorText = errorMessage(error, locale);
  const noticeText = noticeMessage(notice, locale);

  return (
    <main className="shell page">
      <div className="grid gap-12 border-t border-line pt-10 lg:grid-cols-2 lg:gap-20">
        <div className="max-w-md">
          <p className="eyebrow">Toyooka BBS</p>
          <h1 className="title-page mt-4">{m.auth.loginTitle}</h1>
          <p className="mt-4 text-[13px] leading-[1.85] text-muted">{m.auth.loginSubtitle}</p>
        </div>

        <div className="w-full max-w-md lg:justify-self-end">
          {errorText ? <p className="notice notice-error mb-6">{errorText}</p> : null}
          {noticeText ? <p className="notice notice-success mb-6">{noticeText}</p> : null}

          <form action="/api/auth/login" method="post" className="space-y-6">
            <input type="hidden" name="next" value={safeNextPath(next)} />

            <div>
              <label htmlFor="username" className="field-label">
                {m.auth.username}
              </label>
              <input
                id="username"
                name="username"
                autoComplete="username"
                required
                className="field mt-2"
              />
            </div>

            <div>
              <label htmlFor="password" className="field-label">
                {m.auth.password}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="field mt-2"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              {m.auth.loginButton}
            </button>
          </form>

          <p className="mt-7 text-[12px] text-muted">
            {m.auth.noAccount}{" "}
            <Link href="/register" className="text-link">
              {m.auth.registerLink}
            </Link>
            {m.auth.sentenceEnd}
          </p>
        </div>
      </div>
    </main>
  );
}
