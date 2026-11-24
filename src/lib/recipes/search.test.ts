import { describe, expect, it } from "vitest";
import { summaries } from "./catalog";
import {
  EMPTY_FILTERS,
  filterRecipes,
  matchesQuery,
  parseFilters,
  serializeFilters,
} from "./search";

const slugs = (list: { slug: string }[]) => list.map((r) => r.slug);

describe("parseFilters / serializeFilters", () => {
  it("round-trips valid filters", () => {
    const qs = "q=dal&cuisine=indian&meal=dinner&time=30&difficulty=easy&diet=vegan&sort=quickest";
    expect(serializeFilters(parseFilters(new URLSearchParams(qs)))).toBe(qs);
  });

  it("ignores unknown or unsafe values", () => {
    const f = parseFilters(new URLSearchParams("meal=brunch&time=17&sort=random&diet=carnivore"));
    expect(f).toEqual({ ...EMPTY_FILTERS, cuisine: null });
  });
});

describe("matchesQuery", () => {
  it("matches word prefixes, plurals and accents", () => {
    expect(matchesQuery("red lentil dal", "lent")).toBe(true);
    expect(matchesQuery("chopped tomato", "tomatoes")).toBe(true);
    expect(matchesQuery("pimenton smoked paprika", "piméntón")).toBe(true);
    expect(matchesQuery("red lentil dal", "lentil soup")).toBe(false);
  });
});

describe("filterRecipes", () => {
  it("finds recipes by ingredient name and alias", () => {
    expect(slugs(filterRecipes(summaries, { ...EMPTY_FILTERS, q: "chickpeas" }))).toContain(
      "smooth-hummus",
    );
    expect(slugs(filterRecipes(summaries, { ...EMPTY_FILTERS, q: "cilantro" }))).toContain(
      "red-lentil-dal",
    );
  });

  it("filters by time, cuisine and meal", () => {
    const quick = filterRecipes(summaries, { ...EMPTY_FILTERS, time: 30 });
    expect(quick.every((r) => r.totalMinutes <= 30)).toBe(true);
    const indianDinner = filterRecipes(summaries, {
      ...EMPTY_FILTERS,
      cuisine: "indian",
      meal: "dinner",
    });
    expect(slugs(indianDinner).sort()).toEqual([
      "chana-masala",
      "home-style-chicken-curry",
      "red-lentil-dal",
    ]);
  });

  it("separates vegetarian with and without egg", () => {
    const veg = slugs(filterRecipes(summaries, { ...EMPTY_FILTERS, diet: "vegetarian" }));
    const noEgg = slugs(filterRecipes(summaries, { ...EMPTY_FILTERS, diet: "vegetarian-no-egg" }));
    expect(veg).toContain("shakshuka");
    expect(noEgg).not.toContain("shakshuka");
    expect(noEgg).toContain("red-lentil-dal");
    expect(veg).not.toContain("teriyaki-salmon-bowl");
  });

  it("sorts quickest first", () => {
    const list = filterRecipes(summaries, { ...EMPTY_FILTERS, sort: "quickest" });
    for (let i = 1; i < list.length; i++)
      expect(list[i].totalMinutes).toBeGreaterThanOrEqual(list[i - 1].totalMinutes);
  });
});
