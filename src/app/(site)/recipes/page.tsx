import type { Metadata } from "next";
import { Suspense } from "react";
import { RecipeBrowser } from "@/components/browse/recipe-browser";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { cuisines, mealTypes, summaries } from "@/lib/recipes/catalog";

export const metadata: Metadata = {
  title: "Browse recipes",
  description:
    "Search every CookBook recipe by name, ingredient, cuisine, meal, time, difficulty and diet.",
};

export default function RecipesPage() {
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Browse recipes</h1>
      <p className="text-ink-muted mt-3 max-w-2xl text-lg">
        Search by dish or ingredient, then narrow it down by cuisine, meal, time, difficulty or
        diet.
      </p>
      <div className="mt-8">
        {/* Filters live in the URL, which is only known in the browser for this static page. */}
        <Suspense fallback={<BrowserSkeleton />}>
          <RecipeBrowser recipes={summaries} cuisines={cuisines} mealTypes={mealTypes} />
        </Suspense>
      </div>
    </Container>
  );
}

function BrowserSkeleton() {
  return (
    <div aria-busy="true">
      <p role="status" className="sr-only">
        Loading recipes…
      </p>
      <Skeleton className="h-12 w-full" />
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="aspect-[4/5]" />
        ))}
      </div>
    </div>
  );
}
