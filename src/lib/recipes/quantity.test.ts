import { describe, expect, it } from "vitest";
import type { Ingredient } from "@/content/schema";
import { formatLine, formatNumber, usEquivalent } from "./quantity";

const onion: Ingredient = {
  id: "onion",
  name: "onion",
  plural: "onions",
  aliases: [],
  aisle: "produce",
  flags: [],
  staple: false,
};
const flour: Ingredient = {
  id: "flour",
  name: "plain flour",
  aliases: [],
  aisle: "baking",
  flags: [],
  staple: false,
};

describe("formatNumber", () => {
  it("uses fractions for spoons and whole items", () => {
    expect(formatNumber(0.5, "tsp")).toBe("½");
    expect(formatNumber(1.5, "tbsp")).toBe("1½");
    expect(formatNumber(0.33, "cup")).toBe("⅓");
    expect(formatNumber(2, "piece")).toBe("2");
  });

  it("rounds metric weights sensibly", () => {
    expect(formatNumber(187.5, "g")).toBe("190");
    expect(formatNumber(12.4, "g")).toBe("12");
    expect(formatNumber(1.25, "kg")).toBe("1.3");
  });
});

describe("usEquivalent", () => {
  it("converts weight to ounces/pounds and volume to cups", () => {
    expect(usEquivalent(200, "g")).toBe("7 oz");
    expect(usEquivalent(1, "kg")).toBe("2.25 lb");
    expect(usEquivalent(240, "ml")).toBe("1 cup");
  });

  it("skips tiny amounts and never converts spoons", () => {
    expect(usEquivalent(5, "g")).toBeNull();
    expect(usEquivalent(2, "tbsp")).toBeNull();
  });
});

describe("formatLine", () => {
  it("pluralises whole items and scales", () => {
    const line = { ingredient: "onion", quantity: 1, unit: "piece" as const, optional: false };
    expect(formatLine(line, onion).amount).toBe("1");
    expect(formatLine(line, onion, 2).name).toBe("onions");
  });

  it("marks to-taste lines", () => {
    const f = formatLine(
      { ingredient: "flour", quantity: null, unit: null, optional: false },
      flour,
    );
    expect(f.toTaste).toBe(true);
    expect(f.amount).toBe("");
  });

  it("adds a US measure for grams", () => {
    expect(
      formatLine({ ingredient: "flour", quantity: 100, unit: "g", optional: false }, flour).us,
    ).toBe("≈ 3.5 oz");
  });
});
