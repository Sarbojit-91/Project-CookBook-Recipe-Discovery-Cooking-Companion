import { z } from "zod";
import { deriveDiet, type DietInfo } from "@/lib/recipes/diet";
import {
  cuisineSchema,
  ingredientSchema,
  mealTypeSchema,
  recipeSchema,
  type Cuisine,
  type Ingredient,
  type MealType,
  type Recipe,
} from "./schema";

export type ImageManifestEntry = {
  width: number;
  height: number;
  /** Generated widths available as /images/recipes/{name}-{w}.{avif,webp}. */
  widths: number[];
  /** Tiny blurred placeholder as a data URL. */
  placeholder: string;
  /** Hash of the source file, used to detect stale output. */
  hash: string;
};

export type ImageManifest = Record<string, ImageManifestEntry>;

export type RecipeWithMeta = Recipe & DietInfo;

export type Content = {
  cuisines: Cuisine[];
  mealTypes: MealType[];
  ingredients: Ingredient[];
  recipes: RecipeWithMeta[];
};

export class ContentError extends Error {
  constructor(public readonly problems: string[]) {
    super(`Recipe content is invalid:\n${problems.map((p) => `  • ${p}`).join("\n")}`);
    this.name = "ContentError";
  }
}

type RawContent = {
  cuisines: unknown[];
  mealTypes: unknown[];
  ingredients: unknown[];
  recipes: unknown[];
  images: ImageManifest;
};

function parseAll<T>(schema: z.ZodType<T>, items: unknown[], label: string, problems: string[]) {
  const out: T[] = [];
  items.forEach((item, index) => {
    const result = schema.safeParse(item);
    if (result.success) {
      out.push(result.data);
    } else {
      const id = (item as { slug?: string; id?: string })?.slug ?? (item as { id?: string })?.id;
      for (const issue of result.error.issues) {
        problems.push(
          `${label} ${id ?? `#${index}`}: ${issue.path.join(".") || "(root)"} — ${issue.message}`,
        );
      }
    }
  });
  return out;
}

function findDuplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const v of values) (seen.has(v) ? dupes : seen).add(v);
  return [...dupes];
}

/**
 * Validates all recipe content and the links between items. Collects every problem before
 * throwing, so one build run reports everything that needs fixing.
 */
export function validateContent(raw: RawContent): Content {
  const problems: string[] = [];

  const cuisines = parseAll(cuisineSchema, raw.cuisines, "Cuisine", problems);
  const mealTypes = parseAll(mealTypeSchema, raw.mealTypes, "Meal type", problems);
  const ingredients = parseAll(ingredientSchema, raw.ingredients, "Ingredient", problems);
  const recipes = parseAll(recipeSchema, raw.recipes, "Recipe", problems);

  for (const [label, ids] of [
    ["cuisine id", cuisines.map((c) => c.id)],
    ["meal type id", mealTypes.map((m) => m.id)],
    ["ingredient id", ingredients.map((i) => i.id)],
    ["recipe slug", recipes.map((r) => r.slug)],
  ] as const) {
    for (const dupe of findDuplicates([...ids])) problems.push(`Duplicate ${label}: ${dupe}`);
  }

  const cuisineIds = new Set(cuisines.map((c) => c.id));
  const ingredientById = new Map(ingredients.map((i) => [i.id, i]));

  const withMeta: RecipeWithMeta[] = [];
  for (const recipe of recipes) {
    const where = `Recipe ${recipe.slug}`;
    if (!cuisineIds.has(recipe.cuisine))
      problems.push(`${where}: unknown cuisine "${recipe.cuisine}"`);

    const used = new Set(recipe.ingredients.map((line) => line.ingredient));
    for (const id of used) {
      if (!ingredientById.has(id)) problems.push(`${where}: unknown ingredient "${id}"`);
    }
    recipe.steps.forEach((step, i) => {
      for (const id of step.uses) {
        if (!used.has(id))
          problems.push(
            `${where}: step ${i + 1} uses "${id}", which is not in its ingredient list`,
          );
      }
    });

    if (recipe.image && !raw.images[recipe.image.file]) {
      problems.push(
        `${where}: image "${recipe.image.file}" has not been processed — run \`npm run images\``,
      );
    }

    const known = [...used].flatMap((id) => ingredientById.get(id) ?? []);
    withMeta.push({ ...recipe, ...deriveDiet(known) });
  }

  if (problems.length > 0) throw new ContentError(problems);

  return { cuisines, mealTypes, ingredients, recipes: withMeta };
}
