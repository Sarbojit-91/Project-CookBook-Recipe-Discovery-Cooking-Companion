import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "falafel",
  title: "Crispy Herb Falafel",
  description:
    "Green-flecked falafel made the proper way with soaked dried chickpeas, fried until crisp and served with a lemony tahini sauce.",
  cuisine: "mediterranean",
  mealTypes: ["lunch", "snack"],
  difficulty: "medium",
  servings: 4,
  prepMinutes: 40,
  cookMinutes: 15,
  totalMinutes: 775,
  tags: ["street-food", "make-ahead"],
  seasons: ["spring", "summer"],
  addedAt: "2026-10-05",
  featured: false,
  image: {
    file: "falafel.jpg",
    alt: "Crisp golden falafel in a bowl, one broken open to show the green herby inside",
    credit: {
      photographer: "Anton",
      sourceUrl: "https://unsplash.com/photos/fried-food-on-white-ceramic-bowl-pQnsKWk5ljQ",
      license: "unsplash",
    },
  },
  ingredients: [
    {
      ingredient: "dried-chickpeas",
      quantity: 250,
      unit: "g",
      note: "Tinned chickpeas are too soft — the falafel will fall apart",
    },
    { ingredient: "onion", quantity: 1, unit: "piece", preparation: "small, roughly chopped" },
    { ingredient: "garlic", quantity: 3, unit: "clove" },
    {
      ingredient: "flat-leaf-parsley",
      quantity: 30,
      unit: "g",
      preparation: "leaves and tender stems",
    },
    {
      ingredient: "fresh-coriander",
      quantity: 30,
      unit: "g",
      preparation: "leaves and tender stems",
    },
    { ingredient: "ground-cumin", quantity: 2, unit: "tsp" },
    { ingredient: "ground-coriander", quantity: 1, unit: "tsp" },
    { ingredient: "salt", quantity: 1, unit: "tsp" },
    { ingredient: "baking-powder", quantity: 1, unit: "tsp" },
    { ingredient: "vegetable-oil", quantity: 250, unit: "ml", note: "For shallow frying" },
    { ingredient: "tahini", quantity: 4, unit: "tbsp", group: "Tahini sauce" },
    {
      ingredient: "lemon",
      quantity: 0.5,
      unit: "piece",
      preparation: "juiced",
      group: "Tahini sauce",
    },
    {
      ingredient: "garlic",
      quantity: 1,
      unit: "clove",
      preparation: "finely grated",
      group: "Tahini sauce",
    },
    { ingredient: "water", quantity: 4, unit: "tbsp", group: "Tahini sauce" },
    { ingredient: "salt", quantity: 1, unit: "pinch", group: "Tahini sauce" },
  ],
  steps: [
    {
      text: "Cover the chickpeas with plenty of cold water and soak for 12 hours or overnight. They will double in size.",
      uses: ["dried-chickpeas"],
    },
    {
      text: "Drain and dry the chickpeas well. Pulse them in a food processor with the onion, garlic, herbs, spices and salt until finely chopped, like coarse sand, scraping down the sides. Don't let it turn into a paste.",
      uses: [
        "onion",
        "garlic",
        "flat-leaf-parsley",
        "fresh-coriander",
        "ground-cumin",
        "ground-coriander",
        "salt",
      ],
    },
    {
      text: "Stir in the baking powder and chill the mixture for 15 minutes.",
      timerSeconds: 15 * 60,
      uses: ["baking-powder"],
    },
    {
      text: "Meanwhile, make the sauce: whisk the tahini, lemon juice, garlic and salt, adding the water a spoonful at a time until smooth and pourable.",
      uses: ["tahini", "lemon", "garlic", "water", "salt"],
    },
    {
      text: "Shape the mixture into about 16 small patties. Heat 1 cm of oil in a frying pan over a medium-high heat.",
      uses: ["vegetable-oil"],
    },
    {
      text: "Fry the falafel in batches for 2–3 minutes on each side, until deep golden and crisp. Drain on kitchen paper.",
      timerSeconds: 3 * 60,
    },
    { text: "Serve hot with the tahini sauce, salad and warm flatbreads." },
  ],
  tips: [
    "Test-fry one falafel first. If it breaks up, pulse the mixture a little more so it holds together.",
  ],
  nutrition: null,
} satisfies RecipeInput;
