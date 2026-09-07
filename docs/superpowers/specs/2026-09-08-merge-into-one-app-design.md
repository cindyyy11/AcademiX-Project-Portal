# Design: Merge landingPage + inbox-backend into academix (one deployable app)

## Context

The repo currently runs 4 separate services: `academix` (main app, Next.js, :3000),
`fyp-management-system-backend` (core API, Express, :8000), `inbox-backend` (Express, :3001),
and `landingPage` (marketing site, Next.js, :3002).

Goal: end up with one single deployable app for everything user-facing (marketing site +
dashboards + inbox), leaving the core API backend as its own separate service. Folding the core
API/Socket.io backend in too was considered and explicitly deferred — it's a much larger,
higher-risk migration (≈14 Express route modules, plus Socket.io needs a custom Next.js server)
and is a candidate for its own future design, not this one.

End state: **2 services** — `academix` (marketing + app + inbox, :3000) and
`fyp-management-system-backend` (:8000).

## Why this is safe: Next.js supports both routers at once

Next.js has natively supported the Pages Router (`pages/`) and App Router (`app/`) coexisting in
the same project since v13 — each is an independent rendering root with its own
layout/providers. `academix` (Pages Router) absorbing `landingPage` (App Router) is the intended
use of that feature, not a hack. This is why Approach A (bring `landingPage/app/` in wholesale)
was chosen over rewriting the landing pages as Pages Router files (much more manual rework for no
benefit) or routing/proxying between two still-separate processes (doesn't achieve "one app").

## Verified compatibility (checked during brainstorming)

- **No route collisions** other than `/`: `academix`'s `pages/index.tsx` currently renders the
  admin template's demo "page list" at `/`; `landingPage`'s `app/(default)/page.tsx` is the real
  marketing homepage, also at `/`. Deleting `academix/pages/index.tsx` resolves this in
  `landingPage`'s favor — which also happens to fix the long-standing "homepage shows template
  page list" issue noted in the earlier code-structure cleanup.
- **No `public/` filename collisions** between the two apps' asset folders.
- **Dependency delta is small**: only 3 packages exist in `landingPage` but not `academix` —
  `@mui/icons-material`, `@types/aos`, `postcss-import`. React version differs (academix `^18.3.1`
  vs landingPage exact `18.2.0`) — academix's is used, compatible minor bump.
- **Import alias**: `landingPage`'s tsconfig maps a generic `"@/*": ["./*"]`; `academix`'s only
  defines specific aliases (`@/components/*`, `@/templates/*`, `@/styles/*`). Adding the generic
  `"@/*": ["./*"]` alongside academix's existing specific ones resolves both identically for any
  overlapping path — no conflict.
- **Tailwind**: `academix`'s `content` globs don't scan an `app/` directory yet; `./app/**/*`
  needs adding, along with any custom `theme.extend` tokens the landing components use that
  aren't already defined in academix's config.

## Plan

1. **Copy `landingPage/app/`** (and its `css/`) into `academix/app/`.
2. **Copy landing-only components** from `landingPage/components/` into `academix/components/`
   (namespaced, e.g. under a `components/landing/` subfolder, to keep them visually distinct from
   `academix`'s existing dashboard components even though no name collisions were found).
3. **Copy `landingPage/public/`** contents into `academix/public/` (no collisions to resolve).
4. **Delete `academix/pages/index.tsx`** so `/` resolves to the App Router's real homepage.
5. **Merge configs**: `tsconfig.json` paths, `tailwind.config.ts` content + theme, add the 3
   missing dependencies to `academix/package.json`.
6. **Fold in the inbox backend**: create `academix/pages/api/inbox/authenticate.ts` with the same
   logic as `inbox-backend/index.js`'s `/authenticate` route (in-memory user store + ChatEngine.io
   call). Update `academix/pages/inbox/Frontend/src/AuthPage.jsx` to call the new relative API
   route instead of `http://localhost:3001/authenticate`.
7. **Delete `inbox-backend/`** and the top-level `landingPage/` folder once their content is
   confirmed working inside `academix`.
8. **Update `README.md`**: drop to 2 "Getting started" steps and a 2-entry project structure
   tree; update the tech-stack table.
9. **Verify**: `npm run dev` in the merged `academix` — marketing homepage loads at `/`,
   dashboards/projects still load, inbox auth round-trips through the new API route without
   needing a separate process on :3001.

## Out of scope (unchanged from before, plus one new item)

- `fyp-management-system-backend` stays a separate service (explicitly confirmed).
- `inbox2`, `inbox33`, `Login2`, the duplicate nested `academix/pages/landingPage`, unused `crm`
  pages — still deferred from the earlier cleanup pass.
- **New finding, not resolved here**: `landingPage` has its own unwired `/signup` and
  `/reset-password` stub pages (styled-components, not connected to the real backend). These get
  carried over as-is alongside the real `Auth/signup` flow — same "duplicate flow" pattern as
  `Login2`, left for a future pass.
- No visual/design changes to either the landing pages or the app — this is a structural
  relocation, not a redesign.
