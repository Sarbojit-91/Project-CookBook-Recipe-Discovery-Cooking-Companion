import { describe, expect, it } from "vitest";
import { getSummary, summaries } from "./catalog";
import { recommend } from "./recommend";
import { relatedRecipes } from "./related";

describe("relatedRecipes", () => {
  it("never includes the recipe itself and prefers the same cuisine", () => {
    const dal = getSummary("red-lentil-dal")!;
    const related = relatedRecipes(dal, summaries, 3);
    expect(related.map((r) => r.slug)).not.toContain("red-lentil-dal");
    expect(related[0].cuisine).toBe("indian");
  });
});

describe("recommend", () => {
  it("waits for 3 favourites", () => {
    expect(recommend(summaries, ["red-lentil-dal", "shakshuka"])).toEqual([]);
  });

  it("excludes favourites and respects a dietary preference", () => {
    const favs = ["red-lentil-dal", "home-style-chicken-curry", "garlic-chilli-spaghetti"];
    const picks = recommend(summaries, favs, 4, "vegetarian");
    expect(picks.length).toBeGreaterThan(0);
    expect(picks.every((r) => !favs.includes(r.slug))).toBe(true);
    expect(picks.every((r) => r.diet === "vegan" || r.diet === "vegetarian")).toBe(true);
  });
});
