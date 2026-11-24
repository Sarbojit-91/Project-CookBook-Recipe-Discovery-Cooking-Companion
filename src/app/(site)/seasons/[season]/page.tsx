import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingPage } from "@/components/recipes/landing-page";
import { SEASONS, type Season } from "@/content/schema";
import { byNewest, summaries } from "@/lib/recipes/catalog";
import { SEASON_NAMES } from "@/lib/recipes/season";

const DESCRIPTIONS: Record<Season, string> = {
  spring: "Fresh, bright dishes for lighter evenings and longer days.",
  summer: "Quick, vibrant food for warm days and eating outside.",
  autumn: "Earthy, comforting cooking for when the nights draw in.",
  winter: "Warming bowls, slow simmers and bakes for cold days.",
};

const isSeason = (value: string): value is Season => (SEASONS as readonly string[]).includes(value);

// Every valid page is generated at build time by generateStaticParams, so navigating to one is
// instant. Only unknown slugs render at request time (to show the not-found page), and those may
// block. This setting only affects the development-time instant-navigation check.
export const instant = false;

export function generateStaticParams() {
  return SEASONS.map((season) => ({ season }));
}

export async function generateMetadata({
  params,
}: PageProps<"/seasons/[season]">): Promise<Metadata> {
  const { season } = await params;
  return isSeason(season)
    ? { title: `${SEASON_NAMES[season]} recipes`, description: DESCRIPTIONS[season] }
    : {};
}

export default async function SeasonPage({ params }: PageProps<"/seasons/[season]">) {
  const { season } = await params;
  if (!isSeason(season)) notFound();
  return (
    <LandingPage
      eyebrow="Seasonal collection"
      title={`${SEASON_NAMES[season]} recipes`}
      description={DESCRIPTIONS[season]}
      recipes={summaries.filter((r) => r.seasons.includes(season)).sort(byNewest)}
      siblings={SEASONS.map((s) => ({
        href: `/seasons/${s}`,
        label: SEASON_NAMES[s],
        active: s === season,
      }))}
      browseHref="/recipes"
    />
  );
}
