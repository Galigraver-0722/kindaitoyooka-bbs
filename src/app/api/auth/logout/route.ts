import { cookies } from "next/headers";
import { destroySession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { isSameOrigin, seeOther } from "@/lib/http";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (token) {
    await destroySession(token);
  }

  const response = seeOther(request, "/?notice=signed-out");
  response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(new Date(0)), maxAge: 0 });
  return response;
}
