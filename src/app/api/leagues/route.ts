import { NextRequest, NextResponse } from "next/server";
import { getStore, newId, type League } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 40) : "";
  const playerId = typeof body?.playerId === "string" ? body.playerId.slice(0, 32) : "";
  const playerName = typeof body?.playerName === "string" ? body.playerName.trim().slice(0, 24) : "";

  if (!name || !playerId || !playerName) {
    return NextResponse.json({ error: "name, playerId and playerName are required" }, { status: 400 });
  }

  const league: League = {
    id: newId(),
    name,
    createdAt: Date.now(),
    members: { [playerId]: { name: playerName, joinedAt: Date.now() } },
    results: {},
  };
  await getStore().set(league);
  return NextResponse.json({ id: league.id });
}
