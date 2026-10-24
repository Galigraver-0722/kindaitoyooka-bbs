import type { Role } from "@prisma/client";

const STYLES: Record<Role, string> = {
  ADMIN: "bg-rose-100 text-rose-700 ring-rose-200",
  MODERATOR: "bg-amber-100 text-amber-800 ring-amber-200",
  STUDENT: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function RoleChip({ role }: { role: Role }) {
  return (
    <span
      className={`ml-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ring-1 ring-inset ${STYLES[role]}`}
    >
      {role.toLowerCase()}
    </span>
  );
}
