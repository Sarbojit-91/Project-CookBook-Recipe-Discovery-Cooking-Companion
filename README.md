# CookBook – Recipe Discovery & Cooking Companion

A warm, mobile-first website for discovering recipes, cooking step by step, planning the week and
keeping a personal recipe collection. Free to build and run: no paid APIs or services.

## Features

- **Discover** — home page with editor's picks, quick recipes, seasonal picks, recently added,
  browse by cuisine and meal, and recommendations once you've saved a few favourites.
- **Browse & search** (`/recipes`) — search by dish, ingredient (including aliases like
  "cilantro") or cuisine; filter by cuisine, meal, time, difficulty and diet (vegetarian,
  vegetarian without egg, vegan, pescatarian, non-veg); sort by newest, quickest or A–Z. Filters
  live in the URL so results can be shared.
- **Recipe pages** — times, servings scaler (metric with US equivalents), ingredient checklist,
  numbered method with timers, tips, allergen notes, private notes, related recipes, and buttons
  to save, add to a collection, add to the meal plan or add to the shopping list.
- **Pantry search** (`/pantry`) — enter what you have; recipes are grouped into "you have
  everything", "missing one or two" and "uses some", always listing matched and missing items.
- **Cooking mode** — one step per screen, big buttons, swipe and arrow keys, the ingredients each
  step needs, several timers at once with sound/vibration/notification, screen kept awake, and
  resume where you left off.
- **Saved** — favourites, collections, folders and notes.
- **Meal planner** — breakfast, lunch, dinner and snacks for each day; change or remove meals;
  generate a shopping list for the week.
- **Shopping list** — manual items, items from recipes and plans, safe merging (never grams with
  cups), grouped by aisle, tick off, undo, copy as text.
- **Accounts (optional)** — without configuration everything is saved on the device. Add a free
  Supabase project to sync across devices with email sign-in.

## Stack

- Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS v4
- Recipe content: original recipes as typed files in `src/content/`, validated with Zod
- Supabase Free (optional): auth + personal data, protected by row-level security
- Testing: Vitest + Testing Library, Playwright + axe

## Getting started

Requires Node.js 22 or newer.

```bash
npm install
npm run dev          # http://localhost:3000
```

The site works fully without any environment variables (personal data is stored in the browser).

## Optional: accounts with Supabase (free)

1. Create a project at [supabase.com](https://supabase.com) on the **Free** plan (no card needed).
2. In the SQL editor, run `supabase/migrations/20261124000000_personal_data.sql`.
3. In **Authentication → URL configuration**, set the Site URL to your site and add
   `https://your-site/auth/callback` and `https://your-site/reset-password` as redirect URLs
   (plus the `http://localhost:3000/...` equivalents for local development).
4. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (the public anon/publishable key — **never** the service-role
   key). Restart `npm run dev`.

Free projects pause after about a week without activity; recipe pages keep working because they
don't use Supabase. Things saved on a device before signing up stay on that device.

## Scripts

| Script                 | What it does                                        |
| ---------------------- | --------------------------------------------------- |
| `npm run dev`          | Start the dev server                                |
| `npm run build`        | Production build                                    |
| `npm run start`        | Serve the production build                          |
| `npm run lint`         | ESLint                                              |
| `npm run typecheck`    | TypeScript type check                               |
| `npm run format`       | Format all files with Prettier                      |
| `npm run format:check` | Check formatting without changing files             |
| `npm test`             | Unit and component tests (Vitest)                   |
| `npm run test:watch`   | Vitest in watch mode                                |
| `npm run test:e2e`     | End-to-end and accessibility tests (Playwright)     |
| `npm run images`       | Generate AVIF/WebP sizes for new recipe photos      |
| `npm run images:check` | Fail if generated photos are missing or stale       |
| `npm run check`        | Lint, typecheck, format, image check and unit tests |

First-time Playwright setup: `npx playwright install chromium`.

## Project layout

```
src/app/(site)/      Pages with the header, footer and mobile tab bar
src/app/(focus)/     Cooking mode (full screen)
src/components/      UI, grouped by feature (recipes, planner, shopping, …)
src/content/         Recipes (one file each), ingredients, cuisines; validated on import
src/content/images/  Source photos — read the README there before adding one
src/lib/             Logic: search, units, scaling, pantry matching, personal data
supabase/migrations/ Database schema and row-level security for accounts
scripts/             build-images.mjs (photo pipeline)
e2e/                 Playwright journeys and accessibility checks
```

## Adding a recipe

Create `src/content/recipes/<slug>.ts` (copy an existing one), add any new ingredients to
`src/content/ingredients.ts` with complete flags, and list the recipe in
`src/content/recipes/index.ts`. `npm test` and `npm run build` fail with a clear list of problems
if anything is inconsistent.

## Deploying

Vercel Hobby (free) suits a personal, non-commercial site; Cloudflare Workers via OpenNext is the
free option if the site may earn money. Set `NEXT_PUBLIC_SITE_URL`, and the Supabase variables if
you use accounts.

## Content and image licensing

All recipe text is original to this project. Photos may only come from Unsplash or Pexels under
their licences (or be your own); each photo's photographer, source URL and licence are stored with
the recipe and listed on `/credits`. No scraping, no paid recipe APIs.
