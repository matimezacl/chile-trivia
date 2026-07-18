import { NextRequest, NextResponse } from "next/server";
import { getRoom, saveRoom, revealCurrent } from "@/lib/party";

export async function POST(req: NextRequest, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const body = await req.json().catch(() => null);
  const hostId = typeof body?.hostId === "string" ? body.hostId : "";

  const room = await getRoom(code);
  if (!room) return NextResponse.json({ error: "Sala no encontrada" }, { status: 404 });
  if (hostId !== room.hostId) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  revealCurrent(room); // no-op unless in the question phase
  await saveRoom(room);
  return NextResponse.json({ ok: true });
}
