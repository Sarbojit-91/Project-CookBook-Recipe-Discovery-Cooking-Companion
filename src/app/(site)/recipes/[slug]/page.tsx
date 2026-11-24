import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChefHat, ChevronRight, Info, Lightbulb, Timer } from "lucide-react";
import { AddToCollectionButton } from "@/components/personal/add-to-collection";
import { AddToPlanButton } from "@/components/personal/add-to-plan";
import { FavouriteButton } from "@/components/recipes/favourite-button";
import { IngredientsPanel } from "@/components/recipes/ingredients-panel";
import { DietBadge } from "@/components/recipes/recipe-badges";
import { RecipeCard, RecipeGrid } from "@/components/recipes/recipe-card";
import { RecipeImage } from "@/components/recipes/recipe-image";
import { RecipeNotes } from "@/components/recipes/recipe-notes";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getCuisine,
  getIngredient,
  getMealType,
  getRecipe,
  getRecipeImage,
  getSummary,
  recipes,
  summaries,
} from "@/lib/recipes/catalog";
import { relatedRecipes } from "@/lib/recipes/related";
import { recipeJsonLd } from "@/lib/recipes/json-ld";
import { capitalize, formatMinutes, plural } from "@/lib/text";

// Every valid page is generated at build time by generateStaticParams, so navigating to one is
// instant. Only unknown slugs render at request time (to show the not-found page), and those may
// block. This setting only affects the development-time instant-navigation check.
export const instant = false;

export function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/recipes/[slug]">): Promise<Metadata> {
  const recipe = getRecipe((await params).slug);
  if (!recipe) return {};
  const image = getRecipeImage(recipe);
  return {
    title: recipe.title,
    description: recipe.description,
    alternates: { canonical: `/recipes/${recipe.slug}` },
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      type: "article",
      images: image ? [{ url: image.src, alt: image.alt }] : undefined,
    },
  };
}

const CONTAINS_LABELS: Record<string, string> = {
  egg: "egg",
  dairy: "dairy",
  gluten: "gluten",
  nuts: "nuts",
  peanuts: "peanuts",
  sesame: "sesame",
  soy: "soy",
  fish: "fish",
  shellfish: "shellfish",
  alcohol: "alcohol",
};

export default async function RecipePage({ params }: PageProps<"/recipes/[slug]">) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  const summary = getSummary(slug);
  if (!recipe || !summary) notFound();

  const cuisine = getCuisine(recipe.cuisine);
  const image = getRecipeImage(recipe);
  const usedIngredients = [...new Set(recipe.ingredients.map((l) => l.ingredient))].flatMap(
    (id) => getIngredient(id) ?? [],
  );
  const related = relatedRecipes(summary, summaries, 4);

  const facts = [
    { label: "Prep", value: formatMinutes(recipe.prepMinutes) },
    {
      label: "Cook",
      value: recipe.cookMinutes > 0 ? formatMinutes(recipe.cookMinutes) : "No cooking",
    },
    { label: "Total", value: formatMinutes(recipe.totalMinutes) },
    { label: "Serves", value: String(recipe.servings) },
    { label: "Difficulty", value: capitalize(recipe.difficulty) },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        // JSON-LD for search engines. Content is our own; < is escaped to keep the script safe.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(recipeJsonLd(recipe, image)).replace(/</g, "\\u003c"),
        }}
      />
      <Container className="py-6 sm:py-10">
        <nav aria-label="Breadcrumb" className="text-ink-muted mb-6 text-sm">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/recipes" className="hover:text-ink hover:underline">
                Recipes
              </Link>
            </li>
            <ChevronRight aria-hidden className="size-4" />
            <li>
              <Link href={`/cuisines/${recipe.cuisine}`} className="hover:text-ink hover:underline">
                {cuisine?.name}
              </Link>
            </li>
            <ChevronRight aria-hidden className="size-4" />
            <li aria-current="page" className="text-ink">
              {recipe.title}
            </li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-2">
              <DietBadge diet={recipe.diet} />
              {recipe.mealTypes.map((m) => (
                <Link key={m} href={`/meals/${m}`}>
                  <Badge className="hover:bg-line">{getMealType(m)?.name}</Badge>
                </Link>
              ))}
            </div>
            <h1 className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
              {recipe.title}
            </h1>
            <p className="text-ink-muted text-lg">{recipe.description}</p>

            <dl className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {facts.map((f) => (
                <div
                  key={f.label}
                  className="bg-surface rounded-2xl px-3 py-3 text-center shadow-(--shadow-card)"
                >
                  <dt className="text-ink-muted text-xs font-medium tracking-wide uppercase">
                    {f.label}
                  </dt>
                  <dd className="mt-1 font-semibold">{f.value}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap gap-2">
              <Link
                href={`/recipes/${recipe.slug}/cook`}
                className={buttonVariants({ size: "lg" })}
              >
                <ChefHat aria-hidden className="size-5" />
                Start cooking
              </Link>
              <FavouriteButton
                slug={recipe.slug}
                title={recipe.title}
                variant="full"
                className="h-13 px-6"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <AddToCollectionButton slug={recipe.slug} title={recipe.title} />
              <AddToPlanButton
                slug={recipe.slug}
                title={recipe.title}
                servings={recipe.servings}
                mealTypes={recipe.mealTypes}
              />
            </div>
          </div>

          <figure>
            <RecipeImage
              image={image}
              title={recipe.title}
              cuisine={recipe.cuisine}
              mealType={recipe.mealTypes[0]}
              sizes="(min-width: 1024px) 45vw, 100vw"
              priority
              className="aspect-[4/3] w-full rounded-[2rem] shadow-(--shadow-raised)"
            />
            <figcaption className="text-ink-muted mt-2 text-right text-xs">
              {image ? (
                <>
                  Photo by{" "}
                  <a
                    href={image.credit.sourceUrl}
                    className="underline"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {image.credit.photographer}
                  </a>{" "}
                  on {capitalize(image.credit.license)}
                </>
              ) : (
                "Photo coming soon"
              )}
            </figcaption>
          </figure>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:items-start">
          <div className="flex flex-col gap-6 lg:sticky lg:top-24">
            <IngredientsPanel recipe={recipe} ingredients={usedIngredients} />
            {recipe.contains.length > 0 && (
              <p className="bg-sand/70 text-ink-muted flex gap-2 rounded-2xl px-4 py-3 text-sm">
                <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
                <span>
                  Contains {recipe.contains.map((c) => CONTAINS_LABELS[c]).join(", ")}. Always check
                  product labels if you have an allergy.
                </span>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-10">
            <section aria-labelledby="method-heading">
              <h2 id="method-heading" className="text-2xl font-semibold">
                Method
              </h2>
              <ol className="mt-5 flex flex-col gap-6">
                {recipe.steps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span
                      aria-hidden
                      className="bg-terracotta-600 font-display grid size-10 shrink-0 place-items-center rounded-full text-lg font-semibold text-white"
                    >
                      {i + 1}
                    </span>
                    <div className="pt-1.5">
                      <p className="text-lg leading-relaxed">
                        <span className="sr-only">Step {i + 1}: </span>
                        {step.text}
                      </p>
                      {step.timerSeconds && (
                        <p className="bg-sage-50 text-sage-700 mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium">
                          <Timer aria-hidden className="size-4" />
                          Timer: {plural(Math.round(step.timerSeconds / 60), "minute")}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {recipe.tips.length > 0 && (
              <section
                aria-labelledby="tips-heading"
                className="bg-terracotta-50 rounded-(--radius-card) p-5 sm:p-6"
              >
                <h2 id="tips-heading" className="flex items-center gap-2 text-xl font-semibold">
                  <Lightbulb aria-hidden className="text-terracotta-700 size-5" />
                  Tips
                </h2>
                <ul className="mt-3 flex list-disc flex-col gap-2 pl-5">
                  {recipe.tips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </section>
            )}

            <RecipeNotes slug={recipe.slug} />
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <SectionHeading title="You might also like" className="mb-6" />
            <RecipeGrid>
              {related.map((r) => (
                <RecipeCard key={r.slug} recipe={r} />
              ))}
            </RecipeGrid>
          </section>
        )}
      </Container>
    </>
  );
}
