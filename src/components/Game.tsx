"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORY_LABEL, type Question } from "@/lib/questions";
import { QUESTIONS_PER_DAY, dayNumber, questionsForDay, shareGrid } from "@/lib/game";
import {
  getStats,
  loadGame,
  recordFinish,
  saveGame,
  syncResultToLeagues,
  type SavedGame,
  type Stats,
} from "@/lib/client";

const LETTERS = ["A", "B", "C", "D"];

export default function Game() {
  const [day, setDay] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [results, setResults] = useState<boolean[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [copied, setCopied] = useState(false);

  // Initialise for today: rehydrate a saved game if the player already played.
  useEffect(() => {
    const d = dayNumber();
    const qs = questionsForDay(d);
    setDay(d);
    setQuestions(qs);

    const saved = loadGame(d);
    if (saved?.done) {
      setAnswers(saved.answers);
      setResults(saved.results);
      setDone(true);
      setCurrent(qs.length);
      // Idempotent: ensures stats and league sync land even if the player left
      // right after the last answer, before hitting "Ver resultado".
      const correct = saved.results.filter(Boolean).length;
      setStats(recordFinish(d, correct, qs.length));
      void syncResultToLeagues(d, correct);
    } else if (saved) {
      setAnswers(saved.answers);
      setResults(saved.results);
      const answered = saved.answers.filter((a) => a >= 0).length;
      setCurrent(answered);
    } else {
      setAnswers(new Array(qs.length).fill(-1));
      setResults([]);
    }
  }, []);

  const score = results.filter(Boolean).length;

  function choose(idx: number) {
    if (selected !== null || done || day === null) return;
    const q = questions[current];
    const ok = idx === q.answer;
    setSelected(idx);

    const nextAnswers = [...answers];
    nextAnswers[current] = idx;
    const nextResults = [...results, ok];
    setAnswers(nextAnswers);
    setResults(nextResults);

    const isLast = current === questions.length - 1;
    const partial: SavedGame = {
      answers: nextAnswers,
      results: nextResults,
      done: isLast,
    };
    saveGame(day, partial);
  }

  function next() {
    if (day === null) return;
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      return;
    }
    // Finished the last question.
    setDone(true);
    setCurrent(questions.length);
    const correct = results.filter(Boolean).length;
    const s = recordFinish(day, correct, questions.length);
    setStats(s);
    void syncResultToLeagues(day, correct);
  }

  async function share() {
    if (day === null) return;
    const text = shareGrid(results, day);
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
    } catch {
      /* user cancelled — fall through to clipboard */
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  if (day === null) {
    return <div className="mt-20 text-center text-neutral-400">Cargando…</div>;
  }

  if (done) {
    return (
      <Results
        day={day}
        results={results}
        stats={stats}
        onShare={share}
        copied={copied}
      />
    );
  }

  const q = questions[current];
  return (
    <div className="pop-in">
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="rounded-full bg-neutral-100 px-3 py-1 font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          {CATEGORY_LABEL[q.category]}
        </span>
        <span className="tabular-nums text-neutral-400">
          {current + 1} / {questions.length}
        </span>
      </div>

      <Progress total={questions.length} results={results} current={current} />

      <h2 className="mt-6 mb-6 text-xl font-semibold leading-snug sm:text-2xl">{q.q}</h2>

      <div className="flex flex-col gap-3">
        {q.options.map((opt, i) => {
          const isAnswer = i === q.answer;
          const isPicked = i === selected;
          let cls =
            "border-neutral-200 hover:border-red-400 hover:bg-red-50 dark:border-neutral-700 dark:hover:border-red-500 dark:hover:bg-red-950/40";
          if (selected !== null) {
            if (isAnswer)
              cls = "border-green-500 bg-green-50 dark:bg-green-950/50 dark:border-green-500";
            else if (isPicked)
              cls = "border-red-500 bg-red-50 dark:bg-red-950/50 dark:border-red-500";
            else cls = "border-neutral-200 opacity-60 dark:border-neutral-800";
          }
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={selected !== null}
              className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-base transition ${cls}`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-sm font-bold text-neutral-500 dark:bg-neutral-800">
                {LETTERS[i]}
              </span>
              <span className="font-medium">{opt}</span>
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="reveal mt-5">
          <p className="rounded-xl bg-neutral-100 px-4 py-3 text-sm leading-relaxed text-neutral-700 dark:bg-neutral-800/70 dark:text-neutral-300">
            {selected === q.answer ? "✅ ¡Correcto! " : "❌ "}
            {q.fact}
          </p>
          <button
            onClick={next}
            className="mt-4 w-full rounded-xl bg-red-600 py-3.5 text-base font-semibold text-white transition hover:bg-red-700 active:scale-[0.99]"
          >
            {current === questions.length - 1 ? "Ver resultado" : "Siguiente"}
          </button>
        </div>
      )}
    </div>
  );
}

function Progress({
  total,
  results,
  current,
}: {
  total: number;
  results: boolean[];
  current: number;
}) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        let cls = "bg-neutral-200 dark:bg-neutral-800";
        if (i < results.length) cls = results[i] ? "bg-green-500" : "bg-red-500";
        else if (i === current) cls = "bg-neutral-400 dark:bg-neutral-500";
        return <div key={i} className={`h-1.5 flex-1 rounded-full ${cls}`} />;
      })}
    </div>
  );
}

function Results({
  day,
  results,
  stats,
  onShare,
  copied,
}: {
  day: number;
  results: boolean[];
  stats: Stats | null;
  onShare: () => void;
  copied: boolean;
}) {
  const score = results.filter(Boolean).length;
  const verdict = useMemo(() => verdictFor(score), [score]);

  return (
    <div className="pop-in text-center">
      <p className="text-sm font-medium text-neutral-400">Cachaí #{day + 1}</p>
      <p className="mt-2 text-6xl font-black tabular-nums">
        {score}
        <span className="text-3xl font-bold text-neutral-400">/{QUESTIONS_PER_DAY}</span>
      </p>
      <p className="mt-1 text-lg font-semibold text-red-600 dark:text-red-400">{verdict}</p>

      <div className="mt-6 flex justify-center gap-2 text-2xl">
        {results.map((ok, i) => (
          <span key={i}>{ok ? "🟩" : "🟥"}</span>
        ))}
      </div>

      {stats && (
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          <Stat label="Racha" value={stats.streak} />
          <Stat label="Jugados" value={stats.played} />
          <Stat label="Perfectos" value={stats.perfect} />
        </div>
      )}

      <button
        onClick={onShare}
        className="mt-8 w-full rounded-xl bg-red-600 py-3.5 text-base font-semibold text-white transition hover:bg-red-700 active:scale-[0.99]"
      >
        {copied ? "¡Copiado! 📋" : "Compartir resultado"}
      </button>

      <p className="mt-6 text-sm text-neutral-400">Vuelve mañana para un nuevo desafío 🇨🇱</p>
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

function verdictFor(score: number): string {
  return (
    [
      "Uf… puro chilenismo pendiente 😅",
      "Vai aprendiendo, sigue no más",
      "Ahí vamos, medio chileno",
      "¡Bien! Cachái harto",
      "¡Casi perfecto, crack!",
      "¡Perfecto! Chileno de tomo y lomo 🇨🇱",
    ][score] ?? ""
  );
}
