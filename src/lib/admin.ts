/**
 * Who may do what inside the moderator console.
 *
 * These are pure decisions on purpose: the console is one page with several
 * destructive buttons, and "a moderator must not be able to suspend another
 * moderator, or to demote the last administrator" is exactly the kind of rule
 * that quietly rots when it lives in three route handlers. The routes call
 * these functions; the tests pin them.
 */
import type { Role } from "@prisma/client";

export type Actor = { id: string; role: Role };
export type Target = { id: string; role: Role; isSuspended: boolean };

export type Decision = { ok: true } | { ok: false; reason: "forbidden" | "self" | "last-admin" };

const isAdmin = (actor: Actor) => actor.role === "ADMIN";
const isModerator = (actor: Actor) => actor.role === "MODERATOR" || actor.role === "ADMIN";

/**
 * Suspending is a personal sanction, so the ladder is explicit: a moderator may
 * suspend students; only an administrator may suspend a moderator; nobody may
 * suspend an administrator, including another administrator.
 */
export function canSuspend(actor: Actor, target: Target): Decision {
  if (!isModerator(actor)) {
    return { ok: false, reason: "forbidden" };
  }
  if (actor.id === target.id) {
    return { ok: false, reason: "self" };
  }
  if (target.role === "ADMIN") {
    return { ok: false, reason: "forbidden" };
  }
  if (target.role === "MODERATOR" && !isAdmin(actor)) {
    return { ok: false, reason: "forbidden" };
  }
  return { ok: true };
}

/** Restoring is the undo of suspending, so it follows the same ladder. */
export function canRestore(actor: Actor, target: Target): Decision {
  return canSuspend(actor, target);
}

/**
 * Role changes are site-level: administrators only, never on yourself, and the
 * last administrator cannot be demoted (there would be nobody left to fix it).
 */
export function canChangeRole(
  actor: Actor,
  target: Target,
  adminCount: number,
  next: Role,
): Decision {
  if (!isAdmin(actor)) {
    return { ok: false, reason: "forbidden" };
  }
  if (actor.id === target.id) {
    return { ok: false, reason: "self" };
  }
  if (target.role === "ADMIN" && next !== "ADMIN" && adminCount <= 1) {
    return { ok: false, reason: "last-admin" };
  }
  return { ok: true };
}

/** Removing content is day-to-day moderation; the roles share it. */
export function canRemoveContent(actor: Actor): boolean {
  return isModerator(actor);
}

/** Board lifecycle (archive / restore) stays with administrators. */
export function canManageBoards(actor: Actor): boolean {
  return isAdmin(actor);
}
