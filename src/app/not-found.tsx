import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">404</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">We could not find that page.</h1>
      <p className="mt-2 text-sm text-slate-500">
        The thread may have been removed, or the link may be wrong.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        Back to the boards
      </Link>
    </main>
  );
}
