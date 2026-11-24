import { describe, expect, it } from "vitest";
import { getSummary, summaries } from "./catalog";
import { matchPantry } from "./pantry";

describe("matchPantry", () => {
  it("returns nothing without ingredients", () => {
    expect(matchPantry(summaries, [])).toEqual({ complete: [], almost: [], partial: [] });
  });

  it("only says 'complete' when every key ingredient is owned", () => {
    const hummus = getSummary("smooth-hummus")!;
    const groups = matchPantry([hummus], hummus.keyIngredients);
    expect(groups.complete).toHaveLength(1);
    expect(groups.complete[0].missing).toEqual([]);

    const groups2 = matchPantry([hummus], hummus.keyIngredients.slice(1));
    expect(groups2.complete).toHaveLength(0);
    expect(groups2.almost[0].missing).toEqual([hummus.keyIngredients[0]]);
  });

  it("ignores staples and optional ingredients", () => {
    const shakshuka = getSummary("shakshuka")!;
    expect(shakshuka.keyIngredients).not.toContain("olive-oil");
    expect(shakshuka.keyIngredients).not.toContain("crusty-bread");
    expect(shakshuka.optionalIngredients).toContain("crusty-bread");
  });

  it("lists matched and missing ingredients explicitly", () => {
    const { almost, partial } = matchPantry(summaries, ["egg", "onion"]);
    for (const m of [...almost, ...partial]) {
      expect(m.matched.length + m.missing.length).toBe(m.recipe.keyIngredients.length);
      expect(m.matched.every((id) => ["egg", "onion"].includes(id))).toBe(true);
    }
  });
});
