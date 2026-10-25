import Link from "next/link";
import { type Locale, t } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const m = t(locale).footer;

  return (
    <footer className="site-footer mt-24 border-t border-line">
      <div className="shell grid gap-10 py-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="eyebrow">Toyooka BBS</p>
          <p className="mt-4 max-w-[52ch] text-[13px] leading-[1.8] text-muted">{m.disclaimer}</p>
        </div>

        <nav
          className="flex flex-col gap-2.5 text-[13px] md:col-span-3"
          aria-label={m.policies}
        >
          <Link href="/rules" className="text-muted transition-colors hover:text-ink">
            {m.rules}
          </Link>
          <Link href="/privacy" className="text-muted transition-colors hover:text-ink">
            {m.privacy}
          </Link>
          <Link href="/moderation-policy" className="text-muted transition-colors hover:text-ink">
            {m.moderation}
          </Link>
        </nav>

        <div className="md:col-span-3 md:text-right">
          <p className="meta">{m.license}</p>
          <p className="meta mt-2">MIT / 2026</p>
        </div>
      </div>
    </footer>
  );
}
