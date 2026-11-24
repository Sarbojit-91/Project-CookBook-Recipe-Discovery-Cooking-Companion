import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CookingMode } from "@/components/cook/cooking-mode";
import { getIngredient, getRecipe, recipes } from "@/lib/recipes/catalog";

// Every valid page is generated at build time by generateStaticParams, so navigating to one is
// instant. Only unknown slugs render at request time (to show the not-found page), and those may
// block. This setting only affects the development-time instant-navigation check.
export const instant = false;

export function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/recipes/[slug]/cook">): Promise<Metadata> {
  const recipe = getRecipe((await params).slug);
  return recipe ? { title: `Cooking: ${recipe.title}`, robots: { index: false } } : {};
}

export default async function CookPage({ params }: PageProps<"/recipes/[slug]/cook">) {
  const recipe = getRecipe((await params).slug);
  if (!recipe) notFound();
  const used = [...new Set(recipe.ingredients.map((l) => l.ingredient))].flatMap(
    (id) => getIngredient(id) ?? [],
  );
  return (
    <CookingMode
      recipe={{
        slug: recipe.slug,
        title: recipe.title,
        servings: recipe.servings,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
      }}
      ingredients={used}
    />
  );
}
