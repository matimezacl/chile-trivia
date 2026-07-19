# Agent notes for chile-trivia (Cachaí)

- **Adding trivia questions or timeline events?** Read `CONTENT.md` first and
  follow it exactly — schema, difficulty rubric, factual bar, validation steps.
  Validate with `npx tsx scripts/validate-content.ts` before committing.
- This project runs Next.js 16 — APIs and conventions may differ from your
  training data. Check `node_modules/next/dist/docs/` before writing framework
  code. Heed deprecation notices.
- Dev server: `npm run dev -- --port 3100` (port 3000 belongs to the sibling
  word-league project). Both are configured in `../.claude/launch.json`.
- Git identity is repo-local (GitHub noreply email) — do not change it, and
  don't commit with a different author (Vercel blocks unrecognized committers).
- Redis: production uses `REDIS_URL` (any `redis://` var works, see
  `src/lib/db.ts`); local dev falls back to JSON files under `.data/`.
