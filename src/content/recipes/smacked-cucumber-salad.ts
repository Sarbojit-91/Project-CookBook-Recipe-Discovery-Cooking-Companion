import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "smacked-cucumber-salad",
  title: "Smacked Cucumber Salad",
  description:
    "Crunchy smashed cucumber in a punchy garlic, soy, vinegar and chilli dressing. A cooling side dish or snack in minutes.",
  cuisine: "chinese",
  mealTypes: ["snack", "lunch"],
  difficulty: "easy",
  servings: 4,
  prepMinutes: 10,
  cookMinutes: 0,
  totalMinutes: 25,
  tags: ["no-cook", "salad"],
  seasons: ["summer"],
  addedAt: "2026-10-17",
  featured: false,
  image: {
    file: "smacked-cucumber-salad.jpg",
    alt: "Smashed cucumber pieces with chilli and sesame seeds in a bowl with chopsticks",
    credit: {
      photographer: "Alex Bayev",
      sourceUrl: "https://unsplash.com/photos/a-bowl-of-food-5ottS7B6ubU",
      license: "unsplash",
    },
  },
  ingredients: [
    { ingredient: "cucumber", quantity: 2, unit: "piece" },
    { ingredient: "salt", quantity: 1, unit: "tsp" },
    { ingredient: "garlic", quantity: 2, unit: "clove", preparation: "crushed", group: "Dressing" },
    { ingredient: "soy-sauce", quantity: 1, unit: "tbsp", group: "Dressing" },
    { ingredient: "rice-vinegar", quantity: 1.5, unit: "tbsp", group: "Dressing" },
    { ingredient: "sugar", quantity: 1, unit: "tsp", group: "Dressing" },
    { ingredient: "sesame-oil", quantity: 1, unit: "tsp", group: "Dressing" },
    { ingredient: "chilli-flakes", quantity: 0.5, unit: "tsp", group: "Dressing" },
    {
      ingredient: "sesame-seeds",
      quantity: 1,
      unit: "tsp",
      preparation: "toasted",
      group: "To serve",
    },
  ],
  steps: [
    {
      text: "Lay the cucumbers on a board and smash them with the flat of a large knife or a rolling pin until they crack open. Cut into bite-sized chunks.",
      uses: ["cucumber"],
    },
    {
      text: "Toss with the salt in a sieve and leave for 15 minutes to draw out the water. Shake dry.",
      timerSeconds: 15 * 60,
      uses: ["salt"],
    },
    {
      text: "Mix the garlic, soy sauce, vinegar, sugar, sesame oil and chilli flakes.",
      uses: ["garlic", "soy-sauce", "rice-vinegar", "sugar", "sesame-oil", "chilli-flakes"],
    },
    {
      text: "Toss the cucumber in the dressing, sprinkle with sesame seeds and serve cold within an hour.",
      uses: ["sesame-seeds"],
    },
  ],
  tips: ["Smashing rather than slicing gives rough edges that soak up more dressing."],
  nutrition: null,
} satisfies RecipeInput;
