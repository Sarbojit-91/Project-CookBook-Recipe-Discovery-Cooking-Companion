import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "leek-potato-soup",
  title: "Leek & Potato Soup",
  description:
    "A silky, comforting soup of gently sweated leeks and potatoes — simple, thrifty and perfect with crusty bread.",
  cuisine: "british",
  mealTypes: ["lunch"],
  difficulty: "easy",
  servings: 4,
  prepMinutes: 15,
  cookMinutes: 35,
  totalMinutes: 50,
  tags: ["comfort-food", "freezer-friendly", "budget", "soup"],
  seasons: ["autumn", "winter"],
  addedAt: "2026-10-30",
  featured: false,
  image: {
    file: "leek-potato-soup.jpg",
    alt: "A bowl of smooth pale green soup topped with fresh herbs",
    credit: {
      photographer: "Megan Bucknall",
      sourceUrl: "https://unsplash.com/photos/green-soup-on-white-ceramic-bowl-qav5LFLbSUk",
      license: "unsplash",
    },
  },
  ingredients: [
    { ingredient: "butter", quantity: 40, unit: "g" },
    { ingredient: "leek", quantity: 3, unit: "piece", preparation: "trimmed, washed and sliced" },
    { ingredient: "onion", quantity: 1, unit: "piece", preparation: "chopped" },
    { ingredient: "potato-floury", quantity: 400, unit: "g", preparation: "peeled and diced" },
    { ingredient: "vegetable-stock", quantity: 1, unit: "l" },
    { ingredient: "milk", quantity: 150, unit: "ml" },
    { ingredient: "salt", quantity: null, unit: null },
    { ingredient: "black-pepper", quantity: null, unit: null },
    {
      ingredient: "fresh-chives",
      quantity: 1,
      unit: "tbsp",
      preparation: "snipped",
      optional: true,
      group: "To serve",
    },
  ],
  steps: [
    {
      text: "Melt the butter in a large pan over a medium-low heat. Add the leeks, onion and a pinch of salt, cover and sweat for 10 minutes, stirring now and then, until soft but not browned.",
      timerSeconds: 10 * 60,
      uses: ["butter", "leek", "onion", "salt"],
    },
    {
      text: "Add the potatoes and stock, bring to the boil, then simmer, partly covered, for 20 minutes until the potatoes are very tender.",
      timerSeconds: 20 * 60,
      uses: ["potato-floury", "vegetable-stock"],
    },
    { text: "Blend until smooth with a stick blender, or leave it chunky if you prefer." },
    {
      text: "Stir in the milk and reheat gently without boiling. Season to taste and serve topped with chives.",
      uses: ["milk", "salt", "black-pepper", "fresh-chives"],
    },
  ],
  tips: [
    "Leeks hide grit between their layers — slice them first, then rinse well in a bowl of water.",
  ],
  nutrition: null,
} satisfies RecipeInput;
