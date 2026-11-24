import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "masala-omelette",
  title: "Masala Omelette",
  description:
    "A fluffy Indian-style omelette flecked with onion, tomato, green chilli and coriander — breakfast in ten minutes.",
  cuisine: "indian",
  mealTypes: ["breakfast"],
  difficulty: "easy",
  servings: 1,
  prepMinutes: 5,
  cookMinutes: 5,
  totalMinutes: 10,
  tags: ["quick", "brunch"],
  seasons: [],
  addedAt: "2026-10-08",
  featured: false,
  image: {
    file: "masala-omelette.jpg",
    alt: "A folded omelette served on a plate with salad and toast",
    credit: {
      photographer: "Amin Zabardast",
      sourceUrl:
        "https://unsplash.com/photos/omelette-with-salad-and-toast-served-on-a-plate-TpdD-DDOF6Q",
      license: "unsplash",
    },
  },
  ingredients: [
    { ingredient: "egg", quantity: 3, unit: "piece" },
    { ingredient: "ground-turmeric", quantity: 1, unit: "pinch" },
    { ingredient: "salt", quantity: 1, unit: "pinch" },
    { ingredient: "black-pepper", quantity: null, unit: null },
    { ingredient: "onion", quantity: 0.5, unit: "piece", preparation: "small, finely chopped" },
    {
      ingredient: "tomato",
      quantity: 0.5,
      unit: "piece",
      preparation: "deseeded and finely chopped",
    },
    { ingredient: "green-chilli", quantity: 1, unit: "piece", preparation: "finely chopped" },
    { ingredient: "fresh-coriander", quantity: 1, unit: "tbsp", preparation: "chopped" },
    { ingredient: "vegetable-oil", quantity: 1, unit: "tbsp" },
  ],
  steps: [
    {
      text: "Beat the eggs with the turmeric, salt and pepper until frothy.",
      uses: ["egg", "ground-turmeric", "salt", "black-pepper"],
    },
    {
      text: "Stir in the onion, tomato, chilli and coriander.",
      uses: ["onion", "tomato", "green-chilli", "fresh-coriander"],
    },
    {
      text: "Heat the oil in a 20–24 cm non-stick frying pan over a medium heat. Pour in the eggs and tilt the pan to spread them evenly.",
      uses: ["vegetable-oil"],
    },
    {
      text: "Cook for about 2 minutes, until the underside is golden and the top is almost set. Fold or flip and cook for 30–60 seconds more.",
      timerSeconds: 2 * 60,
    },
    { text: "Serve straight away with buttered toast or a warm paratha." },
  ],
  tips: ["Chop the vegetables finely so the omelette holds together when you fold it."],
  nutrition: null,
} satisfies RecipeInput;
