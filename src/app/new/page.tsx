import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ThemedPage, Crumb } from "@/components/theme/themed-page";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getLocale, t } from "@/lib/i18n";
import { errorMessage } from "@/lib/messages";
import { parseSuggestedTags } from "@/lib/tags";
import { getTheme } from "@/lib/theme";
import { LIMITS } from "@/lib/validation";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: t(locale).newThread.title };
}

export const dynamic = "force-dynamic";

export default async function NewThreadPage({
  searchParams,
}: {
  searchParams: Promise<{ board?: string; error?: string }>;
}) {
  const [{ board: preferredSlug, error }, theme] = await Promise.all([searchParams, getTheme()]);
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(preferredSlug ? `/new?board=${preferredSlug}` : "/new")}`);
  }

  const boards = await prisma.board.findMany({
    where: { isArchived: false },
    orderBy: { sortOrder: "asc" },
    select: { id: true, slug: true, name: true, suggestedTags: true },
  });
  const selectedBoard = boards.find((board) => board.slug === preferredSlug) ?? boards[0];
  const suggestedTags = selectedBoard ? parseSuggestedTags(selectedBoard.suggestedTags) : [];
  const errorText = errorMessage(error, "ja");

  return (
    <ThemedPage theme={theme} username={user.username} active="new">
      <main>
        <div className="page-head">
          <Crumb items={[{ href: "/", label: "ボード" }, { label: "スレッドを立てる" }]} />
          <h1>スレッドを立てる</h1>
          <p className="lede">質問でも連絡でも、まず 1 本立ててみてください。全校生徒が読める場所です。</p>
        </div>

        {errorText ? <p className="notice error">{errorText}</p> : null}

        {boards.length === 0 || !selectedBoard ? (
          <p className="empty">投稿できるボードがまだありません。管理者に連絡してください。</p>
        ) : (
          <form className="form-card" action="/api/threads" method="post">
            <label className="field-label" htmlFor="boardId">ボード</label>
            <select id="boardId" name="boardId" defaultValue={selectedBoard.id}>
              {boards.map((board) => (
                <option key={board.id} value={board.id}>{board.name}</option>
              ))}
            </select>

            <label className="field-label" htmlFor="title">タイトル</label>
            <input id="title" name="title" required minLength={LIMITS.titleMin} maxLength={LIMITS.titleMax} placeholder="例：文化祭のステージ企画、メンバー募集" />

            <label className="field-label" htmlFor="tags">タグ</label>
            <input id="tags" name="tags" maxLength={150} placeholder="#文化祭 #実行委員" />
            <p className="hint">スペースかカンマで区切って最大 5 個。</p>
            {suggestedTags.length > 0 ? (
              <p className="hint">このボードのおすすめ: {suggestedTags.map((tag) => `#${tag}`).join(" ")}</p>
            ) : null}

            <label className="field-label" htmlFor="body">本文</label>
            <textarea id="body" name="body" required maxLength={LIMITS.bodyMax} rows={9} />

            <div className="form-foot">
              <button className="btn btn-p" type="submit">スレッドを立てる</button>
              <Link className="hint" href={preferredSlug ? `/b/${preferredSlug}` : "/"}>キャンセル</Link>
            </div>
          </form>
        )}
      </main>
    </ThemedPage>
  );
}
