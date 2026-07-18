import type { MetadataRoute } from "next";

// Web App Manifest — enables "Add to home screen" on Android/iOS so Cachaí
// runs as a standalone app after install. Icons are supplied by src/app/icon.tsx.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cachaí — trivia diario de Chile",
    short_name: "Cachaí",
    description: "¿Cuánto cachái de Chile? Cinco preguntas al día sobre lo más chileno.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#dc2626",
    lang: "es-CL",
    categories: ["games", "entertainment", "education"],
  };
}
