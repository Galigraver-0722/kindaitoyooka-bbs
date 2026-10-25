import { LOCALE_COOKIE, type Locale } from "@/lib/i18n";

/**
 * Two plain forms, no client JavaScript. `/api/locale` reads the Referer header
 * to send the reader back to the page they were on.
 */
export function LanguageToggle({ locale }: { locale: Locale }) {
  return (
    <div className="lang" role="group" aria-label="Language">
      {(["ja", "en"] as const).map((value) => (
        <form action="/api/locale" method="post" key={value}>
          <input type="hidden" name={LOCALE_COOKIE} value={value} />
          <button
            type="submit"
            className={locale === value ? "on" : ""}
            aria-pressed={locale === value}
            aria-label={value === "ja" ? "日本語" : "English"}
          >
            {value === "ja" ? "JA" : "EN"}
          </button>
        </form>
      ))}
    </div>
  );
}
