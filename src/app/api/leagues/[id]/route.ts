import { NextRequest, NextResponse } from "next/server";
import { getStore, type League, type WeekChampion } from "@/lib/db";
import { dayNumber } from "@/lib/game";
import { currentWeek, daysInWeek, isWeekFinished, weekLabel, weekOf } from "@/lib/week";

interface StandingRow {
  playerId: string;
  name: string;
  total: number; // all-time points
  played: number;
  todayCorrect: number | null;
  weekPoints: number; // points earned this week
  weekPlayed: number;
}

interface ChampionSummary {
  week: number;
  label: string;
  playerId: string;
  name: string;
  points: number;
}

// Sum a player's points across the day range [firstDay, lastDay] inclusive.
function pointsIn(league: League, playerId: string, firstDay: number, lastDay: number): { points: number; played: number } {
  let points = 0;
  let played = 0;
  for (let d = firstDay; d <= lastDay; d++) {
    const r = league.results[String(d)]?.[playerId];
    if (r) {
      points += r.points;
      played++;
    }
  }
  return { points, played };
}

// Determine the winner of a completed week, if any player scored > 0. Returns
// null when the week had no results at all.
function computeChampion(league: League, week: number): WeekChampion | null {
  const [first, last] = daysInWeek(week);
  const rows = Object.entries(league.members)
    .map(([playerId, m]) => ({ playerId, name: m.name, ...pointsIn(league, playerId, first, last) }))
    .filter((r) => r.played > 0)
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
  const winner = rows[0];
  if (!winner) return null;
  return { playerId: winner.playerId, name: winner.name, points: winner.points, crownedAt: Date.now() };
}

// Crown every finished, un-crowned week from the earliest with results up to
// (but not including) the current week. Returns true if anything changed.
function crownFinishedWeeks(league: League): boolean {
  league.weekChampions ??= {};
  const days = Object.keys(league.results).map(Number);
  if (days.length === 0) return false;
  const firstWeek = weekOf(Math.min(...days));
  const thisWeek = currentWeek();
  let changed = false;
  for (let w = firstWeek; w < thisWeek; w++) {
    if (!isWeekFinished(w)) continue;
    if (league.weekChampions[String(w)]) continue;
    const champ = computeChampion(league, w);
    if (champ) {
      league.weekChampions[String(w)] = champ;
      changed = true;
    }
  }
  return changed;
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const store = getStore();
  const { id } = await ctx.params;
  const league = await store.get(id);
  if (!league) return NextResponse.json({ error: "League not found" }, { status: 404 });

  // Lazy crowning: whenever anyone loads the league page after a week ends,
  // freeze that week's winner.
  if (crownFinishedWeeks(league)) await store.set(league);

  const today = dayNumber();
  const week = currentWeek();
  const [weekFirst, weekLast] = daysInWeek(week);

  const standings: StandingRow[] = Object.entries(league.members).map(([playerId, m]) => {
    let total = 0;
    let played = 0;
    for (const day of Object.values(league.results)) {
      const r = day[playerId];
      if (r) {
        total += r.points;
        played++;
      }
    }
    const t = league.results[String(today)]?.[playerId];
    const week = pointsIn(league, playerId, weekFirst, weekLast);
    return {
      playerId,
      name: m.name,
      total,
      played,
      todayCorrect: t ? t.correct : null,
      weekPoints: week.points,
      weekPlayed: week.played,
    };
  });
  standings.sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));

  const champions: ChampionSummary[] = Object.entries(league.weekChampions ?? {})
    .map(([w, c]) => ({
      week: Number(w),
      label: weekLabel(Number(w)),
      playerId: c.playerId,
      name: c.name,
      points: c.points,
    }))
    .sort((a, b) => b.week - a.week);

  // Also compute the full podium of the most recent crowned week so the
  // client can play the animated reveal. Only included when there's a real
  // finished-and-played week to celebrate.
  interface PodiumEntry { playerId: string; name: string; points: number }
  let lastWeekPodium: { week: number; label: string; top: PodiumEntry[] } | null = null;
  if (champions.length > 0) {
    const lastWeek = champions[0].week;
    const [first, last] = daysInWeek(lastWeek);
    const rows: PodiumEntry[] = Object.entries(league.members)
      .map(([playerId, m]) => ({ playerId, name: m.name, ...pointsIn(league, playerId, first, last) }))
      .filter((r) => r.played > 0)
      .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name))
      .map((r) => ({ playerId: r.playerId, name: r.name, points: r.points }));
    lastWeekPodium = { week: lastWeek, label: weekLabel(lastWeek), top: rows.slice(0, 5) };
  }

  return NextResponse.json({
    id: league.id,
    name: league.name,
    day: today,
    week,
    weekLabel: weekLabel(week),
    standings,
    champions,
    lastWeekPodium,
  });
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const playerId = typeof body?.playerId === "string" ? body.playerId.slice(0, 32) : "";
  const playerName = typeof body?.playerName === "string" ? body.playerName.trim().slice(0, 24) : "";
  if (!playerId || !playerName) {
    return NextResponse.json({ error: "playerId and playerName are required" }, { status: 400 });
  }

  const store = getStore();
  const league = await store.get(id);
  if (!league) return NextResponse.json({ error: "League not found" }, { status: 404 });

  if (!league.members[playerId]) {
    if (Object.keys(league.members).length >= 50) {
      return NextResponse.json({ error: "League is full" }, { status: 400 });
    }
    league.members[playerId] = { name: playerName, joinedAt: Date.now() };
    await store.set(league);
  }
  return NextResponse.json({ ok: true, name: league.name });
}
