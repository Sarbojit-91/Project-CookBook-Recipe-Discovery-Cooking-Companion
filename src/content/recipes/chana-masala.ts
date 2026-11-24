import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "chana-masala",
  title: "Chana Masala",
  description:
    "Chickpeas simmered in a tangy, deeply spiced onion and tomato masala — a store-cupboard favourite that tastes even better the next day.",
  cuisine: "indian",
  mealTypes: ["lunch", "dinner"],
  difficulty: "easy",
  servings: 4,
  prepMinutes: 10,
  cookMinutes: 35,
  totalMinutes: 45,
  tags: ["one-pot", "budget", "store-cupboard", "freezer-friendly"],
  seasons: ["autumn", "winter"],
  addedAt: "2026-10-04",
  featured: true,
  image: {
    file: "chana-masala.jpg",
    alt: "A pot of chickpea curry in a rich, spiced tomato sauce garnished with coriander",
    credit: {
      photographer: "Nosh Caterers",
      sourceUrl: "https://unsplash.com/photos/a-large-pot-of-food-on-a-table-XCL-jHI4BTU",
      license: "unsplash",
    },
  },
  ingredients: [
    { ingredient: "vegetable-oil", quantity: 2, unit: "tbsp" },
    { ingredient: "cumin-seeds", quantity: 1, unit: "tsp" },
    { ingredient: "onion", quantity: 2, unit: "piece", preparation: "finely chopped" },
    { ingredient: "garlic", quantity: 4, unit: "clove", preparation: "finely grated" },
    { ingredient: "ginger", quantity: 1, unit: "tbsp", preparation: "finely grated" },
    { ingredient: "green-chilli", quantity: 1, unit: "piece", preparation: "slit lengthways" },
    { ingredient: "ground-coriander", quantity: 2, unit: "tsp", group: "Spices" },
    { ingredient: "ground-cumin", quantity: 1, unit: "tsp", group: "Spices" },
    { ingredient: "ground-turmeric", quantity: 0.5, unit: "tsp", group: "Spices" },
    { ingredient: "kashmiri-chilli-powder", quantity: 1, unit: "tsp", group: "Spices" },
    { ingredient: "chopped-tomatoes", quantity: 400, unit: "g" },
    {
      ingredient: "chickpeas",
      quantity: 2,
      unit: "can",
      preparation: "400 g cans, drained and rinsed",
    },
    { ingredient: "water", quantity: 200, unit: "ml" },
    { ingredient: "salt", quantity: 1, unit: "tsp", note: "Adjust to taste" },
    { ingredient: "garam-masala", quantity: 1, unit: "tsp", group: "To finish" },
    {
      ingredient: "lemon",
      quantity: 0.5,
      unit: "piece",
      preparation: "juiced",
      group: "To finish",
    },
    {
      ingredient: "fresh-coriander",
      quantity: 1,
      unit: "handful",
      preparation: "chopped",
      group: "To finish",
    },
  ],
  steps: [
    {
      text: "Heat the oil in a large pan over a medium heat. Add the cumin seeds and let them sizzle for about 30 seconds.",
      uses: ["vegetable-oil", "cumin-seeds"],
    },
    {
      text: "Add the onions and cook for 10–12 minutes, stirring often, until golden.",
      timerSeconds: 10 * 60,
      uses: ["onion"],
    },
    {
      text: "Add the garlic, ginger and green chilli and cook for 1 minute.",
      uses: ["garlic", "ginger", "green-chilli"],
    },
    {
      text: "Turn the heat down, add the ground spices with a splash of water so they don't burn, and stir for 1 minute.",
      uses: ["ground-coriander", "ground-cumin", "ground-turmeric", "kashmiri-chilli-powder"],
    },
    {
      text: "Add the tomatoes and cook for about 8 minutes, stirring often, until thick and the oil starts to separate at the edges.",
      timerSeconds: 8 * 60,
      uses: ["chopped-tomatoes"],
    },
    {
      text: "Add the chickpeas, water and salt. Simmer for 15 minutes, mashing a few chickpeas against the side of the pan to thicken the sauce.",
      timerSeconds: 15 * 60,
      uses: ["chickpeas", "water", "salt"],
    },
    {
      text: "Stir in the garam masala and lemon juice, taste for salt and scatter with coriander.",
      uses: ["garam-masala", "lemon", "fresh-coriander"],
    },
  ],
  tips: [
    "Serve with rice, naan or warm flatbreads.",
    "Like most curries, it tastes even better the next day.",
  ],
  nutrition: null,
} satisfies RecipeInput;
