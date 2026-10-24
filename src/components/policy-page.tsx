import type { PolicyDocument } from "@/lib/policies";

export function PolicyPage({ document }: { document: PolicyDocument }) {
  return (
    <main className="shell page">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-20">
        <article className="max-w-[68ch]">
          <header className="border-b border-line pb-8">
            <p className="eyebrow">Toyooka BBS</p>
            <h1 className="title-page mt-4">{document.title}</h1>
            <p className="meta mt-4">{document.updated}</p>
            <p className="mt-6 text-[15.5px] leading-[1.9] text-muted">{document.intro}</p>
          </header>

          <div className="mt-10 space-y-10">
            {document.sections.map((section, index) => (
              <section key={section.heading} id={`section-${index + 1}`} className="scroll-mt-24">
                <h2 className="title-section">{section.heading}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-[15.5px] leading-[1.9] text-ink/85">
                    {paragraph}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-[15.5px] leading-[1.9] text-ink/85 marker:text-line">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="pl-1">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24 border-l border-line pl-6">
            <p className="eyebrow">Contents</p>
            <ol className="mt-4 space-y-2.5">
              {document.sections.map((section, index) => (
                <li key={section.heading}>
                  <a
                    href={`#section-${index + 1}`}
                    className="text-[12px] leading-snug text-muted transition-colors hover:text-ink"
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </main>
  );
}
