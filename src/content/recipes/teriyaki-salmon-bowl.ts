import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "teriyaki-salmon-bowl",
  title: "Teriyaki Salmon Rice Bowl",
  description:
    "Crisp-skinned salmon glazed in a homemade soy, mirin and sake teriyaki, served over short-grain rice with cucumber.",
  cuisine: "japanese",
  mealTypes: ["dinner"],
  difficulty: "easy",
  servings: 2,
  prepMinutes: 10,
  cookMinutes: 25,
  totalMinutes: 35,
  tags: ["rice-bowl"],
  seasons: ["spring"],
  addedAt: "2026-11-23",
  featured: true,
  image: null,
  ingredients: [
    { ingredient: "short-grain-rice", quantity: 150, unit: "g", group: "For the rice" },
    { ingredient: "water", quantity: 200, unit: "ml", group: "For the rice" },
    { ingredient: "soy-sauce", quantity: 3, unit: "tbsp", group: "Teriyaki sauce" },
    { ingredient: "mirin", quantity: 3, unit: "tbsp", group: "Teriyaki sauce" },
    { ingredient: "sake", quantity: 2, unit: "tbsp", group: "Teriyaki sauce" },
    { ingredient: "sugar", quantity: 1, unit: "tbsp", group: "Teriyaki sauce" },
    {
      ingredient: "salmon-fillet",
      quantity: 2,
      unit: "piece",
      preparation: "skin on, about 130 g each",
      group: "For the salmon",
    },
    { ingredient: "vegetable-oil", quantity: 1, unit: "tbsp", group: "For the salmon" },
    {
      ingredient: "cucumber",
      quantity: 0.5,
      unit: "piece",
      preparation: "thinly sliced",
      group: "To serve",
    },
    {
      ingredient: "spring-onion",
      quantity: 1,
      unit: "piece",
      preparation: "thinly sliced",
      group: "To serve",
    },
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
      text: "Rinse the rice in several changes of cold water until the water is almost clear. Put it in a small pan with the measured water, bring to the boil, then cover and cook on the lowest heat for 12 minutes. Take off the heat and leave covered for 10 minutes.",
      timerSeconds: 12 * 60,
      uses: ["short-grain-rice", "water"],
    },
    {
      text: "Stir the soy sauce, mirin, sake and sugar together until the sugar dissolves.",
      uses: ["soy-sauce", "mirin", "sake", "sugar"],
    },
    {
      text: "Pat the salmon dry. Heat the oil in a non-stick frying pan over a medium-high heat and cook the salmon skin-side down for 4 minutes, until the skin is crisp. Turn and cook for 2 minutes more.",
      timerSeconds: 4 * 60,
      uses: ["salmon-fillet", "vegetable-oil"],
    },
    {
      text: "Wipe out the excess fat with kitchen paper. Pour in the sauce and let it bubble for 1–2 minutes, spooning it over the fish, until syrupy and glossy and the salmon flakes easily.",
    },
    {
      text: "Divide the rice between bowls and top with the salmon, extra sauce from the pan, cucumber, spring onion and sesame seeds.",
      uses: ["cucumber", "spring-onion", "sesame-seeds"],
    },
  ],
  tips: ["The sauce thickens quickly once it bubbles, so watch it closely so it doesn't burn."],
  nutrition: null,
} satisfies RecipeInput;
