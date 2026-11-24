import type { Metadata } from "next";
import { Suspense } from "react";
import { PantrySearch } from "@/components/pantry/pantry-search";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { ingredients, summaries } from "@/lib/recipes/catalog";

export const metadata: Metadata = {
  title: "Cook with what you have",
  description:
    "Enter the ingredients in your kitchen and find recipes that use them, with missing items clearly shown.",
};

export default function PantryPage() {
  const options = ingredients
    .filter((i) => !i.staple)
    .map((i) => ({ id: i.id, name: i.name, aliases: i.aliases }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Cook with what you have</h1>
      <p className="text-ink-muted mt-3 max-w-2xl text-lg">
        Tell us what’s in your fridge and cupboards. We’ll rank recipes by how much of each one you
        can already make — and show exactly what’s missing.
      </p>
      <div className="mt-8">
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <PantrySearch recipes={summaries} options={options} />
        </Suspense>
      </div>
    </Container>
  );
}
