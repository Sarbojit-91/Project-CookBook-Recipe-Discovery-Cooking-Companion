import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "shakshuka",
  title: "Shakshuka",
  description:
    "Eggs gently poached in a sweet, spiced tomato and pepper sauce — a one-pan breakfast made for mopping up with bread.",
  cuisine: "mediterranean",
  mealTypes: ["breakfast", "lunch"],
  difficulty: "easy",
  servings: 2,
  prepMinutes: 10,
  cookMinutes: 30,
  totalMinutes: 40,
  tags: ["one-pan", "brunch"],
  seasons: ["spring", "summer"],
  addedAt: "2026-11-19",
  featured: false,
  image: null,
  ingredients: [
    { ingredient: "olive-oil", quantity: 2, unit: "tbsp" },
    { ingredient: "onion", quantity: 1, unit: "piece", preparation: "thinly sliced" },
    { ingredient: "red-pepper", quantity: 1, unit: "piece", preparation: "thinly sliced" },
    { ingredient: "garlic", quantity: 3, unit: "clove", preparation: "thinly sliced" },
    { ingredient: "ground-cumin", quantity: 1, unit: "tsp" },
    { ingredient: "sweet-paprika", quantity: 1, unit: "tsp" },
    { ingredient: "chilli-flakes", quantity: 0.25, unit: "tsp", optional: true },
    { ingredient: "chopped-tomatoes", quantity: 400, unit: "g" },
    { ingredient: "salt", quantity: 0.5, unit: "tsp" },
    { ingredient: "black-pepper", quantity: null, unit: null },
    { ingredient: "egg", quantity: 4, unit: "piece" },
    { ingredient: "flat-leaf-parsley", quantity: 1, unit: "handful", preparation: "chopped" },
    { ingredient: "crusty-bread", quantity: null, unit: null, optional: true, note: "To serve" },
  ],
  steps: [
    {
      text: "Heat the oil in a large frying pan that has a lid over a medium heat. Cook the onion and pepper for about 10 minutes, until soft and sweet.",
      timerSeconds: 10 * 60,
      uses: ["olive-oil", "onion", "red-pepper"],
    },
    {
      text: "Add the garlic, cumin, paprika and chilli flakes, if using, and cook for 1 minute.",
      uses: ["garlic", "ground-cumin", "sweet-paprika", "chilli-flakes"],
    },
    {
      text: "Add the tomatoes and salt and simmer for about 10 minutes, stirring now and then, until thickened. Taste and season with pepper.",
      timerSeconds: 10 * 60,
      uses: ["chopped-tomatoes", "salt", "black-pepper"],
    },
    {
      text: "Use a spoon to make 4 hollows in the sauce and crack an egg into each one. Season the eggs lightly.",
      uses: ["egg"],
    },
    {
      text: "Cover and cook over a low–medium heat for 5–8 minutes, until the whites are set but the yolks are still runny.",
      timerSeconds: 6 * 60,
    },
    {
      text: "Scatter with parsley and serve straight from the pan, with crusty bread for dipping.",
      uses: ["flat-leaf-parsley", "crusty-bread"],
    },
  ],
  tips: ["For firmer yolks, cook for a couple of minutes longer with the lid on."],
  nutrition: null,
} satisfies RecipeInput;
