import type { Role } from "@prisma/client";
import { type Locale, t } from "@/lib/i18n";

const STYLES: Record<Role, string> = {
  ADMIN: "border-error/35 text-error",
  MODERATOR: "border-accent/35 text-accent",
  STUDENT: "",
};

export function RoleChip({ role, locale }: { role: Role; locale: Locale }) {
  // A student is the default reader; showing the role next to every name adds
  // noise without information. Only staff roles need a marker.
  if (role === "STUDENT") {
    return null;
  }

  return (
    <span
      className={`inline-block border px-1.5 py-0.5 font-mono text-[9.5px] uppercase leading-none tracking-[0.12em] ${STYLES[role]}`}
    >
      {t(locale).roles[role]}
    </span>
  );
}
