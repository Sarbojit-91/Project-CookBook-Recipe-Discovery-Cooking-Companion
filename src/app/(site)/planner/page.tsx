import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingPanel } from "@/components/personal/loading-panel";
import { PlannerView } from "@/components/planner/planner-view";
import { Container } from "@/components/ui/container";
import { ingredients, recipes, summaries } from "@/lib/recipes/catalog";

export const metadata: Metadata = { title: "Meal planner", robots: { index: false } };

export default function PlannerPage() {
  const listRecipes = recipes.map((r) => ({
    slug: r.slug,
    servings: r.servings,
    ingredients: r.ingredients,
  }));
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Meal planner</h1>
      <p className="text-ink-muted mt-3 mb-6 max-w-2xl text-lg">
        Plan breakfast, lunch, dinner and snacks for the week, then turn it into a shopping list.
      </p>
      <Suspense fallback={<LoadingPanel label="Loading your meal plan…" />}>
        <PlannerView recipes={summaries} listRecipes={listRecipes} ingredients={ingredients} />
      </Suspense>
    </Container>
  );
}
