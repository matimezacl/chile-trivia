"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { QUESTIONS_PER_DAY, dayNumber, pointsForResults } from "@/lib/game";
import { EVENTS_PER_DAY, EXPERT_MAX_SCORE } from "@/lib/timeline";

// The daily checklist: one glance shows what's played today and one button
// shares the whole day. Reads the same localStorage the games write.

interface TriviaSave { results: boolean[]; done: boolean }
interface CronosSave { results: boolean[]; done: boolean }
interface ExpertSave { finished: boolean; results: { points: number; correct: boolean[] }[] }

interface DayState {
  day: number;
  trivia: { score: number; points: number; squares: string } | null;
  cronos: { score: number; squares: string } | null;
  expert: { points: number } | null;
}

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

const squares = (results: boolean[]) => results.map((r) => (r ? "🟩" : "🟥")).join("");

export default function DailyStatus() {
  const [state, setState] = useState<DayState | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const day = dayNumber();
    const trivia = read<TriviaSave>(`ct:game:${day}`);
    const cronos = read<CronosSave>(`ct:tl:game:${day}`);
    const expert = read<ExpertSave>(`ct:tl:expert:${day}`);
    setState({
      day,
      trivia: trivia?.done
        ? {
            score: trivia.results.filter(Boolean).length,
            points: pointsForResults(day, trivia.results),
            squares: squares(trivia.results),
          }
        : null,
      cronos: cronos?.done
        ? { score: cronos.results.filter(Boolean).length, squares: squares(cronos.results) }
        : null,
      expert: expert?.finished
        ? { points: expert.results.reduce((s, r) => s + r.points, 0) }
        : null,
    });
  }, []);

  if (!state) return null;
  const anyPlayed = !!(state.trivia || state.cronos || state.expert);

  async function shareDay() {
    if (!state) return;
    const lines = [`Cachaí #${state.day + 1} 🇨🇱`];
    if (state.trivia) lines.push(`Trivia ${state.trivia.score}/${QUESTIONS_PER_DAY} ${state.trivia.squares} (+${state.trivia.points} pts)`);
    if (state.cronos) lines.push(`Cronos ${state.cronos.score}/${EVENTS_PER_DAY} ${state.cronos.squares}`);
    if (state.expert) lines.push(`Experto ${state.expert.points}/${EXPERT_MAX_SCORE} 🎓`);
    lines.push("", "https://chile-trivia.vercel.app");
    const text = lines.join("\n");
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

  return (
    <section className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Tu día</h2>
        {anyPlayed && (
          <button
            onClick={shareDay}
            className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            {copied ? "¡Copiado! 📋" : "Compartir mi día"}
          </button>
        )}
      </div>
      <ul className="mt-3 divide-y divide-neutral-100 dark:divide-neutral-800">
        <Row
          href="/"
          emoji="🧠"
          name="Trivia diaria"
          status={state.trivia ? `${state.trivia.score}/5 · +${state.trivia.points} pts` : null}
        />
        <Row
          href="/timeline"
          emoji="🕰️"
          name="Cronos"
          status={state.cronos ? `${state.cronos.score}/5` : null}
        />
        <Row
          href="/timeline/experto"
          emoji="🎓"
          name="Cronos Experto"
          status={state.expert ? `${state.expert.points}/${EXPERT_MAX_SCORE}` : null}
        />
      </ul>
    </section>
  );
}

function Row({ href, emoji, name, status }: { href: string; emoji: string; name: string; status: string | null }) {
  return (
    <li>
      <Link href={href} className="flex items-center gap-3 py-2.5 text-sm">
        <span className="text-lg" aria-hidden="true">{emoji}</span>
        <span className="flex-1 font-medium">{name}</span>
        {status ? (
          <span className="font-semibold text-green-600 dark:text-green-500">✓ {status}</span>
        ) : (
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
            Jugar →
          </span>
        )}
      </Link>
    </li>
  );
}
