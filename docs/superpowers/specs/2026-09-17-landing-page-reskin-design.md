# Design: Reskin the marketing site to match the dashboard's design system

## Context

`academix`'s marketing site (`app/**`, `components/landing/**`, merged in from the standalone
`landingPage` app back in September) still carries its original dark, soft-SaaS-template visual
identity: dark background (`bg-lgray-900`/`text-lgray-200`), Inter font (never actually loaded —
falls back to system sans), soft rounded corners, minimal shadows. The dashboard
(`pages/`, `components/` outside `landing/`, `templates/`) has a distinct, deliberate identity:
light cream background (`#FAF4F0`), bold black-outline "neo-brutalist" cards with hard offset
drop-shadows, Roboto Flex, sharp corners except where elements are inherently circular.

Goal: make the marketing site visually read as the same product as the dashboard — same colors,
same font, same card/button language — not a bolted-on template.

## What stays the same (non-goals)

- No copy/content changes (including the still-placeholder "Feature 1"..."Feature 6" text in
  `features.tsx` — pre-existing, out of scope here).
- No section order or layout-structure changes (same grid, same page flow).
- No JS behavior changes (video modal, mobile menu toggle, AOS scroll-reveal animations,
  newsletter form, banner dismiss).
- No changes to the dashboard side itself — this is one-directional, marketing site conforms to
  the dashboard.
- The `land-sm`/`land-md`/`land-lg`/`land-xl`/`land-2xl` breakpoint namespace (added during the
  September merge to prevent colliding with the dashboard's own max-width breakpoints) is
  untouched — only the *color/font/shape* classes change, not the responsive-variant ones.

## Color mapping

| Current (landingPage-era) | Role | Becomes (dashboard's actual tokens) |
|---|---|---|
| `bg-lgray-900` | Page background | `bg-background` (`#FAF4F0`) |
| `bg-lgray-800` | Card/testimonial/badge surfaces | `bg-white` |
| `text-lgray-100`, `text-lgray-200` | Headings, emphasized text | `text-n-1` (near-black) |
| `text-lgray-400` | Secondary/muted body text | `text-n-3` (`#5F646D`) |
| `text-lgray-600`, `text-lgray-700` | Tertiary text, icon hover, dividers-as-text | `text-n-3` or `border-n-1` depending on role (see per-file notes below) |
| `border-lgray-700`, `border-lgray-800` | Section/card dividers | `border-n-1` (matches the dashboard's bold divider weight — this is a deliberate identity trait, not a subtle-gray-divider look) |
| `lpurple-600`, `lpurple-700` (strong brand purple — buttons, primary icon fills, links) | Primary accent | `purple-1` (`#AE7AFF`) default, `purple-2` (`#8B62CC`) for hover/darker states — mirrors the dashboard's own `.btn-purple` pattern exactly |
| `lpurple-100`–`lpurple-500` (paler decorative accents — icon detail strokes, input borders/placeholders) | Light accent | `purple-3` (`#EFE4FF`) |
| `green-200`, `green-600` (the "Achieve impactful milestones" badge in `zigzag.tsx`) | Badge accent | `green-2` (`#EAFBEE`) background / `green-1` (`#98E9AB`)-derived text, the dashboard's own green tokens instead of default Tailwind green |

Where a single old token mapped to multiple roles (e.g. `lgray-700` used once as a text color and
once as a border color), preserve the *role* (text stays text-colored, border stays a border),
not a literal find-replace.

## Typography

- `font-inter` → `font-sans` (resolves to `var(--font-roboto)` via the dashboard's existing
  Tailwind config). This requires loading Roboto Flex in `app/layout.tsx` — currently the App
  Router root has no font loading at all. Match the dashboard's own loader in `pages/_app.tsx`
  exactly: `Roboto_Flex({ weight: ["400","500","700","800"], subsets: ["latin"], display: "block",
  variable: "--font-roboto" })`.
- `tracking-land-tight` (the one letter-spacing override) is dropped — the dashboard doesn't
  apply a custom tracking override anywhere; use the default.
- `text-land-lg` / `text-land-xl` become plain `text-lg` / `text-xl`. These were namespaced during
  the September merge specifically to preserve the landing page's *original* bare-string sizing
  (no explicit line-height) separate from the dashboard's own `fontSize` scale. Since the goal now
  is to adopt the dashboard's system, and the dashboard doesn't override `lg`/`xl` at all (they've
  always resolved to Tailwind's own default tuples, which do include line-heights), switching to
  the plain classes *is* adopting the dashboard's typographic approach — dropping the `land-`
  prefix is the correct move, not a workaround.
- Once every `text-land-lg`/`text-land-xl` and `tracking-land-tight` usage is gone, remove the now
  dead `land-lg`/`land-xl` (fontSize) and `land-tight` (letterSpacing) keys from
  `academix/tailwind.config.ts`. Do **not** remove the `land-sm`/`land-md`/`land-lg`/`land-xl`/
  `land-2xl` **screens** keys — those are unrelated (breakpoints, not sizes) and still needed.
  Similarly remove `lgray` and `lpurple` from `colors` once their usages are gone.

## Component treatment

- **Buttons:** replace manually-composed button classes (e.g.
  `btn text-white bg-lpurple-600 hover:bg-lpurple-700`) with the dashboard's actual button
  component classes — `.btn-purple` for primary CTAs (Join Now, Subscribe), `.btn-stroke` or
  `.btn-dark` for secondary ones (Learn more, Sign In), matching how the dashboard itself chooses
  between them contextually (primary action vs. secondary).
- **Cards/surfaces:** testimonial cards, the newsletter CTA box, and (optionally, if it reads
  better) the feature icon badges adopt the dashboard's `.card` treatment — white background,
  `border border-n-1`, hard offset shadow (`.shadow-primary-4` or `.shadow-primary-6` depending on
  size) — replacing the current flat `bg-lgray-800` boxes with no border/shadow.
- **Corners:** the dashboard's cards and buttons use sharp corners by design (no `rounded-*` in
  the `.card`/`.btn` plugin definitions). Drop `rounded-sm`/`rounded` on the newsletter email
  input and CTA elements to match. `rounded-full` usages stay exactly as they are — those are on
  inherently circular elements (social icon buttons, avatar images), a shape choice unrelated to
  the corner-radius styling this reskin is changing.
- **Header:** currently `absolute` positioned with a transparent background (works against a dark
  hero). Give it the same treatment as the dashboard's own header (`components/Header/index.tsx`):
  solid `bg-background` with a `border-b border-n-1`, so it reads correctly against the new light
  hero background.
- **Footer:** background/text colors follow the mapping table above; social icon buttons keep
  their `rounded-full` shape but swap `bg-lgray-800`/`text-lpurple-600`/hover states to the
  mapped tokens.

## Per-file scope

`academix/app/layout.tsx`, `app/(default)/layout.tsx`, `app/(default)/page.tsx`,
`app/(auth)/layout.tsx`, `app/(auth)/signup/page.tsx`, `app/(auth)/reset-password/page.tsx`,
`components/landing/banner.tsx`, `hero.tsx`, `features.tsx`, `newsletter.tsx`, `testimonials.tsx`,
`zigzag.tsx`, `modal-video.tsx` (if it carries any color classes worth checking),
`components/landing/ui/header.tsx`, `footer.tsx`, `mobile-menu.tsx`.

Correction from initial investigation: only `signup/page.tsx` uses `styled-components` (with its
own `lightTheme`/`darkTheme` JS objects) — `reset-password/page.tsx` actually uses plain Tailwind
classes (`lgray-*`/`lpurple-*`/`land-xl` etc.), same as the rest of the landing tree, and follows
the same color-mapping table as everything else. For `signup/page.tsx`, update only the
`lightTheme` object's hex values to the equivalent tokens (`background` → `#FAF4F0`,
`buttonBackground` → `#AE7AFF`, `buttonHoverBackground` → `#8B62CC`) plus the two hardcoded
`#7d00ff` accent references outside the theme object (the "X" in the logo, the "Recover password"
link) → `#8B62CC`. Leave `darkTheme` untouched — it's this page's own separate light/dark toggle
feature, unrelated to the site-wide dark theme this reskin removes.

## Verification

Same approach as the September merge work: `npm run dev` + manual checks (the codebase's
pre-existing, unrelated `npm run build` failures — see prior spec/ledger — are still not a usable
gate). Check the homepage, header/footer, and both stub auth pages render with the light
cream/purple palette and Roboto Flex, with no leftover dark-theme classes anywhere in the touched
files.
