import type { Aisle, Ingredient, Recipe } from "@/content/schema";
import { normalize, singular } from "@/lib/text";
import { convert, unitDimension } from "@/lib/units";
import type { Amount, ShoppingItem } from "./types";

export const AISLE_LABELS: Record<Aisle, string> = {
  produce: "Fruit & vegetables",
  "meat-fish": "Meat & fish",
  "dairy-eggs": "Dairy & eggs",
  bakery: "Bakery",
  "grains-pasta": "Rice, pasta & grains",
  "tins-jars": "Tins & jars",
  spices: "Herbs & spices",
  baking: "Baking",
  condiments: "Oils & condiments",
  "world-foods": "World foods",
  frozen: "Frozen",
  drinks: "Drinks",
  other: "Other",
};

export const AISLE_ORDER = Object.keys(AISLE_LABELS) as Aisle[];

/** Ingredients never worth putting on a shopping list. */
const NEVER_LIST = new Set(["water"]);

/**
 * Adds an amount to a list of amounts, combining it with one of the same dimension (mass with
 * mass, volume with volume, cloves with cloves). Mass and volume are never combined.
 */
export function addAmount(amounts: Amount[], next: Amount): Amount[] {
  if (next.quantity === null || next.unit === null) {
    // "To taste": only worth recording if there's no amount at all yet.
    return amounts.length === 0 ? [next] : amounts;
  }
  const withoutToTaste = amounts.filter((a) => a.quantity !== null);
  const index = withoutToTaste.findIndex(
    (a) => a.unit !== null && unitDimension(a.unit) === unitDimension(next.unit!),
  );
  if (index === -1) return [...withoutToTaste, next];
  const existing = withoutToTaste[index];
  const converted = convert(next.quantity, next.unit, existing.unit!);
  const merged: Amount = { quantity: existing.quantity! + converted!, unit: existing.unit };
  return withoutToTaste.map((a, i) => (i === index ? normalizeAmount(merged) : a));
}

/** Moves large metric amounts up a unit: 1500 g → 1.5 kg, 1200 ml → 1.2 l. */
export function normalizeAmount(amount: Amount): Amount {
  if (amount.quantity === null) return amount;
  if (amount.unit === "g" && amount.quantity >= 1000)
    return { quantity: amount.quantity / 1000, unit: "kg" };
  if (amount.unit === "ml" && amount.quantity >= 1000)
    return { quantity: amount.quantity / 1000, unit: "l" };
  if (amount.unit === "tsp" && amount.quantity >= 3)
    return { quantity: amount.quantity / 3, unit: "tbsp" };
  return amount;
}

type RecipeLineInput = {
  recipe: Pick<Recipe, "slug" | "servings" | "ingredients">;
  servings: number;
};

type NewId = () => string;

/**
 * Merges the ingredients of one or more recipes into the shopping list. Existing unpurchased
 * items for the same ingredient are topped up; everything else becomes a new item. Returns only
 * the items that were created or changed.
 */
export function addRecipesToList(
  list: ShoppingItem[],
  inputs: RecipeLineInput[],
  lookup: (id: string) => Ingredient | undefined,
  newId: NewId,
  now: string,
  { includeOptional = false }: { includeOptional?: boolean } = {},
): ShoppingItem[] {
  const changed = new Map<string, ShoppingItem>();
  const current = (ingredientId: string) =>
    [...changed.values()].find((i) => i.ingredientId === ingredientId && !i.purchased) ??
    list.find((i) => i.ingredientId === ingredientId && !i.purchased);

  for (const { recipe, servings } of inputs) {
    const factor = servings / recipe.servings;
    for (const line of recipe.ingredients) {
      if (NEVER_LIST.has(line.ingredient) || (line.optional && !includeOptional)) continue;
      const ingredient = lookup(line.ingredient);
      if (!ingredient) continue;
      const amount: Amount = {
        quantity: line.quantity === null ? null : line.quantity * factor,
        unit: line.unit,
      };
      const existing = current(line.ingredient);
      const item: ShoppingItem = existing
        ? {
            ...existing,
            amounts: addAmount(existing.amounts, amount),
            sources: existing.sources.includes(recipe.slug)
              ? existing.sources
              : [...existing.sources, recipe.slug],
          }
        : {
            id: newId(),
            ingredientId: ingredient.id,
            name: ingredient.name,
            amounts: addAmount([], amount),
            aisle: ingredient.aisle,
            purchased: false,
            sources: [recipe.slug],
            createdAt: now,
          };
      changed.set(item.id, item);
    }
  }
  return [...changed.values()];
}

/** Finds a catalogue ingredient for a typed name, so manual items land in the right aisle. */
export function matchIngredient(name: string, all: Ingredient[]): Ingredient | undefined {
  const target = singular(normalize(name));
  if (!target) return undefined;
  return all.find((i) =>
    [i.name, i.plural ?? "", ...i.aliases].some((n) => n && singular(normalize(n)) === target),
  );
}
