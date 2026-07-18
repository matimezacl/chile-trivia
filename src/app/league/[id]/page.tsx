"use client";

import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";
import { addLeague, getLeagues, getPlayer, loadGame, setPlayerName, syncResultToLeagues } from "@/lib/client";
import PartyPodium from "@/components/PartyPodium";

interface StandingRow {
  playerId: string;
  name: string;
  total: number;
  played: number;
  todayCorrect: number | null;
  weekPoints: number;
  weekPlayed: number;
}

interface Champion {
  week: number;
  label: string;
  playerId: string;
  name: string;
  points: number;
}

interface PodiumEntry {
  playerId: string;
  name: string;
  points: number;
}

interface LeagueData {
  id: string;
  name: string;
  day: number;
  week: number;
  weekLabel: string;
  standings: StandingRow[];
  champions: Champion[];
  lastWeekPodium: { week: number; label: string; top: PodiumEntry[] } | null;
}

const seenChampionKey = (leagueId: string, week: number) => `ct:seen-champion:${leagueId}:${week}`;

export default function LeaguePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [league, setLeague] = useState<LeagueData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [playerName, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [me, setMe] = useState("");
  const [reveal, setReveal] = useState<{ week: number; label: string; top: PodiumEntry[] } | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch(`/api/leagues/${id}`);
    if (!res.ok) {
      setNotFound(true);
      return;
    }
    const data: LeagueData = await res.json();
    setLeague(data);
    const player = getPlayer();
    setMe(player.id);
    setIsMember(data.standings.some((s) => s.playerId === player.id));
  }, [id]);

  useEffect(() => {
    setName(getPlayer().name);
    void refresh();
  }, [refresh]);

  // If the player already finished today's game, make sure this league has it.
  useEffect(() => {
    if (!league || !isMember) return;
    if (!getLeagues().some((l) => l.id === id)) addLeague({ id, name: league.name });
    const game = loadGame(league.day);
    if (game?.done) {
      void syncResultToLeagues(league.day, game.results).then(refresh);
    }
  }, [league, isMember, id, refresh]);

  // First-visit-after-Monday reveal: if there's a fresh champion for last week
  // that this browser hasn't seen yet, and the player is a member, play the
  // animated podium once.
  useEffect(() => {
    if (!league?.lastWeekPodium || !isMember) return;
    const key = seenChampionKey(league.id, league.lastWeekPodium.week);
    if (localStorage.getItem(key)) return;
    setReveal(league.lastWeekPodium);
  }, [league, isMember]);

  function dismissReveal() {
    if (reveal && league) localStorage.setItem(seenChampionKey(league.id, reveal.week), "1");
    setReveal(null);
  }

  async function join() {
    const pname = playerName.trim();
    if (!pname || !league) return;
    setBusy(true);
    const player = setPlayerName(pname);
    const res = await fetch(`/api/leagues/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId: player.id, playerName: player.name }),
    });
    if (res.ok) {
      addLeague({ id, name: league.name });
      const game = loadGame(league.day);
      if (game?.done) {
        await syncResultToLeagues(league.day, game.results);
      }
      await refresh();
    }
    setBusy(false);
  }

  async function copyInvite() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (notFound) {
    return (
      <main className="mx-auto max-w-xl px-5 py-16 text-center">
        <p className="text-lg font-semibold">Liga no encontrada</p>
        <Link href="/" className="mt-2 inline-block text-red-600 hover:underline dark:text-red-400">
          ← Volver al juego de hoy
        </Link>
      </main>
    );
  }

  if (!league) {
    return <main className="mx-auto max-w-xl px-5 py-16 text-center text-neutral-400">Cargando…</main>;
  }

  // Weekly leader = the first player with any weekly points (all-time sort
  // shouldn't crown someone who didn't play this week).
  const weekLeader = [...league.standings]
    .filter((s) => s.weekPlayed > 0)
    .sort((a, b) => b.weekPoints - a.weekPoints || a.name.localeCompare(b.name))[0];

  return (
    <main className="mx-auto max-w-xl px-5 pb-16">
      {reveal && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-5 backdrop-blur-sm"
          onClick={dismissReveal}
        >
          <div
            className="mt-6 w-full max-w-md rounded-2xl bg-white p-5 dark:bg-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-center text-sm font-semibold uppercase tracking-wide text-neutral-400">
              {reveal.label}
            </p>
            <PartyPodium
              title="🏆 Campeón de la semana"
              showNewGameLink={false}
              leaderboard={reveal.top.map((r) => ({ id: r.playerId, name: r.name, score: r.points }))}
            />
            <button
              onClick={dismissReveal}
              className="mx-auto mt-2 block rounded-xl border border-neutral-300 px-5 py-2 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-600 dark:hover:bg-neutral-800"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{league.name}</h1>
          <p className="text-sm text-neutral-500">
            {league.standings.length} {league.standings.length === 1 ? "jugador" : "jugadores"} · Cachaí #{league.day + 1}
          </p>
        </div>
        <button
          onClick={copyInvite}
          className="shrink-0 rounded-xl border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-600 dark:hover:bg-neutral-800"
        >
          {copied ? "¡Copiado!" : "Copiar enlace"}
        </button>
      </div>

      {!isMember && (
        <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-50 p-4 dark:bg-red-950/30">
          <p className="font-medium">Te invitaron a unirte a esta liga</p>
          <div className="mt-3 flex gap-2">
            <input
              value={playerName}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              maxLength={24}
              className="flex-1 rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
            />
            <button
              onClick={join}
              disabled={busy || !playerName.trim()}
              className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {busy ? "Uniéndome…" : "Unirme"}
            </button>
          </div>
        </div>
      )}

      {/* This week's leader */}
      <section className="mt-6 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Esta semana</p>
        {weekLeader ? (
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl">👑</span>
            <div className="flex-1">
              <p className="text-lg font-bold">{weekLeader.name}</p>
              <p className="text-xs text-neutral-500">Va primero con {weekLeader.weekPoints} puntos</p>
            </div>
          </div>
        ) : (
          <p className="mt-1 text-sm text-neutral-500">Nadie ha jugado esta semana todavía.</p>
        )}
        <p className="mt-2 text-xs text-neutral-400">{league.weekLabel} · el ganador se corona el lunes</p>
      </section>

      {/* Standings — now with weekly + all-time columns */}
      <table className="mt-6 w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-neutral-500 dark:border-neutral-700">
            <th className="py-2 font-medium">#</th>
            <th className="py-2 font-medium">Jugador</th>
            <th className="py-2 text-center font-medium">Hoy</th>
            <th className="py-2 text-right font-medium">Semana</th>
            <th className="py-2 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {league.standings.map((row, i) => (
            <tr
              key={row.playerId}
              className={`border-b border-neutral-100 dark:border-neutral-800 ${row.playerId === me ? "font-semibold" : ""}`}
            >
              <td className="py-2.5 text-neutral-400">{i + 1}</td>
              <td className="py-2.5">
                {row.name}
                {row.playerId === me && <span className="ml-1 text-xs text-neutral-400">(tú)</span>}
              </td>
              <td className="py-2.5 text-center">
                {row.todayCorrect === null ? (
                  <span className="text-neutral-300 dark:text-neutral-600">—</span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">{row.todayCorrect}/5</span>
                )}
              </td>
              <td className="py-2.5 text-right tabular-nums">{row.weekPoints}</td>
              <td className="py-2.5 text-right font-semibold tabular-nums">{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4 text-xs text-neutral-400">
        Cada acierto suma según su dificultad: Fácil +1, Media +2, Difícil +4.
      </p>

      {/* Champion history */}
      {league.champions.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Campeones semanales</h2>
          <ul className="mt-2 divide-y divide-neutral-100 dark:divide-neutral-800">
            {league.champions.map((c) => (
              <li key={c.week} className="flex items-center gap-3 py-2.5 text-sm">
                <span className="text-lg">🏆</span>
                <div className="flex-1">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-neutral-400">{c.label}</p>
                </div>
                <span className="font-bold tabular-nums text-red-600 dark:text-red-400">{c.points} pts</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Link href="/" className="mt-8 inline-block text-sm text-red-600 hover:underline dark:text-red-400">
        ← Juego de hoy
      </Link>
    </main>
  );
}
