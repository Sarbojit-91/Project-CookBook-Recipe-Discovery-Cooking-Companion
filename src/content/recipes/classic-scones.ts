import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "classic-scones",
  title: "Classic British Scones",
  description:
    "Tall, light scones with a golden top, served warm with strawberry jam and clotted cream — afternoon tea at its best.",
  cuisine: "british",
  mealTypes: ["snack", "dessert"],
  difficulty: "easy",
  servings: 8,
  prepMinutes: 15,
  cookMinutes: 12,
  totalMinutes: 30,
  tags: ["baking", "teatime", "family"],
  seasons: ["spring", "summer"],
  addedAt: "2026-10-28",
  featured: false,
  image: {
    file: "classic-scones.jpg",
    alt: "A split scone filled with jam and cream on a plate",
    credit: {
      photographer: "Sarah Kilian",
      sourceUrl: "https://unsplash.com/photos/brown-bread-on-white-ceramic-plate-Kgcc8TKKEkg",
      license: "unsplash",
    },
  },
  ingredients: [
    { ingredient: "self-raising-flour", quantity: 350, unit: "g", note: "Plus extra for dusting" },
    { ingredient: "baking-powder", quantity: 1, unit: "tsp" },
    { ingredient: "salt", quantity: 1, unit: "pinch" },
    { ingredient: "butter", quantity: 85, unit: "g", preparation: "cold, cubed" },
    { ingredient: "caster-sugar", quantity: 3, unit: "tbsp" },
    { ingredient: "milk", quantity: 175, unit: "ml" },
    { ingredient: "egg", quantity: 1, unit: "piece", preparation: "beaten, to glaze" },
    { ingredient: "strawberry-jam", quantity: null, unit: null, optional: true, group: "To serve" },
    { ingredient: "clotted-cream", quantity: null, unit: null, optional: true, group: "To serve" },
  ],
  steps: [
    { text: "Heat the oven to 220°C (200°C fan, gas 7) and line a baking tray with baking paper." },
    {
      text: "Mix the flour, baking powder and salt in a large bowl. Rub in the butter with your fingertips until it looks like fine breadcrumbs, then stir in the sugar.",
      uses: ["self-raising-flour", "baking-powder", "salt", "butter", "caster-sugar"],
    },
    {
      text: "Make a well in the middle, pour in the milk and quickly mix with a cutlery knife to a soft, slightly sticky dough. Don't overwork it.",
      uses: ["milk"],
    },
    {
      text: "Tip onto a floured surface and gently pat out to about 3 cm thick. Cut out rounds with a 6 cm cutter, pressing straight down without twisting. Gently re-press the trimmings to cut more.",
    },
    { text: "Put the scones on the tray and brush the tops with beaten egg.", uses: ["egg"] },
    {
      text: "Bake for 10–12 minutes, until well risen and golden. Cool on a wire rack and serve warm with jam and clotted cream.",
      timerSeconds: 10 * 60,
      uses: ["strawberry-jam", "clotted-cream"],
    },
  ],
  tips: ["The less you handle the dough, the taller and lighter your scones will be."],
  nutrition: null,
} satisfies RecipeInput;
