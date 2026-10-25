import type { Locale } from "@/lib/locales";

/** Short relative time used by lists and profiles. */
export function timeAgo(date: Date, locale: Locale = "ja"): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60_000);

  if (locale === "en") {
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  if (minutes < 1) return "たった今";
  if (minutes < 60) return `${minutes} 分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 時間前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} 日前`;
  return date.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" });
}
