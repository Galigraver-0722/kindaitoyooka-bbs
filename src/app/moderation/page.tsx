import { redirect } from "next/navigation";

/**
 * The moderation queue moved into the console at /admin, which also carries the
 * account and content tooling. This path stays as a redirect because older links
 * and bookmarks point here; there is exactly one entry point.
 */
export default async function ModerationRedirect({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const target = page && page !== "1" ? `/admin?tab=reports&page=${page}` : "/admin?tab=reports";
  redirect(target);
}
