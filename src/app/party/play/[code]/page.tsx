"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { CATEGORY_LABEL, DIFFICULTY_LABEL } from "@/lib/questions";
import type { PlayerView } from "@/lib/party";
import {
  getLastName,
  getPlayer,
  postParty,
  savePlayer,
  setLastName,
  useCountdown,
  usePartyPoll,
} from "@/lib/partyClient";

const LETTERS = ["A", "B", "C", "D"];
// Kahoot-style colours so answers are easy to hit on a phone.
const OPTION_COLORS = [
  "bg-red-600 hover:bg-red-700",
  "bg-blue-600 hover:bg-blue-700",
  "bg-amber-500 hover:bg-amber-600",
  "bg-green-600 hover:bg-green-700",
];

export default function PlayPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const existing = getPlayer(code);
    if (existing) setPlayerId(existing.playerId);
    setReady(true);
  }, [code]);

  if (!ready) return <Center><p className="text-neutral-400">Cargando…</p></Center>;
  if (!playerId) return <JoinForm code={code} onJoined={setPlayerId} />;
  return <Play code={code} playerId={playerId} />;
}

function Center({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 text-center">{children}</main>;
}

function JoinForm({ code, onJoined }: { code: string; onJoined: (id: string) => void }) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => setName(getLastName()), []);

  async function join() {
    const n = name.trim();
    if (!n) return;
    setBusy(true);
    setErr(null);
    const r = await postParty(code, "join", { name: n });
    if (r.ok && typeof r.playerId === "string") {
      savePlayer(code, r.playerId, n);
      setLastName(n);
      onJoined(r.playerId);
    } else {
      setErr(r.error ?? "No se pudo unir");
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
      <h1 className="text-center text-3xl font-black">
        Cachaí <span className="text-red-600">Party</span>
      </h1>
      <p className="mt-2 text-center text-sm text-neutral-500">
        Sala <span className="font-bold tracking-widest">{code}</span>
      </p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && join()}
        placeholder="Tu nombre"
        maxLength={20}
        autoFocus
        className="mt-6 w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3.5 text-center text-lg dark:border-neutral-600"
      />
      {err && <p className="mt-3 text-center text-sm text-red-600">{err}</p>}
      <button
        onClick={join}
        disabled={busy || !name.trim()}
        className="mt-4 w-full rounded-xl bg-red-600 py-3.5 text-base font-semibold text-white transition hover:bg-red-700 active:scale-[0.99] disabled:opacity-50"
      >
        {busy ? "Entrando…" : "Entrar a la sala"}
      </button>
      <Link href="/party" className="mt-6 text-center text-sm text-neutral-400 hover:underline">
        Usar otro código
      </Link>
    </main>
  );
}

function Play({ code, playerId }: { code: string; playerId: string }) {
  const { view, error } = usePartyPoll<PlayerView>(code, playerId);
  const [picked, setPicked] = useState<number | null>(null);
  const remaining = useCountdown(view?.questionStartedAt ?? null, view?.secondsPerQuestion ?? 20);

  // Reset the local pick when a new question starts.
  useEffect(() => {
    setPicked(null);
  }, [view?.currentIndex, view?.status]);

  if (error) return <Center><p className="text-lg font-semibold">{error}</p></Center>;
  if (!view) return <Center><p className="text-neutral-400">Cargando…</p></Center>;
  if (!view.me) {
    return (
      <Center>
        <p className="text-lg font-semibold">Ya no estás en esta sala</p>
        <Link href={`/party/play/${code}`} className="mt-2 text-red-600 hover:underline">Volver a unirte</Link>
      </Center>
    );
  }

  const me = view.me;
  const serverChoice = me.choice;
  const answered = serverChoice !== null || picked !== null;

  async function answer(choice: number) {
    if (answered || remaining === 0) return;
    setPicked(choice);
    const r = await postParty(code, "answer", { playerId, choice });
    if (!r.ok) setPicked(null); // let them retry if it didn't stick
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-6">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">{me.name}</span>
        <span className="font-bold tabular-nums text-red-600 dark:text-red-400">{me.score} pts</span>
      </div>

      {view.status === "lobby" && (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-2xl font-bold">¡Estás dentro! 🎉</p>
          <p className="mt-2 text-neutral-500">Espera a que el anfitrión empiece la partida.</p>
          <p className="mt-6 text-sm text-neutral-400">{view.playersCount} en la sala</p>
        </div>
      )}

      {view.status === "question" && view.question && (
        <div className="flex flex-1 flex-col">
          <div className="mt-3 flex items-center justify-between text-sm text-neutral-500">
            <span>{CATEGORY_LABEL[view.question.category]} · {DIFFICULTY_LABEL[view.question.difficulty]}</span>
            <span className="font-bold tabular-nums">{remaining}s</span>
          </div>
          <h2 className="mt-4 text-xl font-bold leading-snug">{view.question.q}</h2>

          {answered ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <p className="text-2xl font-bold">Respuesta enviada</p>
              <p className="mt-2 text-neutral-500">Espera el resultado…</p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-3">
              {view.question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => answer(i)}
                  disabled={remaining === 0}
                  className={`flex items-center gap-3 rounded-xl px-4 py-4 text-left text-lg font-semibold text-white transition active:scale-[0.98] disabled:opacity-50 ${OPTION_COLORS[i]}`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/25 text-sm font-bold">
                    {LETTERS[i]}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {view.status === "reveal" && (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          {me.choice === null ? (
            <p className="text-2xl font-bold text-neutral-500">No respondiste 😴</p>
          ) : me.correct ? (
            <>
              <p className="text-3xl font-black text-green-600">¡Correcto! ✅</p>
              <p className="mt-2 text-xl font-bold">+{me.gained} puntos</p>
            </>
          ) : (
            <p className="text-3xl font-black text-red-600">Incorrecto ❌</p>
          )}
          {view.question && me.choice !== null && !me.correct && (
            <p className="mt-3 text-sm text-neutral-500">
              La correcta era: <span className="font-semibold">{view.question.options[view.question.answer ?? 0]}</span>
            </p>
          )}
          <div className="mt-6 rounded-xl bg-neutral-100 px-6 py-3 dark:bg-neutral-800/70">
            <p className="text-sm text-neutral-500">Vas en el puesto</p>
            <p className="text-2xl font-black">
              #{me.rank} <span className="text-base font-medium text-neutral-400">de {view.playersCount}</span>
            </p>
          </div>
        </div>
      )}

      {view.status === "ended" && (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-sm font-medium text-neutral-500">Terminaste en</p>
          <p className="text-6xl font-black">#{me.rank}</p>
          <p className="mt-1 text-lg font-semibold">{me.score} puntos</p>
          <div className="mt-8 w-full">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-400">Top 5</h3>
            <div className="flex flex-col gap-1.5">
              {view.top.map((r, i) => (
                <div
                  key={r.id}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2.5 ${
                    r.name === me.name ? "bg-red-600 text-white" : "bg-neutral-100 dark:bg-neutral-800/70"
                  }`}
                >
                  <span className="w-6 text-center font-bold opacity-70">{i + 1}</span>
                  <span className="flex-1 text-left font-medium">{r.name}</span>
                  <span className="font-bold tabular-nums">{r.score}</span>
                </div>
              ))}
            </div>
          </div>
          <Link href="/" className="mt-8 text-sm text-red-600 hover:underline dark:text-red-400">
            Volver al juego diario
          </Link>
        </div>
      )}
    </main>
  );
}
