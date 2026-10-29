import { getCurrentUser } from "@/lib/auth";
import { saveDraft } from "@/lib/drafts";
import { formText, isOversized, isSameOrigin, payloadTooLarge } from "@/lib/http";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

/**
 * Autosave endpoint for the thread composer. Returns JSON so the client can
 * show "saved at 12:04" without leaving the page.
 */
export async function POST(request: Request) {
  const json = { ok: false } as { ok: boolean; savedAt?: string; error?: string };

  if (!isSameOrigin(request)) {
    return Response.json({ ...json, error: "forbidden" }, { status: 403 });
  }
  if (isOversized(request)) {
    return payloadTooLarge();
  }

  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ ...json, error: "login-required" }, { status: 401 });
  }

  const limit = await checkRateLimit(
    `draft:${user.id}`,
    RATE_LIMITS.draft.limit,
    RATE_LIMITS.draft.windowMs,
  );
  if (!limit.allowed) {
    return Response.json({ ...json, error: "rate-limited" }, { status: 429 });
  }

  const data = await request.formData();
  const saved = await saveDraft(user.id, {
    boardId: formText(data, "boardId"),
    title: formText(data, "title"),
    body: typeof data.get("body") === "string" ? String(data.get("body")) : "",
    tags: formText(data, "tags"),
  });

  if (!saved) {
    // The form went empty: the row was removed instead of storing a blank draft.
    return Response.json({ ok: true, savedAt: new Date().toISOString(), empty: true });
  }

  return Response.json({ ok: true, savedAt: saved.updatedAt.toISOString() });
}
