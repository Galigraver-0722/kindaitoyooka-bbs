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
  const [{ error, next }, theme] = await Promise.all([searchParams, getTheme()]);
  const user = await getCurrentUser();
  if (user) redirect(safeNextPath(next));

  const errorText = errorMessage(error, "ja");
  const nextPath = safeNextPath(next);

  return (
    <ThemedPage theme={theme} username={null}>
      <main>
        <div className="page-head">
          <Crumb items={[{ href: "/", label: "ホーム" }, { label: "新規登録" }]} />
          <h1>新規登録</h1>
          <p className="lede">全校生徒のための掲示板です。ユーザー名とパスワードを決めて登録してください。</p>
        </div>

        {errorText ? <p className="notice error">{errorText}</p> : null}

        <form className="form-card" action="/api/auth/register" method="post">
          <input type="hidden" name="next" value={nextPath} />
          <label className="field-label" htmlFor="username">ユーザー名</label>
          <input id="username" name="username" autoComplete="username" required />
          <label className="field-label" htmlFor="email">メールアドレス</label>
          <input id="email" name="email" type="email" autoComplete="email" />
          <label className="field-label" htmlFor="password">パスワード</label>
          <input id="password" name="password" type="password" autoComplete="new-password" required />
          <div className="form-foot">
            <button className="btn btn-p" type="submit">登録する</button>
            <span className="hint">すでにアカウントがある方は <Link href="/login">ログイン</Link></span>
          </div>
        </form>
      </main>
    </ThemedPage>
  );
}
