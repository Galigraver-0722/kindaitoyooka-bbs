import assert from "node:assert/strict";
import test from "node:test";
import {
  formatInviteCode,
  generateInviteCode,
  hashInviteCode,
  isValidInviteCode,
  normalizeInviteCode,
} from "@/lib/invites";

test("invite codes are eight unambiguous characters", () => {
  for (let i = 0; i < 200; i += 1) {
    const code = generateInviteCode();
    assert.equal(code.length, 8);
    assert.ok(isValidInviteCode(code));
    assert.ok(!/[01OIL]/.test(code));
  }
});

test("invite codes normalise case, width and separators", () => {
  assert.equal(normalizeInviteCode(" abcd-2345 "), "ABCD2345");
  assert.equal(normalizeInviteCode("ＡＢＣＤ　２３４５"), "ABCD2345");
});

test("invite codes of the wrong shape are rejected", () => {
  assert.equal(isValidInviteCode(""), false);
  assert.equal(isValidInviteCode("ABCD234"), false);
  assert.equal(isValidInviteCode("ABCD23456"), false);
  assert.equal(isValidInviteCode("ABCDO345"), false);
});

test("invite hashes are deterministic and formatted in two groups", () => {
  assert.equal(hashInviteCode("ABCD2345"), hashInviteCode("ABCD2345"));
  assert.equal(hashInviteCode("ABCD2345").length, 64);
  assert.equal(formatInviteCode("ABCD2345"), "ABCD-2345");
});
