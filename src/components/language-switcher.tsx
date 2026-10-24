import { LOCALE_COOKIE, type Locale, t } from "@/lib/i18n";

/**
 * Two plain forms, no client JavaScript. The locale endpoint reads the Referer
 * header to send the reader back to the page they were on.
 */
export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const m = t(locale).language;
  const base =
    "px-1 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-150";

  return (
    <div className="flex items-center gap-1" role="group" aria-label={m.label}>
      <form action="/api/locale" method="post">
        <input type="hidden" name={LOCALE_COOKIE} value="ja" />
        <button
          type="submit"
          aria-pressed={locale === "ja"}
          className={`${base} ${
            locale === "ja" ? "text-ink" : "text-muted hover:text-ink"
          }`}
        >
          日本語
        </button>
      </form>
      <span aria-hidden="true" className="text-[10px] text-line">
        /
      </span>
      <form action="/api/locale" method="post">
        <input type="hidden" name={LOCALE_COOKIE} value="en" />
        <button
          type="submit"
          aria-pressed={locale === "en"}
          className={`${base} ${
            locale === "en" ? "text-ink" : "text-muted hover:text-ink"
          }`}
        >
          EN
        </button>
      </form>
    </div>
  );
}
