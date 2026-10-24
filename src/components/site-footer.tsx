import Link from "next/link";
import { type Locale, t } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const m = t(locale).footer;

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-slate-500">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl">{m.disclaimer}</p>
          <p>{m.license}</p>
        </div>
        <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-1" aria-label={m.policies}>
          <Link href="/rules" className="transition hover:text-slate-800">
            {m.rules}
          </Link>
          <Link href="/privacy" className="transition hover:text-slate-800">
            {m.privacy}
          </Link>
          <Link href="/moderation-policy" className="transition hover:text-slate-800">
            {m.moderation}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
