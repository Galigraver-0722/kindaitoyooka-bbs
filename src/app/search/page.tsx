import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/** Search results are the home feed with `q` applied. */
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; sort?: string }>;
}) {
  const { q, tag, sort } = await searchParams;
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (tag) params.set("q", `#${tag}`);
  if (sort) params.set("sort", sort);
  const qs = params.toString();
  redirect(qs ? `/?${qs}` : "/");
}
