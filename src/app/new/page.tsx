import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ThemedPage, Crumb } from "@/components/theme/themed-page";
import { PostPreview } from "@/components/theme/post-preview";
import { FEATURES } from "@/lib/features";
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
  const [{ board: preferredSlug, error }, theme, locale] = await Promise.all([searchParams, getTheme(), getLocale()]);
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
  const copy = t(locale).pages.compose;
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

        {boards.length === 0 || !selectedBoard ? (
          <p className="empty">{copy.noBoards}</p>
        ) : (
          <form className="form-card" action="/api/threads" method="post">
            <label className="field-label" htmlFor="boardId">{copy.board}</label>
            <select id="boardId" name="boardId" defaultValue={selectedBoard.id}>
              {boards.map((board) => (
                <option key={board.id} value={board.id}>{board.name}</option>
              ))}
            </select>

            <label className="field-label" htmlFor="title">{copy.threadTitle}</label>
            <input id="title" name="title" required minLength={LIMITS.titleMin} maxLength={LIMITS.titleMax} placeholder={copy.titlePlaceholder} />

            <label className="field-label" htmlFor="tags">{copy.tags}</label>
            <input id="tags" name="tags" maxLength={150} placeholder={copy.tagsPlaceholder} />
            <p className="hint">{copy.tagsHint}</p>
            {suggestedTags.length > 0 ? (
              <p className="hint">{copy.suggested}{suggestedTags.map((tag) => `#${tag}`).join(" ")}</p>
            ) : null}

            <label className="field-label" htmlFor="body">{copy.body}</label>
            <textarea id="body" name="body" required maxLength={LIMITS.bodyMax} rows={9} />

            <div className="form-foot">
              {FEATURES.postPreview ? (
                <PostPreview fieldId="body" labels={previewLabels} maxLength={LIMITS.bodyMax} />
              ) : null}
              <button className="btn btn-p" type="submit">{copy.submit}</button>
              <Link className="hint" href={preferredSlug ? `/b/${preferredSlug}` : "/"}>{copy.cancel}</Link>
            </div>
          </form>
        )}
      </main>
    </ThemedPage>
  );
}
