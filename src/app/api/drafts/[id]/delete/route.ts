import { getCurrentUser } from "@/lib/auth";
import { deleteDraft } from "@/lib/drafts";
import { isOversized, isSameOrigin, payloadTooLarge, seeOther } from "@/lib/http";

/** Discard a draft. The id is scoped to the signed-in account in the query. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }
  if (isOversized(request)) {
    return payloadTooLarge();
  }

  const user = await getCurrentUser();
  if (!user) {
    return seeOther(request, "/login?next=/new");
  }

  const { id } = await params;
  await deleteDraft(user.id, id);

  return seeOther(request, "/new?notice=draft-discarded");
}
