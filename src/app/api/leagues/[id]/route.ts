import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/db";
import { dayNumber } from "@/lib/game";

interface StandingRow {
  playerId: string;
  name: string;
  total: number;
  played: number;
  todayCorrect: number | null;
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const league = await getStore().get(id);
  if (!league) return NextResponse.json({ error: "League not found" }, { status: 404 });

  const today = String(dayNumber());
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
    const t = league.results[today]?.[playerId];
    return {
      playerId,
      name: m.name,
      total,
      played,
      todayCorrect: t ? t.correct : null,
    };
  });
  standings.sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));

  return NextResponse.json({ id: league.id, name: league.name, day: Number(today), standings });
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
