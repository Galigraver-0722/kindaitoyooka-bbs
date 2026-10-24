import Link from "next/link";
import { getLocale, t } from "@/lib/i18n";

export default async function NotFound() {
  const locale = await getLocale();
  const m = t(locale).notFound;

  return (
    <main className="shell flex min-h-[60vh] items-center py-20">
      <div className="grid w-full gap-8 lg:grid-cols-[auto_1fr] lg:items-end">
        <p className="font-mono text-[5rem] leading-none tracking-[-0.06em] text-line sm:text-[7rem]">
          {m.code}
        </p>
        <div className="border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <h1 className="title-page">{m.heading}</h1>
          <p className="mt-3 max-w-[46ch] text-[13px] leading-[1.9] text-muted">{m.body}</p>
          <Link href="/" className="btn btn-secondary mt-7">
            {m.back}
          </Link>
        </div>
      </div>
    </main>
  );
}
