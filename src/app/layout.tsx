import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCurrentUser } from "@/lib/auth";
import { getLocale, t } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const m = t(locale);

  return {
    title: {
      default: m.meta.title,
      template: `%s · ${m.meta.title}`,
    },
    description: m.meta.description,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()]);

  return (
    <html lang={locale}>
      <body className="flex min-h-screen flex-col bg-bg text-ink antialiased">
        <SiteHeader user={user} locale={locale} />
        <div className="flex-1">{children}</div>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
