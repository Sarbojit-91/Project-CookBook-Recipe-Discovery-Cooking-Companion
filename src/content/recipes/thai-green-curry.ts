import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "thai-green-curry",
  title: "Thai Green Chicken Curry",
  description:
    "Tender chicken and green beans in a fragrant, creamy coconut curry with Thai basil. On the table in about 35 minutes.",
  cuisine: "thai",
  mealTypes: ["dinner"],
  difficulty: "easy",
  servings: 4,
  prepMinutes: 15,
  cookMinutes: 20,
  totalMinutes: 35,
  tags: ["spicy", "family"],
  seasons: [],
  addedAt: "2026-10-10",
  featured: false,
  image: {
    file: "thai-green-curry.jpg",
    alt: "A bowl of creamy green curry with herbs and a spoon",
    credit: {
      photographer: "You Le",
      sourceUrl: "https://unsplash.com/photos/a-bowl-of-soup-with-a-spoon-in-it-JTTxGQaFZKw",
      license: "unsplash",
    },
  },
  ingredients: [
    { ingredient: "jasmine-rice", quantity: 300, unit: "g", group: "To serve" },
    { ingredient: "vegetable-oil", quantity: 1, unit: "tbsp" },
    {
      ingredient: "thai-green-curry-paste",
      quantity: 3,
      unit: "tbsp",
      note: "Use less for a milder curry",
    },
    { ingredient: "coconut-milk", quantity: 400, unit: "ml", preparation: "1 can, shaken" },
    {
      ingredient: "chicken-thigh",
      quantity: 500,
      unit: "g",
      preparation: "cut into bite-sized pieces",
    },
    { ingredient: "water", quantity: 100, unit: "ml" },
    {
      ingredient: "makrut-lime-leaves",
      quantity: 4,
      unit: "piece",
      preparation: "torn",
      optional: true,
    },
    { ingredient: "fish-sauce", quantity: 1, unit: "tbsp" },
    { ingredient: "sugar", quantity: 2, unit: "tsp" },
    { ingredient: "green-beans", quantity: 150, unit: "g", preparation: "trimmed and halved" },
    {
      ingredient: "thai-holy-basil",
      quantity: 1,
      unit: "handful",
      note: "Thai sweet basil is traditional here",
    },
    {
      ingredient: "red-bird-eye-chilli",
      quantity: 1,
      unit: "piece",
      preparation: "sliced",
      optional: true,
      group: "To serve",
    },
  ],
  steps: [
    {
      text: "Rinse the rice and cook it according to the packet instructions.",
      timerSeconds: 12 * 60,
      uses: ["jasmine-rice"],
    },
    {
      text: "Heat the oil in a wok or large pan over a medium heat and fry the curry paste for 1–2 minutes, until fragrant.",
      uses: ["vegetable-oil", "thai-green-curry-paste"],
    },
    {
      text: "Pour in about a third of the coconut milk and simmer for 2 minutes, until the oil starts to separate.",
      uses: ["coconut-milk"],
    },
    { text: "Add the chicken, stir to coat and cook for 3 minutes.", uses: ["chicken-thigh"] },
    {
      text: "Add the remaining coconut milk, the water, lime leaves, fish sauce and sugar, and simmer for 8 minutes.",
      timerSeconds: 8 * 60,
      uses: ["coconut-milk", "water", "makrut-lime-leaves", "fish-sauce", "sugar"],
    },
    {
      text: "Add the beans and simmer for about 4 minutes more, until just tender and the chicken is cooked through.",
      timerSeconds: 4 * 60,
      uses: ["green-beans"],
    },
    {
      text: "Taste and balance with a little more fish sauce or sugar. Stir in the basil and serve with the rice and sliced chilli.",
      uses: ["thai-holy-basil", "red-bird-eye-chilli"],
    },
  ],
  tips: [
    "Most shop-bought green curry pastes contain shrimp paste — check the label if that matters to you.",
  ],
  nutrition: null,
} satisfies RecipeInput;
