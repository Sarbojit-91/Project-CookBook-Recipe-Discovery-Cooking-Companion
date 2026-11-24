/**
 * Validated recipe content. Importing this module validates everything, so invalid content fails
 * `next build` and the test suite with a list of every problem.
 */
import { cuisines } from "./cuisines";
import images from "./images.generated.json";
import { ingredients } from "./ingredients";
import { mealTypes } from "./meal-types";
import { recipes as rawRecipes } from "./recipes";
import { validateContent, type ImageManifest } from "./validate";

export const imageManifest = images as ImageManifest;

export const content = validateContent({
  cuisines,
  mealTypes,
  ingredients,
  recipes: rawRecipes,
  images: imageManifest,
});

export type { Content, RecipeWithMeta, ImageManifestEntry } from "./validate";
