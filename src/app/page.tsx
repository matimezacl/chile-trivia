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

      <LeaguePanel />

      <footer className="mt-8 text-center text-xs text-neutral-400">
        Un juego diario de cultura chilena · gratis y sin cuenta
      </footer>
    </main>
  );
}
