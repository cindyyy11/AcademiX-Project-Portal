# Design: Root README refresh (logo + code structure)

## Context

The repo currently has no root `README.md` — only `ReadMe.rtf`, a 4-line list of
`npm run dev` commands and ports for the project's four services. There's no
description of what AcademiX is, no visuals, and no explanation of the repo's
structure.

This is a public-facing README (a separate dev-onboarding doc may follow later,
out of scope here).

## Assets already in the repo (reused, not created)

- `academix/public/assets/AcademiX_Logo.png` — black-outlined "AcademiX"
  wordmark, used live in the app's own header.
- `landingPage/public/AcademiXProjectPortal-icon.png` — purple mountain "A"
  icon, used as the landing page favicon.
- Real product screenshots (not template stock) in `landingPage/public/images/`:
  - `SupervisorSettingUpProject.png` — supervisor milestone/timeline setup
  - `ProjectTimeline-4Planning.png` — student milestone view (Project Planning)
  - `ProjectTimeline-1CaseStudy (1).png` — student milestone view (Case Study)

## Structure of `README.md`

1. **Banner** — icon + wordmark side by side (`<p align="center">` with two
   `<img>` tags referencing the existing paths above), plus a one-line
   tagline and a row of tech badges (Next.js, Express, MongoDB, Socket.io,
   TypeScript — shields.io, static badges, no CI badges since none exist).
2. **Overview** — 2-3 sentences: AcademiX is a role-based Final Year
   Project / capstone management platform covering the project lifecycle
   (case study → proposal → planning/milestones → final documentation →
   result & review) with grading and feedback, for Students, Supervisors,
   and Admins.
3. **Screenshots** — the three real screenshots listed above, each with a
   short caption, referenced from their existing repo paths.
4. **Features** — bullets grouped loosely: role-based dashboards
   (Admin/Student/Supervisor), project timeline & milestones, proposals/
   grading/feedback, tasks & kanban boards, calendar, file manager,
   real-time inbox chat, real-time notifications.
5. **Tech stack** — a short table per service:
   - `academix` (frontend): Next.js 14, React 18, Chakra UI, Redux Toolkit,
     TypeScript, Tailwind
   - `fyp-management-system-backend` (core API): Express, MongoDB/Mongoose,
     Redis, Socket.io, JWT auth, TypeScript
   - `academix/pages/inbox/backend` (chat microservice): Node/Express,
     Socket.io
   - `landingPage` (marketing site): Next.js 14, TypeScript, Tailwind
6. **Project structure** — a high-level tree of the 3 top-level apps
   (academix, fyp-management-system-backend, landingPage; the inbox backend
   noted as a nested 4th service) with their main subfolders and a one-line
   purpose each. Not a deep/exhaustive tree — role subfolders (Admin/
   Student/Supervisor) get one mention, not fully expanded.
7. **Getting started** — the four run commands from `ReadMe.rtf`, cleaned
   up into a numbered steps list with each service's port annotated,
   effectively superseding `ReadMe.rtf`.

`ReadMe.rtf` is deleted once its content is folded into `README.md`, so
there's a single source of truth at the root.

## Out of scope

- No dev-onboarding doc (env vars, DB seeding, troubleshooting) — explicitly
  deferred by the user to a separate future doc.
- No LICENSE section — none exists in the repo today; not fabricating one.
- No CI/build/deploy badges — no CI configured.
- No new image assets are created; only existing repo images are reused.
