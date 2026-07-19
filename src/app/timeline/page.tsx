import type { Metadata } from "next";
import Link from "next/link";
import TimelineGame from "@/components/TimelineGame";

export const metadata: Metadata = {
  title: "Cachaí Cronos — ordena la historia de Chile",
  description:
    "El segundo juego diario de Cachaí: ordena cinco hitos chilenos del más antiguo al más reciente. Gratis y sin cuenta.",
};

export default function TimelinePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col px-5 pb-16">
      <header className="pt-8 pb-6 text-center">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Cachaí <span className="text-red-600">Cronos</span>
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Ordena 5 hitos chilenos · un desafío al día
        </p>
      </header>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
        <TimelineGame />
      </section>

      <Link href="/" className="mt-6 text-center text-sm text-red-600 hover:underline dark:text-red-400">
        ← Trivia del día
      </Link>

      <footer className="mt-8 text-center text-xs text-neutral-400">
        Un juego diario de historia chilena · gratis y sin cuenta
      </footer>
    </main>
  );
}
