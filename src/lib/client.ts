"use client";

export interface Player {
  id: string;
  name: string;
}

export interface SavedGame {
  // Index chosen for each question (0-3), in question order. -1 = unanswered.
  answers: number[];
  // Whether each answer was correct, same order.
  results: boolean[];
  done: boolean;
}

export interface Stats {
  played: number;
  totalCorrect: number;
  perfect: number; // days with 5/5
  streak: number;
  maxStreak: number;
  lastDay: number | null;
}

export interface JoinedLeague {
  id: string;
  name: string;
}

const isBrowser = typeof window !== "undefined";

function read<T>(key: string): T | null {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(value));
}

const RID = "abcdefghjkmnpqrstuvwxyz23456789";
function randomId(len: number): string {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(bytes, (b) => RID[b % RID.length]).join("");
}

export function getPlayer(): Player {
  const existing = read<Player>("ct:player");
  if (existing) return existing;
  const player = { id: randomId(12), name: "" };
  write("ct:player", player);
  return player;
}

export function setPlayerName(name: string): Player {
  const player = { ...getPlayer(), name: name.trim().slice(0, 24) };
  write("ct:player", player);
  return player;
}

export function loadGame(day: number): SavedGame | null {
  return read<SavedGame>(`ct:game:${day}`);
}

export function saveGame(day: number, game: SavedGame) {
  write(`ct:game:${day}`, game);
}

export function getStats(): Stats {
  return (
    read<Stats>("ct:stats") ?? {
      played: 0,
      totalCorrect: 0,
      perfect: 0,
      streak: 0,
      maxStreak: 0,
      lastDay: null,
    }
  );
}

export function recordFinish(day: number, correct: number, total: number): Stats {
  const s = getStats();
  if (s.lastDay === day) return s; // already counted this day
  s.played++;
  s.totalCorrect += correct;
  if (correct === total) s.perfect++;
  // Streak counts consecutive days played (any score keeps it alive).
  s.streak = s.lastDay === day - 1 || s.lastDay === null ? s.streak + 1 : 1;
  s.maxStreak = Math.max(s.maxStreak, s.streak);
  s.lastDay = day;
  write("ct:stats", s);
  return s;
}

export function getLeagues(): JoinedLeague[] {
  return read<JoinedLeague[]>("ct:leagues") ?? [];
}

export function addLeague(league: JoinedLeague) {
  const leagues = getLeagues().filter((l) => l.id !== league.id);
  leagues.push(league);
  write("ct:leagues", leagues);
}

// Push today's finished result to every joined league. The server derives the
// score and difficulty-weighted points from `results`, so it can't be forged.
// Server ignores duplicates.
export async function syncResultToLeagues(day: number, results: boolean[]) {
  const player = getPlayer();
  const leagues = getLeagues();
  if (!leagues.length) return;
  await Promise.allSettled(
    leagues.map((l) =>
      fetch(`/api/leagues/${l.id}/results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: player.id, day, results }),
      })
    )
  );
}
