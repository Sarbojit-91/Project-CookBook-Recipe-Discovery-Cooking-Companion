import type { Metadata } from "next";
import { LoadingPanel } from "@/components/personal/loading-panel";
import { ShoppingListView } from "@/components/shopping/shopping-list-view";
import { Container } from "@/components/ui/container";
import { ingredients, recipes } from "@/lib/recipes/catalog";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Shopping list", robots: { index: false } };

export default function ShoppingListPage() {
  const recipeTitles = Object.fromEntries(recipes.map((r) => [r.slug, r.title]));
  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Shopping list</h1>
      <p className="text-ink-muted mt-3 mb-6 text-lg">
        Grouped by aisle. Matching ingredients are combined when their units can be added up safely.
      </p>
      <Suspense fallback={<LoadingPanel label="Loading your shopping list…" />}>
        <ShoppingListView recipeTitles={recipeTitles} ingredients={ingredients} />
      </Suspense>
    </Container>
  );
}
