# LunaVox

Application d'astrologie mystique en français — horoscopes quotidiens, compatibilité astrologique, annuaire de consultants, et abonnement premium.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/astro-mystic run dev` — run the frontend (Vite)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Auth: Clerk (Google login) — Replit-managed, provisioned via setupClerkWhitelabelAuth()
- Payments: Stripe via stripe-replit-sync (connect Stripe in Integrations tab to activate)
- Frontend: React + Vite + Tailwind v4 + shadcn/ui + Wouter routing + Framer Motion
- Validation: Zod (zod/v4), drizzle-zod
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/api-client-react/` — generated React Query hooks (from codegen)
- `lib/api-zod/` — generated Zod schemas (from codegen)
- `lib/db/src/schema/` — Drizzle ORM schema (users, consultants)
- `artifacts/api-server/src/routes/` — Express route handlers (horoscope, compatibility, consultants, user, payments)
- `artifacts/astro-mystic/src/` — React frontend

## Architecture decisions

- Contract-first: OpenAPI spec drives both frontend hooks and backend validation schemas via Orval codegen
- Clerk proxy at `/api/__clerk` — frontend uses `publishableKeyFromHost` from `@clerk/react/internal`, never raw env var
- Stripe is non-fatal on startup — server boots even without Stripe connected; returns 503 on payment endpoints
- App is always dark — `class="dark"` on `<html>` in index.html, no toggle needed
- `@workspace/db/migrate` export is a stub (schema is pushed via `drizzle-kit push`, not migration files)

## Product

- **Landing page**: public, showcases features, CTAs to sign in/sign up
- **Horoscope** (authenticated): choose zodiac sign, get daily reading with domain scores
- **Compatibilité** (authenticated): compare two signs — free once, then requires Premium
- **Consultants**: browse approved consultants; apply to become one
- **Premium**: €9.99/mo or €79.99/yr via Stripe Checkout
- **Mon Profil**: update zodiac sign, view subscription status

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After adding a new route or changing the OpenAPI spec, run `pnpm --filter @workspace/api-spec run codegen` then `pnpm run typecheck:libs` before checking artifact typechecks
- Stripe must be connected via Integrations tab before payments work — the server warns on startup but doesn't crash
- `@apply dark` is NOT valid in Tailwind v4 — use `class="dark"` on the html element instead
- Clerk: `proxyUrl` prop must be set unconditionally (empty string in dev is correct)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See the `clerk-auth` skill for Clerk setup details and troubleshooting
- See the `stripe` skill for Stripe integration patterns
