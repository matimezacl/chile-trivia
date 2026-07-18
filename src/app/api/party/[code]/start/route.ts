import { NextRequest, NextResponse } from "next/server";
import { getRoom, saveRoom, selectQuestions } from "@/lib/party";

export async function POST(req: NextRequest, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const body = await req.json().catch(() => null);
  const hostId = typeof body?.hostId === "string" ? body.hostId : "";

  const room = await getRoom(code);
  if (!room) return NextResponse.json({ error: "Sala no encontrada" }, { status: 404 });
  if (hostId !== room.hostId) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  if (room.status !== "lobby") return NextResponse.json({ error: "Ya empezó" }, { status: 400 });
  if (Object.keys(room.players).length === 0) {
    return NextResponse.json({ error: "Esperando jugadores" }, { status: 400 });
  }

  room.questions = selectQuestions(room.config);
  if (room.questions.length === 0) {
    return NextResponse.json({ error: "No hay preguntas para esos filtros" }, { status: 400 });
  }
  room.currentIndex = 0;
  room.status = "question";
  room.questionStartedAt = Date.now();
  await saveRoom(room);
  return NextResponse.json({ ok: true, total: room.questions.length });
}
