import Link from "next/link";
import type { RecipeSummary } from "@/lib/recipes/catalog";
import { cn } from "@/lib/cn";
import { FavouriteButton } from "./favourite-button";
import { DietBadge, TimeAndDifficulty } from "./recipe-badges";
import { RecipeImage } from "./recipe-image";

type RecipeCardProps = {
  recipe: RecipeSummary;
  /** Extra content under the meta row, e.g. pantry matches. */
  children?: React.ReactNode;
  headingLevel?: "h2" | "h3";
  priority?: boolean;
  className?: string;
};

export function RecipeCard({
  recipe,
  children,
  headingLevel: Heading = "h3",
  priority,
  className,
}: RecipeCardProps) {
  return (
    <article
      className={cn(
        "group bg-surface relative flex flex-col overflow-hidden rounded-(--radius-card) shadow-(--shadow-card) transition-shadow hover:shadow-(--shadow-raised)",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <RecipeImage
          image={recipe.image}
          title={recipe.title}
          cuisine={recipe.cuisine}
          mealType={recipe.mealTypes[0]}
          sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 100vw"
          priority={priority}
          className="size-full transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute top-3 right-3 z-10">
          <FavouriteButton slug={recipe.slug} title={recipe.title} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-terracotta-700 text-xs font-semibold tracking-wide uppercase">
          {recipe.cuisineName}
        </p>
        <Heading className="text-lg leading-snug font-semibold">
          {/* The stretched link makes the whole card clickable while keeping one tab stop. */}
          <Link
            href={`/recipes/${recipe.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {recipe.title}
          </Link>
        </Heading>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
          <TimeAndDifficulty totalMinutes={recipe.totalMinutes} difficulty={recipe.difficulty} />
          <DietBadge diet={recipe.diet} />
        </div>
        {children && <div className="relative z-10">{children}</div>}
      </div>
      {/* Visible focus ring for the stretched link. */}
      <span
        aria-hidden
        className="ring-terracotta-600 pointer-events-none absolute inset-0 rounded-(--radius-card) ring-offset-2 group-has-[a:focus-visible]:ring-2"
      />
    </article>
  );
}

export function RecipeGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", className)}>
      {children}
    </div>
  );
}
