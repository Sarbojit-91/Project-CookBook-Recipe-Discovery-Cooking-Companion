import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "chicken-fajitas",
  title: "Sizzling Chicken Fajitas",
  description:
    "Smoky spiced chicken and charred peppers wrapped in warm tortillas with avocado and lime. A 30-minute crowd-pleaser.",
  cuisine: "mexican",
  mealTypes: ["dinner"],
  difficulty: "easy",
  servings: 4,
  prepMinutes: 15,
  cookMinutes: 15,
  totalMinutes: 30,
  tags: ["quick", "family", "crowd-pleaser"],
  seasons: ["summer"],
  addedAt: "2026-10-20",
  featured: false,
  image: {
    file: "chicken-fajitas.jpg",
    alt: "Strips of grilled chicken with peppers and warm tortillas on a wooden table",
    credit: {
      photographer: "Thomas Park",
      sourceUrl:
        "https://unsplash.com/photos/a-wooden-table-topped-with-plates-of-food-G3hZMCdLUdw",
      license: "unsplash",
    },
  },
  ingredients: [
    { ingredient: "chicken-thigh", quantity: 600, unit: "g", preparation: "cut into strips" },
    { ingredient: "smoked-paprika", quantity: 2, unit: "tsp" },
    { ingredient: "ground-cumin", quantity: 1, unit: "tsp" },
    { ingredient: "garlic", quantity: 2, unit: "clove", preparation: "crushed" },
    { ingredient: "lime", quantity: 1, unit: "piece", preparation: "juiced" },
    { ingredient: "olive-oil", quantity: 2, unit: "tbsp" },
    { ingredient: "salt", quantity: 1, unit: "tsp" },
    { ingredient: "red-pepper", quantity: 2, unit: "piece", preparation: "sliced" },
    { ingredient: "onion", quantity: 1, unit: "piece", preparation: "sliced" },
    { ingredient: "flour-tortilla", quantity: 8, unit: "piece", group: "To serve" },
    { ingredient: "avocado", quantity: 1, unit: "piece", preparation: "sliced", group: "To serve" },
    { ingredient: "fresh-coriander", quantity: 1, unit: "handful", group: "To serve" },
    {
      ingredient: "plain-yogurt",
      quantity: 4,
      unit: "tbsp",
      optional: true,
      note: "Or soured cream",
      group: "To serve",
    },
  ],
  steps: [
    {
      text: "Mix the chicken with the paprika, cumin, garlic, half the lime juice, 1 tbsp oil and the salt.",
      uses: [
        "chicken-thigh",
        "smoked-paprika",
        "ground-cumin",
        "garlic",
        "lime",
        "olive-oil",
        "salt",
      ],
    },
    {
      text: "Heat the remaining oil in a large frying pan or griddle over a high heat. Cook the peppers and onion for about 5 minutes, until charred at the edges but still a little crisp. Tip onto a plate.",
      timerSeconds: 5 * 60,
      uses: ["red-pepper", "onion", "olive-oil"],
    },
    {
      text: "Cook the chicken in a single layer in the same pan for 6–8 minutes, turning, until cooked through and charred in places.",
      timerSeconds: 7 * 60,
    },
    {
      text: "Return the vegetables to the pan, squeeze over the remaining lime juice and toss together.",
    },
    {
      text: "Warm the tortillas in a dry pan, then fill with the chicken and peppers, avocado, coriander and a spoonful of yogurt.",
      uses: ["flour-tortilla", "avocado", "fresh-coriander", "plain-yogurt"],
    },
  ],
  tips: [
    "If you have time, marinate the chicken for up to 2 hours in the fridge for even more flavour.",
  ],
  nutrition: null,
} satisfies RecipeInput;
