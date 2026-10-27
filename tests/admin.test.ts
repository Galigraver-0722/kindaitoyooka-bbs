import assert from "node:assert/strict";
import test from "node:test";
import { canChangeRole, canManageBoards, canRemoveContent, canRestore, canSuspend } from "../src/lib/admin";

const admin = { id: "a1", role: "ADMIN" } as const;
const moderator = { id: "m1", role: "MODERATOR" } as const;
const student = { id: "s1", role: "STUDENT" } as const;

const target = (id: string, role: "STUDENT" | "MODERATOR" | "ADMIN", isSuspended = false) =>
  ({ id, role, isSuspended }) as const;

test("a moderator may suspend a student", () => {
  assert.deepEqual(canSuspend(moderator, target("s1", "STUDENT")), { ok: true });
});

test("a moderator may not suspend another moderator or an administrator", () => {
  assert.equal(canSuspend(moderator, target("m2", "MODERATOR")).ok, false);
  assert.equal(canSuspend(moderator, target("a9", "ADMIN")).ok, false);
});

test("an administrator may suspend a moderator but not another administrator", () => {
  assert.deepEqual(canSuspend(admin, target("m2", "MODERATOR")), { ok: true });
  assert.equal(canSuspend(admin, target("a2", "ADMIN")).ok, false);
});

test("nobody suspends their own account", () => {
  assert.deepEqual(canSuspend(admin, target("a1", "ADMIN")), { ok: false, reason: "self" });
  assert.deepEqual(canSuspend(moderator, target("m1", "MODERATOR")), { ok: false, reason: "self" });
});

test("students cannot suspend anyone", () => {
  assert.deepEqual(canSuspend(student, target("s2", "STUDENT")), { ok: false, reason: "forbidden" });
});

test("restore follows the same ladder as suspend", () => {
  assert.deepEqual(canRestore(moderator, target("s1", "STUDENT", true)), { ok: true });
  assert.equal(canRestore(moderator, target("m2", "MODERATOR", true)).ok, false);
});

test("role changes are administrators only", () => {
  assert.deepEqual(canChangeRole(admin, target("s1", "STUDENT"), 2, "MODERATOR"), { ok: true });
  assert.deepEqual(canChangeRole(moderator, target("s1", "STUDENT"), 2, "MODERATOR"), {
    ok: false,
    reason: "forbidden",
  });
});

test("an administrator cannot change their own role", () => {
  assert.deepEqual(canChangeRole(admin, target("a1", "ADMIN"), 2, "STUDENT"), { ok: false, reason: "self" });
});

test("the last administrator cannot be demoted", () => {
  assert.deepEqual(canChangeRole(admin, target("a2", "ADMIN"), 1, "MODERATOR"), {
    ok: false,
    reason: "last-admin",
  });
  // With a second administrator around, demoting one is fine.
  assert.deepEqual(canChangeRole(admin, target("a2", "ADMIN"), 2, "MODERATOR"), { ok: true });
});

test("removing content is shared, board lifecycle is not", () => {
  assert.equal(canRemoveContent(moderator), true);
  assert.equal(canRemoveContent(admin), true);
  assert.equal(canRemoveContent(student), false);
  assert.equal(canManageBoards(moderator), false);
  assert.equal(canManageBoards(admin), true);
});
