"use client";

import { useId, useMemo, useState } from "react";
import { inputClass } from "@/components/ui/form";
import type { MealTypeId } from "@/content/schema";
import type { RecipeSummary } from "@/lib/recipes/catalog";
import { matchesQuery } from "@/lib/recipes/search";
import { formatMinutes } from "@/lib/text";
import { cn } from "@/lib/cn";

type RecipePickerProps = {
  recipes: RecipeSummary[];
  selected: string | null;
  onSelect: (slug: string) => void;
  /** Recipes for this meal are listed first. */
  preferMeal?: MealTypeId;
};

/** Searchable single-choice list of recipes, used by the planner. */
export function RecipePicker({ recipes, selected, onSelect, preferMeal }: RecipePickerProps) {
  const [query, setQuery] = useState("");
  const id = useId();
  const list = useMemo(() => {
    const filtered = recipes.filter((r) => matchesQuery(r.searchText, query));
    return preferMeal
      ? [...filtered].sort(
          (a, b) =>
            Number(b.mealTypes.includes(preferMeal)) - Number(a.mealTypes.includes(preferMeal)),
        )
      : filtered;
  }, [recipes, query, preferMeal]);

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className="text-sm font-medium">
        Find a recipe
      </label>
      <input
        id={id}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search recipes"
        className={inputClass}
        autoComplete="off"
      />
      <div
        role="radiogroup"
        aria-label="Recipes"
        className="border-line bg-surface flex max-h-72 flex-col gap-1 overflow-y-auto rounded-xl border p-1"
      >
        {list.length === 0 && (
          <p className="text-ink-muted p-3 text-sm">No recipes match “{query}”.</p>
        )}
        {list.map((r) => (
          <label
            key={r.slug}
            className={cn(
              "hover:bg-sand flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5",
              selected === r.slug && "bg-terracotta-50",
            )}
          >
            <input
              type="radio"
              name={`${id}-recipe`}
              checked={selected === r.slug}
              onChange={() => onSelect(r.slug)}
              className="accent-terracotta-600 size-4"
            />
            <span className="flex-1">
              <span className="block font-medium">{r.title}</span>
              <span className="text-ink-muted text-sm">
                {r.cuisineName} · {formatMinutes(r.totalMinutes)}
              </span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
