export const THREADS_PER_PAGE = 20;

/** Page numbers come from the query string, so treat anything invalid as page 1. */
export function parsePage(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function totalPages(count: number, perPage = THREADS_PER_PAGE): number {
  return Math.max(1, Math.ceil(Math.max(count, 0) / perPage));
}

/**
 * Keep `sort` when moving between pages, and keep page 1 as a clean URL so the
 * canonical board link does not gain a redundant `?page=1`.
 */
export function boardPageHref(
  slug: string,
  options: { page: number; sort?: "latest" | "hot" },
): string {
  const params = new URLSearchParams();
  if (options.sort === "hot") {
    params.set("sort", "hot");
  }
  if (options.page > 1) {
    params.set("page", String(options.page));
  }

  const query = params.toString();
  return `/b/${slug}${query ? `?${query}` : ""}`;
}
