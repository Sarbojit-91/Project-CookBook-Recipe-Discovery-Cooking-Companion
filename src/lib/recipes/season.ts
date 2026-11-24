import type { Season } from "@/content/schema";

export const SEASON_NAMES: Record<Season, string> = {
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
  winter: "Winter",
};

/** Northern-hemisphere meteorological seasons. */
export function seasonForMonth(month: number): Season {
  if (month === 11 || month <= 1) return "winter";
  if (month <= 4) return "spring";
  if (month <= 7) return "summer";
  return "autumn";
}
