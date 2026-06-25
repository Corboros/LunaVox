---
name: Clerk frontend wiring
description: Critical patterns for wiring Clerk auth in a React+Vite app on this project
---

Three things that MUST be done exactly right or Clerk breaks:

1. **publishableKey** — use `publishableKeyFromHost(window.location.hostname, import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)` from `@clerk/react/internal`. Never use the raw env var, never use `window.location.host` (includes port).

2. **proxyUrl** — set `proxyUrl={import.meta.env.VITE_CLERK_PROXY_URL}` unconditionally on ClerkProvider. Empty string in dev is intentional and correct. Never gate on NODE_ENV.

3. **Route patterns** — MUST be exactly `path="/sign-in/*?"` and `path="/sign-up/*?"`. The `/*?` optional wildcard is the only wouter syntax that matches both the bare URL and Clerk's OAuth sub-paths. Do not use `/sign-in`, `/sign-in/*`, or `:rest*`.

**Why:** Replit uses a Clerk proxy for production domains. The `publishableKeyFromHost` helper resolves the right key for custom domains. The proxy URL is auto-set in production by Replit. Wrong route patterns cause 404s on OAuth callbacks.
