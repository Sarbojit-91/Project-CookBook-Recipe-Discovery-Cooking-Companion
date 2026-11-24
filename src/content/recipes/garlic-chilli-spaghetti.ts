import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "garlic-chilli-spaghetti",
  title: "Garlic & Chilli Spaghetti",
  description:
    "A store-cupboard classic: spaghetti tossed in golden garlic oil, chilli and parsley, ready in about 20 minutes.",
  cuisine: "italian",
  mealTypes: ["lunch", "dinner"],
  difficulty: "easy",
  servings: 2,
  prepMinutes: 5,
  cookMinutes: 15,
  totalMinutes: 20,
  tags: ["quick", "store-cupboard", "budget"],
  seasons: [],
  addedAt: "2026-11-08",
  featured: false,
  image: null,
  ingredients: [
    { ingredient: "spaghetti", quantity: 200, unit: "g" },
    { ingredient: "salt", quantity: 1, unit: "tbsp", note: "For the pasta water" },
    { ingredient: "olive-oil", quantity: 5, unit: "tbsp" },
    { ingredient: "garlic", quantity: 4, unit: "clove", preparation: "thinly sliced" },
    { ingredient: "chilli-flakes", quantity: 0.5, unit: "tsp", note: "Use more or less to taste" },
    {
      ingredient: "flat-leaf-parsley",
      quantity: 1,
      unit: "handful",
      preparation: "finely chopped",
    },
    { ingredient: "lemon", quantity: 0.5, unit: "piece", preparation: "zested", optional: true },
    { ingredient: "black-pepper", quantity: null, unit: null },
  ],
  steps: [
    {
      text: "Bring a large pan of water to the boil and add the salt. Cook the spaghetti for 1 minute less than the packet says.",
      timerSeconds: 9 * 60,
      uses: ["spaghetti", "salt"],
    },
    {
      text: "While the pasta cooks, put the oil and garlic in a large, cold frying pan. Set it over a low heat and cook gently for 3–4 minutes, until the garlic is pale gold — browned garlic tastes bitter. Add the chilli flakes for the last 30 seconds.",
      uses: ["olive-oil", "garlic", "chilli-flakes"],
    },
    {
      text: "Scoop out a mugful of the pasta water, then drain the spaghetti. Add it to the frying pan with 4 tablespoons of the pasta water.",
    },
    {
      text: "Toss over a medium heat for 1–2 minutes, until the oil and water come together into a light, glossy coating. Add more pasta water if it looks dry. Stir in the parsley and lemon zest, season with pepper and serve straight away.",
      uses: ["flat-leaf-parsley", "lemon", "black-pepper"],
    },
  ],
  tips: ["The starchy pasta water is what makes the sauce cling, so don't skip saving it."],
  nutrition: null,
} satisfies RecipeInput;
