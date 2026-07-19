// Content validator — run with:  npx tsx scripts/validate-content.ts
// Checks the trivia question pool and the timeline event pool for the
// structural mistakes that have actually bitten us. Exits non-zero on error
// so it can gate commits. See CONTENT.md for authoring rules.

import { QUESTIONS, CATEGORY_LABEL } from "../src/lib/questions";
import { EVENTS } from "../src/lib/timeline";

let errors = 0;
const err = (msg: string) => {
  console.error("✗", msg);
  errors++;
};

// ---- Questions ----
{
  const ids = new Set<number>();
  const texts = new Set<string>();
  for (const q of QUESTIONS) {
    if (ids.has(q.id)) err(`question id ${q.id} is duplicated`);
    ids.add(q.id);
    if (texts.has(q.q)) err(`question text duplicated: "${q.q}"`);
    texts.add(q.q);
    if (!(q.category in CATEGORY_LABEL)) err(`question ${q.id}: unknown category "${q.category}"`);
    if (![1, 2, 3].includes(q.difficulty)) err(`question ${q.id}: difficulty must be 1|2|3`);
    if (q.options.length !== 4) err(`question ${q.id}: must have exactly 4 options`);
    if (new Set(q.options).size !== 4) err(`question ${q.id}: options must be unique`);
    if (q.options.some((o) => !o.trim())) err(`question ${q.id}: empty option`);
    if (q.answer !== 0) err(`question ${q.id}: convention is answer: 0 (correct option first; runtime shuffles)`);
    if (!q.fact.trim()) err(`question ${q.id}: fact is required`);
    // The literal chars backslash+quote leaking into content = escaping bug.
    if (q.fact.includes("\\'") || q.q.includes("\\'")) err(`question ${q.id}: backslash-apostrophe escaping bug`);
  }
  const dist = { 1: 0, 2: 0, 3: 0 } as Record<number, number>;
  for (const q of QUESTIONS) dist[q.difficulty]++;
  console.log(`questions: ${QUESTIONS.length} ok (fácil ${dist[1]} / media ${dist[2]} / difícil ${dist[3]})`);
}

// ---- Timeline events ----
{
  const ids = new Set<number>();
  const texts = new Set<string>();
  for (const e of EVENTS) {
    if (ids.has(e.id)) err(`event id ${e.id} is duplicated`);
    ids.add(e.id);
    if (texts.has(e.text)) err(`event text duplicated: "${e.text}"`);
    texts.add(e.text);
    if (!e.text.trim()) err(`event ${e.id}: empty text`);
    if (!Number.isInteger(e.year) || e.year < 1400 || e.year > 2030) err(`event ${e.id}: implausible year ${e.year}`);
    if (/\b(1[4-9]\d\d|20\d\d)\b/.test(e.text)) err(`event ${e.id}: text contains a year — that gives away the answer`);
  }
  const years = new Set(EVENTS.map((e) => e.year));
  console.log(`events: ${EVENTS.length} ok (${years.size} distinct years)`);
}

if (errors > 0) {
  console.error(`\n${errors} problem(s) found`);
  process.exit(1);
}
console.log("\nAll content valid ✓");
