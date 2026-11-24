import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "tomato-bruschetta",
  title: "Tomato & Basil Bruschetta",
  description:
    "Crisp, garlic-rubbed toast piled with juicy chopped tomatoes, basil and good olive oil. Best made with ripe summer tomatoes.",
  cuisine: "italian",
  mealTypes: ["snack", "lunch"],
  difficulty: "easy",
  servings: 4,
  prepMinutes: 15,
  cookMinutes: 5,
  totalMinutes: 20,
  tags: ["quick", "crowd-pleaser"],
  seasons: ["summer"],
  addedAt: "2026-10-14",
  featured: false,
  image: {
    file: "tomato-bruschetta.jpg",
    alt: "Slices of toasted bread topped with chopped tomato and herbs on a wooden board",
    credit: {
      photographer: "Mike van den Bos",
      sourceUrl:
        "https://unsplash.com/photos/brown-bread-with-tomato-and-green-vegetable-on-brown-wooden-table-F4qVqfkG2Aw",
      license: "unsplash",
    },
  },
  ingredients: [
    { ingredient: "tomato", quantity: 4, unit: "piece", preparation: "ripe, finely diced" },
    { ingredient: "fresh-basil", quantity: 1, unit: "handful", preparation: "shredded" },
    { ingredient: "olive-oil", quantity: 3, unit: "tbsp", note: "Plus extra to serve" },
    { ingredient: "salt", quantity: 0.5, unit: "tsp" },
    { ingredient: "black-pepper", quantity: null, unit: null },
    {
      ingredient: "crusty-bread",
      quantity: 8,
      unit: "slice",
      preparation: "thick slices of ciabatta or sourdough",
    },
    { ingredient: "garlic", quantity: 1, unit: "clove", preparation: "halved" },
  ],
  steps: [
    {
      text: "Mix the tomatoes, basil, oil, salt and pepper in a bowl and leave for 10 minutes so the juices start to run.",
      timerSeconds: 10 * 60,
      uses: ["tomato", "fresh-basil", "olive-oil", "salt", "black-pepper"],
    },
    {
      text: "Toast or griddle the bread for 1–2 minutes on each side, until golden and crisp at the edges.",
      uses: ["crusty-bread"],
    },
    { text: "Rub one side of each hot toast with the cut side of the garlic.", uses: ["garlic"] },
    {
      text: "Spoon the tomatoes over the toast, leaving most of the juice behind so the bread stays crisp. Drizzle with a little more oil and serve straight away.",
    },
  ],
  tips: ["Don't put the tomatoes on until you're ready to eat, or the toast goes soggy."],
  nutrition: null,
} satisfies RecipeInput;
