import { NextRequest, NextResponse } from "next/server";
import { getRoom, saveRoom, PARTY_MAX_PLAYERS } from "@/lib/party";
import { newId } from "@/lib/db";

export async function POST(req: NextRequest, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 20) : "";
  if (!name) return NextResponse.json({ error: "Falta tu nombre" }, { status: 400 });

  const room = await getRoom(code);
  if (!room) return NextResponse.json({ error: "Sala no encontrada" }, { status: 404 });
  if (room.status !== "lobby") {
    return NextResponse.json({ error: "La partida ya empezó" }, { status: 400 });
  }
  if (Object.keys(room.players).length >= PARTY_MAX_PLAYERS) {
    return NextResponse.json({ error: "La sala está llena" }, { status: 400 });
  }
  // Avoid duplicate display names within a room.
  const taken = Object.values(room.players).some((p) => p.name.toLowerCase() === name.toLowerCase());
  if (taken) return NextResponse.json({ error: "Ese nombre ya está tomado" }, { status: 400 });

  const playerId = newId();
  room.players[playerId] = { id: playerId, name, joinedAt: Date.now(), score: 0, answers: {} };
  await saveRoom(room);
  return NextResponse.json({ playerId, name });
}
