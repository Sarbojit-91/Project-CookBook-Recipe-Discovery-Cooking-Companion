"use client";

import { SlidersHorizontal, SearchX, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { RecipeCard, RecipeGrid } from "@/components/recipes/recipe-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { inputClass, labelClass, selectClass } from "@/components/ui/form";
import type { Cuisine, MealType } from "@/content/schema";
import type { RecipeSummary } from "@/lib/recipes/catalog";
import {
  countActiveFilters,
  DIET_OPTIONS,
  EMPTY_FILTERS,
  filterRecipes,
  parseFilters,
  serializeFilters,
  SORT_OPTIONS,
  TIME_OPTIONS,
  type RecipeFilters,
} from "@/lib/recipes/search";
import { cn } from "@/lib/cn";

type RecipeBrowserProps = {
  recipes: RecipeSummary[];
  cuisines: Cuisine[];
  mealTypes: MealType[];
};

export function RecipeBrowser({ recipes, cuisines, mealTypes }: RecipeBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const filters = useMemo(() => parseFilters(new URLSearchParams(params.toString())), [params]);
  const [query, setQuery] = useState(filters.q);
  const [showFilters, setShowFilters] = useState(false);
  const ids = { q: useId(), panel: useId() };

  // Always build on the latest filters, even from a delayed (debounced) update.
  const latest = useRef(filters);
  useEffect(() => {
    latest.current = filters;
  }, [filters]);

  const update = (patch: Partial<RecipeFilters>) => {
    const next = { ...latest.current, ...patch };
    latest.current = next;
    const qs = serializeFilters(next);
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // Debounce typing into the URL so history and rendering stay smooth.
  useEffect(() => {
    if (query === filters.q) return;
    const t = window.setTimeout(() => update({ q: query }), 250);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const results = useMemo(() => filterRecipes(recipes, filters), [recipes, filters]);
  const active = countActiveFilters(filters);

  const filterFields = (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <Field label="Cuisine">
        {(id) => (
          <select
            id={id}
            className={selectClass}
            value={filters.cuisine ?? ""}
            onChange={(e) => update({ cuisine: e.target.value || null })}
          >
            <option value="">Any cuisine</option>
            {cuisines.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field label="Meal">
        {(id) => (
          <select
            id={id}
            className={selectClass}
            value={filters.meal ?? ""}
            onChange={(e) => update({ meal: (e.target.value || null) as RecipeFilters["meal"] })}
          >
            <option value="">Any meal</option>
            {mealTypes.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field label="Time">
        {(id) => (
          <select
            id={id}
            className={selectClass}
            value={filters.time ?? ""}
            onChange={(e) => update({ time: e.target.value ? Number(e.target.value) : null })}
          >
            <option value="">Any time</option>
            {TIME_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field label="Difficulty">
        {(id) => (
          <select
            id={id}
            className={selectClass}
            value={filters.difficulty ?? ""}
            onChange={(e) =>
              update({ difficulty: (e.target.value || null) as RecipeFilters["difficulty"] })
            }
          >
            <option value="">Any difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        )}
      </Field>
      <Field label="Diet">
        {(id) => (
          <select
            id={id}
            className={selectClass}
            value={filters.diet ?? ""}
            onChange={(e) => update({ diet: (e.target.value || null) as RecipeFilters["diet"] })}
          >
            <option value="">Any diet</option>
            {DIET_OPTIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        )}
      </Field>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor={ids.q} className={labelClass}>
            Search recipes
          </label>
          <input
            id={ids.q}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Dish, ingredient or cuisine"
            className={cn(inputClass, "h-12")}
            autoComplete="off"
          />
        </div>
        <Button
          variant="secondary"
          className="h-12 lg:hidden"
          aria-expanded={showFilters}
          aria-controls={ids.panel}
          onClick={() => setShowFilters((v) => !v)}
        >
          <SlidersHorizontal aria-hidden className="size-4" />
          Filters{active > 0 && ` (${active})`}
        </Button>
      </div>

      <div
        id={ids.panel}
        className={cn(
          "border-line bg-surface rounded-(--radius-card) border p-4 lg:block",
          !showFilters && "hidden",
        )}
      >
        {filterFields}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-ink-muted text-sm">
          {results.length} {results.length === 1 ? "recipe" : "recipes"}
          {filters.q && (
            <>
              {" "}
              for “<span className="text-ink font-medium">{filters.q}</span>”
            </>
          )}
        </p>
        <div className="flex items-center gap-3">
          {(active > 0 || filters.q) && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                update({ ...EMPTY_FILTERS, sort: filters.sort });
              }}
              className="text-terracotta-700 hover:bg-terracotta-50 inline-flex h-10 items-center gap-1 rounded-full px-3 text-sm font-medium"
            >
              <X aria-hidden className="size-4" />
              Clear all
            </button>
          )}
          <label className="flex items-center gap-2 text-sm">
            <span className="text-ink-muted">Sort</span>
            <select
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value as RecipeFilters["sort"] })}
              className={cn(selectClass, "h-10 w-auto")}
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {results.length > 0 ? (
        <RecipeGrid>
          {results.map((r) => (
            <RecipeCard key={r.slug} recipe={r} headingLevel="h2" />
          ))}
        </RecipeGrid>
      ) : (
        <EmptyState
          icon={SearchX}
          title="No recipes match"
          description="Try a different word, or remove a filter or two."
          action={
            <Button
              onClick={() => {
                setQuery("");
                update(EMPTY_FILTERS);
              }}
            >
              Clear search and filters
            </Button>
          }
        />
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: (id: string) => React.ReactNode }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children(id)}
    </div>
  );
}
