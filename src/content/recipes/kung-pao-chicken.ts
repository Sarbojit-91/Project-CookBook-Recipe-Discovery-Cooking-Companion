import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "kung-pao-chicken",
  title: "Kung Pao Chicken",
  description:
    "Sichuan-style stir-fried chicken with dried chillies, tingly Sichuan pepper and crunchy peanuts in a glossy sweet-sour sauce.",
  cuisine: "chinese",
  mealTypes: ["dinner"],
  difficulty: "medium",
  servings: 2,
  prepMinutes: 15,
  cookMinutes: 10,
  totalMinutes: 25,
  tags: ["spicy", "stir-fry", "quick"],
  seasons: [],
  addedAt: "2026-10-03",
  featured: false,
  image: {
    file: "kung-pao-chicken.jpg",
    alt: "A plate of stir-fried chicken with peanuts and chillies",
    credit: {
      photographer: "tommao wang",
      sourceUrl: "https://unsplash.com/photos/two-dishes-of-asian-food-on-a-table-ijx5tcp2lIg",
      license: "unsplash",
    },
  },
  ingredients: [
    { ingredient: "chicken-thigh", quantity: 350, unit: "g", preparation: "cut into 2 cm cubes" },
    { ingredient: "soy-sauce", quantity: 1, unit: "tbsp", group: "Marinade" },
    { ingredient: "cornflour", quantity: 2, unit: "tsp", group: "Marinade" },
    { ingredient: "soy-sauce", quantity: 1, unit: "tbsp", group: "Sauce" },
    { ingredient: "rice-vinegar", quantity: 1, unit: "tbsp", group: "Sauce" },
    { ingredient: "sugar", quantity: 2, unit: "tsp", group: "Sauce" },
    { ingredient: "cornflour", quantity: 1, unit: "tsp", group: "Sauce" },
    { ingredient: "water", quantity: 3, unit: "tbsp", group: "Sauce" },
    { ingredient: "vegetable-oil", quantity: 2, unit: "tbsp" },
    {
      ingredient: "dried-red-chillies",
      quantity: 8,
      unit: "piece",
      preparation: "snipped in half, seeds shaken out",
    },
    { ingredient: "sichuan-peppercorns", quantity: 1, unit: "tsp" },
    { ingredient: "garlic", quantity: 3, unit: "clove", preparation: "sliced" },
    { ingredient: "ginger", quantity: 1, unit: "tbsp", preparation: "finely chopped" },
    {
      ingredient: "spring-onion",
      quantity: 3,
      unit: "piece",
      preparation: "cut into 2 cm lengths",
    },
    { ingredient: "roasted-peanuts", quantity: 50, unit: "g" },
    {
      ingredient: "jasmine-rice",
      quantity: null,
      unit: null,
      optional: true,
      note: "Steamed, to serve",
    },
  ],
  steps: [
    {
      text: "Mix the chicken with the marinade soy sauce and cornflour and set aside for 10 minutes.",
      uses: ["chicken-thigh", "soy-sauce", "cornflour"],
    },
    {
      text: "Stir the sauce ingredients together in a small bowl.",
      uses: ["soy-sauce", "rice-vinegar", "sugar", "cornflour", "water"],
    },
    {
      text: "Heat the oil in a wok over a medium heat. Add the chillies and Sichuan peppercorns and stir for 20–30 seconds, until fragrant and the chillies darken — don't let them burn.",
      uses: ["vegetable-oil", "dried-red-chillies", "sichuan-peppercorns"],
    },
    {
      text: "Turn the heat to high, add the chicken and stir-fry for 3–4 minutes, until cooked through.",
      timerSeconds: 4 * 60,
    },
    {
      text: "Add the garlic, ginger and spring onions and stir-fry for 30 seconds.",
      uses: ["garlic", "ginger", "spring-onion"],
    },
    {
      text: "Stir the sauce, pour it in and toss for about 30 seconds, until thick and glossy. Stir in the peanuts and serve with steamed rice.",
      uses: ["roasted-peanuts", "jasmine-rice"],
    },
  ],
  tips: ["The dried chillies are for flavour — most people don't eat them."],
  nutrition: null,
} satisfies RecipeInput;
