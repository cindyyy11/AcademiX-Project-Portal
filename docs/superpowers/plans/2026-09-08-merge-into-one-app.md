# Merge landingPage + inbox-backend into academix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fold the standalone `landingPage` (Next.js marketing site) and `inbox-backend` (Express chat-auth service) into `academix`, so the whole user-facing product is one deployable Next.js app. `fyp-management-system-backend` stays a separate service.

**Architecture:** `academix` already uses the Pages Router (`pages/`). Next.js 14 supports the Pages Router and the App Router (`app/`) coexisting in one project, each an independent rendering root. `landingPage`'s `app/` directory (plus its landing-only components and public assets) gets copied into `academix` as a second, independent route tree; `inbox-backend`'s one Express route becomes a Next.js API route. No test framework exists in either app today, so each task's "test" is a concrete build/dev-server/manual verification, not an automated test suite — this follows the existing project's own pattern rather than inventing one.

**Tech Stack:** Next.js 14 (Pages Router + App Router), TypeScript, Tailwind CSS, React 18.

**Spec:** `docs/superpowers/specs/2026-09-08-merge-into-one-app-design.md`

## Global Constraints

- `fyp-management-system-backend` is not touched — it stays a separate service (confirmed scope boundary).
- No visual/design changes to either the landing pages or the app — this is a structural relocation only.
- Out of scope, do not touch: `inbox2`, `inbox33`, `Login2`, the duplicate nested `academix/pages/landingPage`, unused `crm` pages, `landingPage`'s unwired `/signup` and `/reset-password` stub pages (carried over as-is, not wired to the real backend).
- Every commit message ends with the author's own name only — no `Co-Authored-By`/`Claude-Session` trailer (per standing project preference).

---

### Task 1: Merge build config (tsconfig, Tailwind, PostCSS, package.json)

No files are copied yet in this task — only the shared config that the copied files will depend on. This is verified in isolation first so any breakage in Task 2 can only be from the new files, not the config.

**Files:**
- Modify: `academix/tsconfig.json`
- Modify: `academix/tailwind.config.ts`
- Modify: `academix/postcss.config.js`
- Modify: `academix/package.json`

**Interfaces:**
- Produces: a generic `@/*` import alias (resolves to `academix/*`), a Tailwind config that scans `./app/**/*` and defines `colors.gray`, the merged `colors.purple` (both the `1-3` and `100-900` scales), `fontFamily.inter`, `fontFamily['architects-daughter']`, the additive `fontSize` keys (`xs, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl` — **not** `sm`, which keeps academix's existing tuple value), `letterSpacing` extras, `inset.full`, `minWidth[10]`, `scale[98]`, and `spacing['9/16']`/`spacing['3/4']`/`spacing['1/1']` — all of which Task 2's copied components rely on. Also produces working `postcss-import` resolution for `@import` rules in CSS, and the 3 packages Task 2's copied files import.

- [ ] **Step 1: Add the generic `@/*` path alias**

In `academix/tsconfig.json`, the `"paths"` block currently ends with:

```json
      "@/mocks/*": ["mocks/*"],
    }
```

Change it to:

```json
      "@/mocks/*": ["mocks/*"],
      "@/*": ["./*"]
    }
```

(TypeScript's tsconfig parser tolerates the trailing comma either way, but this keeps the new entry as the last one, consistent with the rest of the list.)

- [ ] **Step 2: Replace `academix/tailwind.config.ts` with the merged config**

Replace the entire file with:

```ts
const { fontFamily } = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");


/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    prefix: "dui-",  // Add this line to prefix DaisyUI classes
  },
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./templates/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      "4xl": { max: "1719px" },
      // => @media (max-width: 1719px) { ... }
      "2xl": { max: "1419px" },
      // => @media (max-width: 1419px) { ... }
      xl: { max: "1259px" },
      // => @media (max-width: 1259px) { ... }
      xls: { max: "1179px" },
      // => @media (max-width: 1179px) { ... }
      lg: { max: "1023px" },
      // => @media (max-width: 1023px) { ... }
      md: { max: "767px" },
      // => @media (max-width: 767px) { ... }
      sm: { max: "480px" },
      // => @media (max-width: 480px) { ... }
    },
    extend: {
      colors: {
        purple: {
          1: "#AE7AFF",
          2: "#8B62CC",
          3: "#EFE4FF",
          100: "#F4F4FF",
          200: "#E2E1FF",
          300: "#CBCCFF",
          400: "#ABABFF",
          500: "#8D8DFF",
          600: "#5D5DFF",
          700: "#4B4ACF",
          800: "#38379C",
          900: "#262668",
        },
        gray: {
          100: "#EBF1F5",
          200: "#D9E3EA",
          300: "#C5D2DC",
          400: "#9BA9B4",
          500: "#707D86",
          600: "#55595F",
          700: "#33363A",
          800: "#25282C",
          900: "#151719",
        },
        yellow: {
          1: "#FAE8A4",
          2: "#FEFAED",
        },
        pink: {
          1: "#E99898",
          2: "#FBEAEA",
        },
        green: {
          1: "#98E9AB",
          2: "#EAFBEE",
        },
        n: {
          1: "#000000",
          2: "#161616",
          3: "#5F646D",
          4: "#E7E8E9",
          5: "#3F3A52",
          6: "#252134",
          7: "#15131D",
          8: "#0E0C15",
          9: "#474060",
          10: "#43435C",
          11: "#1B1B2E",
          12: "#2E2A41",
          13: "#6C7275",
        },
        white: "#FFFFFF",
        background: "#FAF4F0",
        color: {
          1: "#AC6AFF",
          2: "#FFC876",
          3: "#FF776F",
          4: "#7ADB78",
          5: "#858DFF",
          6: "#FF98E2",
          7: "#15131D",
          8: "#0E0C15",
          9: "#474060",
          10: "#43435C",
          11: "#1B1B2E",
          12: "#2E2A41",
          13: "#6C7275",
        },
        stroke: {
          1: "#26242C",
        },
      },
      zIndex: {
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
      },
      spacing: {
        0.25: "0.0625rem",
        0.75: "0.1875rem",
        4.5: "1.125rem",
        5.5: "1.375rem",
        6.5: "1.75rem",
        7.5: "1.875rem",
        8.5: "2.125rem",
        9.5: "2.375rem",
        13: "3.25rem",
        15: "3.75rem",
        17: "4.25rem",
        18: "4.5rem",
        19: "4.75rem",
        21: "5.25rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
        34: "8.5rem",
        38: "9.5rem",
        42: "10.5rem",
        58: "14.5rem",
        "9/16": "56.25%",
        "3/4": "75%",
        "1/1": "100%",
      },
      letterSpacing: {
        tagline: ".15em",
        tighter: "-0.02em",
        tight: "-0.01em",
        normal: "0",
        wide: "0.01em",
        wider: "0.02em",
        widest: "0.4em",
      },
      inset: {
        full: "100%",
      },
      minWidth: {
        10: "2.5rem",
      },
      scale: {
        98: ".98",
      },
      backgroundImage: {
        "radial-gradient": "radial-gradient(var(--tw-gradient-stops))",
        "conic-gradient":
          "conic-gradient(from 225deg, #FFC876, #79FFF7, #9F53FF, #FF98E2, #FFC876)",
      },
      borderWidth: {
        DEFAULT: "0.0625rem",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
      transitionTimingFunction: {
        DEFAULT: "linear",
      },
      keyframes: {
        loaderDots: {
          "0%": { opacity: 1 },
          "50%,100%": { opacity: 0.15 },
        },
      },
      opacity: {
        85: ".85",
        95: ".95",
      },
      borderRadius: {
        1: "0.0625rem",
      },
      fontFamily: {
        sans: ["var(--font-roboto)", ...fontFamily.sans],
        inter: ["var(--font-inter)", "sans-serif"],
        "architects-daughter": ["var(--font-architects-daughter)", "sans-serif"],
      },
      fontSize: {
        0: ["0px", "0px"],
        sm: ["0.875rem", "1.3125rem"],
        xs: "0.75rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        "4xl": "2.5rem",
        "5xl": "3.25rem",
        "6xl": "4rem",
        h1: [
          "3rem",
          {
            lineHeight: "3.5rem",
            fontWeight: "800",
          },
        ],
        h2: [
          "2.25rem",
          {
            lineHeight: "2.875rem",
            fontWeight: "800",
          },
        ],
        h3: [
          "1.875rem",
          {
            lineHeight: "2.375rem",
            fontWeight: "800",
          },
        ],
        h4: [
          "1.5rem",
          {
            lineHeight: "2rem",
            fontWeight: "800",
          },
        ],
        h5: [
          "1.25rem",
          {
            lineHeight: "1.75rem",
            fontWeight: "800",
          },
        ],
        h6: [
          "1.125rem",
          {
            lineHeight: "1.5rem",
            fontWeight: "800",
          },
        ],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require("@headlessui/tailwindcss")({ prefix: "ui" }),
    require('daisyui'),
    require("tailwind-scrollbar"),
    plugin(function ({ addBase, addComponents, addUtilities }: { addBase: any, addComponents: any, addUtilities: any }) {
      addBase({
        html: {
          "@apply text-[1rem]": {},
        },
        body: {
          "@apply bg-background text-base antialiased dark:bg-n-2": {},
        },
      });
      addComponents({
        ".btn": {
          "@apply inline-flex items-center justify-center h-13 px-5 border border-n-1 rounded-sm text-base text-n-1 fill-n-1 font-bold transition-colors":
            {},
        },
        ".btn svg": {
          "@apply icon-18 fill-inherit first:mr-1.5 last:ml-1.5": {},
        },
        ".btn-transparent-light": {
          "@apply btn border-transparent text-white fill-white hover:text-purple-1 hover:fill-purple-1":
            {},
        },
        ".btn-transparent-dark": {
          "@apply btn border-transparent text-n-1 fill-n-1 hover:text-purple-1 hover:fill-purple-1 dark:text-white dark:fill-white dark:hover:text-purple-1 hover:dark:fill-purple-1":
            {},
        },
        ".btn-purple": {
          "@apply btn bg-purple-1 text-n-1 fill-n-1 hover:bg-purple-1/90": {},
        },
        ".btn-dark": {
          "@apply btn bg-n-1 text-white fill-white hover:bg-n-1/80 dark:bg-white/10 dark:hover:bg-white/20":
            {},
        },
        ".btn-stroke": {
          "@apply btn hover:bg-n-1 hover:text-white hover:fill-white dark:border-white dark:text-white dark:fill-white dark:hover:bg-white dark:hover:text-n-1 dark:hover:fill-n-1":
            {},
        },
        ".btn-shadow": {
          "@apply shadow-primary-4": {},
        },
        ".btn-square": {
          "@apply !px-0": {},
        },
        ".btn-square svg": {
          "@apply !ml-0 !mr-0": {},
        },
        ".btn-small": {
          "@apply h-8 px-3 text-xs": {},
        },
        ".btn-medium": {
          "@apply h-9 px-2 text-xs": {},
        },
        ".btn-small svg, .btn-medium svg": {
          "@apply icon-16": {},
        },
        ".btn-square.btn-small": {
          "@apply w-8": {},
        },
        ".btn-square.btn-medium": {
          "@apply w-9": {},
        },
        ".label": {
          "@apply inline-flex justify-center items-center h-6 px-3 border rounded-sm text-center text-xs font-bold text-n-1":
            {},
        },
        ".label-stroke": {
          "@apply label border-n-1 dark:border-white dark:text-white": {},
        },
        ".label-stroke-yellow": {
          "@apply label border-yellow-1 text-yellow-1": {},
        },
        ".label-stroke-pink": {
          "@apply label border-pink-1 text-pink-1": {},
        },
        ".label-stroke-purple": {
          "@apply label border-purple-1 text-purple-1": {},
        },
        ".label-stroke-green": {
          "@apply label border-green-1 text-green-1": {},
        },
        ".label-purple": {
          "@apply label border-purple-1 bg-purple-1": {},
        },
        ".label-green": {
          "@apply label border-green-1 bg-green-1": {},
        },
        ".label-yellow": {
          "@apply label border-yellow-1 bg-yellow-1": {},
        },
        ".label-black": {
          "@apply label border-n-1 bg-n-1 text-white dark:bg-white/10": {},
        },
        ".table-custom": {
          "@apply table w-full border border-n-1 bg-white dark:bg-n-1 dark:border-white":
            {},
        },
        ".table-select": {
          "@apply table-custom [&>thead>tr>*:nth-child(2)]:pl-0 [&>thead>tr>*:nth-child(1)]:w-13 [&>thead>tr>*:nth-child(1)]:px-0 [&>thead>tr>*:nth-child(1)]:text-0 [&>thead>tr>*:nth-child(1)]:text-center [&>tbody>tr>*:nth-child(2)]:pl-0 [&>tbody>tr>*:nth-child(1)]:w-13 [&>tbody>tr>*:nth-child(1)]:px-0 [&>tbody>tr>*:nth-child(1)]:text-center [&>tbody>tr>*:nth-child(1)]:text-0":
            {},
        },
        ".th-custom": {
          "@apply table-cell h-12 px-3 py-2 align-middle text-left first:pl-5 last:pr-5":
            {},
        },
        ".td-custom": {
          "@apply table-cell h-[3.875rem] px-3 py-2.5 align-middle border-t border-n-1 text-sm first:pl-5 last:pr-5 dark:border-white":
            {},
        },
        ".card": {
          "@apply bg-white border border-n-1 dark:bg-n-1 dark:border-white": {},
        },
        ".card-head": {
          "@apply flex justify-between items-center min-h-[4rem] px-5 py-3 border-b border-n-1 dark:border-white":
            {},
        },
        ".card-title": {
          "@apply p-5 border-b border-n-1 text-h6 dark:border-white": {},
        },
        ".icon-16": {
          "@apply !w-4 !h-4": {},
        },
        ".icon-18": {
          "@apply !w-4.5 !h-4.5": {},
        },
        ".icon-20": {
          "@apply !w-5 !h-5": {},
        },
        ".icon-22": {
          "@apply !w-5.5 !h-5.5": {},
        },
        ".icon-24": {
          "@apply !w-6 !h-6": {},
        },
        ".icon-28": {
          "@apply !w-7 !h-7": {},
        },
        ".shadow-primary-4": {
          "@apply shadow-[0.25rem_0.25rem_0_#000000] dark:shadow-[0.25rem_0.25rem_0_rgba(255,255,255,.25)]":
            {},
        },
        ".shadow-primary-6": {
          "@apply shadow-[0.375rem_0.375rem_0_#000000] dark:shadow-[0.375rem_0.375rem_0_rgba(255,255,255,.25)]":
            {},
        },
        ".shadow-primary-8": {
          "@apply shadow-[0.5rem_0.5rem_0_#000000] dark:shadow-[0.5rem_0.5rem_0_rgba(255,255,255,.25)]":
            {},
        },
        ".shadow-secondary-4": {
          "@apply shadow-[0.25rem_-0.25rem_0_#000000] dark:shadow-[0.25rem_-0.25rem_0_rgba(255,255,255,.25)]":
            {},
        },
        ".shadow-secondary-6": {
          "@apply shadow-[0.375rem_-0.375rem_0_#000000] dark:shadow-[0.375rem_-0.375rem_0_rgba(255,255,255,.25)]":
            {},
        },
        ".shadow-secondary-8": {
          "@apply shadow-[0.5rem_-0.5rem_0_#000000] dark:shadow-[0.5rem_-0.5rem_0_rgba(255,255,255,.25)]":
            {},
        },
        ".container": {
          "@apply max-w-[77.5rem] mx-auto px-5 md:px-10 lg:px-15 xl:max-w-[87.5rem]":
            {},
        },
        ".h1": {
          "@apply font-semibold text-[2.5rem] leading-[3.25rem] md:text-[2.75rem] md:leading-[3.75rem] lg:text-[3.25rem] lg:leading-[4.0625rem] xl:text-[3.75rem] xl:leading-[4.5rem]":
            {},
        },
        ".h2": {
          "@apply text-[1.75rem] leading-[2.5rem] md:text-[2rem] md:leading-[2.5rem] lg:text-[2.5rem] lg:leading-[3.5rem] xl:text-[3rem] xl:leading-tight":
            {},
        },
        ".h3": {
          "@apply text-[2rem] leading-normal md:text-[2.5rem]": {},
        },
        ".h4": {
          "@apply text-[2rem] leading-normal": {},
        },
        ".h5": {
          "@apply text-2xl leading-normal": {},
        },
        ".h6": {
          "@apply font-semibold text-lg leading-8": {},
        },
        ".body-1": {
          "@apply text-[0.875rem] leading-[1.5rem] md:text-[1rem] md:leading-[1.75rem] lg:text-[1.25rem] lg:leading-8":
            {},
        },
        ".body-2": {
          "@apply font-light text-[0.875rem] leading-6 md:text-base": {},
        },
        ".caption": {
          "@apply text-sm": {},
        },
        ".tagline": {
          "@apply font-light text-xs tracking-tagline uppercase":
            {},
        },
        ".quote": {
          "@apply text-lg leading-normal": {},
        },
        ".button": {
          "@apply text-xs font-bold uppercase tracking-wider": {},
        },
      });
      addUtilities({
        ".tap-highlight-color": {
          "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)",
        },
      });
    }),
  ],
};
```

This is the exact original file with: `./app/**/*.{js,ts,jsx,tsx}` added to `content`; `colors.purple` extended with the `100-900` scale; `colors.gray` added; `spacing` extended with the 3 fraction keys; `letterSpacing` extended; `inset`, `minWidth`, `scale` added; `fontFamily` extended with `inter`/`architects-daughter`; `fontSize` extended with `xs, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl` (deliberately **not** overwriting `sm`, so every existing `text-sm` usage across the dashboard keeps its current `1.3125rem` line-height — landingPage's plain-string `sm` is dropped). Nothing else changed.

- [ ] **Step 3: Add `postcss-import` to `academix/postcss.config.js`**

`landingPage/app/css/style.css` (copied in Task 2) uses `@import 'additional-styles/...'` — this requires the `postcss-import` plugin to resolve, and it must run before `tailwindcss`. Replace the file with:

```js
module.exports = {
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 4: Add the 3 missing dependencies to `academix/package.json`**

In the `"dependencies"` block, add `@mui/icons-material` (keep alphabetical order, right before `@mui/material`):

```json
    "@mui/icons-material": "^5.15.20",
    "@mui/material": "^5.15.20",
```

In the `"devDependencies"` block, add `@types/aos` and `postcss-import` (keep alphabetical order):

```json
  "devDependencies": {
    "@types/aos": "^3.0.7",
    "@types/multer": "^1.4.11",
    "@typescript-eslint/parser": "^7.2.0",
    "daisyui": "^4.12.8",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.2.3",
    "postcss-import": "^16.1.0",
    "react-toastify": "^10.0.5"
  }
```

- [ ] **Step 5: Install dependencies**

Run: `cd academix && npm install`
Expected: installs `@mui/icons-material`, `@types/aos`, `postcss-import` with no errors.

- [ ] **Step 6: Verify the existing app is unaffected**

Run: `cd academix && npm run build`
Expected: build succeeds (same as before this task — this is the pre-Task-2 baseline; it proves the config changes alone don't break anything).

- [ ] **Step 7: Commit**

```bash
cd "C:\Users\User\AcademiX-Project-Portal"
git add academix/tsconfig.json academix/tailwind.config.ts academix/postcss.config.js academix/package.json academix/package-lock.json
git commit -m "Merge Tailwind/tsconfig/postcss config from landingPage into academix

Adds the generic @/* import alias, Tailwind content glob + theme keys,
and postcss-import support that the landingPage files being merged in
Task 2 depend on. No new pages/components yet - this is config only."
```

---

### Task 2: Bring the marketing site into academix as its App Router tree

**Files:**
- Create: `academix/app/layout.tsx`
- Create: `academix/app/(default)/layout.tsx`
- Create: `academix/app/(default)/page.tsx`
- Create: `academix/app/(auth)/layout.tsx`
- Create: `academix/app/(auth)/signup/page.tsx` (copied as-is)
- Create: `academix/app/(auth)/reset-password/page.tsx` (copied as-is)
- Create: `academix/app/css/style.css` and `academix/app/css/additional-styles/*.css` (copied as-is)
- Create: `academix/components/landing/*` (all of `landingPage/components/*`, copied as-is except `zigzag.tsx`)
- Create/merge: `academix/public/images/*`, `academix/public/videos/*`, `academix/public/AcademiXProjectPortal-icon.png` (copied from `landingPage/public/`, no filename collisions with academix's existing `public/`)
- Modify: `academix/components/landing/zigzag.tsx` (fix a broken image import, see Step 3)
- Delete: `academix/pages/index.tsx`

**Interfaces:**
- Consumes: the `@/*` alias and Tailwind/PostCSS config from Task 1.
- Produces: `/` now renders the real AcademiX marketing homepage instead of the admin template's demo page list; all existing `pages/`-router routes (`/dashboard/*`, `/projects/*`, etc.) are unaffected since the App Router and Pages Router are independent trees.

- [ ] **Step 1: Copy the public assets**

Run:
```bash
cd "C:\Users\User\AcademiX-Project-Portal"
cp -r landingPage/public/images/* academix/public/images/
cp -r landingPage/public/videos academix/public/videos
cp landingPage/public/AcademiXProjectPortal-icon.png academix/public/AcademiXProjectPortal-icon.png
```
Expected: no files overwritten (confirmed zero filename collisions between the two `public/` trees during design).

- [ ] **Step 2: Copy the landing-only components into their own namespaced folder**

Run:
```bash
mkdir -p academix/components/landing
cp -r landingPage/components/* academix/components/landing/
```

This namespacing (`components/landing/`) matters beyond tidiness: `academix/components/` already has PascalCase folders like `Header/` and `Footer/`, and Windows' filesystem is case-insensitive — a flat merge risking `components/header.tsx` next to `components/Header/` would collide on this machine. Namespacing under `landing/` avoids that entirely.

- [ ] **Step 3: Fix the broken image import in `zigzag.tsx`**

The copied `academix/components/landing/zigzag.tsx` still imports the old filename from before the earlier README-cleanup rename (the file on disk is now `ProjectTimeline-1CaseStudy.png`, no space/parens — this import has been broken since that rename and needs fixing regardless of this merge). Find:

```ts
import FeatImage01 from '@/public/images/ProjectTimeline-1CaseStudy (1).png'
```

Replace with:

```ts
import FeatImage01 from '@/public/images/ProjectTimeline-1CaseStudy.png'
```

- [ ] **Step 4: Copy the `app/` route tree and CSS**

Run:
```bash
cd "C:\Users\User\AcademiX-Project-Portal"
mkdir -p "academix/app/(default)" "academix/app/(auth)/signup" "academix/app/(auth)/reset-password" academix/app/css
cp landingPage/app/layout.tsx academix/app/layout.tsx
cp "landingPage/app/(default)/layout.tsx" "academix/app/(default)/layout.tsx"
cp "landingPage/app/(default)/page.tsx" "academix/app/(default)/page.tsx"
cp "landingPage/app/(auth)/layout.tsx" "academix/app/(auth)/layout.tsx"
cp "landingPage/app/(auth)/signup/page.tsx" "academix/app/(auth)/signup/page.tsx"
cp "landingPage/app/(auth)/reset-password/page.tsx" "academix/app/(auth)/reset-password/page.tsx"
cp -r landingPage/app/css/* academix/app/css/
```

Note: `landingPage/app/api/hello/route.ts` is deliberately **not** copied — `academix` already has its own equivalent unused scaffold stub at `pages/api/hello.ts` (Pages Router), and copying the App Router version would collide on the same `/api/hello` route (same class of conflict as `pages/index.tsx` vs `app/page.tsx`, just for a stub neither app actually uses). Leaving `academix`'s existing stub alone and simply not bringing the other one over avoids the collision without losing anything real.

- [ ] **Step 5: Rewrite the `@/components/...` import paths to `@/components/landing/...`**

Six imports across the files just copied (plus one inside a component copied in Step 2) use the path that was valid inside the standalone `landingPage` app. Since the components now live under `academix/components/landing/`, each needs the `landing/` segment inserted. Edit each file:

In `academix/components/landing/hero.tsx`, find:
```ts
import ModalVideo from '@/components/modal-video'
```
Replace with:
```ts
import ModalVideo from '@/components/landing/modal-video'
```

In `academix/app/layout.tsx`, find:
```ts
import Header from '@/components/ui/header'
import Banner from '@/components/banner'
```
Replace with:
```ts
import Header from '@/components/landing/ui/header'
import Banner from '@/components/landing/banner'
```

In `academix/app/(default)/layout.tsx`, find:
```ts
import PageIllustration from '@/components/page-illustration'
import Footer from '@/components/ui/footer'
```
Replace with:
```ts
import PageIllustration from '@/components/landing/page-illustration'
import Footer from '@/components/landing/ui/footer'
```

In `academix/app/(default)/page.tsx`, find:
```ts
import Hero from '@/components/hero'
import Features from '@/components/features'
import Newsletter from '@/components/newsletter'
import Zigzag from '@/components/zigzag'
import Testimonials from '@/components/testimonials'
```
Replace with:
```ts
import Hero from '@/components/landing/hero'
import Features from '@/components/landing/features'
import Newsletter from '@/components/landing/newsletter'
import Zigzag from '@/components/landing/zigzag'
import Testimonials from '@/components/landing/testimonials'
```

In `academix/app/(auth)/layout.tsx`, find:
```ts
import PageIllustration from '@/components/page-illustration'
```
Replace with:
```ts
import PageIllustration from '@/components/landing/page-illustration'
```

- [ ] **Step 6: Delete the template homepage**

Run: `rm "academix/pages/index.tsx"` (or `git rm` if already tracked)

Next.js does not allow both `app/page.tsx` and `pages/index.tsx` to resolve to `/` — this makes the App Router's real marketing homepage win. (`academix/pages/pagelist.tsx`, the same template page at `/pagelist`, is untouched — out of scope.)

- [ ] **Step 7: Build and check for the Headless UI version-mismatch risk**

Run: `cd academix && npm run build`

`landingPage/components/modal-video.tsx` (now `academix/components/landing/modal-video.tsx`) uses `@headlessui/react`'s `Transition.Child` / `Dialog.Panel` compound-component syntax. `academix` already depends on `@headlessui/react@^2.0.4` (newer than what `landingPage` was built against) — if that API changed between versions, this build step is what surfaces it, as a TypeScript error naming the exact symbol that no longer exists on the type. If it does error:
1. Note the exact error message (it will name the missing property, e.g. `Property 'Child' does not exist on type ...`).
2. Check the installed version's type definitions: `academix/node_modules/@headlessui/react/dist/components/transition/transition.d.ts` (or wherever the error points) for the correct v2 export name.
3. Update the import/usage in `modal-video.tsx` to match — e.g. if `Transition.Child` was split into a standalone named export, import it directly (`import { Transition, TransitionChild } from '@headlessui/react'`) and replace `<Transition.Child ...>` with `<TransitionChild ...>`, keeping every prop unchanged.

Expected after any needed fix: `npm run build` succeeds.

- [ ] **Step 8: Manual verification**

Run: `cd academix && npm run dev`, then:
1. Open `http://localhost:3000/` — confirm the real AcademiX marketing homepage renders (hero, features, testimonials, newsletter sections), not the old template page list.
2. Open `http://localhost:3000/dashboard/Student/projects` (or any existing dashboard route) — confirm it still renders exactly as before.
3. Open `http://localhost:3000/pagelist` — confirm the old template page list is still reachable there (unchanged, out of scope).

- [ ] **Step 9: Commit**

```bash
cd "C:\Users\User\AcademiX-Project-Portal"
git add academix/app academix/components/landing academix/public/images academix/public/videos "academix/public/AcademiXProjectPortal-icon.png"
git add -u academix/pages/index.tsx
git commit -m "Bring landingPage's marketing site into academix as its App Router tree

- Copy landingPage's app/, css/, and components into academix
  (components namespaced under components/landing/ to avoid
  case-insensitive collisions with academix's existing PascalCase
  component folders on Windows).
- Fix a broken zigzag.tsx image import left over from the earlier
  README screenshot rename.
- Delete pages/index.tsx so / now resolves to the real marketing
  homepage instead of the admin template's demo page list.
- Existing pages/-router routes (dashboards, projects, auth, etc.)
  are untouched - App Router and Pages Router are independent trees."
```

---

### Task 3: Fold the inbox backend into a Next.js API route

**Files:**
- Create: `academix/pages/api/inbox/authenticate.ts`
- Modify: `academix/pages/inbox/Frontend/src/AuthPage.jsx:22`

**Interfaces:**
- Produces: `POST /api/inbox/authenticate` — same request/response contract as the old `inbox-backend` service (`{ username, secret }` in, ChatEngine.io's response passed through).

- [ ] **Step 1: Create the API route**

Create `academix/pages/api/inbox/authenticate.ts`:

```ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

// In-memory user store for simplicity - matches the behavior of the
// standalone inbox-backend service this replaces. Resets on server
// restart, same as before.
const users: { username: string; secret: string }[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  const { username, secret } = req.body;
  const user = users.find((u) => u.username === username);

  if (user) {
    if (user.secret !== secret) {
      return res.status(400).json({ message: "Invalid Password" });
    }
  } else {
    users.push({ username, secret });
  }

  try {
    const r = await axios.put(
      "https://api.chatengine.io/users/",
      { username, secret, first_name: username },
      { headers: { "private-key": "914ca30f-b953-464d-a8a8-037447b03d48" } }
    );
    return res.status(r.status).json(r.data);
  } catch (e: any) {
    return res.status(e.response?.status ?? 500).json(e.response?.data ?? { message: "ChatEngine request failed" });
  }
}
```

This preserves the exact behavior of `inbox-backend/index.js`'s `/authenticate` route (same in-memory store, same ChatEngine.io call, same private key), just as a Next.js API route instead of a separate Express app. The only behavior change: `e.response?.status ?? 500` instead of crashing when `e.response` is undefined (e.g. no network access to ChatEngine.io) — the original crashed the whole process on that error; this returns a 500 instead, which is strictly safer and doesn't change the happy-path contract.

- [ ] **Step 2: Update the frontend caller**

In `academix/pages/inbox/Frontend/src/AuthPage.jsx`, find:
```jsx
axios.post('http://localhost:3001/authenticate', userData)
```
Replace with:
```jsx
axios.post('/api/inbox/authenticate', userData)
```

- [ ] **Step 3: Verify**

Run: `cd academix && npm run dev`, then in another terminal:
```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:3000/api/inbox/authenticate -X POST -H "Content-Type: application/json" -d '{"username":"test","secret":"test"}'
```
Expected: a response (200 from ChatEngine.io, or a clean error status if ChatEngine.io is unreachable from this environment) — not a connection-refused, confirming the route exists and runs. Then open `http://localhost:3000/inbox` in the browser and confirm the inbox auth page still submits without a network error in the console pointing at `localhost:3001`.

- [ ] **Step 4: Commit**

```bash
cd "C:\Users\User\AcademiX-Project-Portal"
git add academix/pages/api/inbox/authenticate.ts academix/pages/inbox/Frontend/src/AuthPage.jsx
git commit -m "Fold inbox-backend's /authenticate route into a Next.js API route

Same in-memory store + ChatEngine.io call as the standalone Express
service, now served from academix itself at /api/inbox/authenticate.
The one frontend caller (AuthPage.jsx) is updated to match."
```

---

### Task 4: Remove the now-redundant top-level folders and update the docs

**Files:**
- Delete: `landingPage/` (entire folder)
- Delete: `inbox-backend/` (entire folder)
- Modify: `README.md`

**Interfaces:**
- Consumes: Tasks 1-3 must be verified working first — this task's deletions are only safe once `academix` fully covers what these folders provided.

- [ ] **Step 1: Delete the two folders**

```bash
cd "C:\Users\User\AcademiX-Project-Portal"
git rm -r landingPage inbox-backend
```

- [ ] **Step 2: Update `README.md`**

Six spots in `README.md` currently point at paths inside `landingPage/` or `inbox-backend/` — once those folders are deleted in Step 1, any left unfixed become broken image links or wrong instructions. Fix each:

In the banner (near the top), find:
```markdown
  <img src="landingPage/public/AcademiXProjectPortal-icon.png" alt="AcademiX icon" height="90" />
```
Replace with:
```markdown
  <img src="academix/public/AcademiXProjectPortal-icon.png" alt="AcademiX icon" height="90" />
```

In the "Screenshots" section, find:
```markdown
| ![Supervisor setting up a project](landingPage/public/images/SupervisorSettingUpProject.png) | ![Student project planning milestone](landingPage/public/images/ProjectTimeline-4Planning.png) |
```
Replace with:
```markdown
| ![Supervisor setting up a project](academix/public/images/SupervisorSettingUpProject.png) | ![Student project planning milestone](academix/public/images/ProjectTimeline-4Planning.png) |
```

Just below it, find:
```markdown
  <img src="landingPage/public/images/ProjectTimeline-1CaseStudy.png" alt="Student case study milestone" width="70%" />
```
Replace with:
```markdown
  <img src="academix/public/images/ProjectTimeline-1CaseStudy.png" alt="Student case study milestone" width="70%" />
```

In the "Tech stack" table, find:
```markdown
| `inbox-backend` (chat service) | Node.js, Express |
| `landingPage` (marketing site) | Next.js 14, TypeScript, Tailwind CSS |
```
Delete both lines entirely (no replacement — `academix`'s existing row already lists Next.js/React/TypeScript/Tailwind).

In the "Project structure" tree, find:
```
├── inbox-backend/                   # Chat microservice (Express, port 3001)
│   └── index.js                     #   Auth bridge to the ChatEngine.io inbox
│
└── landingPage/                     # Public marketing site (Next.js, port 3002)
    ├── app/                         #   App Router pages ((default), (auth), api)
    ├── components/                  #   Landing sections (hero, features, testimonials, banner...)
    └── public/                      #   Marketing images & product screenshots
```
Delete it, and change the line just above it (the last line of the `fyp-management-system-backend` block) from:
```
│   └── socketServer.ts              #   Real-time notifications/chat via Socket.io
│
```
to:
```
│   └── socketServer.ts              #   Real-time notifications/chat via Socket.io
```
(i.e. `fyp-management-system-backend`'s block is now the last one in the tree — drop the trailing `│` separator line after it). Also add a line to `academix/`'s own block — find:
```
│   └── public/                      #   Static assets (logo, images, file manager icons)
```
Replace with:
```
│   ├── public/                      #   Static assets (logo, images, file manager icons)
│   └── app/                         #   Marketing site (App Router) — merged in from the former landingPage app
```

In "Getting started", find:
```markdown
1. **Main app** — `cd academix && npm run dev` → http://localhost:3000
2. **Core backend API** — `cd fyp-management-system-backend && npm run dev` → http://localhost:8000
3. **Inbox/chat backend** — `cd inbox-backend && npm run dev` → http://localhost:3001
4. **Landing page** — `cd landingPage && npm run dev` → http://localhost:3002
```
Replace with:
```markdown
1. **Main app** — `cd academix && npm run dev` → http://localhost:3000 (serves the marketing site at `/`, the dashboards, and the inbox chat auth API)
2. **Core backend API** — `cd fyp-management-system-backend && npm run dev` → http://localhost:8000
```

- [ ] **Step 3: Final full verification**

Run: `cd academix && npm run dev`, then confirm all three of:
1. `http://localhost:3000/` — marketing homepage.
2. `http://localhost:3000/dashboard/Student/projects` (or similar) — existing dashboard.
3. `http://localhost:3000/inbox` — inbox auth page submits successfully.

Then run: `cd fyp-management-system-backend && npm run dev` — confirm it still starts on :8000 independently (this task never touched it, but a full-system smoke test is worth doing once, now that we're down to 2 services).

- [ ] **Step 4: Commit**

```bash
cd "C:\Users\User\AcademiX-Project-Portal"
git add -A
git commit -m "Remove landingPage/ and inbox-backend/, now merged into academix

academix is the one deployable app for everything user-facing
(marketing site + dashboards + inbox chat auth).
fyp-management-system-backend remains the separate core API service.
2 services total, down from 4. README updated to match."
```
