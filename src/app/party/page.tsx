"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { saveHostId } from "@/lib/partyClient";

const DIFFS: { value: 1 | 2 | 3; label: string }[] = [
  { value: 1, label: "Fácil" },
  { value: 2, label: "Media" },
  { value: 3, label: "Difícil" },
];

export default function PartyLanding() {
  const router = useRouter();
  const [numQuestions, setNumQuestions] = useState(10);
  const [secondsPerQuestion, setSeconds] = useState(20);
  const [speedBonus, setSpeedBonus] = useState(true);
  const [difficulties, setDifficulties] = useState<number[]>([]);
  const [joinCode, setJoinCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleDiff(v: number) {
    setDifficulties((d) => (d.includes(v) ? d.filter((x) => x !== v) : [...d, v]));
  }

  async function createRoom() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/party", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numQuestions, secondsPerQuestion, speedBonus, difficulties, categories: [] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo crear la sala");
      saveHostId(data.code, data.hostId);
      router.push(`/party/host/${data.code}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setBusy(false);
    }
  }

  function join() {
    const code = joinCode.trim().toUpperCase();
    if (code.length >= 4) router.push(`/party/play/${code}`);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col px-5 pb-16">
      <header className="pt-8 pb-6 text-center">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Cachaí <span className="text-red-600">Party</span>
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Juega en vivo con tus amigos · todos en sus teléfonos
        </p>
      </header>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="text-lg font-semibold">Crear una sala</h2>
        <p className="mt-1 text-sm text-neutral-500">Serás el anfitrión en la pantalla grande.</p>

        <div className="mt-5 flex flex-col gap-5">
          <label className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium">Preguntas</span>
            <span className="flex items-center gap-3">
              <input type="range" min={3} max={20} value={numQuestions} onChange={(e) => setNumQuestions(+e.target.value)} className="w-40 accent-red-600" />
              <span className="w-6 text-right font-semibold tabular-nums">{numQuestions}</span>
            </span>
          </label>

          <label className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium">Segundos por pregunta</span>
            <span className="flex items-center gap-3">
              <input type="range" min={5} max={45} step={5} value={secondsPerQuestion} onChange={(e) => setSeconds(+e.target.value)} className="w-40 accent-red-600" />
              <span className="w-6 text-right font-semibold tabular-nums">{secondsPerQuestion}</span>
            </span>
          </label>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium">Dificultad</span>
            <div className="flex gap-2">
              {DIFFS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => toggleDiff(d.value)}
                  className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                    difficulties.includes(d.value)
                      ? "border-red-600 bg-red-600 text-white"
                      : "border-neutral-300 text-neutral-600 dark:border-neutral-600 dark:text-neutral-300"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          {difficulties.length === 0 && (
            <p className="-mt-3 text-right text-xs text-neutral-400">Sin selección = todas las dificultades</p>
          )}

          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span className="text-sm font-medium">Bonus por velocidad</span>
            <input type="checkbox" checked={speedBonus} onChange={(e) => setSpeedBonus(e.target.checked)} className="h-5 w-5 accent-red-600" />
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          onClick={createRoom}
          disabled={busy}
          className="mt-6 w-full rounded-xl bg-red-600 py-3.5 text-base font-semibold text-white transition hover:bg-red-700 active:scale-[0.99] disabled:opacity-50"
        >
          {busy ? "Creando…" : "Crear sala"}
        </button>
      </section>

      <section className="mt-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="text-lg font-semibold">Unirse a una sala</h2>
        <div className="mt-3 flex gap-2">
          <input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && join()}
            placeholder="CÓDIGO"
            maxLength={6}
            className="flex-1 rounded-xl border border-neutral-300 bg-transparent px-4 py-3 text-center text-lg font-bold tracking-widest uppercase dark:border-neutral-600"
          />
          <button
            onClick={join}
            className="rounded-xl bg-neutral-900 px-5 py-3 font-semibold text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900"
          >
            Entrar
          </button>
        </div>
      </section>

      <Link href="/" className="mt-6 text-center text-sm text-red-600 hover:underline dark:text-red-400">
        ← Volver al juego diario
      </Link>
    </main>
  );
}
