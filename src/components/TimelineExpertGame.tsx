"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DndContext, DragOverlay, PointerSensor, TouchSensor, useDroppable, useDraggable, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { createPortal } from "react-dom";
import {
  EVENTS,
  EXPERT_CARDS_PER_ROUND,
  EXPERT_MAX_SCORE,
  EXPERT_ROUNDS,
  EXPERT_ROUND_POINTS,
  correctInsertIndex,
  dayNumber,
  expertRoundCards,
  scoreExpertRound,
  shareExpert,
  type TimelineEvent,
} from "@/lib/timeline";

// ==== Persistence ====

interface RoundResult { correct: boolean[]; points: number; hand: number[]; playerPlacements: number[] }
interface SavedExpert {
  day: number;
  round: number;
  timeline: number[]; // event ids in chronological order
  finished: boolean;
  results: RoundResult[];
}
interface ExpertStats {
  played: number;
  best: number;
  streak: number;
  lastDay: number | null;
}

const isBrowser = typeof window !== "undefined";
const read = <T,>(k: string): T | null => {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch { return null; }
};
const write = (k: string, v: unknown) => { if (isBrowser) localStorage.setItem(k, JSON.stringify(v)); };
const loadSaved = (d: number) => read<SavedExpert>(`ct:tl:expert:${d}`);
const saveState = (s: SavedExpert) => write(`ct:tl:expert:${s.day}`, s);
const getStats = (): ExpertStats => read<ExpertStats>("ct:tl:expert:stats") ?? { played: 0, best: 0, streak: 0, lastDay: null };
function recordFinish(day: number, points: number): ExpertStats {
  const s = getStats();
  if (s.lastDay === day) return s;
  s.played++;
  if (points > s.best) s.best = points;
  s.streak = s.lastDay === day - 1 || s.lastDay === null ? s.streak + 1 : 1;
  s.lastDay = day;
  write("ct:tl:expert:stats", s);
  return s;
}

// ==== Component ====

export default function TimelineExpertGame() {
  const [day, setDay] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const [timeline, setTimeline] = useState<number[]>([]); // correctly-placed event ids so far
  // placements: for each hand card, the index it currently sits at in the merged list.
  // Missing = not yet placed. The merged list is: timeline cards + placements in position order.
  const [placements, setPlacements] = useState<Record<number, number>>({});
  const [hand, setHand] = useState<number[]>([]);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [revealing, setRevealing] = useState<null | { correct: boolean[]; merged: number[]; points: number }>(null);
  const [finished, setFinished] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [stats, setStats] = useState<ExpertStats | null>(null);
  const [copied, setCopied] = useState(false);
  // Portal target for the drag ghost (see SortableList: keeps position:fixed
  // viewport-relative even when an ancestor carries a CSS transform).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const byId = useMemo(() => new Map(EVENTS.map((e) => [e.id, e])), []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 5 } })
  );

  // Initial load
  useEffect(() => {
    const d = dayNumber();
    setDay(d);
    const saved = loadSaved(d);
    if (saved) {
      setRound(saved.round);
      setTimeline(saved.timeline);
      setRoundResults(saved.results);
      setFinished(saved.finished);
      if (saved.finished) setStats(getStats());
    }
    // start a fresh round when we're not finished — dealt from the saved state
    // (or from scratch if none)
    const startRound = saved?.round ?? 0;
    if (!saved?.finished) {
      const cards = expertRoundCards(d, startRound).map((e) => e.id);
      setHand(cards);
      setPlacements({});
    }
  }, []);

  if (day === null) return <div className="mt-16 text-center text-neutral-400">Cargando…</div>;

  // Build the merged view: timeline + placed hand cards, in the order the
  // player has chosen. Unplaced cards stay in the hand pile.
  const placed = Object.keys(placements).map(Number).sort((a, b) => placements[a] - placements[b]);
  const unplaced = hand.filter((id) => placements[id] === undefined);
  const mergedIds: number[] = [];
  {
    // Interleave: walk the timeline, and at each gap (0..timeline.length) drop
    // any placed cards whose target index equals the current gap index.
    let placedIdx = 0;
    for (let i = 0; i <= timeline.length; i++) {
      while (placedIdx < placed.length && placements[placed[placedIdx]] <= mergedIds.length) {
        mergedIds.push(placed[placedIdx]);
        placedIdx++;
      }
      if (i < timeline.length) mergedIds.push(timeline[i]);
    }
    while (placedIdx < placed.length) { mergedIds.push(placed[placedIdx]); placedIdx++; }
  }

  function handleDragStart(e: DragStartEvent) {
    setActiveDragId(String(e.active.id));
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveDragId(null);
    const { active, over } = e;
    if (!over) return;
    const cardId = Number(active.id);
    // Drop target ids are "gap:N" where N is the index in the merged list.
    const overId = String(over.id);
    if (!overId.startsWith("gap:")) return;
    const targetIndex = Number(overId.slice(4));
    setPlacements((prev) => {
      const next = { ...prev, [cardId]: targetIndex };
      // Re-normalize: after shifting one card, other placements should keep
      // their relative order but their indices may collide. Sort by desired
      // index then compact.
      const entries = Object.entries(next).map(([id, idx]) => ({ id: Number(id), idx }));
      entries.sort((a, b) => (a.id === cardId ? -0.5 : a.idx) - (b.id === cardId ? -0.5 : b.idx));
      // Actually just accept possible ties; the merged builder above handles it.
      return next;
    });
  }

  function removePlacement(cardId: number) {
    setPlacements((prev) => {
      const { [cardId]: _dropped, ...rest } = prev;
      return rest;
    });
  }

  function submit() {
    if (day === null) return;
    if (unplaced.length > 0) return;
    const submission = hand.map((id) => {
      const posInMerged = mergedIds.indexOf(id);
      return { id, playerIndex: posInMerged };
    });
    const res = scoreExpertRound(timeline, submission, round);
    const roundRes: RoundResult = {
      correct: res.correct,
      points: res.points,
      hand: [...hand],
      playerPlacements: submission.map((s) => s.playerIndex),
    };
    setRevealing({ correct: res.correct, merged: res.merged, points: res.points });
    // After a beat, commit and advance
    setTimeout(() => {
      const nextTimeline = res.merged;
      const nextResults = [...roundResults, roundRes];
      setRoundResults(nextResults);
      setTimeline(nextTimeline);
      setRevealing(null);
      if (round + 1 >= EXPERT_ROUNDS) {
        setFinished(true);
        const total = nextResults.reduce((s, r) => s + r.points, 0);
        setStats(recordFinish(day, total));
        saveState({ day, round: round + 1, timeline: nextTimeline, finished: true, results: nextResults });
      } else {
        const nextRound = round + 1;
        setRound(nextRound);
        setHand(expertRoundCards(day, nextRound).map((e) => e.id));
        setPlacements({});
        saveState({ day, round: nextRound, timeline: nextTimeline, finished: false, results: nextResults });
      }
    }, 2600);
  }

  async function share() {
    if (day === null) return;
    const perRound = roundResults.map((r) => r.correct.filter(Boolean).length);
    const total = roundResults.reduce((s, r) => s + r.points, 0);
    const text = shareExpert(perRound, total, day);
    try {
      if (navigator.share) { await navigator.share({ text }); return; }
    } catch { /* cancel */ }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* ignore */ }
  }

  if (finished) {
    const total = roundResults.reduce((s, r) => s + r.points, 0);
    return (
      <div className="pop-in">
        <p className="text-center text-sm font-medium text-neutral-400">Cronos Experto #{day + 1}</p>
        <p className="mt-1 text-center text-5xl font-black tabular-nums">
          {total}
          <span className="text-2xl font-bold text-neutral-400">/{EXPERT_MAX_SCORE}</span>
        </p>
        <p className="mt-1 text-center text-lg font-semibold text-red-600 dark:text-red-400">
          {total === EXPERT_MAX_SCORE ? "¡Historiador de la casa! 🎓" : total >= 20 ? "¡Muy bien! Cachái harto" : total >= 10 ? "Buen intento, sigue así" : "Uf… mañana lo hacís mejor"}
        </p>

        <div className="mt-6 flex flex-col gap-2">
          {roundResults.map((r, i) => {
            const correctCount = r.correct.filter(Boolean).length;
            return (
              <div key={i} className="flex items-center justify-between rounded-xl border-2 border-neutral-200 px-4 py-3 dark:border-neutral-700">
                <span className="text-sm font-medium">
                  Ronda {i + 1}
                  <span className="ml-2 text-xs text-neutral-400">(+{EXPERT_ROUND_POINTS[i]} pts/acierto)</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-lg">{"🟩".repeat(correctCount)}{"🟥".repeat(EXPERT_CARDS_PER_ROUND - correctCount)}</span>
                  <span className="text-sm font-bold tabular-nums">{r.points}</span>
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-400">La línea de tiempo completa</h3>
          <div className="flex flex-col gap-1.5">
            {timeline.map((id) => {
              const e = byId.get(id)!;
              return (
                <div key={id} className="flex items-center gap-3 rounded-xl bg-neutral-100 px-3 py-2 text-sm dark:bg-neutral-800/70">
                  <span className="w-14 shrink-0 text-center text-sm font-black tabular-nums">{e.year}</span>
                  <span className="flex-1">{e.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {stats && (
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <Stat label="Racha" value={stats.streak} />
            <Stat label="Mejor" value={stats.best} />
            <Stat label="Jugados" value={stats.played} />
          </div>
        )}

        <button
          onClick={share}
          className="mt-6 w-full rounded-xl bg-red-600 py-3.5 text-base font-semibold text-white transition hover:bg-red-700 active:scale-[0.99]"
        >
          {copied ? "¡Copiado! 📋" : "Compartir resultado"}
        </button>

        <Link href="/timeline" className="mt-4 block text-center text-sm text-red-600 hover:underline dark:text-red-400">
          ← Volver a Cronos diario
        </Link>
      </div>
    );
  }

  // ==== Playing view ====

  const activeCard = activeDragId !== null ? byId.get(Number(activeDragId)) : null;
  const canSubmit = unplaced.length === 0 && !revealing;

  return (
    <div className="pop-in">
      {/* Round header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Ronda {round + 1} de {EXPERT_ROUNDS}</p>
          <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-300">
            +{EXPERT_ROUND_POINTS[round]} pts por acierto
          </p>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: EXPERT_ROUNDS }).map((_, i) => (
            <div
              key={i}
              className={`h-2 w-8 rounded-full ${i < round ? "bg-red-600" : i === round ? "bg-red-300" : "bg-neutral-200 dark:bg-neutral-700"}`}
            />
          ))}
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
        {round === 0 ? (
          <>Arrastra cada carta a su lugar en la <strong>línea de tiempo</strong>. Del más antiguo (arriba) al más reciente (abajo).</>
        ) : (
          <>La línea ya tiene {timeline.length} hitos con año. Arrastra tus {EXPERT_CARDS_PER_ROUND} cartas nuevas al hueco correcto.</>
        )}
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* The timeline area with dropzones between locked events */}
        <div className="rounded-2xl border-2 border-dashed border-neutral-200 p-2 dark:border-neutral-700">
          <TimelineList
            timeline={timeline}
            placements={placements}
            hand={hand}
            byId={byId}
            revealResults={revealing}
            onRemovePlacement={removePlacement}
          />
        </div>

        {/* Hand */}
        {unplaced.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-400">
              Tus cartas ({unplaced.length} por colocar)
            </p>
            <div className="flex flex-col gap-2">
              {unplaced.map((id) => (
                <DraggableCard key={id} id={String(id)} event={byId.get(id)!} />
              ))}
            </div>
          </div>
        )}

        {mounted &&
          createPortal(
            <DragOverlay dropAnimation={null}>
              {activeCard ? (
                <div className="rotate-1 rounded-xl border-2 border-red-500 bg-white px-4 py-3.5 text-sm font-medium shadow-xl ring-4 ring-red-200 dark:bg-neutral-900 dark:ring-red-950/60">
                  {activeCard.text}
                </div>
              ) : null}
            </DragOverlay>,
            document.body
          )}
      </DndContext>

      <button
        onClick={submit}
        disabled={!canSubmit}
        className="mt-6 w-full rounded-xl bg-red-600 py-3.5 text-base font-semibold text-white transition hover:bg-red-700 active:scale-[0.99] disabled:opacity-40"
      >
        {revealing
          ? "¡Revelando…!"
          : canSubmit
            ? "Comprobar ronda"
            : `Coloca ${unplaced.length} carta${unplaced.length === 1 ? "" : "s"} más`}
      </button>
    </div>
  );
}

function TimelineList({
  timeline,
  placements,
  hand,
  byId,
  revealResults,
  onRemovePlacement,
}: {
  timeline: number[];
  placements: Record<number, number>;
  hand: number[];
  byId: Map<number, TimelineEvent>;
  revealResults: null | { correct: boolean[]; merged: number[]; points: number };
  onRemovePlacement: (id: number) => void;
}) {
  const placedIds = Object.keys(placements).map(Number);
  const placedByIndex = [...placedIds].sort((a, b) => placements[a] - placements[b]);

  // Rebuild the render list: for each of (timeline.length + 1) gaps insert
  // any placed cards whose target index is that gap.
  type Row = { kind: "gap"; index: number } | { kind: "locked" | "placed"; id: number };
  const items: Row[] = [];
  let placedCursor = 0;
  const merged: number[] = [];
  for (let i = 0; i <= timeline.length; i++) {
    // GAP at logical merged position `merged.length`
    items.push({ kind: "gap", index: merged.length });
    while (placedCursor < placedByIndex.length && placements[placedByIndex[placedCursor]] <= merged.length) {
      const pid = placedByIndex[placedCursor];
      merged.push(pid);
      items.push({ kind: "placed", id: pid });
      items.push({ kind: "gap", index: merged.length });
      placedCursor++;
    }
    if (i < timeline.length) {
      merged.push(timeline[i]);
      items.push({ kind: "locked", id: timeline[i] });
    }
  }
  // Any leftover placed cards at the very end
  while (placedCursor < placedByIndex.length) {
    const pid = placedByIndex[placedCursor];
    merged.push(pid);
    items.push({ kind: "placed", id: pid });
    items.push({ kind: "gap", index: merged.length });
    placedCursor++;
  }

  return (
    <div className="flex flex-col">
      {items.map((it, idx) => {
        if (it.kind === "gap") return <Gap key={`gap-${idx}`} index={it.index} empty={timeline.length === 0 && Object.keys(placements).length === 0 && hand.length > 0} />;
        if (it.kind === "locked") {
          const e = byId.get(it.id)!;
          return (
            <div key={`locked-${it.id}`} className="drop-in flex items-center gap-3 rounded-xl bg-neutral-100 px-3 py-2 text-sm dark:bg-neutral-800/70">
              <span className="w-12 shrink-0 text-center text-sm font-black tabular-nums text-neutral-600 dark:text-neutral-300">{e.year}</span>
              <span className="flex-1 leading-snug">{e.text}</span>
            </div>
          );
        }
        const e = byId.get(it.id)!;
        const submissionOrder = hand.indexOf(it.id);
        const isReveal = revealResults !== null;
        const wasCorrect = isReveal ? revealResults!.correct[submissionOrder] : null;
        const cls = isReveal
          ? wasCorrect
            ? "border-green-500 bg-green-50 dark:bg-green-950/40"
            : "border-red-400 bg-red-50 dark:bg-red-950/40"
          : "border-red-600 bg-white dark:bg-neutral-900";
        return (
          <div
            key={`placed-${it.id}`}
            className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-sm ${cls}`}
          >
            {isReveal && <span className="w-12 shrink-0 text-center text-sm font-black tabular-nums">{e.year}</span>}
            <span className="flex-1 leading-snug font-medium">{e.text}</span>
            {isReveal ? (
              <span className="shrink-0 text-lg">{wasCorrect ? "✅" : "❌"}</span>
            ) : (
              <button
                onClick={() => onRemovePlacement(it.id)}
                className="shrink-0 rounded-md px-2 py-0.5 text-xs text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800"
                aria-label="Quitar carta"
              >
                ✕
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Gap({ index, empty }: { index: number; empty: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: `gap:${index}` });
  return (
    <div
      ref={setNodeRef}
      className={`transition-all ${
        isOver
          ? "my-1.5 h-14 rounded-xl border-2 border-dashed border-red-500 bg-red-50 dark:bg-red-950/40"
          : empty
            ? "my-1 h-10 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700"
            : "my-0.5 h-1.5"
      }`}
      aria-label={`Insertar en posición ${index + 1}`}
    />
  );
}

function DraggableCard({ id, event }: { id: string; event: TimelineEvent }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), touchAction: "none", opacity: isDragging ? 0.3 : 1 }}
      {...attributes}
      {...listeners}
      className="flex cursor-grab items-center gap-3 rounded-xl border-2 border-neutral-200 bg-white px-4 py-3 text-sm shadow-sm active:cursor-grabbing dark:border-neutral-700 dark:bg-neutral-900"
    >
      <span className="text-neutral-300" aria-hidden="true">⋮⋮</span>
      <span className="flex-1 font-medium leading-snug">{event.text}</span>
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
