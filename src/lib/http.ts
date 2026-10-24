import { NextResponse } from "next/server";

/**
 * A 303 redirect makes the browser follow up with a GET, which is what we want
 * after handling a form POST.
 */
export function seeOther(request: Request, path: string): NextResponse {
  const fallback = new URL(request.url);
  const host = request.headers.get("host") ?? fallback.host;
  const protocol = request.headers.get("x-forwarded-proto") ?? fallback.protocol.replace(":", "");

  return NextResponse.redirect(new URL(path, `${protocol}://${host}`), 303);
}

export function formText(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Defence in depth on top of `SameSite=Lax`: reject cross-site form posts when
 * the browser sends an Origin header. Requests without an Origin header (some
 * privacy tools, non-browser clients) are allowed through.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }

  const host = request.headers.get("host");
  if (!host) {
    return false;
  }

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function withError(path: string, code: string): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}error=${encodeURIComponent(code)}`;
}
