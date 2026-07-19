# Cachaí content guide (for humans and agents)

This is the single source of truth for adding content to Cachaí. If you are an
agent asked to "add questions" or "add timeline events", follow this file
exactly and touch nothing else.

Two content pools exist:

| Pool | File | Used by |
|---|---|---|
| Trivia questions | `src/lib/questions.ts` → `QUESTIONS` | Daily game + party mode |
| Timeline events | `src/lib/timeline.ts` → `EVENTS` | "Cronos" daily ordering game |

## Non-negotiable rules (both pools)

1. **Every fact must be true and verifiable.** This is a trust product. If you
   are not certain of a fact, do not add it. Never invent dates, names, or
   numbers. When in doubt, leave it out.
2. **Factual and non-partisan only.** Chilean culture, history, geography,
   food, sports, science, entertainment. Deliberately excluded: the 1973 coup
   and dictatorship era, contemporary politics, religion, and anything
   opinion-based. Historical figures are fine when treated factually (dates,
   works, roles) — e.g. "first woman president: Michelle Bachelet (2006)" is a
   neutral fact; commentary is not.
3. **Chilean Spanish.** Voseo like "cachái" / "estái" is welcome in modismo
   questions; keep the rest in neutral Latin American Spanish.
4. **IDs**: take the current maximum id in the array and count up from there.
   Never reuse or renumber existing ids (they're referenced by seeded shuffles).
5. **String escaping gotcha**: if a text contains an apostrophe (O'Higgins,
   D'Annunzio), wrap the string in **double quotes**. Writing `\\'` inside a
   single-quoted string has broken the build before.
6. **Validate before committing**:

   ```bash
   npx tsx scripts/validate-content.ts
   ```

   It must print `All content valid ✓`. Then run `npx tsc --noEmit` and
   `npm run build`. All three must pass.

## Trivia questions (`src/lib/questions.ts`)

Schema per question:

```ts
{
  id: <next free integer>,
  category: "modismos" | "música" | "fútbol" | "comida" | "geografía"
          | "historia" | "cultura" | "tv" | "ciencia",
  difficulty: 1 | 2 | 3,        // fácil | media | difícil — see rubric
  q: "…",                        // the question, ideally ending in "…" or "?"
  options: [correct, w1, w2, w3],// EXACTLY 4, all distinct, CORRECT FIRST
  answer: 0,                     // always 0 — the runtime shuffles options
  fact: "…",                     // one line shown after answering; must teach
}
```

Difficulty rubric — calibrate against a "person who grew up in Chile":

- **1 (fácil, +1 pt)**: almost every Chilean knows it ("la flor nacional").
- **2 (media, +2 pts)**: most adults know it, tourists don't ("qué es la once").
- **3 (difícil, +4 pts)**: you'd need to be well-read or a fan ("año de la
  Libertadores de Colo-Colo"). A question only trivia nerds could answer is
  too hard — everything should feel fair after the reveal.

Quality bar per question:

- Wrong options must be *plausible* (same type: three other bands, three other
  years) — never joke options.
- The `fact` must add something beyond restating the answer.
- Skim the existing pool for your topic first — no near-duplicates.
- Aim for a mix: roughly 20% fácil / 50% media / 30% difícil per batch, spread
  across categories (check the validator's distribution output).

## Timeline events (`src/lib/timeline.ts`)

Schema per event:

```ts
{ id: <next free integer>, text: "Se funda la Universidad de Chile", year: 1842 }
```

- `text` must **never contain the year** (the validator rejects it) — the year
  IS the puzzle. Phrase as a headline in present tense: "Se funda…", "Chile
  gana…", "Se estrena…".
- The year must be exact and verifiable. If sources disagree on the year, skip
  the event.
- Same-year events are allowed in the pool (the daily selector guarantees the
  five shown together have distinct years), but prefer spreading across
  decades — the game is only fun if the orderings aren't obvious. Include some
  "trap pairs" that are close together (e.g. 1960 quake vs 1962 World Cup).
- Same exclusions as trivia: nothing from the dictatorship era, nothing
  politically charged.

## Workflow for a content batch

1. `git checkout -b content-<short-name>`
2. Append to the array (never reorder existing entries).
3. `npx tsx scripts/validate-content.ts` → must pass.
4. `npx tsc --noEmit && npm run build` → must pass.
5. Commit with a message like `Content: +N questions (categories…)` and note
   anything you deliberately left out because you couldn't verify it.
6. Merge to `main` and push — Vercel deploys `main` automatically.

Repo-local git identity is already configured (GitHub noreply email); do not
change it.
