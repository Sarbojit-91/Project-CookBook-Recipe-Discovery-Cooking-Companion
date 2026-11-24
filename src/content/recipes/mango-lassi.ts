import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "mango-lassi",
  title: "Mango Lassi",
  description:
    "A thick, creamy blend of ripe mango, yogurt and a pinch of cardamom — cooling, sweet and ready in five minutes.",
  cuisine: "indian",
  mealTypes: ["snack"],
  difficulty: "easy",
  servings: 2,
  prepMinutes: 5,
  cookMinutes: 0,
  totalMinutes: 5,
  tags: ["no-cook", "drink", "quick"],
  seasons: ["summer"],
  addedAt: "2026-10-12",
  featured: false,
  image: {
    file: "mango-lassi.jpg",
    alt: "A tall glass of creamy mango drink beside a fresh mango",
    credit: {
      photographer: "Julia Zyablova",
      sourceUrl:
        "https://unsplash.com/photos/a-glass-filled-with-a-smoothie-next-to-a-mango-KlVIYmGVRQ8",
      license: "unsplash",
    },
  },
  ingredients: [
    {
      ingredient: "ripe-mango",
      quantity: 2,
      unit: "piece",
      preparation: "peeled and chopped (about 300 g flesh)",
    },
    { ingredient: "plain-yogurt", quantity: 250, unit: "g", preparation: "chilled" },
    { ingredient: "milk", quantity: 120, unit: "ml", preparation: "cold" },
    {
      ingredient: "sugar",
      quantity: 1,
      unit: "tbsp",
      note: "Adjust to the sweetness of your mangoes",
    },
    { ingredient: "ground-cardamom", quantity: 1, unit: "pinch", note: "Plus extra to serve" },
  ],
  steps: [
    {
      text: "Put the mango, yogurt, milk, sugar and cardamom in a blender.",
      uses: ["ripe-mango", "plain-yogurt", "milk", "sugar", "ground-cardamom"],
    },
    { text: "Blend for about 1 minute, until completely smooth and frothy." },
    {
      text: "Taste and add a little more sugar or a splash of milk if needed. Pour into glasses and dust with a little cardamom.",
    },
  ],
  tips: ["Out of season, use 250 ml tinned Alphonso mango pulp instead of fresh mango."],
  nutrition: null,
} satisfies RecipeInput;
