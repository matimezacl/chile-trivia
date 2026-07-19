"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Trivia" },
  { href: "/timeline", label: "Cronos" },
  { href: "/timeline/experto", label: "Experto" },
  { href: "/party", label: "Fiesta 🎉" },
];

// One-tap hop between the daily games. Hidden inside live party screens
// (host/play) where the full focus should be on the round.
export default function GameNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/party/")) return null;

  return (
    <nav className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
      <div className="mx-auto flex max-w-xl items-center gap-1 overflow-x-auto px-3 py-2">
        <Link href="/" className="mr-1 shrink-0 text-sm font-black tracking-tight">
          Cacha<span className="text-red-600">í</span>
        </Link>
        {TABS.map((t) => {
          const active = t.href === "/" ? pathname === "/" : pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-red-600 text-white"
                  : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
