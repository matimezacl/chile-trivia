"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { addLeague, getLeagues, getPlayer, setPlayerName, type JoinedLeague } from "@/lib/client";

export default function LeaguePanel() {
  const [leagues, setLeagues] = useState<JoinedLeague[]>([]);
  const [creating, setCreating] = useState(false);
  const [leagueName, setLeagueName] = useState("");
  const [playerName, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLeagues(getLeagues());
    setName(getPlayer().name);
  }, []);

  async function createLeague() {
    const name = leagueName.trim();
    const pname = playerName.trim();
    if (!name || !pname) {
      setError("Escribe un nombre de liga y tu nombre");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const player = setPlayerName(pname);
      const res = await fetch("/api/leagues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, playerId: player.id, playerName: player.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Algo salió mal");
      addLeague({ id: data.id, name });
      setLeagues(getLeagues());
      setCreating(false);
      setLeagueName("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Algo salió mal");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Tus ligas</h2>
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
          >
            + Nueva liga
          </button>
        )}
      </div>

      {leagues.length === 0 && !creating && (
        <p className="mt-2 text-sm text-neutral-500">
          Crea una liga y comparte el enlace — los puntajes diarios de tus amigos se acumulan en una
          tabla de posiciones.
        </p>
      )}

      {leagues.length > 0 && (
        <ul className="mt-2 divide-y divide-neutral-100 dark:divide-neutral-800">
          {leagues.map((l) => (
            <li key={l.id}>
              <Link
                href={`/league/${l.id}`}
                className="flex items-center justify-between py-2 text-sm hover:text-red-600 dark:hover:text-red-400"
              >
                <span className="font-medium">{l.name}</span>
                <span className="text-neutral-400">tabla →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {creating && (
        <div className="mt-3 flex flex-col gap-2">
          <input
            value={leagueName}
            onChange={(e) => setLeagueName(e.target.value)}
            placeholder="Nombre de la liga (ej. Los cabros)"
            maxLength={40}
            className="rounded-xl border border-neutral-300 bg-transparent px-3 py-2.5 text-sm dark:border-neutral-600"
          />
          <input
            value={playerName}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            maxLength={24}
            className="rounded-xl border border-neutral-300 bg-transparent px-3 py-2.5 text-sm dark:border-neutral-600"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={createLeague}
              disabled={busy}
              className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {busy ? "Creando…" : "Crear liga"}
            </button>
            <button
              onClick={() => setCreating(false)}
              className="rounded-xl px-4 py-2.5 text-sm text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
