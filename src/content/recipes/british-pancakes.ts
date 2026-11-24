import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "british-pancakes",
  title: "Thin British Pancakes",
  description:
    "Lacy, thin pancakes in the British style, served simply with a squeeze of lemon and a sprinkle of sugar.",
  cuisine: "british",
  mealTypes: ["breakfast", "dessert"],
  difficulty: "easy",
  servings: 4,
  prepMinutes: 5,
  cookMinutes: 20,
  totalMinutes: 25,
  tags: ["sweet", "family", "budget"],
  seasons: ["winter", "spring"],
  addedAt: "2026-11-20",
  featured: false,
  image: {
    file: "british-pancakes.jpg",
    alt: "Thin folded pancakes stacked on a white and blue plate",
    credit: {
      photographer: "M Draa",
      sourceUrl: "https://unsplash.com/photos/white-and-blue-ceramic-plate-26NcU5Vkd5o",
      license: "unsplash",
    },
  },
  ingredients: [
    { ingredient: "plain-flour", quantity: 100, unit: "g", group: "For the batter" },
    { ingredient: "salt", quantity: 1, unit: "pinch", group: "For the batter" },
    { ingredient: "egg", quantity: 2, unit: "piece", group: "For the batter" },
    { ingredient: "milk", quantity: 300, unit: "ml", group: "For the batter" },
    {
      ingredient: "butter",
      quantity: 15,
      unit: "g",
      preparation: "melted",
      group: "For the batter",
    },
    {
      ingredient: "vegetable-oil",
      quantity: 1,
      unit: "tbsp",
      note: "For greasing the pan",
      group: "For the batter",
    },
    {
      ingredient: "lemon",
      quantity: 1,
      unit: "piece",
      preparation: "cut into wedges",
      group: "To serve",
    },
    { ingredient: "caster-sugar", quantity: 4, unit: "tbsp", group: "To serve" },
  ],
  steps: [
    {
      text: "Sift the flour and salt into a large bowl, make a well in the centre and crack in the eggs.",
      uses: ["plain-flour", "salt", "egg"],
    },
    {
      text: "Whisk, gradually pouring in the milk, until you have a smooth batter about as thick as single cream. Whisk in the melted butter. If you have time, rest the batter for 30 minutes.",
      uses: ["milk", "butter"],
    },
    {
      text: "Heat a 20 cm frying pan over a medium-high heat and wipe it with kitchen paper dipped in oil.",
      uses: ["vegetable-oil"],
    },
    {
      text: "Pour in about 3 tablespoons of batter and swirl to coat the base thinly. Cook for about 1 minute, until the underside is golden.",
    },
    {
      text: "Flip with a palette knife and cook for 30 seconds more. Repeat with the remaining batter, re-oiling the pan as needed and stacking the pancakes between sheets of baking paper.",
    },
    {
      text: "Serve with a squeeze of lemon and a sprinkle of sugar, rolled up or folded into quarters.",
      uses: ["lemon", "caster-sugar"],
    },
  ],
  tips: ["The first pancake is often a tester — use it to adjust the heat and amount of batter."],
  nutrition: null,
} satisfies RecipeInput;
