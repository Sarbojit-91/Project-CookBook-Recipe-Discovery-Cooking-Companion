import { z } from "zod";
import { UNIT_IDS } from "@/lib/units";

/** Lowercase words joined by hyphens: "red-lentil-dal". */
const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens");

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

// ── Taxonomy ────────────────────────────────────────────────────────────────

export const cuisineSchema = z.strictObject({
  id: slug,
  name: z.string().min(1),
  description: z.string().min(1).max(200),
});

export const MEAL_TYPE_IDS = ["breakfast", "lunch", "dinner", "snack", "dessert"] as const;
export const mealTypeIdSchema = z.enum(MEAL_TYPE_IDS);

export const mealTypeSchema = z.strictObject({
  id: mealTypeIdSchema,
  name: z.string().min(1),
  description: z.string().min(1).max(200),
});

// ── Ingredients ─────────────────────────────────────────────────────────────

export const AISLES = [
  "produce",
  "meat-fish",
  "dairy-eggs",
  "bakery",
  "grains-pasta",
  "tins-jars",
  "spices",
  "baking",
  "condiments",
  "world-foods",
  "frozen",
  "drinks",
  "other",
] as const;

/**
 * What an ingredient contains. Diet labels are derived from these, so every animal-derived
 * ingredient must be flagged. Allergen-style flags are informational only — CookBook never makes
 * "free-from" claims.
 */
export const INGREDIENT_FLAGS = [
  "meat",
  "poultry",
  "fish",
  "shellfish",
  "egg",
  "dairy",
  "honey",
  "gelatin",
  "gluten",
  "nuts",
  "peanuts",
  "sesame",
  "soy",
  "alcohol",
] as const;

export const ingredientSchema = z.strictObject({
  id: slug,
  name: z.string().min(1),
  /** Plural display name when it differs: "onion" → "onions". */
  plural: z.string().min(1).optional(),
  /** Other names people search for: "scallion" for spring onion. */
  aliases: z.array(z.string().min(1)).default([]),
  aisle: z.enum(AISLES),
  flags: z.array(z.enum(INGREDIENT_FLAGS)).default([]),
  /** Everyday basics (salt, oil, water) that pantry search assumes you have. */
  staple: z.boolean().default(false),
});

// ── Recipes ─────────────────────────────────────────────────────────────────

export const IMAGE_LICENSES = ["unsplash", "pexels", "original"] as const;

export const recipeImageSchema = z.strictObject({
  /** File name inside src/content/images/. */
  file: z.string().regex(/^[a-z0-9-]+\.(jpe?g|png|webp)$/),
  /** Describes the photo for screen-reader users. */
  alt: z.string().min(10),
  credit: z.strictObject({
    photographer: z.string().min(1),
    sourceUrl: z.url(),
    license: z.enum(IMAGE_LICENSES),
  }),
});

export const recipeIngredientSchema = z.strictObject({
  ingredient: slug,
  /** null means "to taste" or "as needed". */
  quantity: z.number().positive().nullable(),
  unit: z.enum(UNIT_IDS).nullable(),
  /** "finely chopped", "at room temperature". */
  preparation: z.string().min(1).optional(),
  /** Groups the list, e.g. "For the sauce". */
  group: z.string().min(1).optional(),
  optional: z.boolean().default(false),
  /** Short extra guidance shown beside the line. */
  note: z.string().min(1).optional(),
});

export const recipeStepSchema = z.strictObject({
  text: z.string().min(10),
  /** Offers a timer in cooking mode. */
  timerSeconds: z.number().int().positive().optional(),
  /** Ingredient ids used in this step, shown alongside it in cooking mode. */
  uses: z.array(slug).default([]),
});

export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export const SEASONS = ["spring", "summer", "autumn", "winter"] as const;

export const recipeSchema = z
  .strictObject({
    slug,
    title: z.string().min(3).max(80),
    description: z.string().min(20).max(220),
    cuisine: slug,
    mealTypes: z.array(mealTypeIdSchema).min(1),
    difficulty: z.enum(DIFFICULTIES),
    servings: z.number().int().min(1).max(24),
    prepMinutes: z.number().int().min(0),
    cookMinutes: z.number().int().min(0),
    /** Includes resting, soaking or chilling time, so it can exceed prep + cook. */
    totalMinutes: z.number().int().positive(),
    tags: z.array(slug).default([]),
    seasons: z.array(z.enum(SEASONS)).default([]),
    addedAt: isoDate,
    featured: z.boolean().default(false),
    /** null until a properly licensed photo is added. */
    image: recipeImageSchema.nullable(),
    ingredients: z.array(recipeIngredientSchema).min(2),
    steps: z.array(recipeStepSchema).min(2),
    tips: z.array(z.string().min(10)).default([]),
    /** No reliable nutrition data in v1, so this must stay null. */
    nutrition: z.null(),
  })
  .refine((r) => r.totalMinutes >= r.prepMinutes + r.cookMinutes, {
    message: "totalMinutes must be at least prepMinutes + cookMinutes",
    path: ["totalMinutes"],
  })
  .refine((r) => r.ingredients.every((i) => (i.quantity === null) === (i.unit === null)), {
    message: "A quantity needs a unit (use 'piece' for whole items) and vice versa",
    path: ["ingredients"],
  });

export type Cuisine = z.infer<typeof cuisineSchema>;
export type MealTypeId = z.infer<typeof mealTypeIdSchema>;
export type MealType = z.infer<typeof mealTypeSchema>;
export type Ingredient = z.infer<typeof ingredientSchema>;
export type IngredientFlag = (typeof INGREDIENT_FLAGS)[number];
export type Aisle = (typeof AISLES)[number];
export type RecipeImage = z.infer<typeof recipeImageSchema>;
export type RecipeIngredient = z.infer<typeof recipeIngredientSchema>;
export type RecipeStep = z.infer<typeof recipeStepSchema>;
export type Difficulty = (typeof DIFFICULTIES)[number];
export type Season = (typeof SEASONS)[number];
export type Recipe = z.infer<typeof recipeSchema>;

/** What authors write: defaults may be omitted. */
export type RecipeInput = z.input<typeof recipeSchema>;
export type IngredientInput = z.input<typeof ingredientSchema>;
