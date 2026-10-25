import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Crumb, ThemedPage } from "@/components/theme/themed-page";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getLocale, t } from "@/lib/i18n";
import { errorMessage } from "@/lib/messages";
import { getTheme } from "@/lib/theme";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: `${t(locale).shell.createBoard} · ${t(locale).meta.title}` };
}

export const dynamic = "force-dynamic";

export default async function NewBoardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, theme, locale, user] = await Promise.all([
    searchParams,
    getTheme(),
    getLocale(),
    getCurrentUser(),
  ]);
  const copy = t(locale).pages.boardNew;

  if (!user) {
    redirect(`/login?next=${encodeURIComponent("/boards/new")}`);
  }

  const owned = await prisma.board.count({ where: { ownerId: user.id } });
  const errorText = errorMessage(error, locale);

  return (
    <ThemedPage theme={theme} username={user.username} active="boards">
      <main>
        <div className="page-head">
          <Crumb items={[{ href: "/", label: copy.crumbBoards }, { label: copy.title }]} />
          <h1>{copy.title}</h1>
          <p className="lede">{copy.limit}</p>
          <div className="row-meta">
            <span className="pill">{owned} / 3</span>
            <Link className="pill" href="/">← {copy.back}</Link>
          </div>
        </div>

        {errorText ? <p className="notice error">{errorText}</p> : null}

        <form className="form-card" action="/api/boards" method="post">
          <label className="field-label" htmlFor="name">{copy.name}</label>
          <input id="name" name="name" required minLength={2} maxLength={30} placeholder={copy.namePlaceholder} />

          <label className="field-label" htmlFor="slug">{copy.slug}</label>
          <input id="slug" name="slug" required minLength={3} maxLength={30} pattern="[a-z0-9][a-z0-9-]{1,28}[a-z0-9]" placeholder="light-music" />
          <p className="hint">{copy.slugHint}</p>

          <label className="field-label" htmlFor="description">{copy.description}</label>
          <input id="description" name="description" required minLength={2} maxLength={200} placeholder={copy.descriptionPlaceholder} />

          <label className="field-label" htmlFor="tags">{copy.tags}</label>
          <input id="tags" name="tags" maxLength={150} placeholder={t(locale).pages.compose.tagsPlaceholder} />
          <p className="hint">{copy.tagsHint}</p>

          <div className="form-foot">
            <button className="btn btn-p" type="submit">{copy.submit}</button>
            <Link className="hint" href="/">{copy.back}</Link>
          </div>
        </form>
      </main>
    </ThemedPage>
  );
}
