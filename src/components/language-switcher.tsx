import { LOCALE_COOKIE, type Locale, t } from "@/lib/i18n";

/**
 * Two plain forms, no client JavaScript. The locale endpoint reads the Referer
 * header to send the reader back to the page they were on.
 */
export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const m = t(locale).language;
  const base =
    "rounded px-2 py-1 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-600";

  return (
    <div
      className="ml-auto flex items-center gap-1 rounded-md border border-slate-300 p-0.5"
      role="group"
      aria-label={m.label}
    >
      <form action="/api/locale" method="post">
        <input type="hidden" name={LOCALE_COOKIE} value="ja" />
        <button
          type="submit"
          aria-pressed={locale === "ja"}
          className={`${base} ${
            locale === "ja" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          日本語
        </button>
      </form>
      <form action="/api/locale" method="post">
        <input type="hidden" name={LOCALE_COOKIE} value="en" />
        <button
          type="submit"
          aria-pressed={locale === "en"}
          className={`${base} ${
            locale === "en" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          EN
        </button>
      </form>
    </div>
  );
}
