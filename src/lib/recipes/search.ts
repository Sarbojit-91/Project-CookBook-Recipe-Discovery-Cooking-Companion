import type { Difficulty, MealTypeId } from "@/content/schema";
import { normalize, singular } from "@/lib/text";
import type { RecipeSummary } from "./catalog";
import { isVegetarian } from "./diet";

export const TIME_OPTIONS = [
  { value: "15", label: "15 min or less" },
  { value: "30", label: "30 min or less" },
  { value: "60", label: "1 hour or less" },
] as const;

export const DIET_OPTIONS = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegetarian-no-egg", label: "Vegetarian, no egg" },
  { value: "vegan", label: "Vegan" },
  { value: "pescatarian", label: "Pescatarian" },
  { value: "non-vegetarian", label: "Non-vegetarian" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "quickest", label: "Quickest" },
  { value: "az", label: "A–Z" },
] as const;

export type DietFilter = (typeof DIET_OPTIONS)[number]["value"];
export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export type RecipeFilters = {
  q: string;
  cuisine: string | null;
  meal: MealTypeId | null;
  time: number | null;
  difficulty: Difficulty | null;
  diet: DietFilter | null;
  sort: SortOption;
};

export const EMPTY_FILTERS: RecipeFilters = {
  q: "",
  cuisine: null,
  meal: null,
  time: null,
  difficulty: null,
  diet: null,
  sort: "newest",
};

const MEALS: MealTypeId[] = ["breakfast", "lunch", "dinner", "snack", "dessert"];
const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

function oneOf<T extends string>(value: string | null, allowed: readonly T[]): T | null {
  return value && (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

/** Reads filters from the URL, ignoring anything unrecognised. */
export function parseFilters(params: URLSearchParams): RecipeFilters {
  const time = Number(params.get("time"));
  return {
    q: (params.get("q") ?? "").slice(0, 100),
    cuisine: params.get("cuisine") || null,
    meal: oneOf(params.get("meal"), MEALS),
    time: [15, 30, 60].includes(time) ? time : null,
    difficulty: oneOf(params.get("difficulty"), DIFFICULTIES),
    diet: oneOf(
      params.get("diet"),
      DIET_OPTIONS.map((d) => d.value),
    ),
    sort:
      oneOf(
        params.get("sort"),
        SORT_OPTIONS.map((s) => s.value),
      ) ?? "newest",
  };
}

export function serializeFilters(filters: RecipeFilters): string {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set("q", filters.q.trim());
  if (filters.cuisine) params.set("cuisine", filters.cuisine);
  if (filters.meal) params.set("meal", filters.meal);
  if (filters.time) params.set("time", String(filters.time));
  if (filters.difficulty) params.set("difficulty", filters.difficulty);
  if (filters.diet) params.set("diet", filters.diet);
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  return params.toString();
}

export function countActiveFilters(filters: RecipeFilters): number {
  return [filters.cuisine, filters.meal, filters.time, filters.difficulty, filters.diet].filter(
    Boolean,
  ).length;
}

export function matchesDiet(recipe: Pick<RecipeSummary, "diet" | "containsEgg">, diet: DietFilter) {
  switch (diet) {
    case "vegetarian":
      return isVegetarian(recipe.diet);
    case "vegetarian-no-egg":
      return isVegetarian(recipe.diet) && !recipe.containsEgg;
    case "vegan":
      return recipe.diet === "vegan";
    case "pescatarian":
      return recipe.diet !== "non-vegetarian";
    case "non-vegetarian":
      return recipe.diet === "non-vegetarian";
  }
}

/** Every word in the query must appear (as a word prefix) in the recipe's search text. */
export function matchesQuery(searchText: string, query: string): boolean {
  const words = normalize(query).split(" ").filter(Boolean);
  if (words.length === 0) return true;
  const haystack = ` ${searchText}`;
  return words.every((w) => haystack.includes(` ${w}`) || haystack.includes(` ${singular(w)}`));
}

export function filterRecipes(list: RecipeSummary[], filters: RecipeFilters): RecipeSummary[] {
  const result = list.filter(
    (r) =>
      matchesQuery(r.searchText, filters.q) &&
      (!filters.cuisine || r.cuisine === filters.cuisine) &&
      (!filters.meal || r.mealTypes.includes(filters.meal)) &&
      (!filters.time || r.totalMinutes <= filters.time) &&
      (!filters.difficulty || r.difficulty === filters.difficulty) &&
      (!filters.diet || matchesDiet(r, filters.diet)),
  );
  return sortRecipes(result, filters.sort);
}

export function sortRecipes(list: RecipeSummary[], sort: SortOption): RecipeSummary[] {
  const copy = [...list];
  switch (sort) {
    case "quickest":
      return copy.sort((a, b) => a.totalMinutes - b.totalMinutes || a.title.localeCompare(b.title));
    case "az":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "newest":
      return copy.sort(
        (a, b) => b.addedAt.localeCompare(a.addedAt) || a.title.localeCompare(b.title),
      );
  }
}
