import { canChangeRole } from "@/lib/admin";
import { getCurrentUser } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { formText, isSameOrigin, seeOther } from "@/lib/http";

const ROLES = ["STUDENT", "MODERATOR", "ADMIN"] as const;
type RoleName = (typeof ROLES)[number];

/**
 * Change a role. Administrators only, never on yourself, and the last remaining
 * administrator cannot be demoted — otherwise the site can end up with nobody
 * allowed to appoint anyone.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) {
    return new Response("Forbidden", { status: 403 });
  }

  const actor = await getCurrentUser();
  if (!actor) {
    return seeOther(request, "/login?next=/admin");
  }

  const { id } = await params;
  const data = await request.formData();
  const next = formText(data, "role").toUpperCase() as RoleName;
  if (!ROLES.includes(next)) {
    return seeOther(request, "/admin?tab=users&error=invalid-input");
  }

  const target = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true, isSuspended: true },
  });
  if (!target) {
    return seeOther(request, "/admin?tab=users&error=not-found");
  }

  const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
  const decision = canChangeRole(actor, target, adminCount, next);
  if (!decision.ok) {
    const code = decision.reason === "self" ? "self" : decision.reason;
    return seeOther(request, `/admin?tab=users&error=${code}`);
  }

  if (target.role === next) {
    return seeOther(request, "/admin?tab=users");
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id }, data: { role: next } });
    await recordAudit(tx, {
      actorId: actor.id,
      action: "user.role",
      targetType: "user",
      targetId: id,
      details: { from: target.role, to: next },
    });
  });

  return seeOther(request, "/admin?tab=users&notice=role-changed");
}
