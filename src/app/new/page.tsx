import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getLocale, t } from "@/lib/i18n";
import { errorMessage } from "@/lib/messages";
import { parseSuggestedTags } from "@/lib/tags";
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
  const [{ board: preferredSlug, error }, locale] = await Promise.all([searchParams, getLocale()]);
  const m = t(locale);
  const user = await getCurrentUser();

  if (!user) {
    redirect(
      `/login?next=${encodeURIComponent(preferredSlug ? `/new?board=${preferredSlug}` : "/new")}`,
    );
  }

  const boards = await prisma.board.findMany({
    where: { isArchived: false },
    orderBy: { sortOrder: "asc" },
    select: { id: true, slug: true, name: true, suggestedTags: true },
  });

  const selectedBoard = boards.find((board) => board.slug === preferredSlug) ?? boards[0];
  const suggestedTags = selectedBoard ? parseSuggestedTags(selectedBoard.suggestedTags) : [];
  const errorText = errorMessage(error, locale);

  return (
    <main className="shell page">
      <Breadcrumbs
        items={[
          { href: "/", label: m.board.breadcrumb },
          { label: m.newThread.title },
        ]}
      />

      <div className="mt-8 grid gap-10 border-t border-line pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-20">
        <div className="max-w-md">
          <p className="eyebrow">{m.newThread.title}</p>
          <h1 className="title-page mt-3">{m.newThread.title}</h1>
          <p className="mt-4 text-[14px] leading-[1.85] text-muted">{m.newThread.subtitle}</p>

          <div className="mt-10 border-t border-line pt-6">
            <p className="eyebrow">{m.home.rulesTitle}</p>
            <ol className="mt-4 space-y-4">
              {m.home.rules.map((rule, index) => (
                <li key={rule} className="grid grid-cols-[1.5rem_1fr] gap-3">
                  <span className="num pt-0.5">{String(index + 1).padStart(2, "0")}</span>
                  <p className="text-[13px] leading-[1.8] text-muted">{rule}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="w-full max-w-xl lg:justify-self-end">
          {errorText ? <p className="notice notice-error mb-6">{errorText}</p> : null}

          {boards.length === 0 || !selectedBoard ? (
            <p className="text-[13px] text-muted">{m.newThread.noBoards}</p>
          ) : (
            <form action="/api/threads" method="post" className="space-y-7">
              <div>
                <label htmlFor="boardId" className="field-label">
                  {m.newThread.board}
                </label>
                <select
                  id="boardId"
                  name="boardId"
                  defaultValue={selectedBoard.id}
                  className="field mt-2"
                >
                  {boards.map((board) => (
                    <option key={board.id} value={board.id}>
                      {board.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="title" className="field-label">
                  {m.newThread.titleLabel}
                </label>
                <input
                  id="title"
                  name="title"
                  required
                  minLength={LIMITS.titleMin}
                  maxLength={LIMITS.titleMax}
                  placeholder={m.newThread.titlePlaceholder}
                  className="field mt-2"
                />
              </div>

              <div>
                <label htmlFor="tags" className="field-label">
                  {m.tagField.label}
                </label>
                <input
                  id="tags"
                  name="tags"
                  maxLength={150}
                  placeholder={m.tagField.placeholder}
                  className="field mt-2 py-2 text-[14px]"
                />
                <p className="hint">{m.tagField.hint}</p>
                {suggestedTags.length > 0 ? (
                  <p className="hint">
                    {m.tagField.suggested(
                      selectedBoard.name,
                      suggestedTags.map((tag) => `#${tag}`).join(" "),
                    )}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="body" className="field-label">
                  {m.newThread.message}
                </label>
                <textarea
                  id="body"
                  name="body"
                  required
                  rows={9}
                  maxLength={LIMITS.bodyMax}
                  className="field mt-2 min-h-[14rem] resize-y"
                />
                <p className="hint">{m.newThread.charLimit(LIMITS.bodyMax)}</p>
              </div>

              <div className="flex flex-wrap items-center gap-5 border-t border-line pt-6">
                <button type="submit" className="btn btn-primary">
                  {m.newThread.submit}
                </button>
                <Link
                  href={preferredSlug ? `/b/${preferredSlug}` : "/"}
                  className="text-[12px] text-muted transition-colors hover:text-ink"
                >
                  {m.newThread.cancel}
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
