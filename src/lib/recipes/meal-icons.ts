import { CakeSlice, Cookie, CookingPot, EggFried, Salad, type LucideIcon } from "lucide-react";
import type { MealTypeId } from "@/content/schema";

export const MEAL_ICONS: Record<MealTypeId, LucideIcon> = {
  breakfast: EggFried,
  lunch: Salad,
  dinner: CookingPot,
  snack: Cookie,
  dessert: CakeSlice,
};
