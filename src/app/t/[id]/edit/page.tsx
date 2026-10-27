import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Crumb, ThemedPage } from "@/components/theme/themed-page";
import { PostPreview } from "@/components/theme/post-preview";
import { FEATURES } from "@/lib/features";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canEditThread } from "@/lib/editing";
import { getLocale, t } from "@/lib/i18n";
import { errorMessage } from "@/lib/messages";
import { getTheme } from "@/lib/theme";
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
  const [{ id }, { error }, locale, user, theme] = await Promise.all([
    params,
    searchParams,
    getLocale(),
    getCurrentUser(),
    getTheme(),
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
    <ThemedPage theme={theme} username={user.username} active="thread" boardSlug={thread.board.slug}>
      <main>
        <div className="page-head">
          <Crumb
            items={[
              { href: "/", label: m.board.breadcrumb },
              { href: `/b/${thread.board.slug}`, label: thread.board.name },
              { href: `/t/${thread.id}`, label: thread.title },
              { label: m.editing.title },
            ]}
          />
          <h1>{m.editing.title}</h1>
          <p className="lede">{m.editing.subtitle}</p>
        </div>

        {errorText ? <p className="notice error">{errorText}</p> : null}

        <form className="form-card" action={`/api/threads/${thread.id}/edit`} method="post">
          <label className="field-label" htmlFor="title">{m.newThread.titleLabel}</label>
          <input
            id="title"
            name="title"
            required
            minLength={LIMITS.titleMin}
            maxLength={LIMITS.titleMax}
            defaultValue={thread.title}
          />

          <label className="field-label" htmlFor="tags">{m.tagField.label}</label>
          <input
            id="tags"
            name="tags"
            maxLength={150}
            defaultValue={thread.tags.map((tag) => `#${tag.name}`).join(" ")}
            placeholder={m.tagField.placeholder}
          />
          <p className="hint">{m.tagField.hint}</p>

          <label className="field-label" htmlFor="body">{m.newThread.message}</label>
          <textarea
            id="body"
            name="body"
            required
            rows={9}
            maxLength={LIMITS.bodyMax}
            defaultValue={openingPost?.body ?? ""}
          />
          <p className="hint">{m.newThread.charLimit(LIMITS.bodyMax)}</p>

          <div className="form-foot">
            {FEATURES.postPreview ? (
              <PostPreview fieldId="body" labels={t(locale).preview} maxLength={LIMITS.bodyMax} />
            ) : null}
            <button className="btn btn-p" type="submit">{m.editing.save}</button>
            <Link className="hint" href={`/t/${thread.id}`}>{m.editing.cancel}</Link>
          </div>
        </form>
      </main>
    </ThemedPage>
  );
}
