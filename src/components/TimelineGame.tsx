"use client";

import { useEffect, useMemo, useState } from "react";
import {
  EVENTS_PER_DAY,
  dayNumber,
  eventsForDay,
  scoreOrdering,
  shareTimeline,
  solutionForDay,
} from "@/lib/timeline";

interface SavedTimeline {
  ordering: number[]; // event ids in the player's chosen order
  results: boolean[];
  done: boolean;
}

interface TlStats {
  played: number;
  perfect: number;
  streak: number;
  maxStreak: number;
  lastDay: number | null;
}

const isBrowser = typeof window !== "undefined";

function read<T>(key: string): T | null {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  if (isBrowser) localStorage.setItem(key, JSON.stringify(value));
}

function loadTl(day: number): SavedTimeline | null {
  return read<SavedTimeline>(`ct:tl:game:${day}`);
}

function getTlStats(): TlStats {
  return read<TlStats>("ct:tl:stats") ?? { played: 0, perfect: 0, streak: 0, maxStreak: 0, lastDay: null };
}

function recordTlFinish(day: number, correct: number): TlStats {
  const s = getTlStats();
  if (s.lastDay === day) return s;
  s.played++;
  if (correct === EVENTS_PER_DAY) s.perfect++;
  s.streak = s.lastDay === day - 1 || s.lastDay === null ? s.streak + 1 : 1;
  s.maxStreak = Math.max(s.maxStreak, s.streak);
  s.lastDay = day;
  write("ct:tl:stats", s);
  return s;
}

export default function TimelineGame() {
  const [day, setDay] = useState<number | null>(null);
  const [picked, setPicked] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [stats, setStats] = useState<TlStats | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const d = dayNumber();
    setDay(d);
    const saved = loadTl(d);
    if (saved?.done) {
      setPicked(saved.ordering);
      setResults(saved.results);
      setDone(true);
      setStats(getTlStats());
    }
  }, []);

  const events = useMemo(() => (day === null ? [] : eventsForDay(day)), [day]);
  const solution = useMemo(() => (day === null ? [] : solutionForDay(day)), [day]);

  if (day === null) return <div className="mt-16 text-center text-neutral-400">Cargando…</div>;

  function toggle(id: number) {
    if (done) return;
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length < EVENTS_PER_DAY ? [...p, id] : p));
  }

  function check() {
    if (picked.length !== EVENTS_PER_DAY || day === null) return;
    const res = scoreOrdering(day, picked);
    setResults(res);
    setDone(true);
    write(`ct:tl:game:${day}`, { ordering: picked, results: res, done: true } satisfies SavedTimeline);
    setStats(recordTlFinish(day, res.filter(Boolean).length));
  }

  async function share() {
    const text = shareTimeline(results, day!);
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
    } catch {
      /* cancelled */
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  if (done) {
    const score = results.filter(Boolean).length;
    // Where the player placed each solution event, for the reveal.
    const placedAt = new Map(picked.map((id, i) => [id, i]));
    return (
      <div className="pop-in">
        <p className="text-center text-sm font-medium text-neutral-400">Cronos #{day + 1}</p>
        <p className="mt-1 text-center text-5xl font-black tabular-nums">
          {score}
          <span className="text-2xl font-bold text-neutral-400">/{EVENTS_PER_DAY}</span>
        </p>
        <p className="mt-1 text-center text-lg font-semibold text-red-600 dark:text-red-400">
          {["Uf… el tiempo vuela 😅", "Algo es algo", "Vamos mejorando", "¡Bien! Casi crack", "¡Casi perfecto!", "¡Perfecto! Memoria de historiador 🇨🇱"][score]}
        </p>

        <div className="mt-6 flex flex-col gap-2">
          {solution.map((e, i) => {
            const ok = results[i];
            return (
              <div
                key={e.id}
                className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm ${
                  ok
                    ? "border-green-500 bg-green-50 dark:bg-green-950/40"
                    : "border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
                }`}
              >
                <span className="w-12 shrink-0 text-center text-base font-black tabular-nums">{e.year}</span>
                <span className="flex-1">{e.text}</span>
                <span className="shrink-0 text-lg">{ok ? "✅" : "❌"}</span>
                {!ok && (
                  <span className="shrink-0 text-xs text-neutral-400">pusiste #{(placedAt.get(e.id) ?? 0) + 1}</span>
                )}
              </div>
            );
          })}
        </div>

        {stats && (
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <Stat label="Racha" value={stats.streak} />
            <Stat label="Jugados" value={stats.played} />
            <Stat label="Perfectos" value={stats.perfect} />
          </div>
        )}

        <button
          onClick={share}
          className="mt-6 w-full rounded-xl bg-red-600 py-3.5 text-base font-semibold text-white transition hover:bg-red-700 active:scale-[0.99]"
        >
          {copied ? "¡Copiado! 📋" : "Compartir resultado"}
        </button>
        <p className="mt-5 text-center text-sm text-neutral-400">Vuelve mañana para una nueva línea de tiempo 🕰️</p>
      </div>
    );
  }

  return (
    <div className="pop-in">
      <p className="text-center text-sm text-neutral-500">
        Toca los hitos <span className="font-semibold">del más antiguo al más reciente</span>
      </p>

      <div className="mt-5 flex flex-col gap-2.5">
        {events.map((e) => {
          const pos = picked.indexOf(e.id);
          const selected = pos !== -1;
          return (
            <button
              key={e.id}
              onClick={() => toggle(e.id)}
              className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-sm transition active:scale-[0.99] ${
                selected
                  ? "border-red-600 bg-red-50 dark:bg-red-950/40"
                  : "border-neutral-200 hover:border-red-300 dark:border-neutral-700"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                  selected
                    ? "bg-red-600 text-white"
                    : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800"
                }`}
              >
                {selected ? pos + 1 : "·"}
              </span>
              <span className="font-medium">{e.text}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          onClick={() => setPicked([])}
          disabled={picked.length === 0}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-500 hover:bg-neutral-100 disabled:opacity-40 dark:hover:bg-neutral-800"
        >
          Reiniciar
        </button>
        <button
          onClick={check}
          disabled={picked.length !== EVENTS_PER_DAY}
          className="flex-1 rounded-xl bg-red-600 py-3.5 text-base font-semibold text-white transition hover:bg-red-700 active:scale-[0.99] disabled:opacity-40"
        >
          {picked.length === EVENTS_PER_DAY ? "Comprobar" : `Elige ${EVENTS_PER_DAY - picked.length} más`}
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-neutral-100 py-3 dark:bg-neutral-800/70">
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="text-xs text-neutral-500">{label}</div>
    </div>
  );
}
