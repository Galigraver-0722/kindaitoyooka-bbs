import assert from "node:assert/strict";
import test from "node:test";
import { detectSensitiveText } from "../src/lib/content-filter";

test("Japanese threats and explicit terms are flagged", () => {
  assert.ok(detectSensitiveText("死ね").length > 0);
  assert.ok(detectSensitiveText("セックス").length > 0);
});

test("ordinary words from the upstream list are ignored", () => {
  assert.deepEqual(detectSensitiveText("女の子向けの制服"), []);
  assert.deepEqual(detectSensitiveText("おしりの話"), []);
});

test("English terms use word boundaries", () => {
  assert.deepEqual(detectSensitiveText("We passed the class"), []);
  assert.ok(detectSensitiveText("you are a bitch").length > 0);
});

test("at most five terms are returned", () => {
  const hits = detectSensitiveText("死ね 殺す 消えろ カス クズ きもい");
  assert.equal(hits.length, 5);
});
