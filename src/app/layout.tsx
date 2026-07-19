import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cachaí — el trivia diario de Chile",
  description:
    "¿Cuánto cachái de Chile? Cinco preguntas al día sobre cultura, modismos, fútbol, comida e historia chilena. Gratis, sin cuenta. Comparte tu puntaje.",
  openGraph: {
    title: "Cachaí — el trivia diario de Chile",
    description: "Cinco preguntas al día sobre lo más chileno. ¿Cuánto cachái?",
    type: "website",
    locale: "es_CL",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cachaí — el trivia diario de Chile",
    description: "Cinco preguntas al día sobre lo más chileno. ¿Cuánto cachái?",
  },
  // Installed-PWA experience on iOS.
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Cachaí",
  },
};

export const viewport = {
  themeColor: "#dc2626",
};

import GameNav from "@/components/GameNav";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL">
      <body
        className={`${geist.className} min-h-screen bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100`}
      >
        <GameNav />
        {children}
      </body>
    </html>
  );
}
