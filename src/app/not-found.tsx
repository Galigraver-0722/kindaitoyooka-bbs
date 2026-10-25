import Link from "next/link";
import { ThemedPage } from "@/components/theme/themed-page";
import { getTheme } from "@/lib/theme";
import { getLocale, t } from "@/lib/i18n";

export default async function NotFound() {
  const [theme, locale] = await Promise.all([getTheme(), getLocale()]);
  const copy = t(locale).pages.notFound;

  return (
    <ThemedPage theme={theme} username={null}>
      <main>
        <div className="page-head">
          <p className="crumb">404</p>
          <h1>{copy.title}</h1>
          <p className="lede">{copy.lede}</p>
          <div className="row-meta">
            <Link className="pill" href="/">{copy.home}</Link>
            <Link className="pill" href="/">{copy.threads}</Link>
          </div>
        </div>
      </main>
    </ThemedPage>
  );
}
