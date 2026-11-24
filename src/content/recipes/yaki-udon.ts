import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "yaki-udon",
  title: "Vegetable Yaki Udon",
  description:
    "Thick, chewy udon noodles stir-fried with cabbage, carrot and mushrooms in a sweet soy and mirin sauce. A 20-minute supper.",
  cuisine: "japanese",
  mealTypes: ["lunch", "dinner"],
  difficulty: "easy",
  servings: 2,
  prepMinutes: 10,
  cookMinutes: 10,
  totalMinutes: 20,
  tags: ["quick", "stir-fry"],
  seasons: [],
  addedAt: "2026-10-27",
  featured: false,
  image: {
    file: "yaki-udon.jpg",
    alt: "A bowl of stir-fried noodles with vegetables",
    credit: {
      photographer: "Ryan Kwok",
      sourceUrl: "https://unsplash.com/photos/bowl-of-cooked-food-H6iSwrAOMG0",
      license: "unsplash",
    },
  },
  ingredients: [
    { ingredient: "udon-noodles", quantity: 400, unit: "g", preparation: "2 × 200 g packs" },
    { ingredient: "soy-sauce", quantity: 2, unit: "tbsp", group: "Sauce" },
    { ingredient: "mirin", quantity: 1, unit: "tbsp", group: "Sauce" },
    { ingredient: "sugar", quantity: 1, unit: "tsp", group: "Sauce" },
    { ingredient: "vegetable-oil", quantity: 1.5, unit: "tbsp" },
    { ingredient: "onion", quantity: 0.5, unit: "piece", preparation: "sliced" },
    { ingredient: "carrot", quantity: 1, unit: "piece", preparation: "cut into matchsticks" },
    { ingredient: "white-cabbage", quantity: 150, unit: "g", preparation: "shredded" },
    { ingredient: "chestnut-mushroom", quantity: 100, unit: "g", preparation: "sliced" },
    { ingredient: "sesame-oil", quantity: 1, unit: "tsp" },
    { ingredient: "spring-onion", quantity: 2, unit: "piece", preparation: "sliced" },
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
      text: "Put the noodles in a bowl, pour over boiling water and leave for 1 minute. Gently separate them, then drain.",
      uses: ["udon-noodles"],
    },
    { text: "Mix the soy sauce, mirin and sugar.", uses: ["soy-sauce", "mirin", "sugar"] },
    {
      text: "Heat the oil in a wok over a high heat. Stir-fry the onion and carrot for 2 minutes, then add the cabbage and mushrooms and cook for 2–3 minutes, until wilted and lightly coloured.",
      uses: ["vegetable-oil", "onion", "carrot", "white-cabbage", "chestnut-mushroom"],
    },
    {
      text: "Add the noodles and sauce and toss for about 2 minutes, until hot and evenly coated.",
    },
    {
      text: "Take off the heat, stir in the sesame oil and spring onions, and top with sesame seeds.",
      uses: ["sesame-oil", "spring-onion", "sesame-seeds"],
    },
  ],
  tips: ["Most ready-to-wok udon and mirin are vegan, but check the labels."],
  nutrition: null,
} satisfies RecipeInput;
