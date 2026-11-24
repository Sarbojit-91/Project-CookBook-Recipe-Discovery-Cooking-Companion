import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "home-style-chicken-curry",
  title: "Home-Style Chicken Curry",
  description:
    "Tender chicken thighs in a deeply savoury onion, tomato and yogurt gravy — the kind of curry made in home kitchens every week.",
  cuisine: "indian",
  mealTypes: ["dinner"],
  difficulty: "medium",
  servings: 4,
  prepMinutes: 20,
  cookMinutes: 55,
  totalMinutes: 75,
  tags: ["comfort-food", "freezer-friendly"],
  seasons: ["autumn", "winter"],
  addedAt: "2026-11-05",
  featured: false,
  image: null,
  ingredients: [
    { ingredient: "vegetable-oil", quantity: 3, unit: "tbsp" },
    { ingredient: "onion", quantity: 2, unit: "piece", preparation: "finely chopped" },
    { ingredient: "garlic", quantity: 5, unit: "clove", preparation: "finely grated" },
    { ingredient: "ginger", quantity: 1, unit: "tbsp", preparation: "finely grated" },
    { ingredient: "green-chilli", quantity: 1, unit: "piece", preparation: "slit lengthways" },
    { ingredient: "ground-cumin", quantity: 1, unit: "tsp", group: "Spices" },
    { ingredient: "ground-coriander", quantity: 2, unit: "tsp", group: "Spices" },
    { ingredient: "ground-turmeric", quantity: 0.5, unit: "tsp", group: "Spices" },
    { ingredient: "kashmiri-chilli-powder", quantity: 1, unit: "tsp", group: "Spices" },
    { ingredient: "chopped-tomatoes", quantity: 400, unit: "g" },
    {
      ingredient: "chicken-thigh",
      quantity: 700,
      unit: "g",
      preparation: "cut into bite-sized pieces",
    },
    { ingredient: "salt", quantity: 1, unit: "tsp", note: "Adjust to taste" },
    {
      ingredient: "plain-yogurt",
      quantity: 100,
      unit: "g",
      preparation: "whisked, at room temperature",
    },
    { ingredient: "water", quantity: 150, unit: "ml" },
    { ingredient: "garam-masala", quantity: 1, unit: "tsp", group: "To finish" },
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
      text: "Heat the oil in a large, heavy-based pan over a medium heat. Add the onions with a pinch of salt and cook for about 15 minutes, stirring often, until deep golden brown.",
      timerSeconds: 15 * 60,
      uses: ["vegetable-oil", "onion"],
    },
    {
      text: "Add the garlic, ginger and green chilli and cook for 1–2 minutes, until the raw smell has gone.",
      uses: ["garlic", "ginger", "green-chilli"],
    },
    {
      text: "Turn the heat down and add the cumin, coriander, turmeric and chilli powder with a splash of water so the spices don't burn. Stir for 1 minute.",
      uses: ["ground-cumin", "ground-coriander", "ground-turmeric", "kashmiri-chilli-powder"],
    },
    {
      text: "Add the tomatoes and cook for 8–10 minutes, stirring often, until the paste thickens and oil starts to separate at the edges.",
      timerSeconds: 9 * 60,
      uses: ["chopped-tomatoes"],
    },
    {
      text: "Add the chicken and salt and stir to coat. Cook for about 5 minutes, until the outside of the chicken is no longer pink.",
      timerSeconds: 5 * 60,
      uses: ["chicken-thigh", "salt"],
    },
    {
      text: "Take the pan off the heat and stir in the yogurt a spoonful at a time so it doesn't split. Add the water, return to a gentle simmer, cover and cook for 20 minutes, until the chicken is cooked through with no pink inside.",
      timerSeconds: 20 * 60,
      uses: ["plain-yogurt", "water"],
    },
    {
      text: "Stir in the garam masala. If the gravy is thin, simmer uncovered for a few minutes. Taste for salt and finish with coriander.",
      uses: ["garam-masala", "fresh-coriander"],
    },
  ],
  tips: [
    "Taking the onions to a deep golden colour gives the gravy its rich flavour — don't rush this step.",
    "Serve with basmati rice or warm flatbreads.",
  ],
  nutrition: null,
} satisfies RecipeInput;
