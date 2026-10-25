import type { Metadata } from "next";
import { DocPage } from "@/components/theme/doc-page";
import { getLocale } from "@/lib/i18n";
import { policyFor } from "@/lib/policies";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: policyFor(locale, "rules").title };
}

export const dynamic = "force-dynamic";

export default async function RulesPage() {
  const locale = await getLocale();
  return <DocPage docKey="rules" document={policyFor(locale, "rules")} />;
}
