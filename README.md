# Cachaí

**¿Cuánto cachái de Chile?** — a free daily trivia game about Chilean culture.
Five questions a day across modismos, música, fútbol, comida, geografía,
historia y cultura pop. No account, share your score, keep your streak.

## How it works

- Each day serves five questions picked deterministically from a shuffled pool
  (`src/lib/questions.ts`), keyed to the player's local calendar date — same
  five for everyone, rolling over at their midnight.
- Progress, streaks, and an anonymous player id live in `localStorage`. Playing
  is fully client-side; no server call needed.
- Answering reveals the correct option and a one-line fact, so people learn
  something even when they miss.
- The share text is a Wordle-style grid (`🟩🟥`) — the viral loop that gets
  friends to click.

## The content is the moat

Adding questions is the cheapest growth lever. Open `src/lib/questions.ts`,
append objects to the `QUESTIONS` array (id, category, 4 options, correct
`answer` index, one-line `fact`), and redeploy. Every question must be
factually correct — this is a trust product. ~50 questions ship today; aim for
a few hundred so the daily rotation stays fresh for months.

## Develop

```bash
npm install
npm run dev -- --port 3100   # 3000 is used by the sibling word-league project
```

## Deploy to Vercel

1. Push this folder to a Git repo and import it in Vercel (defaults are fine —
   `vercel.json` sets the Next.js framework).
2. It deploys as a static/edge app; gameplay needs no database.
3. (Later) Private leagues reuse word-league's `src/lib/db.ts` pattern — attach
   a Redis integration to inject `REDIS_URL` and port the `api/leagues` routes.

## Monetization notes

- Launch clean (no ads). The Chilean-Spanish angle is the differentiator: it's
  identity-driven and shareable without the risk of politics.
- Add a "Cachaí Pro" (an archive of past days, extra categories) once there are
  regulars, then one non-intrusive ad slot below the result once daily plays
  clear a few thousand.
- Seed launch on Chilean subreddits, X, and WhatsApp groups around a Fiestas
  Patrias / Viña moment for a traffic spike.
