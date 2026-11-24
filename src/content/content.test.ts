import { describe, expect, it } from "vitest";
import { cuisines } from "./cuisines";
import { content } from "./index";
import { ingredients } from "./ingredients";
import { mealTypes } from "./meal-types";
import { recipes } from "./recipes";
import { ContentError, validateContent } from "./validate";

const bySlug = new Map(content.recipes.map((r) => [r.slug, r]));

describe("recipe content", () => {
  it("loads and validates", () => {
    expect(content.recipes).toHaveLength(12);
    expect(content.cuisines.length).toBeGreaterThan(0);
  });

  it("derives the expected diet label for every recipe", () => {
    // If one of these changes, an ingredient flag is probably wrong — check before updating.
    const expected: Record<string, string> = {
      "black-bean-tacos": "vegan",
      "british-pancakes": "vegetarian",
      "egg-fried-rice": "vegetarian",
      "garlic-chilli-spaghetti": "vegan",
      "home-style-chicken-curry": "non-vegetarian",
      "mushroom-risotto": "vegetarian",
      "red-lentil-dal": "vegan",
      shakshuka: "vegetarian",
      "shepherds-pie": "non-vegetarian",
      "smooth-hummus": "vegan",
      "teriyaki-salmon-bowl": "pescatarian",
      "thai-holy-basil-chicken": "non-vegetarian",
    };
    const actual = Object.fromEntries(content.recipes.map((r) => [r.slug, r.diet]));
    expect(actual).toEqual(expected);
  });

  it("flags eggs separately from the vegetarian label", () => {
    expect(bySlug.get("shakshuka")?.containsEgg).toBe(true);
    expect(bySlug.get("red-lentil-dal")?.containsEgg).toBe(false);
  });

  it("covers every cuisine and meal type at least once", () => {
    const usedCuisines = new Set(content.recipes.map((r) => r.cuisine));
    const usedMeals = new Set(content.recipes.flatMap((r) => r.mealTypes));
    expect([...usedCuisines].sort()).toEqual(content.cuisines.map((c) => c.id).sort());
    expect([...usedMeals].sort()).toEqual(content.mealTypes.map((m) => m.id).sort());
  });

  it("never claims nutrition data", () => {
    expect(content.recipes.every((r) => r.nutrition === null)).toBe(true);
  });

  it("does not date recipes in the future", () => {
    const today = new Date().toISOString().slice(0, 10);
    for (const r of content.recipes) expect(r.addedAt <= today, r.slug).toBe(true);
  });
});

describe("validateContent", () => {
  const base = { cuisines, mealTypes, ingredients, recipes, images: {} };
  const dal = recipes.find((r) => r.slug === "red-lentil-dal")!;

  function problemsFor(recipe: unknown, images = {}) {
    try {
      validateContent({ ...base, recipes: [recipe], images });
      return [];
    } catch (error) {
      if (error instanceof ContentError) return error.problems;
      throw error;
    }
  }

  it("reports unknown ingredients and cuisines", () => {
    const problems = problemsFor({
      ...dal,
      cuisine: "martian",
      ingredients: [...dal.ingredients, { ingredient: "unobtainium", quantity: 1, unit: "g" }],
    });
    expect(problems).toContain('Recipe red-lentil-dal: unknown cuisine "martian"');
    expect(problems).toContain('Recipe red-lentil-dal: unknown ingredient "unobtainium"');
  });

  it("reports steps that use ingredients missing from the list", () => {
    const problems = problemsFor({
      ...dal,
      steps: [...dal.steps, { text: "Stir in the butter at the end.", uses: ["butter"] }],
    });
    expect(problems.some((p) => p.includes('step 7 uses "butter"'))).toBe(true);
  });

  // Cross-field rules only run once the field-level checks pass, so test each on its own.
  it("rejects a total time shorter than prep + cook", () => {
    const problems = problemsFor({ ...dal, totalMinutes: 5 });
    expect(problems.some((p) => p.includes("totalMinutes"))).toBe(true);
  });

  it("rejects nutrition data", () => {
    const problems = problemsFor({ ...dal, nutrition: { calories: 300 } });
    expect(problems.some((p) => p.includes("nutrition"))).toBe(true);
  });

  it("rejects a quantity without a unit", () => {
    const problems = problemsFor({
      ...dal,
      ingredients: [{ ingredient: "salt", quantity: 1, unit: null }, ...dal.ingredients],
    });
    expect(problems.some((p) => p.includes("quantity needs a unit"))).toBe(true);
  });

  it("rejects duplicate slugs", () => {
    expect(() => validateContent({ ...base, recipes: [dal, dal] })).toThrow(
      /Duplicate recipe slug/,
    );
  });

  it("requires processed images with a credit", () => {
    const image = {
      file: "red-lentil-dal.jpg",
      alt: "A bowl of red lentil dal topped with coriander",
      credit: {
        photographer: "A. Photographer",
        sourceUrl: "https://unsplash.com/photos/x",
        license: "unsplash",
      },
    };
    expect(problemsFor({ ...dal, image }).some((p) => p.includes("npm run images"))).toBe(true);

    const manifest = {
      "red-lentil-dal.jpg": {
        width: 1600,
        height: 1067,
        widths: [480],
        placeholder: "",
        hash: "x",
      },
    };
    expect(problemsFor({ ...dal, image }, manifest)).toEqual([]);
    expect(
      problemsFor(
        { ...dal, image: { ...image, credit: { ...image.credit, license: "found-online" } } },
        manifest,
      ),
    ).not.toEqual([]);
  });
});
