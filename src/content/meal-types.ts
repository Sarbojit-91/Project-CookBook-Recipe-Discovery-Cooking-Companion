import type { MealType } from "./schema";

export const mealTypes: MealType[] = [
  { id: "breakfast", name: "Breakfast", description: "Easy starts and slow weekend brunches." },
  { id: "lunch", name: "Lunch", description: "Midday meals, from quick bowls to light plates." },
  {
    id: "dinner",
    name: "Dinner",
    description: "Weeknight suppers and dishes worth lingering over.",
  },
  { id: "snack", name: "Snacks", description: "Dips, nibbles and small bites between meals." },
  { id: "dessert", name: "Desserts", description: "Sweet things to finish a meal." },
];
