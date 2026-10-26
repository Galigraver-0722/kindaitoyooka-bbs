import assert from "node:assert/strict";
import test from "node:test";
import { POLICIES, POLICY_UPDATED, POLICY_UPDATES, policyFor } from "../src/lib/policies";

/** Derived from the date map, so a new document cannot be added to one language only. */
const KEYS = Object.keys(POLICY_UPDATES) as (keyof typeof POLICY_UPDATES)[];

test("both languages publish every policy with the same structure", () => {
  for (const key of KEYS) {
    const en = POLICIES.en[key];
    const ja = POLICIES.ja[key];

    assert.ok(en, `en.${key} is missing`);
    assert.ok(ja, `ja.${key} is missing`);
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

test("both languages carry exactly the documented set of policies", () => {
  assert.deepEqual(Object.keys(POLICIES.en).sort(), [...KEYS].sort());
  assert.deepEqual(Object.keys(POLICIES.ja).sort(), [...KEYS].sort());
});

test("each page carries its own last-updated date", () => {
  for (const key of KEYS) {
    assert.ok(
      POLICIES.en[key].updated.includes(POLICY_UPDATES[key]),
      `en.${key} should read ${POLICY_UPDATES[key]}`,
    );
    assert.ok(
      POLICIES.ja[key].updated.includes(POLICY_UPDATES[key]),
      `ja.${key} should read ${POLICY_UPDATES[key]}`,
    );
  }
});

test("the set version is the newest date in the map", () => {
  const newest = [...Object.values(POLICY_UPDATES)].sort().at(-1);
  assert.equal(POLICY_UPDATED, newest);
});

test("policy text contains no unfinished placeholders", () => {
  const text = JSON.stringify(POLICIES);
  assert.ok(!/\bTODO\b|\bTBD\b|\bXXX\b|準備中/.test(text));
});

test("policyFor resolves the requested locale", () => {
  assert.equal(policyFor("ja", "rules"), POLICIES.ja.rules);
  assert.equal(policyFor("en", "privacy"), POLICIES.en.privacy);
  assert.equal(policyFor("ja", "terms"), POLICIES.ja.terms);
  assert.equal(policyFor("en", "terms"), POLICIES.en.terms);
});
