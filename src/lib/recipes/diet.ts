import type { Ingredient, IngredientFlag } from "@/content/schema";

export type DietLabel = "vegan" | "vegetarian" | "pescatarian" | "non-vegetarian";

const NOT_PESCATARIAN: IngredientFlag[] = ["meat", "poultry", "gelatin"];
const NOT_VEGETARIAN: IngredientFlag[] = [...NOT_PESCATARIAN, "fish", "shellfish"];
const NOT_VEGAN: IngredientFlag[] = [...NOT_VEGETARIAN, "egg", "dairy", "honey"];

/** Ingredient flags worth showing as "Contains …" (informational, never a free-from claim). */
export const DISPLAY_FLAGS: IngredientFlag[] = [
  "egg",
  "dairy",
  "gluten",
  "nuts",
  "peanuts",
  "sesame",
  "soy",
  "fish",
  "shellfish",
  "alcohol",
];

export type DietInfo = {
  diet: DietLabel;
  /** Eggs count as vegetarian; this lets people who avoid them filter separately. */
  containsEgg: boolean;
  /** Display flags found in the recipe, in DISPLAY_FLAGS order. */
  contains: IngredientFlag[];
};

/**
 * Derives diet information from ingredient flags. Optional ingredients count too: a label must
 * hold however the recipe is made, so it never over-claims.
 */
export function deriveDiet(ingredients: Pick<Ingredient, "flags">[]): DietInfo {
  const flags = new Set(ingredients.flatMap((i) => i.flags));
  const has = (list: IngredientFlag[]) => list.some((f) => flags.has(f));

  const diet: DietLabel = !has(NOT_VEGAN)
    ? "vegan"
    : !has(NOT_VEGETARIAN)
      ? "vegetarian"
      : !has(NOT_PESCATARIAN)
        ? "pescatarian"
        : "non-vegetarian";

  return {
    diet,
    containsEgg: flags.has("egg"),
    contains: DISPLAY_FLAGS.filter((f) => flags.has(f)),
  };
}

/** True for vegan and vegetarian recipes — the "Veg" side of the veg / non-veg split. */
export function isVegetarian(diet: DietLabel): boolean {
  return diet === "vegan" || diet === "vegetarian";
}
