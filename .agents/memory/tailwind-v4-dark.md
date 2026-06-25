---
name: Tailwind v4 dark mode
description: How to force dark mode in Tailwind v4 — @apply dark is invalid
---

In Tailwind v4, `dark` is a variant selector, not a utility class. Using `@apply dark` in CSS throws "Cannot apply unknown utility class `dark`" at build time.

**Rule:** Add `class="dark"` directly to the `<html>` element in `index.html` to force dark mode app-wide.

**Why:** Tailwind v4 redesigned how variants work — they are no longer injectable via `@apply`. The `dark` class simply enables the `.dark` CSS block of custom properties; it must be present in the HTML, not injected via stylesheet.

**How to apply:** In `index.html`, change `<html lang="en">` to `<html lang="fr" class="dark">`. Remove any `html { @apply dark; }` from index.css.
