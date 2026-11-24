/**
 * Units used in recipe content.
 *
 * Each unit belongs to one dimension. Quantities can only be converted (and later merged on the
 * shopping list) within the same dimension — never mass ↔ volume, because that depends on the
 * ingredient's density. Count-like units are each their own dimension: "2 cloves" and "1 bunch"
 * can never be added together.
 */
export const UNITS = {
  g: { dimension: "mass", toBase: 1, singular: "g", plural: "g" },
  kg: { dimension: "mass", toBase: 1000, singular: "kg", plural: "kg" },
  ml: { dimension: "volume", toBase: 1, singular: "ml", plural: "ml" },
  l: { dimension: "volume", toBase: 1000, singular: "l", plural: "l" },
  tsp: { dimension: "volume", toBase: 5, singular: "tsp", plural: "tsp" },
  tbsp: { dimension: "volume", toBase: 15, singular: "tbsp", plural: "tbsp" },
  cup: { dimension: "volume", toBase: 240, singular: "cup", plural: "cups" },
  pinch: { dimension: "pinch", toBase: 1, singular: "pinch", plural: "pinches" },
  clove: { dimension: "clove", toBase: 1, singular: "clove", plural: "cloves" },
  slice: { dimension: "slice", toBase: 1, singular: "slice", plural: "slices" },
  sprig: { dimension: "sprig", toBase: 1, singular: "sprig", plural: "sprigs" },
  bunch: { dimension: "bunch", toBase: 1, singular: "bunch", plural: "bunches" },
  handful: { dimension: "handful", toBase: 1, singular: "handful", plural: "handfuls" },
  can: { dimension: "can", toBase: 1, singular: "can", plural: "cans" },
  /** Whole items: "2 onions", "3 eggs". Displayed without a unit word. */
  piece: { dimension: "piece", toBase: 1, singular: "", plural: "" },
} as const satisfies Record<
  string,
  { dimension: string; toBase: number; singular: string; plural: string }
>;

export type Unit = keyof typeof UNITS;
export type UnitDimension = (typeof UNITS)[Unit]["dimension"];

export const UNIT_IDS = Object.keys(UNITS) as [Unit, ...Unit[]];

export function unitDimension(unit: Unit): UnitDimension {
  return UNITS[unit].dimension;
}

/** True when two units measure the same thing and can be converted into each other. */
export function areCompatible(a: Unit, b: Unit): boolean {
  return unitDimension(a) === unitDimension(b);
}

/** Converts a quantity between compatible units, or returns null if they are incompatible. */
export function convert(quantity: number, from: Unit, to: Unit): number | null {
  if (!areCompatible(from, to)) return null;
  return (quantity * UNITS[from].toBase) / UNITS[to].toBase;
}
