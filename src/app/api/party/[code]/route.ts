import { NextRequest, NextResponse } from "next/server";
import { getRoom, hostView, playerView } from "@/lib/party";

// Polled by host and player screens. The requester's id (?pid=) decides the
// view; the player view never includes the correct answer mid-question.
export async function GET(req: NextRequest, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const pid = req.nextUrl.searchParams.get("pid") ?? "";
  const room = await getRoom(code);
  if (!room) return NextResponse.json({ error: "Sala no encontrada" }, { status: 404 });

  const view = pid && pid === room.hostId ? hostView(room) : playerView(room, pid);
  return NextResponse.json(view, { headers: { "Cache-Control": "no-store" } });
}
