import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "thai-holy-basil-chicken",
  title: "Thai Holy Basil Chicken",
  description:
    "A fiery, garlicky chicken and holy basil stir-fry served over jasmine rice, with an optional crisp-edged fried egg.",
  cuisine: "thai",
  mealTypes: ["lunch", "dinner"],
  difficulty: "easy",
  servings: 2,
  prepMinutes: 10,
  cookMinutes: 25,
  totalMinutes: 35,
  tags: ["quick", "spicy", "stir-fry"],
  seasons: ["summer"],
  addedAt: "2026-11-17",
  featured: false,
  image: {
    file: "thai-holy-basil-chicken.jpg",
    alt: "A Thai basil stir-fry with rice and a crisp-edged fried egg on a grey plate",
    credit: {
      photographer: "Vicky Ng",
      sourceUrl:
        "https://unsplash.com/photos/fried-rice-with-sunny-side-up-egg-on-gray-ceramic-plate-NT5oqzp-050",
      license: "unsplash",
    },
  },
  ingredients: [
    { ingredient: "jasmine-rice", quantity: 150, unit: "g" },
    { ingredient: "garlic", quantity: 4, unit: "clove", group: "For the stir-fry" },
    {
      ingredient: "red-bird-eye-chilli",
      quantity: 3,
      unit: "piece",
      note: "Use 1–2 for a milder dish",
      group: "For the stir-fry",
    },
    { ingredient: "vegetable-oil", quantity: 2, unit: "tbsp", group: "For the stir-fry" },
    {
      ingredient: "chicken-thigh",
      quantity: 300,
      unit: "g",
      preparation: "finely chopped",
      group: "For the stir-fry",
    },
    {
      ingredient: "thai-holy-basil",
      quantity: 1,
      unit: "handful",
      preparation: "leaves picked",
      note: "Thai sweet basil also works",
      group: "For the stir-fry",
    },
    { ingredient: "oyster-sauce", quantity: 1, unit: "tbsp", group: "For the sauce" },
    { ingredient: "soy-sauce", quantity: 1, unit: "tbsp", group: "For the sauce" },
    { ingredient: "fish-sauce", quantity: 2, unit: "tsp", group: "For the sauce" },
    { ingredient: "sugar", quantity: 1, unit: "tsp", group: "For the sauce" },
    { ingredient: "water", quantity: 2, unit: "tbsp", group: "For the sauce" },
    {
      ingredient: "egg",
      quantity: 2,
      unit: "piece",
      optional: true,
      note: "Fried, to serve",
      group: "To serve",
    },
  ],
  steps: [
    {
      text: "Rinse the rice until the water runs clear, then cook according to the packet instructions — usually about 12 minutes, then 10 minutes resting off the heat with the lid on.",
      timerSeconds: 12 * 60,
      uses: ["jasmine-rice"],
    },
    {
      text: "Pound the garlic and chillies to a coarse paste using a pestle and mortar, or chop them very finely.",
      uses: ["garlic", "red-bird-eye-chilli"],
    },
    {
      text: "Mix the oyster sauce, soy sauce, fish sauce, sugar and water in a small bowl.",
      uses: ["oyster-sauce", "soy-sauce", "fish-sauce", "sugar", "water"],
    },
    {
      text: "Heat the oil in a wok over a high heat until shimmering. Add the garlic and chilli paste and stir-fry for 15–20 seconds, until fragrant — don't let it burn.",
      uses: ["vegetable-oil"],
    },
    {
      text: "Add the chicken and stir-fry for 3–4 minutes, breaking it up, until cooked through and starting to catch at the edges.",
      timerSeconds: 4 * 60,
      uses: ["chicken-thigh"],
    },
    {
      text: "Pour in the sauce and toss for about 1 minute, until glossy. Take the wok off the heat and stir in the basil until just wilted.",
      uses: ["thai-holy-basil"],
    },
    {
      text: "If you like, fry the eggs in a little hot oil until the edges are crisp and the yolks still runny. Serve the chicken over rice, topped with an egg.",
      uses: ["egg"],
    },
  ],
  tips: ["Chopping the chicken by hand gives a better texture than shop-bought mince."],
  nutrition: null,
} satisfies RecipeInput;
