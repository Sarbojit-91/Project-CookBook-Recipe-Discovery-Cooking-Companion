# CookBook – Recipe Discovery & Cooking Companion

A warm, mobile-first website for discovering recipes, cooking step by step, planning the week and
keeping a personal recipe collection. Free to build and run: no paid APIs or services.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4
- Supabase Free (accounts and personal data only, from Phase 6)
- Recipe content: original recipes kept as typed files in this repository (from Phase 2)
- Testing: Vitest + Testing Library (unit/component), Playwright + axe (end-to-end, accessibility)

## Getting started

Requires Node.js 22 or newer.

```bash
npm install
npm run dev          # http://localhost:3000
```

Copy `.env.example` to `.env.local` once Supabase is set up (Phase 6). Never commit `.env.local`.

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
| `npm run check`        | Lint, typecheck, format check and unit tests in one |

First-time Playwright setup: `npx playwright install chromium`.

## Project layout

```
src/app/          Routes (App Router). Unit tests sit next to the code as *.test.ts(x).
src/components/   Shared UI components            (Phase 1)
src/lib/          Logic: search, units, scaling   (Phase 2+)
src/content/      Recipe, ingredient and cuisine data (Phase 2)
e2e/              Playwright tests
```

## Content and image licensing

All recipe text is original to this project. Photos come from Unsplash or Pexels under their
licences; each photo's photographer, source URL and licence are stored with the recipe and listed on
the credits page. No scraping, no paid recipe APIs.
