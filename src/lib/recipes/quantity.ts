import type { Ingredient, RecipeIngredient } from "@/content/schema";
import { UNITS, type Unit } from "@/lib/units";

const FRACTIONS: [number, string][] = [
  [1 / 8, "⅛"],
  [1 / 4, "¼"],
  [1 / 3, "⅓"],
  [1 / 2, "½"],
  [2 / 3, "⅔"],
  [3 / 4, "¾"],
];

/** Units where cooks expect fractions ("½ tsp") rather than decimals. */
const FRACTION_UNITS = new Set<Unit>([
  "tsp",
  "tbsp",
  "cup",
  "piece",
  "can",
  "clove",
  "bunch",
  "handful",
  "slice",
  "sprig",
  "pinch",
]);

/** Formats a number for a recipe: fractions for spoons and whole items, sensible rounding for grams. */
export function formatNumber(value: number, unit: Unit | null): string {
  if (unit && !FRACTION_UNITS.has(unit)) {
    if (value >= 100) return String(Math.round(value / 5) * 5);
    if (value >= 10) return String(Math.round(value));
    return String(Math.round(value * 10) / 10);
  }
  const whole = Math.floor(value);
  const rest = value - whole;
  if (rest < 0.06) return String(whole || (value > 0 ? "⅛" : 0));
  if (rest > 0.94) return String(whole + 1);
  const [, symbol] = FRACTIONS.reduce((best, candidate) =>
    Math.abs(candidate[0] - rest) < Math.abs(best[0] - rest) ? candidate : best,
  );
  return whole > 0 ? `${whole}${symbol}` : symbol;
}

/** "g" → "g", "clove" → "cloves" depending on the amount. "piece" shows no unit word. */
export function unitLabel(unit: Unit, quantity: number): string {
  const u = UNITS[unit];
  return quantity > 1 ? u.plural : u.singular;
}

/** A US-customary equivalent, shown alongside metric amounts (never mass ↔ volume). */
export function usEquivalent(quantity: number, unit: Unit): string | null {
  const round = (n: number, step: number) => Math.round(n / step) * step;
  switch (unit) {
    case "g":
      if (quantity < 15) return null;
      return quantity >= 450
        ? `${round(quantity / 453.6, 0.25)} lb`
        : `${round(quantity / 28.35, 0.5)} oz`;
    case "kg":
      return `${round((quantity * 1000) / 453.6, 0.25)} lb`;
    case "ml":
    case "l": {
      const ml = unit === "l" ? quantity * 1000 : quantity;
      if (ml < 60) return null;
      const cups = round(ml / 240, 0.25);
      return `${formatNumber(cups, "cup")} ${cups > 1 ? "cups" : "cup"}`;
    }
    default:
      return null;
  }
}

export type FormattedLine = {
  /** "1½ tbsp", "2", or "" for "to taste". */
  amount: string;
  /** Ingredient name, pluralised to match the amount. */
  name: string;
  /** "≈ 7 oz", when a US measure helps. */
  us: string | null;
  preparation?: string;
  note?: string;
  optional: boolean;
  toTaste: boolean;
};

export function scaleQuantity(quantity: number | null, factor: number): number | null {
  return quantity === null ? null : quantity * factor;
}

/** Formats one ingredient line, scaled by `factor` (new servings ÷ original servings). */
export function formatLine(
  line: RecipeIngredient,
  ingredient: Ingredient,
  factor = 1,
): FormattedLine {
  const quantity = scaleQuantity(line.quantity, factor);
  const unit = line.unit;
  const base = {
    preparation: line.preparation,
    note: line.note,
    optional: line.optional,
  };
  if (quantity === null || unit === null) {
    return { ...base, amount: "", name: ingredient.name, us: null, toTaste: true };
  }
  const number = formatNumber(quantity, unit);
  const label = unitLabel(unit, quantity);
  const isCount = unit === "piece";
  const name = isCount && quantity > 1 && ingredient.plural ? ingredient.plural : ingredient.name;
  const us = usEquivalent(quantity, unit);
  return {
    ...base,
    amount: label ? `${number} ${label}` : number,
    name,
    us: us ? `≈ ${us}` : null,
    toTaste: false,
  };
}
