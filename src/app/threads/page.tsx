import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * The thread hub was folded into the home feed. Old links keep their filters.
 */
export default async function ThreadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string; sort?: string }>;
}) {
  const { q, filter, sort } = await searchParams;
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (filter === "saved" || filter === "mine") params.set("filter", filter);
  if (sort === "hot" || sort === "rising") params.set("sort", sort);
  const qs = params.toString();
  redirect(qs ? `/?${qs}` : "/");
}
