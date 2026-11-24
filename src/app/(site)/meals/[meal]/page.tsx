import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingPage } from "@/components/recipes/landing-page";
import { byNewest, getMealType, mealTypes, summaries } from "@/lib/recipes/catalog";

// Every valid page is generated at build time by generateStaticParams, so navigating to one is
// instant. Only unknown slugs render at request time (to show the not-found page), and those may
// block. This setting only affects the development-time instant-navigation check.
export const instant = false;

export function generateStaticParams() {
  return mealTypes.map((m) => ({ meal: m.id }));
}

export async function generateMetadata({ params }: PageProps<"/meals/[meal]">): Promise<Metadata> {
  const meal = getMealType((await params).meal);
  return meal ? { title: `${meal.name} recipes`, description: meal.description } : {};
}

export default async function MealPage({ params }: PageProps<"/meals/[meal]">) {
  const meal = getMealType((await params).meal);
  if (!meal) notFound();
  return (
    <LandingPage
      eyebrow="Meal"
      title={`${meal.name} recipes`}
      description={meal.description}
      recipes={summaries.filter((r) => r.mealTypes.includes(meal.id)).sort(byNewest)}
      siblings={mealTypes.map((m) => ({
        href: `/meals/${m.id}`,
        label: m.name,
        active: m.id === meal.id,
      }))}
      browseHref={`/recipes?meal=${meal.id}`}
    />
  );
}
