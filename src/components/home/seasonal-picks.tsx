"use client";

import type { Season } from "@/content/schema";
import { RecipeCard, RecipeGrid } from "@/components/recipes/recipe-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import type { RecipeSummary } from "@/lib/recipes/catalog";
import { useIsClient } from "@/lib/hooks/use-is-client";
import { SEASON_NAMES, seasonForMonth } from "@/lib/recipes/season";

const BLURBS: Record<Season, string> = {
  spring: "Fresh, bright dishes for lighter evenings.",
  summer: "Quick, vibrant food for warm days.",
  autumn: "Earthy, comforting cooking as the nights draw in.",
  winter: "Warming bowls and bakes for cold days.",
};

/** Picks the current season in the browser, so the static page never shows a stale season. */
export function SeasonalPicks({ recipes }: { recipes: RecipeSummary[] }) {
  const isClient = useIsClient();
  const season: Season | null = isClient ? seasonForMonth(new Date().getMonth()) : null;

  const picks = season ? recipes.filter((r) => r.seasons.includes(season)).slice(0, 4) : [];

  return (
    <section aria-label="Seasonal recipes">
      <SectionHeading
        title={season ? `In season: ${SEASON_NAMES[season]}` : "In season"}
        description={season ? BLURBS[season] : "Recipes for this time of year."}
        action={season ? { href: `/seasons/${season}`, label: "See all" } : undefined}
        className="mb-6"
      />
      {season === null ? (
        <RecipeGrid>
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="aspect-[4/5]" />
          ))}
        </RecipeGrid>
      ) : (
        <RecipeGrid>
          {picks.map((r) => (
            <RecipeCard key={r.slug} recipe={r} />
          ))}
        </RecipeGrid>
      )}
    </section>
  );
}
