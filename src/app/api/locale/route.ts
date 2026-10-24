import { cookieSecure } from "@/lib/auth";
import { formText, isSameOrigin, seeOther } from "@/lib/http";
import { isLocale, LOCALE_COOKIE } from "@/lib/i18n";

/** Return to the page the reader came from, but only on this host. */
function backTo(request: Request): string {
  const referer = request.headers.get("referer");
  if (!referer) {
    return "/";
  }

  try {
    const url = new URL(referer);
    const host = request.headers.get("host");
    if (host && url.host === host) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    // A malformed Referer is treated as "no Referer".
  }

  return "/";
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  const data = await request.formData();
  const requested = formText(data, LOCALE_COOKIE);
  const target = backTo(request);

  if (!isLocale(requested)) {
    return seeOther(request, target);
  }

  const response = seeOther(request, target);
  response.cookies.set(LOCALE_COOKIE, requested, {
    httpOnly: true,
    sameSite: "lax",
    secure: cookieSecure(),
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
