import Link from "next/link";
import { ThemedPage } from "@/components/theme/themed-page";
import { getTheme } from "@/lib/theme";
import { getCurrentUser } from "@/lib/auth";
import { getLocale, t } from "@/lib/i18n";

export async function generateMetadata() {
  return { title: t(await getLocale()).kinjo.about };
}
export default async function AboutPage() {
  const [theme, user, locale] = await Promise.all([getTheme(), getCurrentUser(), getLocale()]);
  const copy = t(locale).kinjo;
  return <ThemedPage theme={theme} username={user?.username ?? null}>
    <main className="kinjo-about">
      <div className="page-head"><p className="hero-eyebrow">KINJO · 近所</p><h1>{copy.storyTitle}</h1><p className="lede">{copy.storyBody}</p></div>
      <article className="doc-body">
        <section><h2>{copy.nameHeading}</h2><p>{copy.nameBody}</p></section>
        <section><h2>{copy.philosophyHeading}</h2><p>{copy.philosophyBody}</p></section>
        <blockquote className="kinjo-quote">{copy.closing}</blockquote>
        <Link className="btn btn-p" href="/">{t(locale).commons.browse} <span aria-hidden="true">↗</span></Link>
      </article>
    </main>
  </ThemedPage>;
}
