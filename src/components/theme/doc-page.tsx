import Link from "next/link";
import { Crumb, ThemedPage } from "@/components/theme/themed-page";
import { getCurrentUser } from "@/lib/auth";
import { getLocale, t } from "@/lib/i18n";
import { getTheme } from "@/lib/theme";
import type { PolicyDocument, PolicyKey } from "@/lib/policies";

const ORDER: { key: PolicyKey; href: string }[] = [
  { key: "rules", href: "/rules" },
  { key: "privacy", href: "/privacy" },
  { key: "moderation", href: "/moderation-policy" },
];

/**
 * One layout for every written policy, in both designs. The text comes from
 * `src/lib/policies.ts`, so the English and Japanese editions stay in step.
 */
export async function DocPage({ docKey, document }: { docKey: PolicyKey; document: PolicyDocument }) {
  const [theme, locale, user] = await Promise.all([getTheme(), getLocale(), getCurrentUser()]);
  const copy = t(locale).docs;
  const footer = t(locale).footer;
  const labels: Record<PolicyKey, string> = {
    rules: footer.rules,
    privacy: footer.privacy,
    moderation: footer.moderation,
  };

  return (
    <ThemedPage theme={theme} username={user?.username ?? null}>
      <main>
        <div className="page-head doc-head">
          <Crumb items={[{ href: "/", label: copy.crumb }, { label: document.title }]} />
          <h1>{document.title}</h1>
          <p className="lede">{document.intro}</p>
          <div className="row-meta">
            <span className="pill">{document.updated}</span>
            <span className="pill">{copy.crumb}</span>
          </div>
        </div>

        <div className="doc-cols">
          <article className="doc-body">
            {document.sections.map((section, index) => (
              <section key={section.heading} id={`section-${index + 1}`}>
                <h2>{section.heading}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets ? (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </article>

          <aside className="doc-side">
            <div className="doc-toc" role="navigation" aria-label={copy.contents}>
              <p className="cap">{copy.contents}</p>
              <ol>
                {document.sections.map((section, index) => (
                  <li key={section.heading}>
                    <a href={`#section-${index + 1}`}>{section.heading}</a>
                  </li>
                ))}
              </ol>
            </div>
            <div className="doc-links" role="navigation" aria-label={copy.documents}>
              <p className="cap">{copy.documents}</p>
              <ul>
                {ORDER.map((item) => (
                  <li key={item.key}>
                    <Link className={item.key === docKey ? "on" : ""} href={item.href}>
                      {labels[item.key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </ThemedPage>
  );
}
