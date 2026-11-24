import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "egg-fried-rice",
  title: "Egg Fried Rice",
  description:
    "Fluffy scrambled egg, peas and spring onions tossed with day-old rice in a hot wok — a 20-minute way to use up leftovers.",
  cuisine: "chinese",
  mealTypes: ["lunch", "dinner"],
  difficulty: "easy",
  servings: 2,
  prepMinutes: 10,
  cookMinutes: 10,
  totalMinutes: 20,
  tags: ["quick", "leftovers", "stir-fry", "budget"],
  seasons: [],
  addedAt: "2026-11-22",
  featured: false,
  image: null,
  ingredients: [
    {
      ingredient: "jasmine-rice",
      quantity: 450,
      unit: "g",
      preparation: "cooked and chilled",
      note: "About 150 g uncooked rice",
    },
    { ingredient: "egg", quantity: 3, unit: "piece", preparation: "beaten with a pinch of salt" },
    { ingredient: "vegetable-oil", quantity: 2, unit: "tbsp" },
    { ingredient: "garlic", quantity: 2, unit: "clove", preparation: "finely chopped" },
    {
      ingredient: "spring-onion",
      quantity: 3,
      unit: "piece",
      preparation: "sliced, whites and greens kept separate",
    },
    { ingredient: "frozen-peas", quantity: 100, unit: "g" },
    { ingredient: "soy-sauce", quantity: 1.5, unit: "tbsp" },
    { ingredient: "white-pepper", quantity: 1, unit: "pinch" },
    { ingredient: "sesame-oil", quantity: 1, unit: "tsp" },
  ],
  steps: [
    {
      text: "Break up the cold rice with your fingers so there are no clumps.",
      uses: ["jasmine-rice"],
    },
    {
      text: "Heat 1 tbsp oil in a wok over a high heat. Pour in the eggs and scramble for 30–60 seconds, until just set. Tip onto a plate.",
      uses: ["vegetable-oil", "egg"],
    },
    {
      text: "Add the remaining oil, then the garlic and spring onion whites and stir-fry for 30 seconds. Add the peas and cook for 1 minute.",
      uses: ["vegetable-oil", "garlic", "spring-onion", "frozen-peas"],
    },
    {
      text: "Add the rice and stir-fry for 3–4 minutes, pressing it against the hot wok, until piping hot and the grains are separate.",
      timerSeconds: 4 * 60,
      uses: ["jasmine-rice"],
    },
    {
      text: "Add the soy sauce and white pepper, return the eggs and toss for 1 minute. Take off the heat and stir through the sesame oil and spring onion greens.",
      uses: ["soy-sauce", "white-pepper", "egg", "sesame-oil", "spring-onion"],
    },
  ],
  tips: [
    "Freshly cooked rice turns mushy. If you don't have leftovers, spread just-cooked rice on a tray and chill it for an hour first.",
    "Cool leftover rice quickly and keep it in the fridge for no more than a day before frying.",
  ],
  nutrition: null,
} satisfies RecipeInput;
