import { content, imageManifest } from "@/content";
import type { RecipeWithMeta } from "@/content";
import type { Cuisine, Ingredient, MealType, MealTypeId, Season } from "@/content/schema";
import { normalize } from "@/lib/text";
import type { DietLabel } from "./diet";

export const recipes = content.recipes;
export const cuisines = content.cuisines;
export const mealTypes = content.mealTypes;
export const ingredients = content.ingredients;

const recipeBySlug = new Map(recipes.map((r) => [r.slug, r]));
const ingredientById = new Map(ingredients.map((i) => [i.id, i]));
const cuisineById = new Map(cuisines.map((c) => [c.id, c]));
const mealTypeById = new Map(mealTypes.map((m) => [m.id, m]));

export function getRecipe(slug: string): RecipeWithMeta | undefined {
  return recipeBySlug.get(slug);
}

export function getIngredient(id: string): Ingredient | undefined {
  return ingredientById.get(id);
}

export function getCuisine(id: string): Cuisine | undefined {
  return cuisineById.get(id);
}

export function getMealType(id: string): MealType | undefined {
  return mealTypeById.get(id as MealTypeId);
}

export type RecipeImageData = {
  src: string;
  avifSrcSet: string;
  webpSrcSet: string;
  width: number;
  height: number;
  placeholder: string;
  alt: string;
  credit: { photographer: string; sourceUrl: string; license: string };
};

export function getRecipeImage(recipe: RecipeWithMeta): RecipeImageData | null {
  if (!recipe.image) return null;
  const entry = imageManifest[recipe.image.file];
  if (!entry) return null;
  const base = `/images/recipes/${recipe.image.file.replace(/\.[^.]+$/, "")}`;
  const srcSet = (ext: string) => entry.widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(", ");
  const middle = entry.widths[Math.min(1, entry.widths.length - 1)];
  return {
    src: `${base}-${middle}.webp`,
    avifSrcSet: srcSet("avif"),
    webpSrcSet: srcSet("webp"),
    width: entry.width,
    height: entry.height,
    placeholder: entry.placeholder,
    alt: recipe.image.alt,
    credit: recipe.image.credit,
  };
}

/**
 * The slice of a recipe that list views and client-side search need. Kept small because it is
 * sent to the browser for every recipe.
 */
export type RecipeSummary = {
  slug: string;
  title: string;
  description: string;
  cuisine: string;
  cuisineName: string;
  mealTypes: MealTypeId[];
  difficulty: RecipeWithMeta["difficulty"];
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  totalMinutes: number;
  diet: DietLabel;
  containsEgg: boolean;
  seasons: Season[];
  tags: string[];
  addedAt: string;
  featured: boolean;
  image: RecipeImageData | null;
  /** Required, non-staple ingredient ids — what pantry search matches against. */
  keyIngredients: string[];
  /** Optional ingredient ids. */
  optionalIngredients: string[];
  /** Normalised text for search: title, cuisine, tags and ingredient names/aliases. */
  searchText: string;
};

export function toSummary(recipe: RecipeWithMeta): RecipeSummary {
  const lineIds = (optional: boolean) => [
    ...new Set(
      recipe.ingredients
        .filter((l) => l.optional === optional && !getIngredient(l.ingredient)?.staple)
        .map((l) => l.ingredient),
    ),
  ];
  const key = lineIds(false);
  const cuisineName = getCuisine(recipe.cuisine)?.name ?? recipe.cuisine;
  const ingredientWords = recipe.ingredients.flatMap((l) => {
    const i = getIngredient(l.ingredient);
    return i ? [i.name, i.plural ?? "", ...i.aliases] : [];
  });
  return {
    slug: recipe.slug,
    title: recipe.title,
    description: recipe.description,
    cuisine: recipe.cuisine,
    cuisineName,
    mealTypes: recipe.mealTypes,
    difficulty: recipe.difficulty,
    servings: recipe.servings,
    prepMinutes: recipe.prepMinutes,
    cookMinutes: recipe.cookMinutes,
    totalMinutes: recipe.totalMinutes,
    diet: recipe.diet,
    containsEgg: recipe.containsEgg,
    seasons: recipe.seasons,
    tags: recipe.tags,
    addedAt: recipe.addedAt,
    featured: recipe.featured,
    image: getRecipeImage(recipe),
    keyIngredients: key,
    optionalIngredients: lineIds(true).filter((id) => !key.includes(id)),
    searchText: normalize(
      [recipe.title, cuisineName, recipe.description, ...recipe.tags, ...ingredientWords].join(" "),
    ),
  };
}

export const summaries: RecipeSummary[] = recipes.map(toSummary);

export function getSummary(slug: string): RecipeSummary | undefined {
  return summaries.find((s) => s.slug === slug);
}

/** Newest first. */
export function byNewest(a: { addedAt: string }, b: { addedAt: string }): number {
  return b.addedAt.localeCompare(a.addedAt);
}
