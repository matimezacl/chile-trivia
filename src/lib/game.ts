import { QUESTIONS, type Question } from "./questions";

export const QUESTIONS_PER_DAY = 5;

// Day 0 = launch day. Uses the player's local calendar date so the puzzle rolls
// over at their midnight, just like the word game.
const EPOCH = new Date(2026, 6, 17).getTime();

export function dayNumber(now: Date = new Date()): number {
  const local = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.max(0, Math.round((local - EPOCH) / 86400000));
}

// Deterministic shuffle of the question pool with a fixed seed, computed once.
// Windowing through a shuffled list (instead of the raw order) means each day's
// five questions are well mixed across categories and the same for every player.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SHUFFLED: Question[] = (() => {
  const arr = [...QUESTIONS];
  const rand = mulberry32(0x1e5c0);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
})();

// Reorder a question's four options deterministically per (day, question) so
// the correct answer isn't always in the same slot — the pool stores every
// correct option at index 0, which would make the game trivially gameable if
// shown as-is. Seeded by day+id, so every player sees the same order and a
// reload on the same day is stable.
function shuffleOptions(q: Question, day: number): Question {
  const order = [0, 1, 2, 3];
  const rand = mulberry32(day * 1_000_003 + q.id * 97 + 17);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const options = order.map((i) => q.options[i]) as [string, string, string, string];
  const answer = order.indexOf(q.answer) as 0 | 1 | 2 | 3;
  return { ...q, options, answer };
}

// The five distinct questions for a given day, wrapping around the pool, each
// with its options shuffled for that day.
export function questionsForDay(day: number): Question[] {
  const n = SHUFFLED.length;
  const start = (day * QUESTIONS_PER_DAY) % n;
  const out: Question[] = [];
  for (let i = 0; i < QUESTIONS_PER_DAY; i++) {
    out.push(shuffleOptions(SHUFFLED[(start + i) % n], day));
  }
  return out;
}

// League points: reward a perfect run, then scale down with each miss.
// 5/5 = 10, 4 = 7, 3 = 5, 2 = 3, 1 = 1, 0 = 0.
export function pointsForScore(correct: number): number {
  return [0, 1, 3, 5, 7, 10][correct] ?? 0;
}

export function shareGrid(results: boolean[], day: number): string {
  const score = results.filter(Boolean).length;
  const squares = results.map((ok) => (ok ? "🟩" : "🟥")).join("");
  return `Cachaí #${day + 1} — ${score}/${QUESTIONS_PER_DAY} 🇨🇱\n${squares}\n\nhttps://cachai.cl`;
}
