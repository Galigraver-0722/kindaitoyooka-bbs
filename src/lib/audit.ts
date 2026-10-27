import type { Prisma } from "@prisma/client";

export type AuditAction =
  | "post.remove"
  | "thread.lock"
  | "thread.unlock"
  | "thread.remove"
  | "report.remove"
  | "report.dismiss"
  | "user.suspend"
  | "user.restore"
  | "user.role";

export type AuditInput = {
  actorId: string;
  action: AuditAction;
  targetType: "post" | "thread" | "report" | "user" | "board";
  targetId: string;
  details?: Record<string, unknown>;
};

/** Must be called inside a transaction so the action and its record commit together. */
export async function recordAudit(tx: Prisma.TransactionClient, input: AuditInput): Promise<void> {
  await tx.auditLog.create({
    data: {
      actorId: input.actorId,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      details: input.details ? JSON.stringify(input.details) : null,
    },
  });
}
