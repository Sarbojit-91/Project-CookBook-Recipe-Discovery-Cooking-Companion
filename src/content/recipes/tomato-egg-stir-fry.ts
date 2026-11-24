import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "tomato-egg-stir-fry",
  title: "Tomato & Egg Stir-Fry",
  description:
    "Soft, silky scrambled egg folded into sweet, saucy tomatoes — a much-loved Chinese home dish that's ready in under 20 minutes.",
  cuisine: "chinese",
  mealTypes: ["lunch", "dinner"],
  difficulty: "easy",
  servings: 2,
  prepMinutes: 10,
  cookMinutes: 8,
  totalMinutes: 18,
  tags: ["quick", "budget", "stir-fry"],
  seasons: ["summer"],
  addedAt: "2026-10-13",
  featured: false,
  image: {
    file: "tomato-egg-stir-fry.jpg",
    alt: "Soft scrambled egg folded through saucy tomatoes on a plate",
    credit: {
      photographer: "Andrijana Bozic",
      sourceUrl: "https://unsplash.com/photos/a-plate-of-food-SBc3QKmqwpg",
      license: "unsplash",
    },
  },
  ingredients: [
    { ingredient: "egg", quantity: 4, unit: "piece", preparation: "beaten with a pinch of salt" },
    { ingredient: "vegetable-oil", quantity: 3, unit: "tbsp" },
    {
      ingredient: "tomato",
      quantity: 4,
      unit: "piece",
      preparation: "ripe, cut into wedges (about 500 g)",
    },
    { ingredient: "sugar", quantity: 2, unit: "tsp" },
    { ingredient: "salt", quantity: 0.5, unit: "tsp" },
    { ingredient: "water", quantity: 3, unit: "tbsp" },
    { ingredient: "spring-onion", quantity: 2, unit: "piece", preparation: "sliced" },
    {
      ingredient: "jasmine-rice",
      quantity: null,
      unit: null,
      optional: true,
      note: "Steamed, to serve",
    },
  ],
  steps: [
    {
      text: "Heat 2 tbsp oil in a wok over a medium-high heat. Pour in the eggs, let them set for 10 seconds, then gently push them into large, soft curds. Tip out while still a little runny.",
      uses: ["egg", "vegetable-oil"],
    },
    {
      text: "Add the remaining oil and stir-fry the tomatoes for about 2 minutes, until they start to collapse.",
      uses: ["vegetable-oil", "tomato"],
    },
    {
      text: "Add the sugar, salt and water and cook for 2–3 minutes, pressing some of the tomatoes to make a sauce.",
      uses: ["sugar", "salt", "water"],
    },
    {
      text: "Return the eggs and fold through for 30 seconds. Scatter with spring onions and serve over rice.",
      uses: ["spring-onion", "jasmine-rice"],
    },
  ],
  tips: ["Use the ripest tomatoes you can find — they make the sauce."],
  nutrition: null,
} satisfies RecipeInput;
