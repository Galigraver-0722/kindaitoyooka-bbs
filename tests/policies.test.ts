import assert from "node:assert/strict";
import test from "node:test";
import { POLICIES, POLICY_UPDATED, policyFor } from "../src/lib/policies";

const KEYS = ["rules", "privacy", "moderation"] as const;

test("both languages publish every policy with the same structure", () => {
  for (const key of KEYS) {
    const en = POLICIES.en[key];
    const ja = POLICIES.ja[key];

    assert.ok(en.title.length > 0);
    assert.ok(ja.title.length > 0);
    assert.ok(en.intro.length > 0);
    assert.ok(ja.intro.length > 0);
    assert.equal(en.sections.length, ja.sections.length);
    assert.ok(en.sections.length >= 5);

    en.sections.forEach((section, index) => {
      const translated = ja.sections[index];
      assert.equal(section.heading.length > 0, true);
      assert.equal(translated.heading.length > 0, true);
      assert.equal(Boolean(section.paragraphs?.length || section.bullets?.length), true);
      assert.equal(Boolean(translated.paragraphs?.length || translated.bullets?.length), true);
    });
  }
});

test("policy pages carry the shared update date", () => {
  for (const key of KEYS) {
    assert.ok(POLICIES.en[key].updated.includes(POLICY_UPDATED));
    assert.ok(POLICIES.ja[key].updated.includes(POLICY_UPDATED));
  }
});

test("policy text contains no unfinished placeholders", () => {
  const text = JSON.stringify(POLICIES);
  assert.ok(!/\bTODO\b|\bTBD\b|\bXXX\b|準備中/.test(text));
});

test("policyFor resolves the requested locale", () => {
  assert.equal(policyFor("ja", "rules"), POLICIES.ja.rules);
  assert.equal(policyFor("en", "privacy"), POLICIES.en.privacy);
});
