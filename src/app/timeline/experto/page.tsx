import type { Metadata } from "next";
import Link from "next/link";
import TimelineExpertGame from "@/components/TimelineExpertGame";

export const metadata: Metadata = {
  title: "Cronos Experto — desafío diario de historia chilena",
  description:
    "Modo experto de Cachaí Cronos: tres rondas, cada una con cinco cartas que insertás en una línea de tiempo que crece. Puntaje diario para historiadores.",
};

export default function ExpertPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col px-5 pb-16">
      <header className="pt-8 pb-6 text-center">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Cronos <span className="text-red-600">Experto</span> 🎓
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          3 rondas · 15 hitos · un puntaje diario
        </p>
      </header>

      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
        <TimelineExpertGame />
      </section>

      <Link href="/timeline" className="mt-6 text-center text-sm text-red-600 hover:underline dark:text-red-400">
        ← Cronos diario
      </Link>
    </main>
  );
}
