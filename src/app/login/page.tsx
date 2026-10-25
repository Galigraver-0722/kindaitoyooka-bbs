import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ThemedPage, Crumb } from "@/components/theme/themed-page";
import { getCurrentUser } from "@/lib/auth";
import { getLocale, t } from "@/lib/i18n";
import { errorMessage, noticeMessage } from "@/lib/messages";
import { getTheme } from "@/lib/theme";
import { LIMITS, safeNextPath } from "@/lib/validation";

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
  const registerHref = nextPath === "/" ? "/register" : `/register?next=${encodeURIComponent(nextPath)}`;

  return (
    <ThemedPage theme={theme} username={null}>
      <main>
        <div className="page-head">
          <Crumb items={[{ href: "/", label: "ホーム" }, { label: "ログイン" }]} />
          <h1>ログイン</h1>
          <p className="lede">
            ユーザー名とパスワードを入れてください。ログインすると、返信・いいね・保存ができます。
          </p>
        </div>

        {errorText ? <p className="notice error">{errorText}</p> : null}
        {noticeText ? <p className="notice">{noticeText}</p> : null}

        <form className="form-card" action="/api/auth/login" method="post">
          <input type="hidden" name="next" value={nextPath} />

          <label className="field-label" htmlFor="username">ユーザー名</label>
          <input id="username" name="username" autoComplete="username" placeholder="例: taro_2026" required />
          <p className="hint">
            登録したときのユーザー名。半角英数字とアンダースコア（_）で {LIMITS.usernameMin}〜{LIMITS.usernameMax} 文字です。
          </p>

          <label className="field-label" htmlFor="password">パスワード</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
          <p className="hint">
            {LIMITS.passwordMin} 文字以上。大文字と小文字は区別されます。忘れた場合は自分で再設定できないので、教職員か管理者に連絡してください。
          </p>

          <div className="form-foot">
            <button className="btn btn-p" type="submit">ログイン</button>
            <span className="hint">アカウントがない方は <Link href={registerHref}>新規登録</Link></span>
          </div>
        </form>

        <div className="form-card">
          <h2>ログインするとできること</h2>
          <ul className="auth-list">
            <li>スレッドへの返信と、コメントへの返信</li>
            <li>スレッドの保存（あとで「保存」から読めます）</li>
            <li>スレッドとコメントへのいいね</li>
            <li>自分のボードの作成（1 アカウント 3 つまで）</li>
          </ul>
        </div>

        <p className="notice">
          はじめての方は <Link href={registerHref}>新規登録</Link> から。
          利用前に <Link href="/rules">コミュニティルール</Link> と <Link href="/privacy">プライバシー通知</Link> も確認してください。
        </p>
      </main>
    </ThemedPage>
  );
}
