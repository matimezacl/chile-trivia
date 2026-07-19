import Link from "next/link";
import Game from "@/components/Game";
import LeaguePanel from "@/components/LeaguePanel";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col px-5 pb-16">
      <header className="pt-8 pb-6 text-center">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Cacha<span className="text-red-600">í</span>
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          ¿Cuánto cachái de Chile? · 5 preguntas al día
        </p>
      </header>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
        <Game />
      </section>

      <Link
        href="/timeline"
        className="mt-4 flex items-center justify-between rounded-2xl border-2 border-neutral-200 bg-white px-6 py-4 transition hover:border-red-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-red-900"
      >
        <span>
          <span className="block text-lg font-semibold">Cronos 🕰️</span>
          <span className="block text-sm text-neutral-500">Ordena 5 hitos chilenos, del más antiguo al más nuevo</span>
        </span>
        <span className="text-2xl">→</span>
      </Link>

      <Link
        href="/party"
        className="mt-4 flex items-center justify-between rounded-2xl bg-red-600 px-6 py-4 text-white transition hover:bg-red-700"
      >
        <span>
          <span className="block text-lg font-semibold">Modo fiesta 🎉</span>
          <span className="block text-sm text-red-100">Juega en vivo con amigos, cada uno en su teléfono</span>
        </span>
        <span className="text-2xl">→</span>
      </Link>

      <LeaguePanel />

      <footer className="mt-8 text-center text-xs text-neutral-400">
        Un juego diario de cultura chilena · gratis y sin cuenta
      </footer>
    </main>
  );
}
