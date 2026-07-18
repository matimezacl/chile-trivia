import { getStore } from "./db";
import { QUESTIONS, type Category, type Difficulty } from "./questions";

export const PARTY_MAX_PLAYERS = 40;
export const ROOM_TTL_SECONDS = 60 * 60 * 4; // rooms auto-expire after 4h

// Base points per correct answer by difficulty; a Kahoot-style speed bonus of
// up to 50% is added on top for fast correct answers.
export const DIFFICULTY_BASE: Record<Difficulty, number> = { 1: 100, 2: 200, 3: 300 };

export type PartyStatus = "lobby" | "question" | "reveal" | "ended";

export interface PartyConfig {
  numQuestions: number;
  secondsPerQuestion: number;
  speedBonus: boolean;
  difficulties: Difficulty[]; // empty = all
  categories: Category[]; // empty = all
}

export interface PartyQuestion {
  id: number;
  category: Category;
  difficulty: Difficulty;
  q: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
}

export interface PartyAnswer {
  choice: number;
  at: number; // ms epoch when answered
  correct: boolean;
  gained: number;
}

export interface PartyPlayer {
  id: string;
  name: string;
  joinedAt: number;
  score: number;
  answers: Record<number, PartyAnswer>; // keyed by question index
}

export interface Room {
  code: string;
  hostId: string;
  status: PartyStatus;
  config: PartyConfig;
  questions: PartyQuestion[];
  currentIndex: number;
  questionStartedAt: number | null;
  players: Record<string, PartyPlayer>;
  createdAt: number;
  updatedAt: number;
}

const key = (code: string) => `cachai:room:${code.toUpperCase()}`;

export async function getRoom(code: string): Promise<Room | null> {
  const raw = await getStore().kvGet(key(code));
  return raw ? (JSON.parse(raw) as Room) : null;
}

export async function saveRoom(room: Room): Promise<void> {
  room.updatedAt = Date.now();
  await getStore().kvSet(key(room.code), JSON.stringify(room), ROOM_TTL_SECONDS);
}

// Unambiguous room code (no O/0, I/1) — easy to read off a screen.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function newRoomCode(len = 4): string {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick the questions for a room from the pool, honouring difficulty/category
// filters, and pre-shuffle each question's options (pool stores answer at 0).
export function selectQuestions(config: PartyConfig): PartyQuestion[] {
  const pool = QUESTIONS.filter(
    (q) =>
      (config.difficulties.length === 0 || config.difficulties.includes(q.difficulty)) &&
      (config.categories.length === 0 || config.categories.includes(q.category))
  );
  const picked = shuffle(pool).slice(0, Math.min(config.numQuestions, pool.length));
  return picked.map((q) => {
    const order = shuffle([0, 1, 2, 3]);
    const options = order.map((i) => q.options[i]) as [string, string, string, string];
    return {
      id: q.id,
      category: q.category,
      difficulty: q.difficulty,
      q: q.q,
      options,
      answer: order.indexOf(q.answer) as 0 | 1 | 2 | 3,
    };
  });
}

export function deadlineOf(room: Room): number | null {
  if (room.questionStartedAt === null) return null;
  return room.questionStartedAt + room.config.secondsPerQuestion * 1000;
}

// Points for one answer: base by difficulty + speed bonus (correct only).
export function scoreFor(room: Room, q: PartyQuestion, ans: PartyAnswer): number {
  if (ans.choice !== q.answer) return 0;
  const base = DIFFICULTY_BASE[q.difficulty];
  if (!room.config.speedBonus || room.questionStartedAt === null) return base;
  const total = room.config.secondsPerQuestion * 1000;
  const used = Math.max(0, ans.at - room.questionStartedAt);
  const remainingFraction = Math.max(0, 1 - used / total);
  return base + Math.round(base * 0.5 * remainingFraction);
}

// Lock in scores for the current question and flip to the reveal phase.
// Idempotent: only acts while the room is in the question phase.
export function revealCurrent(room: Room): void {
  if (room.status !== "question") return;
  const q = room.questions[room.currentIndex];
  for (const p of Object.values(room.players)) {
    const ans = p.answers[room.currentIndex];
    if (!ans) continue;
    ans.correct = ans.choice === q.answer;
    ans.gained = scoreFor(room, q, ans);
    p.score += ans.gained;
  }
  room.status = "reveal";
  room.questionStartedAt = null;
}

export interface Standing {
  id: string;
  name: string;
  score: number;
}

export function leaderboard(room: Room): Standing[] {
  return Object.values(room.players)
    .map((p) => ({ id: p.id, name: p.name, score: p.score }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

export interface HostView {
  role: "host";
  code: string;
  status: PartyStatus;
  currentIndex: number;
  total: number;
  config: PartyConfig;
  questionStartedAt: number | null;
  secondsPerQuestion: number;
  question: PartyQuestion | null;
  answeredCount: number;
  playersCount: number;
  players: { id: string; name: string }[];
  leaderboard: Standing[];
}

export interface PlayerView {
  role: "player";
  code: string;
  status: PartyStatus;
  currentIndex: number;
  total: number;
  questionStartedAt: number | null;
  secondsPerQuestion: number;
  question: {
    q: string;
    category: Category;
    difficulty: Difficulty;
    options: [string, string, string, string];
    answer: number | null;
  } | null;
  me: {
    name: string;
    score: number;
    rank: number;
    choice: number | null;
    correct: boolean | null;
    gained: number | null;
  } | null;
  playersCount: number;
  top: Standing[];
}

// What the host screen sees: everything, plus how many have answered.
export function hostView(room: Room): HostView {
  const q = room.status === "question" || room.status === "reveal" ? room.questions[room.currentIndex] : null;
  const answered =
    room.status === "question"
      ? Object.values(room.players).filter((p) => p.answers[room.currentIndex]).length
      : 0;
  return {
    role: "host" as const,
    code: room.code,
    status: room.status,
    currentIndex: room.currentIndex,
    total: room.questions.length,
    config: room.config,
    questionStartedAt: room.questionStartedAt,
    secondsPerQuestion: room.config.secondsPerQuestion,
    question: q,
    answeredCount: answered,
    playersCount: Object.keys(room.players).length,
    players: Object.values(room.players).map((p) => ({ id: p.id, name: p.name })),
    leaderboard: leaderboard(room),
  };
}

// What a player's phone sees. During the question phase the correct answer is
// NOT included, so it can't be read off the network.
export function playerView(room: Room, playerId: string): PlayerView {
  const me = room.players[playerId];
  const q = room.status === "question" || room.status === "reveal" ? room.questions[room.currentIndex] : null;
  const showAnswer = room.status === "reveal" || room.status === "ended";
  const myAnswer = me?.answers[room.currentIndex] ?? null;
  const board = leaderboard(room);
  const myRank = me ? board.findIndex((s) => s.id === playerId) + 1 : 0;
  return {
    role: "player" as const,
    code: room.code,
    status: room.status,
    currentIndex: room.currentIndex,
    total: room.questions.length,
    questionStartedAt: room.questionStartedAt,
    secondsPerQuestion: room.config.secondsPerQuestion,
    question: q
      ? {
          q: q.q,
          category: q.category,
          difficulty: q.difficulty,
          options: q.options,
          answer: showAnswer ? q.answer : null,
        }
      : null,
    me: me
      ? {
          name: me.name,
          score: me.score,
          rank: myRank,
          choice: myAnswer ? myAnswer.choice : null,
          correct: showAnswer && myAnswer ? myAnswer.correct : null,
          gained: showAnswer && myAnswer ? myAnswer.gained : null,
        }
      : null,
    playersCount: Object.keys(room.players).length,
    top: showAnswer ? board.slice(0, 5) : [],
  };
}
