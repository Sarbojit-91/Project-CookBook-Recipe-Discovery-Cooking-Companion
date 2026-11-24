import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "pad-thai",
  title: "Prawn Pad Thai",
  description:
    "Chewy rice noodles tossed with prawns, egg and beansprouts in a tangy tamarind sauce, finished with peanuts and lime.",
  cuisine: "thai",
  mealTypes: ["lunch", "dinner"],
  difficulty: "medium",
  servings: 2,
  prepMinutes: 20,
  cookMinutes: 10,
  totalMinutes: 30,
  tags: ["stir-fry", "street-food"],
  seasons: [],
  addedAt: "2026-10-22",
  featured: true,
  image: {
    file: "pad-thai.jpg",
    alt: "A plate of pad thai noodles with prawns, spring onions and a wedge of lime",
    credit: {
      photographer: "Markus Winkler",
      sourceUrl: "https://unsplash.com/photos/a-plate-of-food-4WPOb7eIpJ0",
      license: "unsplash",
    },
  },
  ingredients: [
    { ingredient: "flat-rice-noodles", quantity: 150, unit: "g" },
    { ingredient: "tamarind-paste", quantity: 2, unit: "tbsp", group: "For the sauce" },
    { ingredient: "fish-sauce", quantity: 2, unit: "tbsp", group: "For the sauce" },
    { ingredient: "sugar", quantity: 1.5, unit: "tbsp", group: "For the sauce" },
    { ingredient: "water", quantity: 2, unit: "tbsp", group: "For the sauce" },
    { ingredient: "vegetable-oil", quantity: 2, unit: "tbsp" },
    { ingredient: "garlic", quantity: 2, unit: "clove", preparation: "finely chopped" },
    { ingredient: "king-prawns", quantity: 200, unit: "g", preparation: "peeled" },
    { ingredient: "egg", quantity: 2, unit: "piece" },
    { ingredient: "beansprouts", quantity: 100, unit: "g" },
    {
      ingredient: "spring-onion",
      quantity: 3,
      unit: "piece",
      preparation: "cut into 3 cm lengths",
    },
    {
      ingredient: "roasted-peanuts",
      quantity: 30,
      unit: "g",
      preparation: "roughly chopped",
      group: "To serve",
    },
    {
      ingredient: "lime",
      quantity: 1,
      unit: "piece",
      preparation: "cut into wedges",
      group: "To serve",
    },
    { ingredient: "chilli-flakes", quantity: 0.5, unit: "tsp", optional: true, group: "To serve" },
  ],
  steps: [
    {
      text: "Soak the noodles in warm (not boiling) water for 15–20 minutes, until pliable but still firm. Drain.",
      timerSeconds: 15 * 60,
      uses: ["flat-rice-noodles"],
    },
    {
      text: "Stir the tamarind, fish sauce, sugar and water together until the sugar dissolves.",
      uses: ["tamarind-paste", "fish-sauce", "sugar", "water"],
    },
    {
      text: "Heat the oil in a wok over a high heat. Stir-fry the garlic for 15 seconds, then add the prawns and cook for 1–2 minutes, until just pink.",
      uses: ["vegetable-oil", "garlic", "king-prawns"],
    },
    {
      text: "Push everything to one side, crack in the eggs and scramble until nearly set.",
      uses: ["egg"],
    },
    {
      text: "Add the noodles and sauce and toss for 2–3 minutes, until the noodles are soft and the sauce is absorbed. Add a splash of water if they stick.",
    },
    {
      text: "Toss in the beansprouts and spring onions for 30 seconds. Serve topped with peanuts, lime wedges and chilli flakes.",
      uses: ["beansprouts", "spring-onion", "roasted-peanuts", "lime", "chilli-flakes"],
    },
  ],
  tips: [
    "Have everything chopped and ready before you start — the cooking takes only a few minutes.",
  ],
  nutrition: null,
} satisfies RecipeInput;
