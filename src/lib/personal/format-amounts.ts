import { formatNumber, unitLabel } from "@/lib/recipes/quantity";
import type { Amount } from "./types";

/** "450 g + 2 tbsp", or "" when there's no amount (e.g. "to taste"). */
export function formatAmounts(amounts: Amount[]): string {
  return amounts
    .filter((a) => a.quantity !== null && a.unit !== null)
    .map((a) => {
      const label = unitLabel(a.unit!, a.quantity!);
      const n = formatNumber(a.quantity!, a.unit);
      return label ? `${n} ${label}` : n;
    })
    .join(" + ");
}
