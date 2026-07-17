import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/db";
import { dayNumber, pointsForScore, QUESTIONS_PER_DAY } from "@/lib/game";

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const playerId = typeof body?.playerId === "string" ? body.playerId.slice(0, 32) : "";
  const day = Number(body?.day);
  const correct = Number(body?.correct);

  if (
    !playerId ||
    !Number.isInteger(day) ||
    !Number.isInteger(correct) ||
    correct < 0 ||
    correct > QUESTIONS_PER_DAY
  ) {
    return NextResponse.json({ error: "Invalid result payload" }, { status: 400 });
  }
  // Accept only today's game (one-day grace window for timezones).
  if (Math.abs(day - dayNumber()) > 1) {
    return NextResponse.json({ error: "Result is not for the current game" }, { status: 400 });
  }

  const store = getStore();
  const league = await store.get(id);
  if (!league) return NextResponse.json({ error: "League not found" }, { status: 404 });
  if (!league.members[playerId]) {
    return NextResponse.json({ error: "Not a member of this league" }, { status: 403 });
  }

  const key = String(day);
  league.results[key] ??= {};
  if (league.results[key][playerId]) {
    return NextResponse.json({ ok: true, alreadyRecorded: true });
  }
  league.results[key][playerId] = {
    correct,
    points: pointsForScore(correct),
    at: Date.now(),
  };
  await store.set(league);
  return NextResponse.json({ ok: true });
}
