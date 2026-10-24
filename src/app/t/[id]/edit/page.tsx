import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canEditThread } from "@/lib/editing";
import { getLocale, t } from "@/lib/i18n";
import { errorMessage } from "@/lib/messages";
import { LIMITS } from "@/lib/validation";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: t(locale).editing.title };
}

export const dynamic = "force-dynamic";

export default async function EditThreadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error }, locale, user] = await Promise.all([
    params,
    searchParams,
    getLocale(),
    getCurrentUser(),
  ]);
  const m = t(locale);

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/t/${id}/edit`)}`);
  }

  const thread = await prisma.thread.findUnique({
    where: { id },
    include: {
      board: { select: { slug: true, name: true } },
      tags: { select: { name: true }, orderBy: { name: "asc" } },
      posts: { orderBy: { createdAt: "asc" }, take: 1, select: { id: true, body: true } },
    },
  });

  if (!thread || thread.isDeleted) {
    notFound();
  }
  if (!canEditThread(user.id, thread)) {
    redirect(`/t/${thread.id}?error=edit-not-allowed`);
  }

  const openingPost = thread.posts[0];
  const errorText = errorMessage(error, locale);

  return (
    <main className="shell page">
      <Breadcrumbs
        items={[
          { href: "/", label: m.board.breadcrumb },
          { href: `/b/${thread.board.slug}`, label: thread.board.name },
          { href: `/t/${thread.id}`, label: thread.title },
          { label: m.editing.title },
        ]}
      />

      <div className="mt-8 grid gap-10 border-t border-line pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-20">
        <div className="max-w-md">
          <p className="eyebrow">{m.editing.title}</p>
          <h1 className="title-page mt-3">{m.editing.title}</h1>
          <p className="mt-4 text-[13px] leading-[1.85] text-muted">{m.editing.subtitle}</p>
        </div>

        <div className="w-full max-w-xl lg:justify-self-end">
          {errorText ? <p className="notice notice-error mb-6">{errorText}</p> : null}

          <form action={`/api/threads/${thread.id}/edit`} method="post" className="space-y-7">
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
                defaultValue={thread.title}
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
                defaultValue={thread.tags.map((tag) => `#${tag.name}`).join(" ")}
                placeholder={m.tagField.placeholder}
                className="field mt-2 py-2 text-[13px]"
              />
              <p className="hint">{m.tagField.hint}</p>
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
                defaultValue={openingPost?.body ?? ""}
                className="field mt-2 min-h-[14rem] resize-y"
              />
              <p className="hint">{m.newThread.charLimit(LIMITS.bodyMax)}</p>
            </div>

            <div className="flex flex-wrap items-center gap-5 border-t border-line pt-6">
              <button type="submit" className="btn btn-primary">
                {m.editing.save}
              </button>
              <Link
                href={`/t/${thread.id}`}
                className="text-[12px] text-muted transition-colors hover:text-ink"
              >
                {m.editing.cancel}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
