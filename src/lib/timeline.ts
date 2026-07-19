import { dayNumber } from "./game";

// "Cronos" — the second daily game: put 5 Chilean milestones in chronological
// order. Content rules live in CONTENT.md: exact verifiable years, no year in
// the text, nothing from the dictatorship era or politically charged.

export const EVENTS_PER_DAY = 5;

export interface TimelineEvent {
  id: number;
  text: string;
  year: number;
}

export const EVENTS: TimelineEvent[] = [
  { id: 1, text: "Hernando de Magallanes cruza por primera vez el estrecho que hoy lleva su nombre", year: 1520 },
  { id: 2, text: "Pedro de Valdivia funda Santiago", year: 1541 },
  { id: 3, text: "Se forma la Primera Junta Nacional de Gobierno", year: 1810 },
  { id: 4, text: "Chile proclama su independencia", year: 1818 },
  { id: 5, text: "Se funda la Universidad de Chile, con Andrés Bello como rector", year: 1842 },
  { id: 6, text: "Parte el primer ferrocarril de Chile, entre Copiapó y Caldera", year: 1851 },
  { id: 7, text: "Arturo Prat muere en el Combate Naval de Iquique", year: 1879 },
  { id: 8, text: "Chile incorpora Isla de Pascua (Rapa Nui)", year: 1888 },
  { id: 9, text: "Chile celebra el Centenario de la Primera Junta", year: 1910 },
  { id: 10, text: "Se funda Colo-Colo", year: 1925 },
  { id: 11, text: "Se funda el club Universidad de Chile", year: 1927 },
  { id: 12, text: "Se funda el Club Deportivo Universidad Católica", year: 1937 },
  { id: 13, text: "Gabriela Mistral gana el Premio Nobel de Literatura", year: 1945 },
  { id: 14, text: "Se publica el primer libro de Papelucho", year: 1947 },
  { id: 15, text: "Aparece Condorito por primera vez", year: 1949 },
  { id: 16, text: "Las mujeres votan por primera vez en una elección presidencial chilena", year: 1952 },
  { id: 17, text: "Canal 13 inicia las primeras transmisiones de TV del país", year: 1959 },
  { id: 18, text: "Ocurre el terremoto de Valdivia, el más fuerte jamás registrado", year: 1960 },
  { id: 19, text: "Se realiza el primer Festival de Viña del Mar", year: 1960 },
  { id: 20, text: "Chile organiza el Mundial de fútbol y logra el tercer lugar", year: 1962 },
  { id: 21, text: "Violeta Parra compone «Gracias a la vida»", year: 1966 },
  { id: 22, text: "Se forma el grupo Inti-Illimani", year: 1967 },
  { id: 23, text: "El observatorio La Silla es inaugurado por la ESO", year: 1969 },
  { id: 24, text: "Pablo Neruda gana el Premio Nobel de Literatura", year: 1971 },
  { id: 25, text: "Se inaugura el Metro de Santiago", year: 1975 },
  { id: 26, text: "Se realiza la primera Teletón", year: 1978 },
  { id: 27, text: "La cueca es declarada baile nacional oficial", year: 1979 },
  { id: 28, text: "Los Prisioneros lanzan «La voz de los 80»", year: 1984 },
  { id: 29, text: "Se estrena «La Negra Ester» en teatro", year: 1988 },
  { id: 30, text: "Los Prisioneros lanzan «Corazones», con «Tren al sur»", year: 1990 },
  { id: 31, text: "Colo-Colo gana la Copa Libertadores", year: 1991 },
  { id: 32, text: "Rapa Nui es declarado Patrimonio de la Humanidad", year: 1995 },
  { id: 33, text: "Marcelo Ríos llega a ser número 1 del tenis mundial", year: 1998 },
  { id: 34, text: "Las iglesias de Chiloé son declaradas Patrimonio de la Humanidad", year: 2000 },
  { id: 35, text: "El casco histórico de Valparaíso es declarado Patrimonio de la Humanidad", year: 2003 },
  { id: 36, text: "Se estrena «31 minutos» en TVN", year: 2003 },
  { id: 37, text: "Massú y González ganan oros olímpicos para Chile en Atenas", year: 2004 },
  { id: 38, text: "Las salitreras de Humberstone y Santa Laura son declaradas Patrimonio de la Humanidad", year: 2005 },
  { id: 39, text: "Michelle Bachelet asume como la primera presidenta de Chile", year: 2006 },
  { id: 40, text: "Son rescatados los 33 mineros de la mina San José", year: 2010 },
  { id: 41, text: "Ocurre el terremoto y tsunami del 27F", year: 2010 },
  { id: 42, text: "Se inaugura oficialmente el observatorio ALMA", year: 2013 },
  { id: 43, text: "Se completa la Gran Torre Santiago, la más alta de Sudamérica", year: 2013 },
  { id: 44, text: "Chile gana su primera Copa América, como local", year: 2015 },
  { id: 45, text: "Termina «Sábados Gigantes» tras más de medio siglo al aire", year: 2015 },
  { id: 46, text: "«Historia de un oso» gana el primer Oscar para Chile", year: 2016 },
  { id: 47, text: "Chile gana su segunda Copa América, en la edición Centenario", year: 2016 },
  { id: 48, text: "Comienza la construcción del telescopio ELT en el cerro Armazones", year: 2017 },
  { id: 49, text: "«Una mujer fantástica» gana el Oscar a mejor película extranjera", year: 2018 },
  { id: 50, text: "Se crea la Región de Ñuble, la número 16", year: 2018 },
  { id: 51, text: "Un eclipse total de sol cruza La Serena y el valle del Elqui", year: 2019 },
  { id: 52, text: "Las momias Chinchorro son declaradas Patrimonio de la Humanidad", year: 2021 },
  { id: 53, text: "Santiago organiza los Juegos Panamericanos", year: 2023 },
  { id: 54, text: "El observatorio Vera Rubin publica sus primeras imágenes del cosmos", year: 2025 },
];

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(list: T[], seed: number): T[] {
  const arr = [...list];
  const rand = mulberry32(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Fixed-seed ring of events; each day windows 5 events starting at day*5,
// skipping any whose year already appears in the set (same-year events would
// make the ordering ambiguous). Presented in a day-seeded shuffled order.
const RING = seededShuffle(EVENTS, 0xc20b0);

export function eventsForDay(day: number): TimelineEvent[] {
  const n = RING.length;
  const start = (day * EVENTS_PER_DAY) % n;
  const out: TimelineEvent[] = [];
  const years = new Set<number>();
  for (let step = 0; step < n && out.length < EVENTS_PER_DAY; step++) {
    const e = RING[(start + step) % n];
    if (years.has(e.year)) continue;
    years.add(e.year);
    out.push(e);
  }
  return seededShuffle(out, day * 7919 + 13);
}

export { dayNumber };

// Correct chronological order for a day's events.
export function solutionForDay(day: number): TimelineEvent[] {
  return [...eventsForDay(day)].sort((a, b) => a.year - b.year || a.id - b.id);
}

// Score = how many positions of the player's ordering match the solution.
// `ordering` holds event ids in the player's chosen order (earliest first).
export function scoreOrdering(day: number, ordering: number[]): boolean[] {
  const solution = solutionForDay(day);
  return solution.map((e, i) => ordering[i] === e.id);
}

export function shareTimeline(results: boolean[], day: number): string {
  const score = results.filter(Boolean).length;
  const squares = results.map((ok) => (ok ? "🟩" : "🟥")).join("");
  return `Cachaí Cronos #${day + 1} — ${score}/${EVENTS_PER_DAY} 🕰️🇨🇱\n${squares}\n\nhttps://chile-trivia.vercel.app/timeline`;
}
