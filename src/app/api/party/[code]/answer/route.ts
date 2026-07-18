import { NextRequest, NextResponse } from "next/server";
import { getRoom, saveRoom, deadlineOf } from "@/lib/party";

export async function POST(req: NextRequest, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const body = await req.json().catch(() => null);
  const playerId = typeof body?.playerId === "string" ? body.playerId : "";
  const choice = Number(body?.choice);

  const room = await getRoom(code);
  if (!room) return NextResponse.json({ error: "Sala no encontrada" }, { status: 404 });
  if (room.status !== "question") return NextResponse.json({ error: "No se aceptan respuestas" }, { status: 400 });

  const player = room.players[playerId];
  if (!player) return NextResponse.json({ error: "No estás en la sala" }, { status: 403 });
  if (!Number.isInteger(choice) || choice < 0 || choice > 3) {
    return NextResponse.json({ error: "Opción inválida" }, { status: 400 });
  }
  // Already answered this question — ignore (answers are locked).
  if (player.answers[room.currentIndex]) return NextResponse.json({ ok: true, locked: true });

  const deadline = deadlineOf(room);
  if (deadline !== null && Date.now() > deadline + 1000) {
    return NextResponse.json({ error: "Se acabó el tiempo" }, { status: 400 });
  }

  // Scored at reveal, so the correct answer never travels to the client here.
  player.answers[room.currentIndex] = { choice, at: Date.now(), correct: false, gained: 0 };
  await saveRoom(room);
  return NextResponse.json({ ok: true });
}
