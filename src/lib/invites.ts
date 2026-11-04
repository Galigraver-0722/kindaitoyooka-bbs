import { createHash, randomInt } from "node:crypto";
import { prisma } from "@/lib/db";

/**
 * Registration is invite-only. A code is eight characters drawn from an
 * alphabet without look-alikes (no 0/O, 1/I/L), so a code read aloud or copied
 * off a blackboard is unambiguous.
 */
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const CODE_LENGTH = 8;

export function normalizeInviteCode(input: string): string {
  return input.normalize("NFKC").toUpperCase().replace(/[\s-]/g, "");
}

export function isValidInviteCode(input: string): boolean {
  return new RegExp(`^[${ALPHABET}]{${CODE_LENGTH}}$`).test(input);
}

export function hashInviteCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

export function formatInviteCode(code: string): string {
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

export function generateInviteCode(): string {
  let out = "";
  for (let i = 0; i < CODE_LENGTH; i += 1) {
    out += ALPHABET[randomInt(ALPHABET.length)];
  }
  return out;
}

/** Create `count` unused codes and return them in plaintext, once. */
export async function createInviteCodes(count: number, note: string | null): Promise<string[]> {
  const codes: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const code = generateInviteCode();
    await prisma.inviteCode.create({
      data: {
        codeHash: hashInviteCode(code),
        prefix: code.slice(0, 4),
        note,
      },
    });
    codes.push(code);
  }
  return codes;
}

export async function listInviteCodes(): Promise<
  { id: string; prefix: string; note: string | null; createdAt: Date; usedAt: Date | null }[]
> {
  return prisma.inviteCode.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, prefix: true, note: true, createdAt: true, usedAt: true },
  });
}

export async function revokeInviteCode(prefix: string): Promise<number> {
  const result = await prisma.inviteCode.deleteMany({
    where: { prefix: prefix.toUpperCase(), usedAt: null },
  });
  return result.count;
}
