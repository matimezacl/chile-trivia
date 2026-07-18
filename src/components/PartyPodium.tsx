"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Standing } from "@/lib/party";

// Count a number up to `target` with an ease-out, once `run` is true.
function useCountUp(target: number, run: boolean, ms = 700): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) {
      setVal(0);
      return;
    }
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / ms);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms]);
  return val;
}

function Confetti() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = (canvas.width = canvas.offsetWidth * dpr);
    const h = (canvas.height = canvas.offsetHeight * dpr);
    const colors = ["#dc2626", "#f59e0b", "#16a34a", "#2563eb", "#ffffff"];
    const parts = Array.from({ length: 140 }, () => ({
      x: Math.random() * w,
      y: -Math.random() * h * 0.4,
      vx: (Math.random() - 0.5) * 3 * dpr,
      vy: (Math.random() * 3 + 2) * dpr,
      size: (Math.random() * 6 + 4) * dpr,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
    }));
    let raf = 0;
    const start = performance.now();
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04 * dpr;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
      if (t - start < 4000) raf = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, w, h);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
}

const MEDALS = ["🥇", "🥈", "🥉"];

function Row({ rank, name, score, run, champion }: { rank: number; name: string; score: number; run: boolean; champion: boolean }) {
  const shown = useCountUp(score, run);
  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-5 py-4 transition-all duration-500 ${
        run ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${champion ? "bg-red-600 text-white shadow-lg" : "bg-neutral-100 dark:bg-neutral-800/70"}`}
    >
      <span className="w-9 text-2xl">{MEDALS[rank - 1] ?? rank}</span>
      <span className="flex-1 text-left text-lg font-semibold">
        {name}
        {champion && <span className="ml-2">👑</span>}
      </span>
      <span className="text-xl font-black tabular-nums">{shown}</span>
    </div>
  );
}

export default function PartyPodium({
  leaderboard,
  title = "🏆 ¡Resultados finales!",
  showNewGameLink = true,
}: {
  leaderboard: Standing[];
  title?: string;
  showNewGameLink?: boolean;
}) {
  const rows = leaderboard.slice(0, 5);
  // Reveal bottom-to-top: `revealed` counts how many rows (from the last) show.
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    const timers = rows.map((_, i) => setTimeout(() => setRevealed((r) => Math.max(r, i + 1)), 500 + i * 850));
    return () => timers.forEach(clearTimeout);
  }, [rows.length]);

  const championShown = revealed >= rows.length && rows.length > 0;

  return (
    <div className="relative pt-10 text-center">
      {championShown && <Confetti />}
      <h1 className="text-3xl font-black">{title}</h1>
      <div className="mt-8 flex flex-col gap-2">
        {rows.map((r, i) => {
          // Row i (rank i+1) becomes visible once the reveal reaches it, counting
          // up from the bottom of the list.
          const run = revealed >= rows.length - i;
          return <Row key={r.id} rank={i + 1} name={r.name} score={r.score} run={run} champion={i === 0 && championShown} />;
        })}
      </div>
      {showNewGameLink && <Link
        href="/party"
        className={`mt-10 inline-block rounded-xl bg-neutral-900 px-6 py-3 font-semibold text-white transition-opacity duration-500 dark:bg-white dark:text-neutral-900 ${
          championShown ? "opacity-100" : "opacity-0"
        }`}
      >
        Nueva partida
      </Link>}
    </div>
  );
}
