# CookBook – Implementation Plan (approved 2026-11-24)

Source of truth for scope and decisions. Update it when a decision changes.

## Status

- [x] Phase 0 — Project setup
- [x] Phase 1 — Design system and layout (tokens, fonts, header, mobile tab bar, base UI, 404/error/loading)
- [x] Phase 2 — Content schema + validation, ingredients, image pipeline, 12 recipes (photos pending)
- [ ] Phase 3 — Discovery: home, `/recipes`, recipe page, landing pages ← next
- [ ] Phases 4–11 (see below)

## Key decisions

- **Recipe data:** original recipes written for this project, stored as typed files in the repo
  (`src/content/`), validated with Zod at build time. **Not TheMealDB** — its free key is for
  development/education only and production access costs $10 (breaks the free-only rule); its image
  rights are mixed.
- **Images:** downloaded manually from Unsplash / Pexels under their licences (free, commercial use
  allowed, no attribution required). Store photographer, source URL and licence per image and list
  them on `/credits`. Avoid identifiable people and brands. Pre-generate AVIF/WebP sizes at build
  time; serve from the site (do not rely on Vercel image optimisation — 5K/month on Hobby). Do not
  use the Unsplash API (requires hotlinking + download tracking).
- **Backend:** Supabase Free for auth and personal data only. Public recipe pages must not depend on
  Supabase (free projects pause after 1 week of inactivity; over-quota = restricted, not billed).
- **Hosting:** Vercel Hobby only if the site is personal and non-commercial (Hobby terms). If it may
  earn money: Cloudflare Workers/Pages free plan via OpenNext.
- **No fake data:** no nutrition in v1; "Popular" sort/section only once favourite counts are
  meaningful (until then "Editor's picks"). Diet labels derived from ingredient flags. No
  allergen-free claims.
- **Libraries:** keep minimal. Planned additions: `zod` (Phase 2), `lucide-react` (Phase 1),
  `@supabase/supabase-js` + `@supabase/ssr` (Phase 6). No UI kits, state libs, DnD libs, analytics.
- **Fonts:** Fraunces (headings) + Inter (body) via `next/font`.
- **Look:** warm off-white background, charcoal text, terracotta accent, sage secondary; large
  photography; subtle motion honouring `prefers-reduced-motion`; WCAG 2.2 AA.

- **Theme:** light only in v1 (warm dark theme is a later release).

## Resolved questions (user approved defaults, 2026-11-24)

1. **Personal, non-commercial** → host on Vercel Hobby. Revisit (Cloudflare + OpenNext) if that
   changes.
2. **Eggs count as vegetarian** (Western convention), with a separate "contains egg" filter.
   **Units:** metric first, US cups/spoons shown alongside.
3. **Sign-in:** email + password only.
4. **Cuisines:** broad mix — Indian, Italian, Mexican, Thai, Mediterranean, Chinese, Japanese,
   British.

## Pages

| Route                                                     | Purpose                                                                                                                | Auth           |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------- |
| `/`                                                       | Hero search, featured, popular\*, recent, by cuisine, by meal type, quick (≤30 min), seasonal, recommended (signed in) | No             |
| `/recipes`                                                | Search + filters + sort, state in URL                                                                                  | No             |
| `/recipes/[slug]`                                         | Recipe details                                                                                                         | No (save: yes) |
| `/recipes/[slug]/cook`                                    | Cooking mode                                                                                                           | No             |
| `/pantry`                                                 | Ingredient-based search                                                                                                | No             |
| `/cuisines/[c]`, `/meals/[t]`, `/collections/[seasonal]`  | Landing pages                                                                                                          | No             |
| `/login`, `/signup`, `/forgot-password`, `/auth/callback` | Auth                                                                                                                   | —              |
| `/saved`                                                  | Favourites, collections/folders, notes                                                                                 | Yes            |
| `/planner`                                                | Weekly meal planner                                                                                                    | Yes            |
| `/shopping-list`                                          | Shopping list                                                                                                          | Yes            |
| `/account`                                                | Profile, diet prefs, sign out, delete account                                                                          | Yes            |
| `/about`, `/credits`, `/privacy`, error/404/loading       | Info and fallbacks                                                                                                     | No             |

Navigation: desktop header (Browse · Pantry · Planner · List · Saved · search · account); mobile
bottom tab bar (Home, Browse, Pantry, Planner, List).

## Feature rules

- **Filters:** name, ingredient, cuisine, meal type, total time buckets, difficulty, diets, veg/non-veg.
  **Sort:** newest (`added_at`), quickest (`total_min`), popular (only when data is meaningful).
- **Recommendations:** rule-based from favourites' cuisines/diets; signed in with ≥3 favourites.
- **Recipe page:** servings scaler, grouped ingredients with checkboxes, numbered steps, photo
  credit, related recipes, favourite / collection / plan / shopping-list actions.
- **Pantry search:** score = owned required ingredients ÷ required ingredients; optional items and
  staples (salt, pepper, oil, water) excluded from the score. Groups: "have everything",
  "missing 1–2", "uses some". Always show matched and missing ingredients explicitly.
- **Collections:** one level of folders; one private note per user per recipe; undo toasts.
- **Planner:** Mon–Sun (configurable start), slots breakfast/lunch/dinner/snack, per-entry servings,
  day view on mobile, "Generate shopping list".
- **Shopping list:** merge only within the same dimension (mass / volume / count) — never
  mass↔volume. Unmergeable lines stay separate ("200 g + 1 cup"). Grouped by aisle; mark bought;
  clear bought; manual items; remembers source recipes.
- **Cooking mode:** one step per screen, big controls, swipe + arrow keys, per-step ingredients,
  multiple concurrent timers (sound, optional notification), Wake Lock, resume last step.

## Data model

Recipe content (repo files): `cuisines`, `meal_types`, `ingredients` (name, plural, aliases, aisle,
unit_dimension, flags: meat/fish/egg/dairy/gluten/nuts…), `recipes` (slug, title, description,
image{src, alt, credit, source_url, license}, prep/cook/total min, servings, difficulty, cuisine,
meal_types, tags, season_tags, added_at, featured, nutrition = null), `recipe_ingredients`
(quantity, unit, preparation, group, optional, position), `recipe_steps` (position, text,
timer_seconds, ingredient_refs).

Personal data (Supabase, RLS on every table, referencing recipes by `recipe_slug` validated
server-side):

```
profiles(id → auth.users, display_name, dietary_prefs[], week_starts_on, created_at)
favourites(user_id, recipe_slug, created_at)                       PK(user_id, recipe_slug)
collection_folders(id, user_id, name, position, created_at)
collections(id, user_id, folder_id?, name, description, created_at)
collection_recipes(collection_id, recipe_slug, added_at)           PK(collection_id, recipe_slug)
recipe_notes(user_id, recipe_slug, body ≤5000, updated_at)          PK(user_id, recipe_slug)
meal_plans(id, user_id, week_start)                                 UNIQUE(user_id, week_start)
meal_plan_entries(id, meal_plan_id, day 0–6, slot, recipe_slug, servings, position)
shopping_lists(id, user_id, name, created_at)
shopping_list_items(id, list_id, ingredient_id?, name, quantity?, unit?, aisle, is_purchased,
                    source_recipe_slugs[], created_at)
```

All cascade from `auth.users`. Popularity via a security-definer function returning counts only.

## Security

`@supabase/ssr` cookie sessions; server-side auth checks on protected routes; RLS
`user_id = auth.uid()` (child tables via `EXISTS` on parent); Zod validation in every Server Action
plus DB check constraints; notes rendered as plain text; CSP and security headers; only the public
anon key in the app — never the service-role key. Graceful degradation when Supabase is unavailable.

## Phases

| #   | Phase                                                                    | Size |
| --- | ------------------------------------------------------------------------ | ---- |
| 0   | Setup (git, Next.js, TS, Tailwind, ESLint, Prettier, Vitest, Playwright) | S ✓  |
| 1   | Design system, layout, header, mobile tab bar, base components           | M    |
| 2   | Content schema + validation, ingredient list, image pipeline, 12 recipes | M    |
| 3   | Discovery: home, `/recipes`, recipe page, landing pages                  | L    |
| 4   | Pantry search                                                            | M    |
| 5   | Cooking mode + timers                                                    | M    |
| 6   | Supabase, migrations + RLS, auth pages, profile                          | M    |
| 7   | Favourites, collections, notes, `/saved`                                 | M    |
| 8   | Weekly planner                                                           | M    |
| 9   | Shopping list                                                            | M    |
| 10  | Remaining recipes (~48), credits, SEO, error/empty states                | M    |
| 11  | Accessibility + performance pass, e2e, deploy                            | M    |

## Testing

Unit (units merging, scaling, pantry scoring, filters, diet derivation, schemas); build-time
content validation; component tests; RLS tests with two users against local Supabase; Playwright
journeys on mobile + desktop; axe on every page; Lighthouse targets LCP < 2.5 s, CLS < 0.1,
INP < 200 ms.

## Later releases

Nutrition estimates from USDA FoodData Central; guest mode with migration; offline cooking mode
(PWA); metric/US toggle; shared collections/lists; print views; user-submitted recipes; ratings;
planner drag-and-drop; voice control; extra OAuth providers.
