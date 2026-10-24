import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getLocale, t } from "@/lib/i18n";
import { errorMessage, noticeMessage } from "@/lib/messages";
import { safeNextPath } from "@/lib/validation";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: t(locale).auth.loginTitle };
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string; next?: string }>;
}) {
  const [{ error, notice, next }, locale] = await Promise.all([searchParams, getLocale()]);
  const m = t(locale);
  const user = await getCurrentUser();

  if (user) {
    redirect(safeNextPath(next));
  }

  const errorText = errorMessage(error, locale);
  const noticeText = noticeMessage(notice, locale);

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {m.auth.loginTitle}
        </h1>
        <p className="mt-2 text-sm text-slate-500">{m.auth.loginSubtitle}</p>

        {errorText ? (
          <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
            {errorText}
          </p>
        ) : null}
        {noticeText ? (
          <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
            {noticeText}
          </p>
        ) : null}

        <form action="/api/auth/login" method="post" className="mt-6 space-y-4">
          <input type="hidden" name="next" value={safeNextPath(next)} />

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700">
              {m.auth.username}
            </label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              {m.auth.password}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
          >
            {m.auth.loginButton}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          {m.auth.noAccount}{" "}
          <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-700">
            {m.auth.registerLink}
          </Link>
          {m.auth.sentenceEnd}
        </p>
      </div>
    </main>
  );
}
