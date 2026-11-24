import { describe, expect, it } from "vitest";
import { getIngredient, getRecipe } from "@/lib/recipes/catalog";
import { formatAmounts } from "./format-amounts";
import { addAmount, addRecipesToList, matchIngredient } from "./shopping";
import { ingredients } from "@/lib/recipes/catalog";

let n = 0;
const newId = () => `id-${++n}`;
const now = "2026-11-24T10:00:00.000Z";

describe("addAmount", () => {
  it("combines amounts of the same dimension", () => {
    expect(addAmount([{ quantity: 200, unit: "g" }], { quantity: 1, unit: "kg" })).toEqual([
      { quantity: 1.2, unit: "kg" },
    ]);
    expect(addAmount([{ quantity: 1, unit: "tbsp" }], { quantity: 3, unit: "tsp" })).toEqual([
      { quantity: 2, unit: "tbsp" },
    ]);
  });

  it("never combines mass and volume", () => {
    const result = addAmount([{ quantity: 200, unit: "g" }], { quantity: 1, unit: "cup" });
    expect(result).toEqual([
      { quantity: 200, unit: "g" },
      { quantity: 1, unit: "cup" },
    ]);
    expect(formatAmounts(result)).toBe("200 g + 1 cup");
  });

  it("keeps cloves and whole items apart", () => {
    expect(
      addAmount([{ quantity: 2, unit: "clove" }], { quantity: 1, unit: "piece" }),
    ).toHaveLength(2);
  });

  it("drops 'to taste' once there's a real amount", () => {
    expect(addAmount([{ quantity: null, unit: null }], { quantity: 1, unit: "tsp" })).toEqual([
      { quantity: 1, unit: "tsp" },
    ]);
    expect(addAmount([{ quantity: 1, unit: "tsp" }], { quantity: null, unit: null })).toEqual([
      { quantity: 1, unit: "tsp" },
    ]);
  });
});

describe("addRecipesToList", () => {
  const dal = getRecipe("red-lentil-dal")!;
  const curry = getRecipe("home-style-chicken-curry")!;

  it("merges shared ingredients across recipes and records sources", () => {
    const items = addRecipesToList(
      [],
      [
        { recipe: dal, servings: 4 },
        { recipe: curry, servings: 4 },
      ],
      getIngredient,
      newId,
      now,
    );
    const garlic = items.find((i) => i.ingredientId === "garlic")!;
    expect(formatAmounts(garlic.amounts)).toBe("9 cloves");
    expect(garlic.sources).toEqual(["red-lentil-dal", "home-style-chicken-curry"]);
    expect(items.some((i) => i.ingredientId === "water")).toBe(false);
  });

  it("scales by servings", () => {
    const items = addRecipesToList([], [{ recipe: dal, servings: 8 }], getIngredient, newId, now);
    expect(formatAmounts(items.find((i) => i.ingredientId === "red-lentils")!.amounts)).toBe(
      "500 g",
    );
  });

  it("tops up an existing unbought item instead of duplicating it", () => {
    const first = addRecipesToList([], [{ recipe: dal, servings: 4 }], getIngredient, newId, now);
    const second = addRecipesToList(
      first,
      [{ recipe: dal, servings: 4 }],
      getIngredient,
      newId,
      now,
    );
    const lentils = second.find((i) => i.ingredientId === "red-lentils")!;
    expect(lentils.id).toBe(first.find((i) => i.ingredientId === "red-lentils")!.id);
    expect(formatAmounts(lentils.amounts)).toBe("500 g");
  });

  it("starts a new item when the existing one is already bought", () => {
    const first = addRecipesToList(
      [],
      [{ recipe: dal, servings: 4 }],
      getIngredient,
      newId,
      now,
    ).map((i) => ({ ...i, purchased: true }));
    const second = addRecipesToList(
      first,
      [{ recipe: dal, servings: 4 }],
      getIngredient,
      newId,
      now,
    );
    expect(second.every((i) => !first.some((f) => f.id === i.id))).toBe(true);
  });

  it("skips optional ingredients", () => {
    const spaghetti = getRecipe("garlic-chilli-spaghetti")!;
    const items = addRecipesToList(
      [],
      [{ recipe: spaghetti, servings: 2 }],
      getIngredient,
      newId,
      now,
    );
    expect(items.some((i) => i.ingredientId === "lemon")).toBe(false);
  });
});

describe("matchIngredient", () => {
  it("finds catalogue ingredients by name, plural or alias", () => {
    expect(matchIngredient("Tomatoes", ingredients)?.id).toBe("tomato");
    expect(matchIngredient("scallions", ingredients)?.id).toBe("spring-onion");
    expect(matchIngredient("washing-up liquid", ingredients)).toBeUndefined();
  });
});
