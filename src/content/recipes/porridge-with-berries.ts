import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "porridge-with-berries",
  title: "Creamy Porridge with Berries",
  description:
    "Slow-stirred oats cooked in milk until thick and creamy, topped with fresh berries and a sprinkle of brown sugar.",
  cuisine: "british",
  mealTypes: ["breakfast"],
  difficulty: "easy",
  servings: 2,
  prepMinutes: 2,
  cookMinutes: 8,
  totalMinutes: 10,
  tags: ["quick", "budget"],
  seasons: ["autumn", "winter"],
  addedAt: "2026-11-01",
  featured: false,
  image: {
    file: "porridge-with-berries.jpg",
    alt: "A bowl of oats topped with strawberries, blueberries and raspberries",
    credit: {
      photographer: "Eiliv Aceron",
      sourceUrl:
        "https://unsplash.com/photos/red-strawberries-and-blue-berries-on-white-ceramic-bowl-uzdfBCKwKTk",
      license: "unsplash",
    },
  },
  ingredients: [
    { ingredient: "rolled-oats", quantity: 80, unit: "g" },
    { ingredient: "milk", quantity: 300, unit: "ml", note: "Plus extra to loosen" },
    { ingredient: "water", quantity: 200, unit: "ml" },
    { ingredient: "salt", quantity: 1, unit: "pinch" },
    { ingredient: "fresh-berries", quantity: 150, unit: "g", group: "To serve" },
    {
      ingredient: "soft-brown-sugar",
      quantity: 2,
      unit: "tsp",
      group: "To serve",
      note: "Or a drizzle of maple syrup",
    },
  ],
  steps: [
    {
      text: "Put the oats, milk, water and salt in a saucepan.",
      uses: ["rolled-oats", "milk", "water", "salt"],
    },
    {
      text: "Bring to the boil, then lower the heat and simmer for 5–6 minutes, stirring often, until thick and creamy. Add a splash more milk if it gets too thick.",
      timerSeconds: 5 * 60,
    },
    {
      text: "Spoon into bowls and top with the berries and a sprinkle of sugar.",
      uses: ["fresh-berries", "soft-brown-sugar"],
    },
  ],
  tips: [
    "A pinch of salt doesn't make porridge salty — it brings out the oats' natural sweetness.",
  ],
  nutrition: null,
} satisfies RecipeInput;
