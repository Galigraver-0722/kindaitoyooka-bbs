import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ThemedPage, Crumb } from "@/components/theme/themed-page";
import { getCurrentUser } from "@/lib/auth";
import { getLocale, t } from "@/lib/i18n";
import { errorMessage, noticeMessage } from "@/lib/messages";
import { getTheme } from "@/lib/theme";
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
  const [{ error, notice, next }, theme, locale] = await Promise.all([searchParams, getTheme(), getLocale()]);
  const user = await getCurrentUser();
  if (user) redirect(safeNextPath(next));

  const errorText = errorMessage(error, locale);
  const noticeText = noticeMessage(notice, locale);
  const copy = t(locale).pages.auth;
  const pages = t(locale).pages;
  const nextPath = safeNextPath(next);
  const registerHref = nextPath === "/" ? "/register" : `/register?next=${encodeURIComponent(nextPath)}`;

  return (
    <ThemedPage theme={theme} username={null}>
      <main>
        <div className="page-head">
          <Crumb items={[{ href: "/", label: pages.home }, { label: copy.loginTitle }]} />
          <h1>{copy.loginTitle}</h1>
          <p className="lede">{copy.loginLede}</p>
        </div>

        {errorText ? <p className="notice error">{errorText}</p> : null}
        {noticeText ? <p className="notice">{noticeText}</p> : null}

        <form className="form-card" action="/api/auth/login" method="post">
          <input type="hidden" name="next" value={nextPath} />

          <label className="field-label" htmlFor="username">{copy.username}</label>
          <input id="username" name="username" autoComplete="username" placeholder="taro_2026" required />
          <p className="hint">{copy.usernameHint}</p>

          <label className="field-label" htmlFor="password">{copy.password}</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
          <p className="hint">{copy.passwordHint}</p>

          <div className="form-foot">
            <button className="btn btn-p" type="submit">{copy.login}</button>
            <span className="hint">{copy.noAccount} <Link href={registerHref}>{copy.register}</Link></span>
          </div>
        </form>

        <div className="form-card">
          <h2>{copy.canTitle}</h2>
          <ul className="auth-list">
            <li>{copy.canReplies}</li>
            <li>{copy.canSaved}</li>
            <li>{copy.canLikes}</li>
            <li>{copy.canBoards}</li>
          </ul>
        </div>

        <p className="notice">
          {copy.firstTime} <Link href={registerHref}>{copy.register}</Link>.{" "}
          <Link href="/rules">{copy.rules}</Link> · <Link href="/privacy">{copy.privacy}</Link>
        </p>
      </main>
    </ThemedPage>
  );
}
