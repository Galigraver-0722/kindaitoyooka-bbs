import type { Locale } from "@/lib/i18n";

const EN_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Tokyo",
});

const JA_FORMATTER = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Tokyo",
});

/** The school is in Japan, so every timestamp is rendered in JST. */
export function formatDateTime(date: Date, locale: Locale): string {
  const formatter = locale === "ja" ? JA_FORMATTER : EN_FORMATTER;
  return `${formatter.format(date)} JST`;
}

export function formatNumber(value: number, locale: Locale): string {
  return value.toLocaleString(locale === "ja" ? "ja-JP" : "en-US");
}
