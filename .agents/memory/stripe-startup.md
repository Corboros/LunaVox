---
name: Stripe non-fatal startup
description: Stripe init on server startup must be non-fatal so server boots without the integration connected
---

Stripe integration credentials come from the Replit connector API at runtime. If Stripe is not connected in the Integrations tab, `getStripeCredentials()` throws. Server startup must not crash in this case.

**Rule:** Wrap the entire Stripe init block (getStripeSync → findOrCreateManagedWebhook → syncBackfill) in try/catch, log a WARN, and continue. Payment endpoints should return 503 with a user-friendly message when Stripe is unconfigured.

**Why:** Developers often boot the app before connecting Stripe. Crashing on startup prevents them from iterating on other features.

**How to apply:** In `index.ts` startup function, wrap Stripe block in `try { ... } catch (err) { logger.warn({ err: err.message }, "Stripe not configured — skipping"); }`. In payment route handlers, catch the credentials error and return `res.status(503).json({ error: "..." })`.
