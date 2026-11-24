import type { RecipeSummary } from "./catalog";

export type PantryMatch = {
  recipe: RecipeSummary;
  /** Key ingredients you have. */
  matched: string[];
  /** Key ingredients you don't have. */
  missing: string[];
  /** matched ÷ key ingredients, 0–1. */
  score: number;
};

export type PantryGroups = {
  complete: PantryMatch[];
  almost: PantryMatch[];
  partial: PantryMatch[];
};

/**
 * Ranks recipes by how many of their key ingredients you have. Staples (salt, pepper, oil, water)
 * and optional ingredients are left out, so "you have everything" means every required,
 * non-staple ingredient — never more than that.
 */
export function matchPantry(recipes: RecipeSummary[], have: string[]): PantryGroups {
  const owned = new Set(have);
  const groups: PantryGroups = { complete: [], almost: [], partial: [] };
  if (owned.size === 0) return groups;

  for (const recipe of recipes) {
    const matched = recipe.keyIngredients.filter((i) => owned.has(i));
    if (matched.length === 0) continue;
    const missing = recipe.keyIngredients.filter((i) => !owned.has(i));
    const match = {
      recipe,
      matched,
      missing,
      score: matched.length / recipe.keyIngredients.length,
    };
    if (missing.length === 0) groups.complete.push(match);
    else if (missing.length <= 2) groups.almost.push(match);
    else groups.partial.push(match);
  }

  const order = (a: PantryMatch, b: PantryMatch) =>
    b.score - a.score ||
    a.missing.length - b.missing.length ||
    a.recipe.title.localeCompare(b.recipe.title);
  groups.complete.sort(order);
  groups.almost.sort(order);
  groups.partial.sort(order);
  return groups;
}
