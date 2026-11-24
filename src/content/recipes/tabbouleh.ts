import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "tabbouleh",
  title: "Lemony Tabbouleh",
  description:
    "A bright, herb-packed Levantine salad of parsley, mint, tomato and a little bulgur, dressed with plenty of lemon and olive oil.",
  cuisine: "mediterranean",
  mealTypes: ["lunch"],
  difficulty: "easy",
  servings: 4,
  prepMinutes: 25,
  cookMinutes: 0,
  totalMinutes: 40,
  tags: ["salad", "make-ahead"],
  seasons: ["spring", "summer"],
  addedAt: "2026-10-09",
  featured: false,
  image: {
    file: "tabbouleh.jpg",
    alt: "A bowl of finely chopped parsley salad with lemon slices beside a fork",
    credit: {
      photographer: "Hamza Zaidi",
      sourceUrl:
        "https://unsplash.com/photos/sliced-lemon-on-white-ceramic-bowl-beside-stainless-steel-fork-pyJ_eHgRikw",
      license: "unsplash",
    },
  },
  ingredients: [
    { ingredient: "bulgur-wheat", quantity: 60, unit: "g" },
    { ingredient: "water", quantity: 100, unit: "ml", preparation: "boiling" },
    {
      ingredient: "flat-leaf-parsley",
      quantity: 2,
      unit: "bunch",
      preparation: "large bunches (about 150 g), finely chopped",
    },
    {
      ingredient: "fresh-mint",
      quantity: 1,
      unit: "handful",
      preparation: "leaves finely chopped",
    },
    { ingredient: "tomato", quantity: 3, unit: "piece", preparation: "finely diced" },
    { ingredient: "spring-onion", quantity: 4, unit: "piece", preparation: "finely sliced" },
    { ingredient: "lemon", quantity: 2, unit: "piece", preparation: "juiced" },
    { ingredient: "olive-oil", quantity: 4, unit: "tbsp" },
    { ingredient: "salt", quantity: 1, unit: "tsp" },
    { ingredient: "black-pepper", quantity: null, unit: null },
  ],
  steps: [
    {
      text: "Put the bulgur in a bowl, pour over the boiling water, cover and leave for 15 minutes until tender. Fluff with a fork and drain off any excess water.",
      timerSeconds: 15 * 60,
      uses: ["bulgur-wheat", "water"],
    },
    {
      text: "Meanwhile, wash and dry the herbs thoroughly, then chop the parsley and mint finely with a sharp knife — a food processor bruises them.",
      uses: ["flat-leaf-parsley", "fresh-mint"],
    },
    {
      text: "Mix the herbs, tomatoes, spring onions and bulgur in a large bowl.",
      uses: ["tomato", "spring-onion"],
    },
    {
      text: "Dress with the lemon juice, oil, salt and pepper and toss well. It should taste bright and lemony. Serve within a few hours.",
      uses: ["lemon", "olive-oil", "salt", "black-pepper"],
    },
  ],
  tips: [
    "Real tabbouleh is mostly parsley, with just a little bulgur — don't be tempted to add more grain.",
  ],
  nutrition: null,
} satisfies RecipeInput;
