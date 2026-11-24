import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "guacamole",
  title: "Chunky Guacamole",
  description:
    "Ripe avocado mashed with lime, chilli, onion and coriander — keep it chunky and serve it straight away.",
  cuisine: "mexican",
  mealTypes: ["snack"],
  difficulty: "easy",
  servings: 4,
  prepMinutes: 10,
  cookMinutes: 0,
  totalMinutes: 10,
  tags: ["no-cook", "dip", "quick", "crowd-pleaser"],
  seasons: ["summer"],
  addedAt: "2026-10-06",
  featured: false,
  image: {
    file: "guacamole.jpg",
    alt: "A stone bowl of chunky guacamole with tomatoes, chilli and lime alongside",
    credit: {
      photographer: "yakshi virmani",
      sourceUrl: "https://unsplash.com/photos/green-vegetable-on-gray-ceramic-bowl-JqDn6CvyVhU",
      license: "unsplash",
    },
  },
  ingredients: [
    { ingredient: "red-onion", quantity: 0.25, unit: "piece", preparation: "very finely chopped" },
    {
      ingredient: "green-chilli",
      quantity: 1,
      unit: "piece",
      preparation: "deseeded and finely chopped",
    },
    { ingredient: "salt", quantity: 0.5, unit: "tsp" },
    { ingredient: "avocado", quantity: 3, unit: "piece", preparation: "ripe" },
    { ingredient: "lime", quantity: 1, unit: "piece", preparation: "juiced" },
    { ingredient: "tomato", quantity: 1, unit: "piece", preparation: "deseeded and diced" },
    { ingredient: "fresh-coriander", quantity: 1, unit: "handful", preparation: "chopped" },
  ],
  steps: [
    {
      text: "In a bowl, crush the onion, chilli and salt together with a fork to a rough paste — this releases their flavour.",
      uses: ["red-onion", "green-chilli", "salt"],
    },
    {
      text: "Halve the avocados, remove the stones and scoop the flesh into the bowl. Mash roughly, leaving plenty of chunks.",
      uses: ["avocado"],
    },
    {
      text: "Stir in the lime juice, tomato and coriander. Taste and add more salt or lime if needed.",
      uses: ["lime", "tomato", "fresh-coriander"],
    },
    { text: "Serve straight away with tortilla chips, tacos or fajitas." },
  ],
  tips: [
    "To store for an hour or two, press cling film right onto the surface so it doesn't brown.",
  ],
  nutrition: null,
} satisfies RecipeInput;
