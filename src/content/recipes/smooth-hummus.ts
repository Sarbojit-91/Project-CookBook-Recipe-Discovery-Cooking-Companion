import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "smooth-hummus",
  title: "Extra-Smooth Hummus",
  description:
    "Whipped, creamy hummus made with tinned chickpeas, plenty of tahini and ice-cold water. No cooking needed.",
  cuisine: "mediterranean",
  mealTypes: ["snack"],
  difficulty: "easy",
  servings: 6,
  prepMinutes: 15,
  cookMinutes: 0,
  totalMinutes: 15,
  tags: ["no-cook", "dip", "make-ahead", "budget"],
  seasons: [],
  addedAt: "2026-11-21",
  featured: false,
  image: null,
  ingredients: [
    {
      ingredient: "chickpeas",
      quantity: 1,
      unit: "can",
      preparation: "400 g can, drained and rinsed",
    },
    { ingredient: "tahini", quantity: 4, unit: "tbsp", preparation: "well stirred" },
    { ingredient: "lemon", quantity: 1, unit: "piece", preparation: "juiced" },
    { ingredient: "garlic", quantity: 1, unit: "clove" },
    { ingredient: "ground-cumin", quantity: 0.5, unit: "tsp" },
    { ingredient: "salt", quantity: 0.5, unit: "tsp" },
    { ingredient: "water", quantity: 4, unit: "tbsp", preparation: "ice-cold" },
    { ingredient: "olive-oil", quantity: 1, unit: "tbsp", group: "To serve" },
    { ingredient: "sweet-paprika", quantity: 1, unit: "pinch", group: "To serve" },
  ],
  steps: [
    {
      text: "For the smoothest hummus, pinch the skins off the chickpeas. It takes about 5 minutes and is worth it, but you can skip it.",
      uses: ["chickpeas"],
    },
    {
      text: "Blend the tahini and lemon juice in a food processor for about 1 minute, until thick and pale.",
      uses: ["tahini", "lemon"],
    },
    {
      text: "Add the garlic, cumin, salt and chickpeas and blend for 2 minutes, scraping down the sides once or twice.",
      timerSeconds: 2 * 60,
      uses: ["garlic", "ground-cumin", "salt", "chickpeas"],
    },
    {
      text: "With the motor running, add the ice-cold water a spoonful at a time and keep blending for 1–2 minutes more, until very smooth and creamy.",
      uses: ["water"],
    },
    {
      text: "Taste and add more salt or lemon if needed. Spoon into a shallow bowl, swirl the top with the back of a spoon, drizzle with oil and dust with paprika.",
      uses: ["olive-oil", "sweet-paprika"],
    },
  ],
  tips: ["Keeps in a covered container in the fridge for up to 4 days."],
  nutrition: null,
} satisfies RecipeInput;
