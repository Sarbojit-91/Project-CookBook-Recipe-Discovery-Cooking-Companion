import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "mango-sticky-rice",
  title: "Mango Sticky Rice",
  description:
    "Soft, sweet coconut-soaked sticky rice with ripe mango and a drizzle of salty-sweet coconut sauce — Thailand's favourite dessert.",
  cuisine: "thai",
  mealTypes: ["dessert"],
  difficulty: "medium",
  servings: 4,
  prepMinutes: 10,
  cookMinutes: 30,
  totalMinutes: 300,
  tags: ["sweet", "make-ahead"],
  seasons: ["summer"],
  addedAt: "2026-10-16",
  featured: false,
  image: {
    file: "mango-sticky-rice.jpg",
    alt: "Slices of ripe mango beside a mound of sticky rice on a banana leaf",
    credit: {
      photographer: "Markus Winkler",
      sourceUrl:
        "https://unsplash.com/photos/a-plate-of-food-with-rice-mango-and-sauce-bKrXKkPkhas",
      license: "unsplash",
    },
  },
  ingredients: [
    { ingredient: "glutinous-rice", quantity: 200, unit: "g", group: "For the rice" },
    { ingredient: "coconut-milk", quantity: 250, unit: "ml", group: "For the rice" },
    { ingredient: "sugar", quantity: 60, unit: "g", group: "For the rice" },
    { ingredient: "salt", quantity: 0.5, unit: "tsp", group: "For the rice" },
    { ingredient: "coconut-milk", quantity: 150, unit: "ml", group: "Coconut sauce" },
    { ingredient: "sugar", quantity: 1, unit: "tbsp", group: "Coconut sauce" },
    { ingredient: "salt", quantity: 1, unit: "pinch", group: "Coconut sauce" },
    { ingredient: "ripe-mango", quantity: 2, unit: "piece", group: "To serve" },
    {
      ingredient: "sesame-seeds",
      quantity: 1,
      unit: "tsp",
      preparation: "toasted",
      optional: true,
      group: "To serve",
    },
  ],
  steps: [
    {
      text: "Rinse the rice until the water runs clear, then cover with plenty of cold water and leave to soak for 4 hours or overnight.",
      uses: ["glutinous-rice"],
    },
    {
      text: "Drain the rice and steam it in a steamer lined with muslin or baking paper over simmering water for 20–25 minutes, until translucent and tender.",
      timerSeconds: 20 * 60,
    },
    {
      text: "Meanwhile, warm 250 ml coconut milk with the sugar and salt, stirring until dissolved. Don't let it boil.",
      uses: ["coconut-milk", "sugar", "salt"],
    },
    {
      text: "Tip the hot rice into a bowl, pour over the sweet coconut milk and stir. Cover and leave for 20 minutes to soak it up.",
      timerSeconds: 20 * 60,
    },
    {
      text: "For the sauce, simmer the remaining coconut milk with the sugar and a pinch of salt for 3–4 minutes, until slightly thickened.",
      uses: ["coconut-milk", "sugar", "salt"],
    },
    {
      text: "Peel and slice the mangoes. Serve the rice with the mango alongside, the sauce drizzled over and a sprinkle of sesame seeds.",
      uses: ["ripe-mango", "sesame-seeds"],
    },
  ],
  tips: [
    "No steamer? A metal sieve set over a pan of simmering water, covered with a lid, works well.",
  ],
  nutrition: null,
} satisfies RecipeInput;
