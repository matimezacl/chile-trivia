import { NextRequest, NextResponse } from "next/server";
import { newRoomCode, saveRoom, getRoom, PARTY_MAX_PLAYERS, type PartyConfig, type Room } from "@/lib/party";
import { newId } from "@/lib/db";
import { CATEGORY_LABEL, type Category, type Difficulty } from "@/lib/questions";

const VALID_CATEGORIES = new Set(Object.keys(CATEGORY_LABEL));

function parseConfig(body: unknown): PartyConfig | null {
  const b = body as Record<string, unknown>;
  const numQuestions = Number(b?.numQuestions);
  const secondsPerQuestion = Number(b?.secondsPerQuestion);
  if (!Number.isInteger(numQuestions) || numQuestions < 3 || numQuestions > 20) return null;
  if (!Number.isInteger(secondsPerQuestion) || secondsPerQuestion < 5 || secondsPerQuestion > 60) return null;
  const difficulties = Array.isArray(b?.difficulties)
    ? (b.difficulties.filter((d) => d === 1 || d === 2 || d === 3) as Difficulty[])
    : [];
  const categories = Array.isArray(b?.categories)
    ? (b.categories.filter((c) => typeof c === "string" && VALID_CATEGORIES.has(c)) as Category[])
    : [];
  return { numQuestions, secondsPerQuestion, speedBonus: b?.speedBonus !== false, difficulties, categories };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const config = parseConfig(body);
  if (!config) return NextResponse.json({ error: "Configuración inválida" }, { status: 400 });

  // Generate a code not currently in use.
  let code = newRoomCode();
  for (let tries = 0; tries < 5 && (await getRoom(code)); tries++) code = newRoomCode();

  const hostId = newId();
  const room: Room = {
    code,
    hostId,
    status: "lobby",
    config,
    questions: [],
    currentIndex: 0,
    questionStartedAt: null,
    players: {},
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await saveRoom(room);
  return NextResponse.json({ code, hostId, maxPlayers: PARTY_MAX_PLAYERS });
}
