import { createSession, SESSION_COOKIE, sessionCookieOptions, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formText, isSameOrigin, seeOther } from "@/lib/http";
import { safeNextPath } from "@/lib/validation";

function failure(request: Request, next: string) {
  const params = new URLSearchParams({ error: "invalid-credentials" });
  if (next !== "/") {
    params.set("next", next);
  }
  return seeOther(request, `/login?${params.toString()}`);
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  const data = await request.formData();
  const username = formText(data, "username").toLowerCase();
  const passwordValue = data.get("password");
  const password = typeof passwordValue === "string" ? passwordValue : "";
  const next = safeNextPath(formText(data, "next"), "/");

  if (!username || !password) {
    return failure(request, next);
  }

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, passwordHash: true },
  });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return failure(request, next);
  }

  const { token, expiresAt } = await createSession(user.id);
  const response = seeOther(request, next);
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
  return response;
}
