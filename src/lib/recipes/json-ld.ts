import type { RecipeWithMeta } from "@/content";
import { SITE_URL } from "@/lib/site";
import { getCuisine, getIngredient, type RecipeImageData } from "./catalog";
import { formatLine } from "./quantity";

const iso = (minutes: number) => `PT${minutes}M`;

/** schema.org Recipe data. Nutrition is deliberately left out — we don't have reliable figures. */
export function recipeJsonLd(recipe: RecipeWithMeta, image: RecipeImageData | null) {
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    url: `${SITE_URL}/recipes/${recipe.slug}`,
    image: image ? [`${SITE_URL}${image.src}`] : undefined,
    datePublished: recipe.addedAt,
    prepTime: iso(recipe.prepMinutes),
    cookTime: iso(recipe.cookMinutes),
    totalTime: iso(recipe.totalMinutes),
    recipeYield: `${recipe.servings} servings`,
    recipeCuisine: getCuisine(recipe.cuisine)?.name,
    recipeCategory: recipe.mealTypes,
    keywords: recipe.tags.join(", "),
    suitableForDiet:
      recipe.diet === "vegan"
        ? "https://schema.org/VeganDiet"
        : recipe.diet === "vegetarian"
          ? "https://schema.org/VegetarianDiet"
          : undefined,
    recipeIngredient: recipe.ingredients.flatMap((line) => {
      const ingredient = getIngredient(line.ingredient);
      if (!ingredient) return [];
      const f = formatLine(line, ingredient);
      return [
        [f.amount, f.name, f.preparation && `, ${f.preparation}`]
          .filter(Boolean)
          .join(" ")
          .replace(" ,", ","),
      ];
    }),
    recipeInstructions: recipe.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: step.text,
    })),
  };
}
