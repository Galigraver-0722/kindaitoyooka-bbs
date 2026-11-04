import { createHash, randomInt } from "node:crypto";
import { prisma } from "@/lib/db";

/**
 * Registration uses one code, shared and reusable. A code is eight characters
 * drawn from an alphabet without look-alikes (no 0/O, 1/I/L), so a value read
 * aloud in class is unambiguous. Issuing a new code retires the previous one:
 * the school always has exactly one value to hand out.
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

/** Issue the active code, retiring whatever was active before. Plaintext is returned once. */
export async function issueInviteCode(note: string | null): Promise<string> {
  const code = generateInviteCode();
  await prisma.$transaction([
    prisma.inviteCode.updateMany({
      where: { retiredAt: null },
      data: { retiredAt: new Date() },
    }),
    prisma.inviteCode.create({
      data: { codeHash: hashInviteCode(code), prefix: code.slice(0, 4), note },
    }),
  ]);
  return code;
}

export async function activeInviteCode() {
  return prisma.inviteCode.findFirst({
    where: { retiredAt: null },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      prefix: true,
      note: true,
      createdAt: true,
      _count: { select: { uses: true } },
    },
  });
}

export async function findActiveCodeByHash(hash: string) {
  return prisma.inviteCode.findFirst({
    where: { codeHash: hash, retiredAt: null },
    select: { id: true, prefix: true },
  });
}

export async function retireActiveInviteCode(): Promise<boolean> {
  const result = await prisma.inviteCode.updateMany({
    where: { retiredAt: null },
    data: { retiredAt: new Date() },
  });
  return result.count > 0;
}

/** Accounts that came in through the code, newest first. */
export async function listInviteUses(limit = 20) {
  return prisma.inviteUse.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      createdAt: true,
      user: { select: { username: true } },
      code: { select: { prefix: true } },
    },
  });
}
