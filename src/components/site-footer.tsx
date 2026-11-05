import Link from "next/link";
import { type Locale, t } from "@/lib/i18n";
import { REPOSITORY, REPOSITORY_URL } from "@/lib/site";
import { versionTag } from "@/lib/version";

export function SiteFooter({ locale }: { locale: Locale }) {
  const m = t(locale).footer;

  return (
    <footer className="site-footer mt-24 border-t border-line">
      <div className="shell grid gap-10 py-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="eyebrow">Kinjo · 近所</p>
          <p className="mt-4 max-w-[52ch] text-[13px] leading-[1.8] text-muted">{m.disclaimer}</p>
        </div>

        <nav
          className="flex flex-col gap-2.5 text-[13px] md:col-span-3"
          aria-label={m.policies}
        >
          <Link href="/about" className="text-muted transition-colors hover:text-ink">
            {m.about}
          </Link>
          <Link href="/terms" className="text-muted transition-colors hover:text-ink">
            {m.terms}
          </Link>
          <Link href="/rules" className="text-muted transition-colors hover:text-ink">
            {m.rules}
          </Link>
          <Link href="/privacy" className="text-muted transition-colors hover:text-ink">
            {m.privacy}
          </Link>
          <Link href="/moderation-policy" className="text-muted transition-colors hover:text-ink">
            {m.moderation}
          </Link>
          <Link href="/b/meta" className="text-muted transition-colors hover:text-ink">
            {m.contact}
          </Link>
        </nav>

        <div className="md:col-span-3 md:text-right">
          <p className="meta">{m.license}</p>
          <p className="meta mt-2">MIT · {versionTag()}</p>
          <a
            className="meta mt-2 inline-block transition-colors hover:text-ink"
            href={REPOSITORY_URL}
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub · {REPOSITORY}
          </a>
          <p className="meta mt-2">{m.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
