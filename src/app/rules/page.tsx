import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy-page";
import { getLocale } from "@/lib/i18n";
import { policyFor } from "@/lib/policies";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: policyFor(locale, "rules").title };
}

export const dynamic = "force-dynamic";

export default async function RulesPage() {
  const locale = await getLocale();
  return <PolicyPage document={policyFor(locale, "rules")} />;
}
