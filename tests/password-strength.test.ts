import assert from "node:assert/strict";
import test from "node:test";
import { passwordStrength } from "../src/lib/password-strength";

test("nothing typed is not yet long enough", () => {
  assert.deepEqual(passwordStrength(""), { score: 0, longEnough: false, length: 0, variety: 0 });
});

test("the requirement is the length, and it is separate from the score", () => {
  assert.equal(passwordStrength("abc").longEnough, false);
  assert.equal(passwordStrength("abcdefgh").longEnough, true);
  assert.equal(passwordStrength("abcdefgh").score, 1);
});

test("variety raises the score once the length is met", () => {
  assert.equal(passwordStrength("abcdefg1").score, 2);
  assert.equal(passwordStrength("Abcdefg1!").score, 3);
  assert.equal(passwordStrength("ا".repeat(8)).score, 1);
});

test("a long passphrase of letters alone stays weak on variety", () => {
  const strength = passwordStrength("abcdefghijklmnopqrs");
  assert.equal(strength.longEnough, true);
  assert.equal(strength.score, 1);
});

test("the minimum length is a parameter", () => {
  assert.equal(passwordStrength("12345678", 8).longEnough, true);
  assert.equal(passwordStrength("12345678", 12).longEnough, false);
});

test("code points, not UTF-16 units", () => {
  assert.equal(passwordStrength("🎓🎓🎓🎓🎓🎓🎓🎓").length, 8);
});
