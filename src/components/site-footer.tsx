import { type Locale, t } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const m = t(locale).footer;

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl">{m.disclaimer}</p>
        <p>{m.license}</p>
      </div>
    </footer>
  );
}
