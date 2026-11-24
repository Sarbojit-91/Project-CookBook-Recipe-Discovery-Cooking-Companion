import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "huevos-rancheros",
  title: "Huevos Rancheros",
  description:
    "Fried eggs on warm corn tortillas with smashed black beans and a quick chilli-tomato salsa. A hearty Mexican breakfast.",
  cuisine: "mexican",
  mealTypes: ["breakfast", "lunch"],
  difficulty: "easy",
  servings: 2,
  prepMinutes: 10,
  cookMinutes: 20,
  totalMinutes: 30,
  tags: ["brunch"],
  seasons: [],
  addedAt: "2026-10-24",
  featured: false,
  image: {
    file: "huevos-rancheros.jpg",
    alt: "Fried eggs with salsa and beans on a white plate",
    credit: {
      photographer: "Paul Hanaoka",
      sourceUrl:
        "https://unsplash.com/photos/egg-and-vegetable-dish-on-white-ceramic-plate-mkOpQDcFrx0",
      license: "unsplash",
    },
  },
  ingredients: [
    { ingredient: "olive-oil", quantity: 2, unit: "tbsp" },
    {
      ingredient: "onion",
      quantity: 1,
      unit: "piece",
      preparation: "finely chopped",
      group: "Salsa",
    },
    { ingredient: "garlic", quantity: 2, unit: "clove", preparation: "crushed", group: "Salsa" },
    {
      ingredient: "green-chilli",
      quantity: 1,
      unit: "piece",
      preparation: "finely chopped",
      group: "Salsa",
    },
    { ingredient: "ground-cumin", quantity: 1, unit: "tsp", group: "Salsa" },
    { ingredient: "chopped-tomatoes", quantity: 400, unit: "g", group: "Salsa" },
    { ingredient: "salt", quantity: 0.5, unit: "tsp", group: "Salsa" },
    {
      ingredient: "black-beans",
      quantity: 1,
      unit: "can",
      preparation: "400 g can, drained and rinsed",
    },
    { ingredient: "corn-tortilla", quantity: 4, unit: "piece" },
    { ingredient: "egg", quantity: 4, unit: "piece" },
    { ingredient: "avocado", quantity: 1, unit: "piece", preparation: "sliced", group: "To serve" },
    { ingredient: "fresh-coriander", quantity: 1, unit: "handful", group: "To serve" },
    {
      ingredient: "lime",
      quantity: 1,
      unit: "piece",
      preparation: "cut into wedges",
      group: "To serve",
    },
  ],
  steps: [
    {
      text: "Heat 1 tbsp oil in a pan over a medium heat and cook the onion for 5 minutes, until soft. Add the garlic, chilli and cumin and cook for 1 minute.",
      timerSeconds: 5 * 60,
      uses: ["olive-oil", "onion", "garlic", "green-chilli", "ground-cumin"],
    },
    {
      text: "Add the tomatoes and salt and simmer for about 8 minutes, until thick and saucy.",
      timerSeconds: 8 * 60,
      uses: ["chopped-tomatoes", "salt"],
    },
    {
      text: "Meanwhile, warm the beans in a small pan with a splash of water, roughly mashing about half of them.",
      uses: ["black-beans"],
    },
    {
      text: "Warm the tortillas in a dry frying pan and keep them warm wrapped in a tea towel.",
      uses: ["corn-tortilla"],
    },
    {
      text: "Heat the remaining oil in the frying pan and fry the eggs for about 3 minutes, until the whites are set and the yolks still runny.",
      timerSeconds: 3 * 60,
      uses: ["olive-oil", "egg"],
    },
    {
      text: "Put two tortillas on each plate, spread with beans, top with the eggs and spoon the salsa around. Finish with avocado, coriander and lime wedges.",
      uses: ["avocado", "fresh-coriander", "lime"],
    },
  ],
  tips: ["Make the salsa the night before and reheat it for an even quicker breakfast."],
  nutrition: null,
} satisfies RecipeInput;
