import { describe, expect, it } from "vitest";
import type { IngredientFlag } from "@/content/schema";
import { deriveDiet, isVegetarian } from "./diet";

const withFlags = (...sets: IngredientFlag[][]) => sets.map((flags) => ({ flags }));

describe("deriveDiet", () => {
  it("labels plant-only recipes vegan", () => {
    expect(deriveDiet(withFlags([], ["gluten"])).diet).toBe("vegan");
  });

  it("treats eggs and dairy as vegetarian but flags eggs", () => {
    const info = deriveDiet(withFlags(["egg"], ["dairy"]));
    expect(info.diet).toBe("vegetarian");
    expect(info.containsEgg).toBe(true);
  });

  it("labels fish without meat pescatarian", () => {
    expect(deriveDiet(withFlags(["fish"], ["dairy"])).diet).toBe("pescatarian");
    expect(deriveDiet(withFlags(["shellfish"])).diet).toBe("pescatarian");
  });

  it("labels meat, poultry and gelatin non-vegetarian", () => {
    expect(deriveDiet(withFlags(["meat"])).diet).toBe("non-vegetarian");
    expect(deriveDiet(withFlags(["poultry"], ["fish"])).diet).toBe("non-vegetarian");
    expect(deriveDiet(withFlags(["gelatin"])).diet).toBe("non-vegetarian");
  });

  it("treats honey as not vegan", () => {
    expect(deriveDiet(withFlags(["honey"])).diet).toBe("vegetarian");
  });

  it("lists display flags in a stable order without duplicates", () => {
    expect(deriveDiet(withFlags(["sesame", "gluten"], ["gluten", "soy"])).contains).toEqual([
      "gluten",
      "sesame",
      "soy",
    ]);
  });

  it("groups vegan and vegetarian as veg", () => {
    expect(isVegetarian("vegan")).toBe(true);
    expect(isVegetarian("vegetarian")).toBe(true);
    expect(isVegetarian("pescatarian")).toBe(false);
  });
});
