import assert from "node:assert/strict";
import test from "node:test";
import { scanContentAll } from "../src/lib/sensitive-words";
import { scanPost } from "../src/lib/content-filter";

const scan = (...texts: string[]) => scanPost(texts.map((text, index) => ({ field: (index === 0 ? "title" : "body") as "title" | "body", text })));

test("a death threat in the title blocks the post", () => {
  const result = scan("死ね", "本文は普通です。");
  assert.equal(result.blocked.length, 1);
  assert.equal(result.blocked[0].term, "死ね");
  assert.equal(result.blocked[0].field, "title");
});

test("the conditional 死ねば is not a threat", () => {
  assert.deepEqual(scan("もし私が死ねば、誰が世話をするのか").blocked, []);
});

test("spaces and punctuation do not hide a blocked word", () => {
  for (const text of ["死 ね", "死・ね", "死　ね"]) {
    assert.equal(scan(text).blocked.length, 1, text);
  }
});

test("the hiragana evasion しね is queued rather than blocked", () => {
  // しね is also dialectal for "shall we", so it cannot block outright.
  const result = scan("し　ね");
  assert.deepEqual(result.blocked, []);
  assert.ok(result.flagged.some((hit) => hit.term === "しね"));
});

test("sexual violence and CSAM terms are blocked", () => {
  for (const term of ["レイプ", "強姦", "児童ポルノ", "援助交際"]) {
    assert.equal(scan(term).blocked.length, 1, term);
  }
});

test("ambiguous violence is flagged, not blocked", () => {
  const result = scan("ゲームで敵を殺すのが楽しい");
  assert.deepEqual(result.blocked, []);
  assert.ok(result.flagged.some((hit) => hit.term === "殺す"));
});

test("insults are queued, not blocked", () => {
  const result = scan("ばかじゃないの");
  assert.deepEqual(result.blocked, []);
  assert.ok(result.flagged.some((hit) => hit.category === "slur"));
});

test("self-harm signals are flagged but never blocked", () => {
  for (const text of ["死にたい", "消えたい", "リスカした"]) {
    const result = scan(text);
    assert.deepEqual(result.blocked, [], text);
    assert.ok(result.flagged.some((hit) => hit.category === "self-harm"), text);
  }
});

test("English threats and hard profanity block, with word boundaries", () => {
  assert.equal(scan("kill yourself").blocked.length, 1);
  assert.equal(scan("fuck this").blocked.length, 1);
  assert.equal(scan("rape").blocked.length, 1);
  // Ordinary words that merely contain a listed term stay clean.
  assert.deepEqual(scan("we passed the class with assiduity").blocked, []);
  assert.deepEqual(scan("analysis of the data").blocked, []);
});

test("full-width English is normalised before matching", () => {
  assert.equal(scan("ＦＵＣＫ").blocked.length, 1);
});

test("the upstream sexual list is flagged, not blocked", () => {
  const result = scan("セックスについての授業");
  assert.deepEqual(result.blocked, []);
  assert.ok(result.flagged.length > 0);
});

test("a clean school post produces nothing", () => {
  const result = scanContentAll([
    { field: "title", text: "文化祭の撮影担当を決めたい" },
    { field: "body", text: "午前は体育館、午後は校庭を回る想定です。" },
    { field: "tags", text: "文化祭,連絡" },
  ]);
  assert.deepEqual(result.blocked, []);
  assert.deepEqual(result.flagged, []);
});
