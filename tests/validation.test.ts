import assert from "node:assert/strict";
import test from "node:test";
import {
  AGREEMENT_FIELDS,
  hasAcceptedTerms,
  missingAgreements,
  safeNextPath,
  validateBody,
  validateEmail,
  validatePassword,
  validateAnnouncement,
  validateReportReason,
  validateTitle,
  validateUsername,
} from "../src/lib/validation";

test("usernames are 3-20 lowercase letters, digits, or underscores", () => {
  assert.equal(validateUsername("sakura_17"), true);
  assert.equal(validateUsername("a".repeat(20)), true);
  assert.equal(validateUsername("ab"), false);
  assert.equal(validateUsername("a".repeat(21)), false);
  assert.equal(validateUsername("has space"), false);
  assert.equal(validateUsername("sakura-17"), false);
  assert.equal(validateUsername("sakura!"), false);
});

test("passwords must be 10-200 characters", () => {
  assert.equal(validatePassword("1234567890"), true);
  assert.equal(validatePassword("123456789"), false);
  assert.equal(validatePassword("a".repeat(200)), true);
  assert.equal(validatePassword("a".repeat(201)), false);
});

test("emails need a local part and a dotted domain", () => {
  assert.equal(validateEmail("student@example.com"), true);
  assert.equal(validateEmail("student@example"), false);
  assert.equal(validateEmail("not-an-email"), false);
  assert.equal(validateEmail("a".repeat(250) + "@example.com"), false);
});

test("thread titles are 3-120 characters", () => {
  assert.equal(validateTitle("abc"), true);
  assert.equal(validateTitle("ab"), false);
  assert.equal(validateTitle("a".repeat(120)), true);
  assert.equal(validateTitle("a".repeat(121)), false);
});

test("post bodies are non-empty and at most 10,000 characters", () => {
  assert.equal(validateBody("hello"), true);
  assert.equal(validateBody(""), false);
  assert.equal(validateBody("a".repeat(10_000)), true);
  assert.equal(validateBody("a".repeat(10_001)), false);
});

test("report reasons are 3-500 characters", () => {
  assert.equal(validateReportReason("abc"), true);
  assert.equal(validateReportReason("ab"), false);
  assert.equal(validateReportReason("a".repeat(500)), true);
  assert.equal(validateReportReason("a".repeat(501)), false);
});

test("redirect targets must stay on this site", () => {
  assert.equal(safeNextPath("/b/study"), "/b/study");
  assert.equal(safeNextPath("/t/abc#p-1"), "/t/abc#p-1");
  assert.equal(safeNextPath(undefined), "/");
  assert.equal(safeNextPath(null), "/");
  assert.equal(safeNextPath(""), "/");
  assert.equal(safeNextPath("//evil.example"), "/");
  assert.equal(safeNextPath("https://evil.example"), "/");
  assert.equal(safeNextPath("javascript:alert(1)"), "/");
});

test("a backslash or control character cannot become an authority", () => {
  // `new URL("/\\evil.example", base)` resolves to http://evil.example/.
  assert.equal(safeNextPath("/\\evil.example"), "/");
  assert.equal(safeNextPath("/\\evil.example/t/1"), "/");
  assert.equal(safeNextPath("/\t/evil.example"), "/");
  assert.equal(safeNextPath("/\r\nSet-Cookie: a=b"), "/");
  assert.equal(safeNextPath("\\\\evil.example"), "/");
  // Keep the harmless shapes intact.
  assert.equal(safeNextPath("/b/study?page=2"), "/b/study?page=2");
  assert.equal(safeNextPath("/t/abc#p-1"), "/t/abc#p-1");
  // An encoded backslash is a path segment, not an authority.
  assert.equal(safeNextPath("/%5Cevil.example"), "/%5Cevil.example");
});

test("terms acceptance needs an explicit yes", () => {
  assert.equal(hasAcceptedTerms("yes"), true);
  assert.equal(hasAcceptedTerms("on"), false);
  assert.equal(hasAcceptedTerms("true"), false);
  assert.equal(hasAcceptedTerms("YES"), false);
  assert.equal(hasAcceptedTerms(""), false);
});

test("every document must be accepted separately", () => {
  const all = Object.fromEntries(AGREEMENT_FIELDS.map((field) => [field, "yes"]));
  assert.deepEqual(missingAgreements(all), []);

  const threeOfFour = { ...all, agree_privacy: "" };
  assert.deepEqual(missingAgreements(threeOfFour), ["agree_privacy"]);

  assert.deepEqual(missingAgreements({}), [...AGREEMENT_FIELDS]);
});

test("only the exact value yes counts as acceptance", () => {
  const all = Object.fromEntries(AGREEMENT_FIELDS.map((field) => [field, "on"]));
  assert.equal(missingAgreements(all).length, AGREEMENT_FIELDS.length);
});

test("an announcement needs a title and a body in both languages", () => {
  const base = { titleJa: "テスト", titleEn: "Test", bodyJa: "本文です", bodyEn: "Body" };
  assert.equal(validateAnnouncement(base), true);
  assert.equal(validateAnnouncement({ ...base, titleJa: "" }), false);
  assert.equal(validateAnnouncement({ ...base, bodyEn: "" }), false);
  assert.equal(validateAnnouncement({ ...base, titleEn: "x".repeat(121) }), false);
  assert.equal(validateAnnouncement({ ...base, bodyJa: "x".repeat(2001) }), false);
});
