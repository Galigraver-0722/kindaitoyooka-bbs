import assert from "node:assert/strict";
import test from "node:test";
import { hashPassword, verifyPassword } from "../src/lib/passwords";

test("password hashes round-trip and never store the plain text", async () => {
  const hash = await hashPassword("toyooka-demo-123");

  assert.match(hash, /^scrypt:[0-9a-f]{32}:[0-9a-f]{128}$/);
  assert.ok(!hash.includes("toyooka-demo-123"));
  assert.equal(await verifyPassword("toyooka-demo-123", hash), true);
  assert.equal(await verifyPassword("wrong-password", hash), false);
});

test("NFKC normalization is stable in both directions", async () => {
  const hash = await hashPassword("ｐａｓｓｗｏｒｄ-１２３４");
  assert.equal(await verifyPassword("password-1234", hash), true);
});

test("malformed hashes are rejected without throwing", async () => {
  assert.equal(await verifyPassword("anything", "plain-text"), false);
  assert.equal(await verifyPassword("anything", "scrypt::"), false);
});
