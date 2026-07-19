"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  EVENTS_PER_DAY,
  dayNumber,
  eventsForDay,
  scoreOrdering,
  shareTimeline,
  solutionForDay,
  type TimelineEvent,
} from "@/lib/timeline";
import { SortableList } from "./timeline/SortableList";

interface SavedTimeline {
  ordering: number[];
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
const read = <T,>(k: string): T | null => {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};
const write = (k: string, v: unknown) => {
  if (isBrowser) localStorage.setItem(k, JSON.stringify(v));
};

const loadTl = (day: number) => read<SavedTimeline>(`ct:tl:game:${day}`);
const getTlStats = (): TlStats =>
  read<TlStats>("ct:tl:stats") ?? { played: 0, perfect: 0, streak: 0, maxStreak: 0, lastDay: null };

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
  const [ordered, setOrdered] = useState<TimelineEvent[]>([]);
  const [done, setDone] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [stats, setStats] = useState<TlStats | null>(null);
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const d = dayNumber();
    setDay(d);
    const events = eventsForDay(d);
    const saved = loadTl(d);
    if (saved?.done) {
      const byId = new Map(events.map((e) => [e.id, e]));
      setOrdered(saved.ordering.map((id) => byId.get(id)!).filter(Boolean));
      setResults(saved.results);
      setDone(true);
      setStats(getTlStats());
    } else {
      setOrdered(events);
    }
  }, []);

  const solution = useMemo(() => (day === null ? [] : solutionForDay(day)), [day]);

  if (day === null || ordered.length === 0) {
    return <div className="mt-16 text-center text-neutral-400">Cargando…</div>;
  }

  function check() {
    if (day === null) return;
    setChecking(true);
    const res = scoreOrdering(
      day,
      ordered.map((e) => e.id)
    );
    setTimeout(() => {
      setResults(res);
      setDone(true);
      write(`ct:tl:game:${day}`, {
        ordering: ordered.map((e) => e.id),
        results: res,
        done: true,
      } satisfies SavedTimeline);
      setStats(recordTlFinish(day, res.filter(Boolean).length));
      setChecking(false);
    }, 400);
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
    const placedAt = new Map(ordered.map((e, i) => [e.id, i]));
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
                className={`year-reveal flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm ${
                  ok
                    ? "border-green-500 bg-green-50 dark:bg-green-950/40"
                    : "border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
                }`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <span className="w-14 shrink-0 text-center text-base font-black tabular-nums">{e.year}</span>
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

        <Link
          href="/timeline/experto"
          className="mt-4 flex items-center justify-between rounded-2xl border-2 border-neutral-200 px-5 py-4 text-left transition hover:border-red-300 dark:border-neutral-700 dark:hover:border-red-900"
        >
          <span>
            <span className="block text-base font-semibold">¿Cachái más? Prueba Cronos Experto 🎓</span>
            <span className="block text-xs text-neutral-500">3 rondas, insertar cartas en la línea de tiempo</span>
          </span>
          <span className="text-xl">→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="pop-in">
      <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
        Arrastra los hitos para ordenarlos <br className="sm:hidden" />
        del <strong>más antiguo</strong> al <strong>más reciente</strong>.
      </div>

      {/* Timeline visual: axis + labels */}
      <div className="flex gap-3">
        <TimelineAxis count={ordered.length} />
        <div className="flex-1">
          <SortableList
            items={ordered.map((e) => ({ ...e, id: String(e.id) }))}
            onChange={(next) => {
              // Preserve full TimelineEvent shape when reordering
              const map = new Map(ordered.map((e) => [e.id, e]));
              setOrdered(next.map((n) => map.get(Number(n.id))!).filter(Boolean));
            }}
            renderItem={(item, { index, isDragging }) => (
              <EventCard event={item as unknown as TimelineEvent} index={index} isDragging={isDragging} />
            )}
          />
        </div>
      </div>

      <button
        onClick={check}
        disabled={checking}
        className="mt-6 w-full rounded-xl bg-red-600 py-3.5 text-base font-semibold text-white transition hover:bg-red-700 active:scale-[0.99] disabled:opacity-50"
      >
        {checking ? "Comprobando…" : "Comprobar orden"}
      </button>
    </div>
  );
}

// Vertical axis with older-up / newer-down labels, aligned to the card list.
function TimelineAxis({ count }: { count: number }) {
  return (
    <div className="flex flex-col items-center pt-2 pb-2" aria-hidden="true">
      <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Antiguo</div>
      <div className="my-2 flex-1 w-1 rounded-full bg-gradient-to-b from-neutral-200 via-red-300 to-neutral-200 dark:from-neutral-800 dark:via-red-900 dark:to-neutral-800" style={{ minHeight: `${count * 60}px` }} />
      <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Reciente</div>
    </div>
  );
}

function EventCard({ event, index, isDragging }: { event: TimelineEvent; index: number; isDragging: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border-2 bg-white px-4 py-3.5 text-sm shadow-sm transition-shadow dark:bg-neutral-900 ${
        isDragging ? "border-red-500 shadow-xl ring-2 ring-red-200 dark:ring-red-900" : "border-neutral-200 dark:border-neutral-700"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${
          isDragging ? "bg-red-600 text-white" : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800"
        }`}
      >
        {index + 1}
      </span>
      <span className="flex-1 font-medium leading-snug">{event.text}</span>
      <span className="shrink-0 text-neutral-300 dark:text-neutral-600" aria-hidden="true">
        ⋮⋮
      </span>
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
