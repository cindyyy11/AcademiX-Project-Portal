# Design: Code structure cleanup (untrack node_modules, relocate inbox backend)

## Context

Reviewing the repo for the README refresh surfaced several structural issues. The user
confirmed this cleanup is to prepare the project for showing/submitting (portfolio/FYP), and
scoped it down to exactly two items (a broader list of duplicate/dead-code issues — `inbox2`,
`inbox33`, `Login2`, the duplicate nested `landingPage`, unused `crm` template pages, and the
homepage rendering the admin template's demo page list instead of real app content — was
surfaced but explicitly deferred to a later pass, not touched here).

## Findings

- `academix/.gitignore`, `fyp-management-system-backend/.gitignore`, and
  `landingPage/.gitignore` each contain `/node_modules`, but that pattern is anchored to the
  `.gitignore`'s own directory — it does not cover nested `node_modules` folders inside
  subdirectories (like `academix/pages/inbox/backend/node_modules`).
- No root-level `.gitignore` exists.
- As a result, ~2,798 `node_modules` files are committed to git, all under three folders:
  `academix/pages/inbox/backend/node_modules` (930), `academix/pages/inbox2/backend/node_modules`
  (930), `academix/pages/inbox33/backend/node_modules` (938). `.git` is ~60MB, working tree ~146MB.
- The one inbox backend actually wired up (`academix/pages/inbox/backend`, port 3001,
  `/authenticate` route) is a full separate Express service sitting inside the Next.js `pages/`
  route folder — inconsistent with the other 3 services (`academix`, `landingPage`,
  `fyp-management-system-backend`), which all live at the repo root.
- Nothing else in the repo references this backend by file path (only by its `localhost:3001`
  URL from the frontend), so it can be moved without touching any import/require paths.
- Its `package.json` only defines a `"start"` script (`nodemon index.js`) — no `"dev"` script —
  even though `ReadMe.rtf`/the current `README.md` documents `npm run dev` for this service. That
  command could never have worked as written.
- Side finding, explicitly out of scope: `academix/pages/inbox/backend/index.js` has a
  ChatEngine.io private key hardcoded in source, committed to git. Not touched in this pass.

## Part 1 — Stop tracking `node_modules`

1. Add a root-level `.gitignore`: `**/node_modules/`, `.env`, `.env*.local`, `.DS_Store`,
   `*.log`, `.vercel`, build output dirs — a repo-wide safety net that catches nested
   `node_modules` the per-app `.gitignore` files miss.
2. `git rm -r --cached` the three tracked `node_modules` trees listed above (files stay on disk,
   just untracked).
3. Leave the per-app `.gitignore` files as-is (they're still correct for their own scope; the
   root one is the fix for the nested-folder gap).

## Part 2 — Relocate the inbox backend

1. `git mv academix/pages/inbox/backend inbox-backend` — new top-level folder, sibling to the
   other 3 services.
2. Add `inbox-backend/.gitignore`, copied from the sibling services' `.gitignore`.
3. Edit `inbox-backend/package.json`: rename `"name"` from `"backend"` to `"inbox-backend"`, add
   `"dev": "nodemon index.js"` alongside the existing `"start"` script.
4. Update `README.md`:
   - "Getting started" step 3: `cd academix/pages/inbox/backend` → `cd inbox-backend`.
   - Project structure tree: move the inbox backend entry out from under `academix/pages/` to
     its own top-level entry, next to `fyp-management-system-backend/`.
5. Verify: start it from the new location (`cd inbox-backend && npm run dev`) and confirm it
   binds to port 3001 without errors.

## Out of scope (deferred, not touched here)

- Deleting `inbox2`, `inbox33`, `Login2`, the duplicate nested `academix/pages/landingPage`.
- Removing the unused `crm` template pages.
- Fixing the homepage (`/`) to show real app content instead of the admin template's demo page
  list.
- Rotating/relocating the hardcoded ChatEngine.io private key.
- Rewriting git history to shrink `.git` itself (untracking only affects future commits going
  forward, not past history size).
