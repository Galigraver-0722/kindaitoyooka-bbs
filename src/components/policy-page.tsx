import type { PolicyDocument } from "@/lib/policies";

export function PolicyPage({ document }: { document: PolicyDocument }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{document.title}</h1>
        <p className="mt-1 text-xs text-slate-400">{document.updated}</p>
        <p className="mt-4 text-slate-600">{document.intro}</p>
      </header>

      <div className="mt-8 space-y-8">
        {document.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-semibold text-slate-900">{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-2 text-slate-700">
                {paragraph}
              </p>
            ))}
            {section.bullets ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </main>
  );
}
