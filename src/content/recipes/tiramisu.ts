import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "tiramisu",
  title: "Easy Tiramisu",
  description:
    "Coffee-soaked sponge fingers layered with a light mascarpone cream and finished with cocoa. No baking and no raw egg.",
  cuisine: "italian",
  mealTypes: ["dessert"],
  difficulty: "medium",
  servings: 8,
  prepMinutes: 25,
  cookMinutes: 0,
  totalMinutes: 265,
  tags: ["make-ahead", "no-bake", "crowd-pleaser", "sweet"],
  seasons: [],
  addedAt: "2026-10-18",
  featured: false,
  image: {
    file: "tiramisu.jpg",
    alt: "A neat slice of layered tiramisu dusted with cocoa on a white plate",
    credit: {
      photographer: "Gina's Auckland",
      sourceUrl:
        "https://unsplash.com/photos/a-piece-of-cake-sitting-on-top-of-a-white-plate-d-Mx494kXAg",
      license: "unsplash",
    },
  },
  ingredients: [
    { ingredient: "strong-coffee", quantity: 300, unit: "ml", preparation: "cooled" },
    { ingredient: "mascarpone", quantity: 500, unit: "g" },
    { ingredient: "caster-sugar", quantity: 80, unit: "g" },
    { ingredient: "double-cream", quantity: 300, unit: "ml" },
    { ingredient: "savoiardi", quantity: 24, unit: "piece", note: "About 200 g" },
    { ingredient: "cocoa-powder", quantity: 2, unit: "tbsp", preparation: "for dusting" },
  ],
  steps: [
    {
      text: "Make the coffee and leave it to cool completely in a shallow dish.",
      uses: ["strong-coffee"],
    },
    {
      text: "Beat the mascarpone and sugar until smooth. Add the cream and whisk until it holds soft, thick peaks — stop before it gets stiff.",
      uses: ["mascarpone", "caster-sugar", "double-cream"],
    },
    {
      text: "Dip half the sponge fingers, one at a time, into the coffee for a second on each side, and lay them in a single layer in a dish of about 20 × 28 cm.",
      uses: ["savoiardi"],
    },
    {
      text: "Spread over half the cream. Repeat with the remaining sponge fingers and cream, then smooth the top.",
    },
    { text: "Cover and chill for at least 4 hours, ideally overnight." },
    {
      text: "Just before serving, dust thickly with cocoa through a sieve.",
      uses: ["cocoa-powder"],
    },
  ],
  tips: [
    "Keep the dip quick — soaked sponge fingers turn soggy.",
    "Keeps covered in the fridge for up to 2 days.",
  ],
  nutrition: null,
} satisfies RecipeInput;
