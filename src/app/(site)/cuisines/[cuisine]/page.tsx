import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingPage } from "@/components/recipes/landing-page";
import { byNewest, cuisines, getCuisine, summaries } from "@/lib/recipes/catalog";

// Every valid page is generated at build time by generateStaticParams, so navigating to one is
// instant. Only unknown slugs render at request time (to show the not-found page), and those may
// block. This setting only affects the development-time instant-navigation check.
export const instant = false;

export function generateStaticParams() {
  return cuisines.map((c) => ({ cuisine: c.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/cuisines/[cuisine]">): Promise<Metadata> {
  const cuisine = getCuisine((await params).cuisine);
  return cuisine ? { title: `${cuisine.name} recipes`, description: cuisine.description } : {};
}

export default async function CuisinePage({ params }: PageProps<"/cuisines/[cuisine]">) {
  const cuisine = getCuisine((await params).cuisine);
  if (!cuisine) notFound();
  return (
    <LandingPage
      eyebrow="Cuisine"
      title={`${cuisine.name} recipes`}
      description={cuisine.description}
      recipes={summaries.filter((r) => r.cuisine === cuisine.id).sort(byNewest)}
      siblings={cuisines.map((c) => ({
        href: `/cuisines/${c.id}`,
        label: c.name,
        active: c.id === cuisine.id,
      }))}
      browseHref={`/recipes?cuisine=${cuisine.id}`}
    />
  );
}
