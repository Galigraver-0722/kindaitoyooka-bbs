import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ThemedPage, Crumb } from "@/components/theme/themed-page";
import { PostPreview } from "@/components/theme/post-preview";
import { DraftAutosave } from "@/components/theme/draft-autosave";
import { FEATURES } from "@/lib/features";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getLocale, t } from "@/lib/i18n";
import { errorMessage, noticeMessage } from "@/lib/messages";
import { parseSuggestedTags } from "@/lib/tags";
import { getTheme } from "@/lib/theme";
import { getDraft, listDrafts } from "@/lib/drafts";
import { formatDateTime } from "@/lib/format";
import { LIMITS } from "@/lib/validation";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: t(locale).newThread.title };
}

export const dynamic = "force-dynamic";

export default async function NewThreadPage({
  searchParams,
}: {
  searchParams: Promise<{ board?: string; error?: string; notice?: string }>;
}) {
  const [{ board: preferredSlug, error, notice }, theme, locale] = await Promise.all([
    searchParams,
    getTheme(),
    getLocale(),
  ]);
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
  const errorText = errorMessage(error, locale);
  const noticeText = noticeMessage(notice, locale);
  const copy = t(locale).pages.compose;
  const [draft, drafts] = selectedBoard
    ? await Promise.all([getDraft(user.id, selectedBoard.id), listDrafts(user.id)])
    : [null, []];
  const previewLabels = t(locale).preview;

  return (
    <ThemedPage theme={theme} username={user.username} active="new">
      <main>
        <div className="page-head">
          <Crumb items={[{ href: "/", label: copy.crumbBoards }, { label: copy.title }]} />
          <h1>{copy.title}</h1>
          <p className="lede">{copy.lede}</p>
        </div>

        {errorText ? <p className="notice error">{errorText}</p> : null}
        {noticeText ? <p className="notice success">{noticeText}</p> : null}

        {boards.length === 0 || !selectedBoard ? (
          <p className="empty">{copy.noBoards}</p>
        ) : (
          <form className="form-card" id="compose-form" action="/api/threads" method="post">
            <label className="field-label" htmlFor="boardId">{copy.board}</label>
            <select id="boardId" name="boardId" defaultValue={selectedBoard.id}>
              {boards.map((board) => (
                <option key={board.id} value={board.id}>{board.name}</option>
              ))}
            </select>

            <label className="field-label" htmlFor="title">{copy.threadTitle}</label>
            <input id="title" name="title" required minLength={LIMITS.titleMin} maxLength={LIMITS.titleMax} placeholder={copy.titlePlaceholder} defaultValue={draft?.title ?? ""} />

            <label className="field-label" htmlFor="tags">{copy.tags}</label>
            <input id="tags" name="tags" maxLength={150} placeholder={copy.tagsPlaceholder} defaultValue={draft?.tags ?? ""} />
            <p className="hint">{copy.tagsHint}</p>
            {suggestedTags.length > 0 ? (
              <p className="hint">{copy.suggested}{suggestedTags.map((tag) => `#${tag}`).join(" ")}</p>
            ) : null}

            <label className="field-label" htmlFor="body">{copy.body}</label>
            <textarea id="body" name="body" required maxLength={LIMITS.bodyMax} rows={9} defaultValue={draft?.body ?? ""} />

            <div className="form-foot">
              {FEATURES.postPreview ? (
                <PostPreview fieldId="body" labels={previewLabels} maxLength={LIMITS.bodyMax} />
              ) : null}
              <button className="btn btn-p" type="submit">{copy.submit}</button>
              <Link className="hint" href={preferredSlug ? `/b/${preferredSlug}` : "/"}>{copy.cancel}</Link>
            </div>
            <DraftAutosave
              formId="compose-form"
              labels={{
                hint: copy.draftHint,
                saving: copy.draftSaving,
                saved: copy.draftSaved,
                failed: copy.draftFailed,
              }}
            />
          </form>
        )}

        {boards.length > 0 && drafts.length > 0 ? (
          <section className="form-card">
            <h2>{copy.draftsTitle}</h2>
            <ul className="draft-list">
              {drafts.map((item) => (
                <li className="draft-row" key={item.id}>
                  <div className="dr-main">
                    <Link href={`/new?board=${item.boardSlug}`}>
                      {item.title.trim() || item.body.trim().slice(0, 40) || "—"}
                    </Link>
                    <span className="dr-meta">
                      {item.boardName} · {copy.draftUpdated} {formatDateTime(item.updatedAt, locale)}
                    </span>
                  </div>
                  <Link className="btn ghost" href={`/new?board=${item.boardSlug}`}>{copy.draftResume}</Link>
                  <form action={`/api/drafts/${item.id}/delete`} method="post">
                    <button className="btn ghost" type="submit">{copy.draftDiscard}</button>
                  </form>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
    </ThemedPage>
  );
}
