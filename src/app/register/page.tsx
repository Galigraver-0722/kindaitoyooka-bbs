import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ThemedPage, Crumb } from "@/components/theme/themed-page";
import { getCurrentUser } from "@/lib/auth";
import { getLocale, t } from "@/lib/i18n";
import { errorMessage } from "@/lib/messages";
import { getTheme } from "@/lib/theme";
import { safeNextPath } from "@/lib/validation";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: t(locale).auth.registerTitle };
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const [{ error, next }, theme, locale] = await Promise.all([searchParams, getTheme(), getLocale()]);
  const user = await getCurrentUser();
  if (user) redirect(safeNextPath(next));

  const errorText = errorMessage(error, locale);
  const copy = t(locale).pages.auth;
  const pages = t(locale).pages;
  const nextPath = safeNextPath(next);
  const loginHref = nextPath === "/" ? "/login" : `/login?next=${encodeURIComponent(nextPath)}`;

  return (
    <ThemedPage theme={theme} username={null}>
      <main>
        <div className="page-head">
          <Crumb items={[{ href: "/", label: pages.home }, { label: copy.registerTitle }]} />
          <h1>{copy.registerTitle}</h1>
          <p className="lede">{copy.registerLede}</p>
        </div>

        {errorText ? <p className="notice error">{errorText}</p> : null}

        <form className="form-card" action="/api/auth/register" method="post">
          <input type="hidden" name="next" value={nextPath} />

          <label className="field-label" htmlFor="username">{copy.username}</label>
          <input id="username" name="username" autoComplete="username" placeholder="hanako_2026" required />
          <p className="hint">{copy.usernameHint}</p>

          <label className="field-label" htmlFor="email">{copy.email}</label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
          <p className="hint">{copy.emailHint}</p>

          <label className="field-label" htmlFor="password">{copy.password}</label>
          <input id="password" name="password" type="password" autoComplete="new-password" required />
          <p className="hint">{copy.passwordNewHint}</p>

          <fieldset className="agree">
            <legend>{copy.agreeTitle}</legend>
            <p className="hint">{copy.agreeLead}</p>

            {[
              { field: "agree_terms", href: "/terms", label: copy.agreeTerms },
              { field: "agree_rules", href: "/rules", label: copy.agreeRules },
              { field: "agree_privacy", href: "/privacy", label: copy.agreePrivacy },
              { field: "agree_moderation", href: "/moderation-policy", label: copy.agreeModeration },
            ].map((item) => (
              <div className="agree-row" key={item.field}>
                <input id={item.field} name={item.field} type="checkbox" value="yes" required />
                <label htmlFor={item.field}>{item.label}</label>
                <Link href={item.href} target="_blank" rel="noreferrer noopener">
                  {copy.agreeOpen}
                </Link>
              </div>
            ))}
            <p className="hint">{copy.agreeHint}</p>
          </fieldset>

          <div className="form-foot">
            <button className="btn btn-p" type="submit">{copy.registerSubmit}</button>
            <span className="hint">{copy.haveAccount} <Link href={loginHref}>{copy.loginLink}</Link></span>
          </div>
        </form>

        <div className="form-card">
          <h2>{copy.noticeTitle}</h2>
          <ul className="auth-list">
            <li>{copy.noticePublic}</li>
            <li>{copy.noticeForbidden}</li>
          </ul>
        </div>
      </main>
    </ThemedPage>
  );
}
