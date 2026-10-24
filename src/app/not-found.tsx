import Link from "next/link";
import { getLocale, t } from "@/lib/i18n";

export default async function NotFound() {
  const locale = await getLocale();
  const m = t(locale).notFound;

  return (
    <main className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">{m.code}</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">{m.heading}</h1>
      <p className="mt-2 text-sm text-slate-500">{m.body}</p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        {m.back}
      </Link>
    </main>
  );
}
