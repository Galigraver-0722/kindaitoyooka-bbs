import enWords from "naughty-words/en.json";
import jaWords from "naughty-words/ja.json";

// The upstream Japanese list includes everyday words that would flood the
// moderation queue. These are deliberately not treated as sensitive.
const IGNORED_JA = new Set([
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

// Threats and insults that the upstream list does not cover well.
const EXTRA_JA = ["死ね", "殺す", "消えろ", "カス", "クズ", "きもい", "キモい", "うざい"];

// Common words in the English list that are legitimate in a school context.
const IGNORED_EN = new Set(["sex", "sexy", "nude", "naked"]);

function latinPattern(term: string): RegExp {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i");
}

const JA_TERMS = [...new Set([...jaWords, ...EXTRA_JA])]
  .filter((term) => !IGNORED_JA.has(term))
  .filter((term) => term.length > 1);

const EN_TERMS = enWords
  .filter((term) => !IGNORED_EN.has(term))
  .filter((term) => term.length > 2)
  .map((term) => ({ term, pattern: latinPattern(term) }));

function normalize(text: string): string {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/g, "");
}

/**
 * Return up to five terms that moderators should review. Matching never blocks
 * a post; it only creates a queue entry. False positives are expected and are
 * dismissed by a moderator.
 */
export function detectSensitiveText(...texts: string[]): string[] {
  const text = normalize(texts.join("\n"));
  const hits = new Set<string>();

  for (const term of JA_TERMS) {
    if (text.includes(term)) {
      hits.add(term);
      if (hits.size >= 5) {
        return [...hits];
      }
    }
  }

  for (const { term, pattern } of EN_TERMS) {
    if (pattern.test(text)) {
      hits.add(term);
      if (hits.size >= 5) {
        return [...hits];
      }
    }
  }

  return [...hits];
}
