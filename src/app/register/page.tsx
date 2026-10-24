import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getLocale, t } from "@/lib/i18n";
import { errorMessage } from "@/lib/messages";
import { LIMITS, safeNextPath } from "@/lib/validation";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: t(locale).auth.registerTitle };
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const [{ error, next }, locale] = await Promise.all([searchParams, getLocale()]);
  const m = t(locale);
  const user = await getCurrentUser();

  if (user) {
    redirect(safeNextPath(next));
  }

  const errorText = errorMessage(error, locale);

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {m.auth.registerTitle}
        </h1>
        <p className="mt-2 text-sm text-slate-500">{m.auth.registerSubtitle}</p>

        {errorText ? (
          <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
            {errorText}
          </p>
        ) : null}

        <form action="/api/auth/register" method="post" className="mt-6 space-y-4">
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
              minLength={LIMITS.usernameMin}
              maxLength={LIMITS.usernameMax}
              pattern="[A-Za-z0-9_]+"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            <p className="mt-1 text-xs text-slate-500">{m.auth.usernameHint}</p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              {m.auth.email}{" "}
              <span className="font-normal text-slate-400">{m.auth.optional}</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            <p className="mt-1 text-xs text-slate-500">{m.auth.emailHint}</p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              {m.auth.password}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={LIMITS.passwordMin}
              maxLength={LIMITS.passwordMax}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            <p className="mt-1 text-xs text-slate-500">{m.auth.passwordHint}</p>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
          >
            {m.auth.createButton}
          </button>
        </form>

        <p className="mt-5 text-xs text-slate-500">
          {m.auth.termsPrefix}
          <Link href="/rules" className="font-medium text-indigo-600 hover:text-indigo-700">
            {m.auth.termsRules}
          </Link>
          {m.auth.termsAnd}
          <Link href="/privacy" className="font-medium text-indigo-600 hover:text-indigo-700">
            {m.auth.termsPrivacy}
          </Link>
          {m.auth.termsSuffix}
        </p>

        <p className="mt-6 text-sm text-slate-500">
          {m.auth.haveAccount}{" "}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
            {m.auth.loginLink}
          </Link>
          {m.auth.sentenceEnd}
        </p>
      </div>
    </main>
  );
}
