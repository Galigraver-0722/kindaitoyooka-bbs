import { cookieSecure } from "@/lib/auth";
import { formText, isOversized, isSameOrigin, payloadTooLarge, sameHostPath, seeOther } from "@/lib/http";
import { isLocale, LOCALE_COOKIE } from "@/lib/i18n";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  if (isOversized(request)) {
    return payloadTooLarge();
  }

  const data = await request.formData();
  const requested = formText(data, LOCALE_COOKIE);
  const target = sameHostPath(request);

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
