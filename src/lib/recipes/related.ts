import type { RecipeSummary } from "./catalog";

/**
 * Recipes most like `recipe`: same cuisine counts most, then shared meal types and shared key
 * ingredients. Ties go to the newer recipe.
 */
export function relatedRecipes(
  recipe: RecipeSummary,
  all: RecipeSummary[],
  limit = 4,
): RecipeSummary[] {
  const key = new Set(recipe.keyIngredients);
  return all
    .filter((r) => r.slug !== recipe.slug)
    .map((r) => ({
      r,
      score:
        (r.cuisine === recipe.cuisine ? 3 : 0) +
        r.mealTypes.filter((m) => recipe.mealTypes.includes(m)).length +
        r.keyIngredients.filter((i) => key.has(i)).length * 0.5 +
        (r.diet === recipe.diet ? 0.5 : 0),
    }))
    .sort((a, b) => b.score - a.score || b.r.addedAt.localeCompare(a.r.addedAt))
    .slice(0, limit)
    .map(({ r }) => r);
}
