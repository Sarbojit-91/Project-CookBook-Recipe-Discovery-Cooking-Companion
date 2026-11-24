import { matchesDiet } from "./search";
import type { RecipeSummary } from "./catalog";

/**
 * Simple, explainable recommendations from a user's favourites: cuisines and meal types they
 * save often, matching their usual diet. Returns nothing until there are 3 favourites.
 */
export function recommend(
  all: RecipeSummary[],
  favouriteSlugs: string[],
  limit = 4,
  preference: "" | "vegetarian" | "vegan" | "pescatarian" = "",
): RecipeSummary[] {
  const favs = all.filter((r) => favouriteSlugs.includes(r.slug));
  if (favs.length < 3) return [];
  const count = <T>(values: T[]) =>
    values.reduce((m, v) => m.set(v, (m.get(v) ?? 0) + 1), new Map<T, number>());
  const cuisines = count(favs.map((r) => r.cuisine));
  const meals = count(favs.flatMap((r) => r.mealTypes));
  const allVeg = favs.every((r) => r.diet === "vegan" || r.diet === "vegetarian");
  return all
    .filter((r) => !favouriteSlugs.includes(r.slug))
    .filter((r) => !allVeg || r.diet === "vegan" || r.diet === "vegetarian")
    .filter((r) => !preference || matchesDiet(r, preference))
    .map((r) => ({
      r,
      score:
        (cuisines.get(r.cuisine) ?? 0) * 2 +
        r.mealTypes.reduce((s, m) => s + (meals.get(m) ?? 0), 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.r.addedAt.localeCompare(a.r.addedAt))
    .slice(0, limit)
    .map((x) => x.r);
}
