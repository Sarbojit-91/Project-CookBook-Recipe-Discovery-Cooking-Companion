import Link from "next/link";
import { Soup } from "lucide-react";
import { RecipeCard, RecipeGrid } from "@/components/recipes/recipe-card";
import { buttonVariants } from "@/components/ui/button";
import { ChipLink } from "@/components/ui/chip";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import type { RecipeSummary } from "@/lib/recipes/catalog";

type LandingPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  recipes: RecipeSummary[];
  /** Sibling pages shown as chips, e.g. other cuisines. */
  siblings: { href: string; label: string; active: boolean }[];
  browseHref: string;
};

export function LandingPage({
  eyebrow,
  title,
  description,
  recipes,
  siblings,
  browseHref,
}: LandingPageProps) {
  return (
    <Container className="py-10 sm:py-14">
      <p className="text-terracotta-700 text-sm font-semibold tracking-wide uppercase">{eyebrow}</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      <p className="text-ink-muted mt-3 max-w-2xl text-lg">{description}</p>
      <nav
        aria-label={`Other ${eyebrow.toLowerCase()} pages`}
        className="-mx-4 mt-6 overflow-x-auto px-4 pb-2"
      >
        <ul className="flex gap-2">
          {siblings.map((s) => (
            <li key={s.href}>
              <ChipLink href={s.href} label={s.label} active={s.active} />
            </li>
          ))}
        </ul>
      </nav>
      <p className="text-ink-muted mt-6 text-sm">
        {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
      </p>
      <div className="mt-4">
        {recipes.length > 0 ? (
          <RecipeGrid>
            {recipes.map((r) => (
              <RecipeCard key={r.slug} recipe={r} headingLevel="h2" />
            ))}
          </RecipeGrid>
        ) : (
          <EmptyState
            icon={Soup}
            title="No recipes here yet"
            description="New recipes are added regularly. In the meantime, browse everything else."
            action={
              <Link href="/recipes" className={buttonVariants()}>
                Browse all recipes
              </Link>
            }
          />
        )}
      </div>
      {recipes.length > 0 && (
        <p className="mt-10 text-center">
          <Link href={browseHref} className={buttonVariants({ variant: "secondary" })}>
            Filter these recipes
          </Link>
        </p>
      )}
    </Container>
  );
}
