import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/ui/prose-page";
import { recipes } from "@/lib/recipes/catalog";

export const metadata: Metadata = {
  title: "About",
  description: "What CookBook is and how its recipes are made.",
};

export default function AboutPage() {
  return (
    <ProsePage
      title="About CookBook"
      intro="A calm, friendly place to find a recipe and actually cook it."
    >
      <p>
        CookBook helps you discover recipes, cook them one step at a time, plan the week ahead and
        keep a collection of the dishes you love. It currently has {recipes.length} recipes across
        eight cuisines, with more on the way.
      </p>
      <h2>Our recipes</h2>
      <p>
        Every recipe is written for CookBook — we don’t copy or scrape other sites. Diet labels such
        as vegetarian and vegan are worked out from each ingredient, so they stay accurate, and we
        count eggs as vegetarian but let you filter them out separately.
      </p>
      <h2>What we don’t claim</h2>
      <ul>
        <li>
          <strong>No nutrition figures yet.</strong> We’d rather show nothing than numbers we can’t
          stand behind.
        </li>
        <li>
          <strong>No “free-from” promises.</strong> We note common allergens a recipe contains, but
          always check your own product labels.
        </li>
        <li>
          <strong>Honest ingredient matching.</strong> <Link href="/pantry">Pantry search</Link>{" "}
          only says you have everything when you have every required ingredient.
        </li>
      </ul>
      <h2>Photography</h2>
      <p>
        Photos are only used when they’re properly licensed, and every photographer is credited on
        the <Link href="/credits">credits page</Link>. Recipes still waiting for a photo show an
        illustration instead.
      </p>
    </ProsePage>
  );
}
