import enWords from "naughty-words/en.json";
import jaWords from "naughty-words/ja.json";

/**
 * The word lists behind automatic moderation.
 *
 * Two layers, because a school board cannot afford to guess wrong in either
 * direction:
 *
 * - `block` refuses the post outright. Only terms whose *only* ordinary use is
 *   abusive are allowed here — a death threat, sexual violence, a slur. A false
 *   positive on this layer costs a student their post, so the list stays small
 *   and every entry is one a Japanese speaker would read the same way.
 * - `flag` lets the post through and puts it in the moderator queue. This is
 *   where ambiguous words go: 「殺す」 can be "kill time", 「ばか」 can be
 *   self-deprecation, and a self-harm phrase is a person in trouble, not a
 *   violation.
 *
 * Japanese first, English second: the site is Japanese, so the Japanese list is
 * curated by hand. The English list reuses the CC BY 4.0 `naughty-words`
 * package and adds the phrases that matter for threats.
 *
 * Matching notes:
 * - Text is NFKC-normalised and lowercased, so full-width and half-width forms
 *   are the same word.
 * - Japanese has no word boundaries, so Japanese matching removes spaces and
 *   punctuation from both sides before comparing. That catches 「死 ね」, which
 *   is the cheapest evasion.
 * - English keeps word boundaries, so `ass` does not match `class`.
 * - A few entries carry `notFollowedBy` to avoid grammatical look-alikes:
 *   「死ねば」 ("if I die") is a conditional, not a threat.
 */

export type Severity = "block" | "flag";

export type Category = "threat" | "sexual" | "slur" | "profanity" | "self-harm" | "drugs" | "other";

export type WordEntry = {
  term: string;
  lang: "ja" | "en";
  severity: Severity;
  category: Category;
  /** Regex fragment that must NOT follow the term (Japanese only). */
  notFollowedBy?: string;
};

/** Terms that stop a post before it is written. Keep this list short and sharp. */
export const BLOCK_ENTRIES: WordEntry[] = [
  // Direct death threats. 死ねば ("if [I] die") is grammatical Japanese, hence the guard.
  { term: "死ね", lang: "ja", severity: "block", category: "threat", notFollowedBy: "ば" },
  { term: "氏ね", lang: "ja", severity: "block", category: "threat" },
  { term: "殺してやる", lang: "ja", severity: "block", category: "threat" },
  { term: "殺すぞ", lang: "ja", severity: "block", category: "threat" },
  { term: "殺害予告", lang: "ja", severity: "block", category: "threat" },
  { term: "刺し殺す", lang: "ja", severity: "block", category: "threat" },

  // Sexual violence and sexual content involving minors.
  { term: "レイプ", lang: "ja", severity: "block", category: "sexual" },
  { term: "輪姦", lang: "ja", severity: "block", category: "sexual" },
  { term: "強姦", lang: "ja", severity: "block", category: "sexual" },
  { term: "強制性交", lang: "ja", severity: "block", category: "sexual" },
  { term: "児童ポルノ", lang: "ja", severity: "block", category: "sexual" },
  { term: "幼児ポルノ", lang: "ja", severity: "block", category: "sexual" },
  { term: "援助交際", lang: "ja", severity: "block", category: "sexual" },

  // English: unambiguous threats, slurs and hard profanity.
  { term: "kill yourself", lang: "en", severity: "block", category: "threat" },
  { term: "kys", lang: "en", severity: "block", category: "threat" },
  { term: "rape", lang: "en", severity: "block", category: "sexual" },
  { term: "raped", lang: "en", severity: "block", category: "sexual" },
  { term: "rapist", lang: "en", severity: "block", category: "sexual" },
  { term: "child porn", lang: "en", severity: "block", category: "sexual" },
  { term: "nigger", lang: "en", severity: "block", category: "slur" },
  { term: "nigga", lang: "en", severity: "block", category: "slur" },
  { term: "faggot", lang: "en", severity: "block", category: "slur" },
  { term: "cunt", lang: "en", severity: "block", category: "profanity" },
  { term: "fuck", lang: "en", severity: "block", category: "profanity" },
  { term: "shit", lang: "en", severity: "block", category: "profanity" },
  { term: "asshole", lang: "en", severity: "block", category: "profanity" },
  { term: "bitch", lang: "en", severity: "block", category: "profanity" },
];

/**
 * Terms that go to the review queue. Ambiguous, milder, or a signal that
 * someone needs help rather than punishment.
 */
export const FLAG_TERMS_JA: Array<{ term: string; category: Category }> = [
  // Violence that is not necessarily a threat ("kill time", "kill the enemy").
  { term: "殺す", category: "threat" },
  { term: "ころす", category: "threat" },
  { term: "殺害", category: "threat" },
  { term: "刺す", category: "threat" },
  { term: "殴る", category: "threat" },
  { term: "しね", category: "threat" },
  { term: "消えろ", category: "threat" },
  { term: "くたばれ", category: "threat" },

  // Insults. Mild enough that context decides.
  { term: "ばか", category: "slur" },
  { term: "バカ", category: "slur" },
  { term: "あほ", category: "slur" },
  { term: "アホ", category: "slur" },
  { term: "間抜け", category: "slur" },
  { term: "カス", category: "slur" },
  { term: "クズ", category: "slur" },
  { term: "きもい", category: "slur" },
  { term: "キモい", category: "slur" },
  { term: "うざい", category: "slur" },
  { term: "ウザい", category: "slur" },
  { term: "ブス", category: "slur" },
  { term: "デブ", category: "slur" },
  { term: "ハゲ", category: "slur" },
  { term: "ジジイ", category: "slur" },
  { term: "ババア", category: "slur" },
  { term: "チョン", category: "slur" },

  // Distress, not a violation. A moderator should look, and a teacher may need to.
  { term: "死にたい", category: "self-harm" },
  { term: "消えたい", category: "self-harm" },
  { term: "リストカット", category: "self-harm" },
  { term: "リスカ", category: "self-harm" },
  { term: "自傷", category: "self-harm" },

  { term: "覚醒剤", category: "drugs" },
  { term: "大麻", category: "drugs" },
  { term: "シンナー", category: "drugs" },
];

/** English phrases that call for a human, not a rejection. */
export const FLAG_TERMS_EN: Array<{ term: string; category: Category }> = [
  { term: "kill myself", category: "self-harm" },
  { term: "suicide", category: "self-harm" },
  { term: "self harm", category: "self-harm" },
  { term: "want to die", category: "self-harm" },
  { term: "retard", category: "slur" },
  { term: "bastard", category: "slur" },
  { term: "idiot", category: "slur" },
  { term: "moron", category: "slur" },
];

/**
 * Upstream Japanese entries kept as flags. The package is a porn-keyword list;
 * everyday words that would flood the queue are excluded here.
 */
export const IGNORED_JA = new Set([
  "3p",
  "sm",
  "xx",
  "いたずら",
  "エスコート",
  "おしっこ",
  "おしり",
  "オシリ",
  "お尻",
  "カント",
  "スリット",
  "なめ",
  "フック",
  "ファンタジー",
  "ぽっちゃり",
  "ボーイズラブ",
  "やおい",
  "レズビアン",
  "ゲイボーイ",
  "嫌い",
  "支配",
  "自己愛性",
  "女の子",
  "女子高生",
  "女装",
  "人妻",
  "人種",
  "両性",
  "両刀",
  "裸",
  "殺人事件",
  "夢精",
  "毛深い",
  "平手打ち",
  "噴出",
  "糞",
  "糞便",
  "卍",
  "宦官",
]);

/** Upstream English entries that are ordinary words in a school. */
export const IGNORED_EN = new Set([
  "sex",
  "sexy",
  "nude",
  "naked",
  "anal", // statistical analysis, anal sex discussions in health class
  "anus",
  "dick", // proper name
  "pussy", // cat
  "cock", // bird / verb
  "cum", // "cum laude"
  "tit", // bird
  "boob", // bird
]);

export type Field = "title" | "body" | "tags" | "reason" | "bio" | "board-name" | "board-description";

export type Hit = {
  term: string;
  lang: "ja" | "en";
  severity: Severity;
  category: Category;
  field: Field;
};

export type ScanResult = {
  blocked: Hit[];
  flagged: Hit[];
};

const PUNCTUATION = /[\s\u3000・.,，．、。!?！？~〜\-_*#/\\|:;'"“”‘’()（）「」『』【】〈〉《》]/g;

/** Full-width to half-width, lowercase, zero-width characters gone. */
export function normalize(text: string): string {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/g, "");
}

/** Normalised text with spaces and punctuation removed, for Japanese matching. */
export function compact(text: string): string {
  return normalize(text).replace(PUNCTUATION, "");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type Compiled = {
  entry: WordEntry;
  ja?: RegExp;
  en?: RegExp;
};

function compile(entry: WordEntry): Compiled {
  if (entry.lang === "ja") {
    const guard = entry.notFollowedBy ? `(?!${entry.notFollowedBy})` : "";
    return { entry, ja: new RegExp(`${escapeRegExp(entry.term)}${guard}`) };
  }
  // English: word boundaries on the normalised text, and a compact form for a
  // few long terms so "n i g g e r" does not slip through.
  const escaped = escapeRegExp(entry.term);
  return { entry, en: new RegExp(`\\b${escaped}\\b`, "i") };
}

const BLOCK_COMPILED = BLOCK_ENTRIES.map(compile);

const JA_FLAGS = FLAG_TERMS_JA.map((item) => ({
  entry: { term: item.term, lang: "ja" as const, severity: "flag" as const, category: item.category },
  regex: new RegExp(escapeRegExp(item.term)),
}));

const EN_FLAGS = FLAG_TERMS_EN.map((item) => ({
  entry: { term: item.term, lang: "en" as const, severity: "flag" as const, category: item.category },
  regex: new RegExp(`\\b${escapeRegExp(item.term)}\\b`, "i"),
}));

/**
 * Scan the given fields and return what should be blocked and what should be
 * queued. Fields are checked independently so the moderator record can say
 * *where* the word was: a title violation and a body violation are different
 * problems.
 */
export function scanContent(fields: Array<{ field: Field; text: string }>): ScanResult {
  const blocked: Hit[] = [];
  const flagged: Hit[] = [];
  const seenBlocked = new Set<string>();
  const seenFlagged = new Set<string>();

  for (const { field, text } of fields) {
    if (!text) continue;
    const plain = normalize(text);
    const tight = compact(text);

    for (const { entry, ja, en } of BLOCK_COMPILED) {
      if (seenBlocked.has(entry.term)) continue;
      const hit = entry.lang === "ja" ? ja?.test(tight) : en?.test(plain);
      if (hit) {
        seenBlocked.add(entry.term);
        blocked.push({
          term: entry.term,
          lang: entry.lang,
          severity: "block",
          category: entry.category,
          field,
        });
      }
    }

    for (const { entry, regex } of JA_FLAGS) {
      if (seenFlagged.has(entry.term) || seenBlocked.has(entry.term)) continue;
      if (regex.test(tight)) {
        seenFlagged.add(entry.term);
        flagged.push({ ...entry, field });
      }
    }

    for (const { entry, regex } of EN_FLAGS) {
      if (seenFlagged.has(entry.term) || seenBlocked.has(entry.term)) continue;
      if (regex.test(plain)) {
        seenFlagged.add(entry.term);
        flagged.push({ ...entry, field });
      }
    }
  }

  return { blocked: blocked.slice(0, 8), flagged: flagged.slice(0, 8) };
}

/** The upstream sexual-vocabulary lists, compiled once and treated as flags. */
const UPSTREAM_JA = jaWords
  .filter((term) => !IGNORED_JA.has(term) && term.length > 1)
  .map((term) => ({ term, regex: new RegExp(escapeRegExp(normalize(term))) }));

const UPSTREAM_EN = enWords
  .filter((term) => !IGNORED_EN.has(term) && term.length > 2)
  .map((term) => ({ term, regex: new RegExp(`\\b${escapeRegExp(term)}\\b`, "i") }));

/** Everything the scanner knows about one set of fields. */
export function scanContentAll(fields: Array<{ field: Field; text: string }>): ScanResult {
  const base = scanContent(fields);
  const flagged = [...base.flagged];
  const seen = new Set(flagged.map((hit) => hit.term));

  for (const { field, text } of fields) {
    if (!text) continue;
    const tight = compact(text);
    const plain = normalize(text);
    for (const { term, regex } of UPSTREAM_JA) {
      if (seen.has(term) || flagged.length >= 8) continue;
      if (regex.test(tight)) {
        seen.add(term);
        flagged.push({ term, lang: "ja", severity: "flag", category: "sexual", field });
      }
    }
    for (const { term, regex } of UPSTREAM_EN) {
      if (seen.has(term) || flagged.length >= 8) continue;
      if (regex.test(plain)) {
        seen.add(term);
        flagged.push({ term, lang: "en", severity: "flag", category: "sexual", field });
      }
    }
  }

  return { blocked: base.blocked, flagged };
}
