"use client";

import Link from "next/link";
import QRCode from "qrcode";
import { use, useEffect, useRef, useState } from "react";
import { CATEGORY_LABEL, DIFFICULTY_LABEL } from "@/lib/questions";
import type { HostView } from "@/lib/party";
import { getHostId, postParty, useCountdown, usePartyPoll } from "@/lib/partyClient";

const LETTERS = ["A", "B", "C", "D"];

export default function HostPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const [hostId, setHostId] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const id = getHostId(code);
    if (id) setHostId(id);
    else setMissing(true);
  }, [code]);

  const { view, error } = usePartyPoll<HostView>(code, hostId);

  if (missing) {
    return (
      <Center>
        <p className="text-lg font-semibold">No eres el anfitrión de esta sala</p>
        <Link href={`/party/play/${code}`} className="mt-2 text-red-600 hover:underline dark:text-red-400">
          Unirte como jugador →
        </Link>
      </Center>
    );
  }
  if (error) return <Center><p className="text-lg font-semibold">{error}</p></Center>;
  if (!view) return <Center><p className="text-neutral-400">Cargando…</p></Center>;

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-5 pb-10">
      {view.status === "lobby" && <Lobby code={code} hostId={hostId!} view={view} />}
      {view.status === "question" && <QuestionStage code={code} hostId={hostId!} view={view} />}
      {view.status === "reveal" && <RevealStage code={code} hostId={hostId!} view={view} />}
      {view.status === "ended" && <Podium view={view} />}
    </main>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-5 text-center">{children}</main>;
}

function Lobby({ code, hostId, view }: { code: string; hostId: string; view: HostView }) {
  const [qr, setQr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const joinUrl = typeof window !== "undefined" ? `${window.location.origin}/party/play/${code}` : "";

  useEffect(() => {
    if (joinUrl) QRCode.toDataURL(joinUrl, { margin: 1, width: 240 }).then(setQr).catch(() => {});
  }, [joinUrl]);

  async function start() {
    setBusy(true);
    setErr(null);
    const r = await postParty(code, "start", { hostId });
    if (!r.ok) {
      setErr(r.error ?? "No se pudo empezar");
      setBusy(false);
    }
  }

  return (
    <div className="pt-8 text-center">
      <p className="text-sm font-medium text-neutral-500">Únete en cachai en tu teléfono</p>
      <div className="mt-3 inline-block rounded-2xl border-2 border-red-600 px-8 py-4">
        <p className="text-xs uppercase tracking-widest text-neutral-400">Código</p>
        <p className="text-6xl font-black tracking-[0.2em] text-red-600">{code}</p>
      </div>

      {qr && (
        <div className="mt-6 flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt="Código QR para unirse" width={180} height={180} className="rounded-xl" />
          <p className="mt-2 max-w-xs break-all text-xs text-neutral-400">{joinUrl}</p>
        </div>
      )}

      <div className="mt-8">
        <p className="text-sm font-medium text-neutral-500">
          {view.playersCount} {view.playersCount === 1 ? "jugador" : "jugadores"} en la sala
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {view.players.map((p) => (
            <span key={p.id} className="rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-medium dark:bg-neutral-800">
              {p.name}
            </span>
          ))}
          {view.playersCount === 0 && <span className="text-sm text-neutral-400">Esperando jugadores…</span>}
        </div>
      </div>

      {err && <p className="mt-4 text-sm text-red-600">{err}</p>}
      <button
        onClick={start}
        disabled={busy || view.playersCount === 0}
        className="mt-8 w-full rounded-xl bg-red-600 py-4 text-lg font-semibold text-white transition hover:bg-red-700 active:scale-[0.99] disabled:opacity-40"
      >
        {busy ? "Empezando…" : "Empezar partida"}
      </button>
    </div>
  );
}

function QuestionStage({ code, hostId, view }: { code: string; hostId: string; view: HostView }) {
  const remaining = useCountdown(view.questionStartedAt, view.secondsPerQuestion);
  const q = view.question!;
  const firedFor = useRef<number>(-1);

  // Auto-reveal when the clock runs out (once per question).
  useEffect(() => {
    if (remaining === 0 && firedFor.current !== view.currentIndex) {
      firedFor.current = view.currentIndex;
      void postParty(code, "reveal", { hostId });
    }
  }, [remaining, view.currentIndex, code, hostId]);

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-neutral-500">
          Pregunta {view.currentIndex + 1} / {view.total}
        </span>
        <span className="rounded-full bg-neutral-100 px-3 py-1 font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          {CATEGORY_LABEL[q.category]} · {DIFFICULTY_LABEL[q.difficulty]}
        </span>
      </div>

      <div className="mt-6 flex items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-red-600 text-3xl font-black tabular-nums text-red-600">
          {remaining}
        </div>
      </div>

      <h2 className="mt-6 text-center text-2xl font-bold leading-snug sm:text-3xl">{q.q}</h2>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {q.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border-2 border-neutral-200 px-4 py-4 text-lg dark:border-neutral-700">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-sm font-bold text-neutral-500 dark:bg-neutral-800">
              {LETTERS[i]}
            </span>
            <span className="font-medium">{opt}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-500">
          {view.answeredCount} / {view.playersCount} respondieron
        </span>
        <button
          onClick={() => postParty(code, "reveal", { hostId })}
          className="rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-semibold hover:bg-neutral-50 dark:border-neutral-600 dark:hover:bg-neutral-800"
        >
          Revelar respuesta
        </button>
      </div>
    </div>
  );
}

function RevealStage({ code, hostId, view }: { code: string; hostId: string; view: HostView }) {
  const q = view.question!;
  const isLast = view.currentIndex + 1 >= view.total;
  return (
    <div className="pt-6">
      <p className="text-center text-sm font-medium text-neutral-500">
        Pregunta {view.currentIndex + 1} / {view.total}
      </p>
      <h2 className="mt-3 text-center text-2xl font-bold leading-snug sm:text-3xl">{q.q}</h2>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {q.options.map((opt, i) => {
          const correct = i === q.answer;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-xl border-2 px-4 py-4 text-lg ${
                correct
                  ? "border-green-500 bg-green-50 dark:bg-green-950/50"
                  : "border-neutral-200 opacity-50 dark:border-neutral-800"
              }`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-sm font-bold text-neutral-500 dark:bg-neutral-800">
                {LETTERS[i]}
              </span>
              <span className="font-medium">{opt}</span>
              {correct && <span className="ml-auto text-green-600">✓</span>}
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-400">Tabla de posiciones</h3>
        <Leaderboard rows={view.leaderboard} />
      </div>

      <button
        onClick={() => postParty(code, "next", { hostId })}
        className="mt-8 w-full rounded-xl bg-red-600 py-4 text-lg font-semibold text-white transition hover:bg-red-700 active:scale-[0.99]"
      >
        {isLast ? "Ver podio final 🏆" : "Siguiente pregunta"}
      </button>
    </div>
  );
}

function Leaderboard({ rows }: { rows: { id: string; name: string; score: number }[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      {rows.slice(0, 8).map((r, i) => (
        <div
          key={r.id}
          className="flex items-center gap-3 rounded-xl bg-neutral-100 px-4 py-2.5 dark:bg-neutral-800/70"
        >
          <span className="w-6 text-center font-bold text-neutral-400">{i + 1}</span>
          <span className="flex-1 font-medium">{r.name}</span>
          <span className="font-bold tabular-nums text-red-600 dark:text-red-400">{r.score}</span>
        </div>
      ))}
    </div>
  );
}

function Podium({ view }: { view: HostView }) {
  const top = view.leaderboard.slice(0, 5);
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div className="pt-10 text-center">
      <h1 className="text-3xl font-black">🏆 ¡Resultados finales!</h1>
      <div className="mt-8 flex flex-col gap-2">
        {top.map((r, i) => (
          <div
            key={r.id}
            className={`flex items-center gap-3 rounded-xl px-5 py-4 ${
              i === 0
                ? "bg-red-600 text-white"
                : "bg-neutral-100 dark:bg-neutral-800/70"
            }`}
          >
            <span className="w-9 text-2xl">{medals[i] ?? i + 1}</span>
            <span className="flex-1 text-left text-lg font-semibold">{r.name}</span>
            <span className="text-lg font-black tabular-nums">{r.score}</span>
          </div>
        ))}
      </div>
      <Link href="/party" className="mt-10 inline-block rounded-xl bg-neutral-900 px-6 py-3 font-semibold text-white dark:bg-white dark:text-neutral-900">
        Nueva partida
      </Link>
    </div>
  );
}
