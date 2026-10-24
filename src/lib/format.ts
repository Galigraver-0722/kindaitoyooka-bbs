const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Tokyo",
});

/** The school is in Japan, so all timestamps are rendered in JST regardless of server locale. */
export function formatDateTime(date: Date): string {
  return `${DATE_TIME_FORMATTER.format(date)} JST`;
}
