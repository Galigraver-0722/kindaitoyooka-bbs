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
  const [{ error, notice, next }, theme] = await Promise.all([searchParams, getTheme()]);
  const user = await getCurrentUser();
  if (user) redirect(safeNextPath(next));

  const errorText = errorMessage(error, "ja");
  const noticeText = noticeMessage(notice, "ja");
  const nextPath = safeNextPath(next);

  return (
    <ThemedPage theme={theme} username={null}>
      <main>
        <div className="page-head">
          <Crumb items={[{ href: "/", label: "ホーム" }, { label: "ログイン" }]} />
          <h1>ログイン</h1>
          <p className="lede">登録したユーザー名とパスワードでログインしてください。</p>
        </div>

        {errorText ? <p className="notice error">{errorText}</p> : null}
        {noticeText ? <p className="notice">{noticeText}</p> : null}

        <form className="form-card" action="/api/auth/login" method="post">
          <input type="hidden" name="next" value={nextPath} />
          <label className="field-label" htmlFor="username">ユーザー名</label>
          <input id="username" name="username" autoComplete="username" required />
          <label className="field-label" htmlFor="password">パスワード</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
          <div className="form-foot">
            <button className="btn btn-p" type="submit">ログイン</button>
            <span className="hint">アカウントがない方は <Link href="/register">新規登録</Link></span>
          </div>
        </form>
      </main>
    </ThemedPage>
  );
}
