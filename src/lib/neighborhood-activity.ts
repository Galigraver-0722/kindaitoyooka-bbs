/** Calendar buckets use JST, consistently with the rest of the forum. */
export function neighborhoodActivity(dates: Date[], now = new Date()) {
  const key = (date: Date) => new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const today = key(now);
  const counts = new Map<string, number>();
  for (const date of dates) {
    const day = key(date);
    if (day <= today) counts.set(day, (counts.get(day) ?? 0) + 1);
  }
  const midnight = new Date(`${today}T00:00:00+09:00`).getTime();
  return Array.from({ length: 14 }, (_, index) => {
    const date = key(new Date(midnight - (13 - index) * 86400000));
    return { date, label: `${Number(date.slice(5, 7))}/${Number(date.slice(8, 10))}`, count: counts.get(date) ?? 0 };
  });
}
