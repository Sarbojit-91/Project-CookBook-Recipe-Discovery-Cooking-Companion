import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "pasta-pomodoro",
  title: "Pasta al Pomodoro",
  description:
    "Spaghetti in a glossy, slow-simmered tomato sauce with garlic, olive oil and torn basil. Simple, and all the better for it.",
  cuisine: "italian",
  mealTypes: ["lunch", "dinner"],
  difficulty: "easy",
  servings: 4,
  prepMinutes: 5,
  cookMinutes: 25,
  totalMinutes: 30,
  tags: ["store-cupboard", "budget", "family"],
  seasons: ["summer"],
  addedAt: "2026-10-02",
  featured: false,
  image: {
    file: "pasta-pomodoro.jpg",
    alt: "A plate of spaghetti in tomato sauce topped with tomatoes",
    credit: {
      photographer: "Paish Zaini",
      sourceUrl:
        "https://unsplash.com/photos/a-white-plate-topped-with-spaghetti-and-tomatoes--9UJTnXpUXM",
      license: "unsplash",
    },
  },
  ingredients: [
    { ingredient: "olive-oil", quantity: 4, unit: "tbsp", note: "Plus extra to serve" },
    { ingredient: "garlic", quantity: 3, unit: "clove", preparation: "thinly sliced" },
    { ingredient: "chilli-flakes", quantity: 1, unit: "pinch", optional: true },
    { ingredient: "chopped-tomatoes", quantity: 800, unit: "g", preparation: "2 × 400 g cans" },
    { ingredient: "salt", quantity: 1, unit: "tsp" },
    {
      ingredient: "sugar",
      quantity: 1,
      unit: "pinch",
      optional: true,
      note: "Only if the tomatoes taste sharp",
    },
    { ingredient: "fresh-basil", quantity: 1, unit: "handful" },
    { ingredient: "spaghetti", quantity: 400, unit: "g" },
    { ingredient: "salt", quantity: 1, unit: "tbsp", note: "For the pasta water" },
  ],
  steps: [
    {
      text: "Heat the oil in a wide pan over a medium-low heat. Cook the garlic gently for about 2 minutes, until fragrant and barely golden, adding the chilli flakes if using.",
      uses: ["olive-oil", "garlic", "chilli-flakes"],
    },
    {
      text: "Add the tomatoes, salt and half the basil, torn. Simmer for about 20 minutes, stirring now and then, until thick and glossy. Taste, and add a pinch of sugar if the sauce is sharp.",
      timerSeconds: 20 * 60,
      uses: ["chopped-tomatoes", "salt", "sugar", "fresh-basil"],
    },
    {
      text: "Meanwhile, cook the spaghetti in a large pan of salted boiling water for 1 minute less than the packet says.",
      timerSeconds: 9 * 60,
      uses: ["spaghetti", "salt"],
    },
    {
      text: "Save a mugful of pasta water, then drain. Toss the spaghetti into the sauce with a splash of the water for about 1 minute, until well coated. Tear in the remaining basil and finish with a drizzle of oil.",
      uses: ["fresh-basil", "olive-oil"],
    },
  ],
  tips: ["For a vegetarian (not vegan) version, finish with grated vegetarian hard cheese."],
  nutrition: null,
} satisfies RecipeInput;
