import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ThemedPage, Crumb } from "@/components/theme/themed-page";
import { getCurrentUser } from "@/lib/auth";
import { getLocale, t } from "@/lib/i18n";
import { errorMessage } from "@/lib/messages";
import { getTheme } from "@/lib/theme";
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
  const [{ error, next }, theme] = await Promise.all([searchParams, getTheme()]);
  const user = await getCurrentUser();
  if (user) redirect(safeNextPath(next));

  const errorText = errorMessage(error, "ja");
  const nextPath = safeNextPath(next);
  const loginHref = nextPath === "/" ? "/login" : `/login?next=${encodeURIComponent(nextPath)}`;

  return (
    <ThemedPage theme={theme} username={null}>
      <main>
        <div className="page-head">
          <Crumb items={[{ href: "/", label: "ホーム" }, { label: "新規登録" }]} />
          <h1>新規登録</h1>
          <p className="lede">
            全校生徒のための掲示板です。ユーザー名とパスワードを決めると、すぐに書き込めます。登録は無料で、あとから削除もできます。
          </p>
        </div>

        {errorText ? <p className="notice error">{errorText}</p> : null}

        <form className="form-card" action="/api/auth/register" method="post">
          <input type="hidden" name="next" value={nextPath} />

          <label className="field-label" htmlFor="username">ユーザー名</label>
          <input id="username" name="username" autoComplete="username" placeholder="例: hanako_2026" required />
          <p className="hint">
            {LIMITS.usernameMin}〜{LIMITS.usernameMax} 文字の半角英数字とアンダースコア（_）。投稿に表示され、あとから変更できません。
            本名や住所など、個人が特定される情報は入れないでください。
          </p>

          <label className="field-label" htmlFor="email">メールアドレス（任意）</label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
          <p className="hint">
            入力しなくても登録できます。連絡用として保存され、他の生徒には表示されません。
          </p>

          <label className="field-label" htmlFor="password">パスワード</label>
          <input id="password" name="password" type="password" autoComplete="new-password" required />
          <p className="hint">
            {LIMITS.passwordMin} 文字以上。推測されにくいものにしてください。他の生徒と共有したり、使い回したりしないでください。
          </p>

          <div className="form-foot">
            <button className="btn btn-p" type="submit">登録する</button>
            <span className="hint">すでにアカウントがある方は <Link href={loginHref}>ログイン</Link></span>
          </div>
        </form>

        <div className="form-card">
          <h2>登録前に確認してください</h2>
          <ul className="auth-list">
            <li>書き込んだ内容は全校生徒が読めます。消しても完全には消えない場合があります。</li>
            <li>人の悪口、個人情報、外部への連絡先の投稿は禁止です。</li>
            <li>最初の登録者が管理者になります。学校のアカウントとして使う場合は、先に管理者を作ってください。</li>
            <li>利用前に <Link href="/rules">コミュニティルール</Link> と <Link href="/privacy">プライバシー通知</Link> を読んでください。</li>
          </ul>
        </div>
      </main>
    </ThemedPage>
  );
}
