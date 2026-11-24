"use client";

import { usePersonal } from "@/components/providers/personal-provider";
import { RecipeCard, RecipeGrid } from "@/components/recipes/recipe-card";
import { SectionHeading } from "@/components/ui/section-heading";
import type { RecipeSummary } from "@/lib/recipes/catalog";
import { recommend } from "@/lib/recipes/recommend";

/** Shown once someone has saved at least 3 favourites. */
export function Recommended({ recipes }: { recipes: RecipeSummary[] }) {
  const { data, status } = usePersonal();
  if (status !== "ready") return null;
  const picks = recommend(
    recipes,
    data.favourites.map((f) => f.slug),
    4,
    data.profile.dietaryPreference,
  );
  if (picks.length === 0) return null;
  return (
    <section aria-label="Recommended for you">
      <SectionHeading
        title="Recommended for you"
        description="Based on the cuisines and meals you save most."
        className="mb-6"
      />
      <RecipeGrid>
        {picks.map((r) => (
          <RecipeCard key={r.slug} recipe={r} />
        ))}
      </RecipeGrid>
    </section>
  );
}
