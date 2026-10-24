import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getLocale, t } from "@/lib/i18n";
import { errorMessage } from "@/lib/messages";
import { LIMITS, safeNextPath } from "@/lib/validation";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: t(locale).auth.registerTitle };
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const [{ error, next }, locale] = await Promise.all([searchParams, getLocale()]);
  const m = t(locale);
  const user = await getCurrentUser();

  if (user) {
    redirect(safeNextPath(next));
  }

  const errorText = errorMessage(error, locale);

  return (
    <main className="shell page">
      <div className="grid gap-12 border-t border-line pt-10 lg:grid-cols-2 lg:gap-20">
        <div className="max-w-md">
          <p className="eyebrow">Toyooka BBS</p>
          <h1 className="title-page mt-4">{m.auth.registerTitle}</h1>
          <p className="mt-4 text-[14px] leading-[1.85] text-muted">{m.auth.registerSubtitle}</p>
        </div>

        <div className="w-full max-w-md lg:justify-self-end">
          {errorText ? <p className="notice notice-error mb-6">{errorText}</p> : null}

          <form action="/api/auth/register" method="post" className="space-y-5">
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
                minLength={LIMITS.usernameMin}
                maxLength={LIMITS.usernameMax}
                pattern="[A-Za-z0-9_]+"
                className="field mt-2"
              />
              <p className="hint">{m.auth.usernameHint}</p>
            </div>

            <div>
              <label htmlFor="email" className="field-label">
                {m.auth.email}{" "}
                <span className="normal-case tracking-normal text-muted">
                  {m.auth.optional}
                </span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                className="field mt-2"
              />
              <p className="hint">{m.auth.emailHint}</p>
            </div>

            <div>
              <label htmlFor="password" className="field-label">
                {m.auth.password}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={LIMITS.passwordMin}
                maxLength={LIMITS.passwordMax}
                className="field mt-2"
              />
              <p className="hint">{m.auth.passwordHint}</p>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              {m.auth.createButton}
            </button>
          </form>

          <p className="mt-6 text-[12.5px] leading-relaxed text-muted">
            {m.auth.termsPrefix}
            <Link href="/rules" className="text-link">
              {m.auth.termsRules}
            </Link>
            {m.auth.termsAnd}
            <Link href="/privacy" className="text-link">
              {m.auth.termsPrivacy}
            </Link>
            {m.auth.termsSuffix}
          </p>

          <p className="mt-4 text-[13px] text-muted">
            {m.auth.haveAccount}{" "}
            <Link href="/login" className="text-link">
              {m.auth.loginLink}
            </Link>
            {m.auth.sentenceEnd}
          </p>
        </div>
      </div>
    </main>
  );
}
