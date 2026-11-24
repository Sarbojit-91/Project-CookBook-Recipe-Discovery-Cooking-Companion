import type { MetadataRoute } from "next";
import { SEASONS } from "@/content/schema";
import { cuisines, mealTypes, recipes } from "@/lib/recipes/catalog";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, lastModified?: string) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
  });
  return [
    page("/"),
    page("/recipes"),
    page("/pantry"),
    page("/about"),
    page("/credits"),
    page("/privacy"),
    ...recipes.map((r) => page(`/recipes/${r.slug}`, r.addedAt)),
    ...cuisines.map((c) => page(`/cuisines/${c.id}`)),
    ...mealTypes.map((m) => page(`/meals/${m.id}`)),
    ...SEASONS.map((s) => page(`/seasons/${s}`)),
  ];
}
