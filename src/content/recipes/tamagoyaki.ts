import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "tamagoyaki",
  title: "Tamagoyaki (Rolled Omelette)",
  description:
    "A sweet-savoury Japanese omelette cooked in thin layers and rolled into a neat block. Lovely for breakfast or a bento box.",
  cuisine: "japanese",
  mealTypes: ["breakfast"],
  difficulty: "medium",
  servings: 2,
  prepMinutes: 5,
  cookMinutes: 10,
  totalMinutes: 15,
  tags: ["bento"],
  seasons: [],
  addedAt: "2026-10-25",
  featured: false,
  image: {
    file: "tamagoyaki.jpg",
    alt: "A layered Japanese rolled omelette sliced on a wooden tray",
    credit: {
      photographer: "Max Griss",
      sourceUrl: "https://unsplash.com/photos/brown-bread-on-brown-wooden-tray-stA9e5JdsYo",
      license: "unsplash",
    },
  },
  ingredients: [
    { ingredient: "egg", quantity: 4, unit: "piece" },
    { ingredient: "sugar", quantity: 1, unit: "tbsp" },
    { ingredient: "soy-sauce", quantity: 1, unit: "tsp" },
    { ingredient: "mirin", quantity: 1, unit: "tbsp" },
    { ingredient: "salt", quantity: 1, unit: "pinch" },
    { ingredient: "vegetable-oil", quantity: 1, unit: "tbsp", note: "For greasing the pan" },
  ],
  steps: [
    {
      text: "Whisk the eggs with the sugar, soy sauce, mirin and salt until well combined but not frothy. Strain through a sieve for an extra-smooth result.",
      uses: ["egg", "sugar", "soy-sauce", "mirin", "salt"],
    },
    {
      text: "Heat a tamagoyaki pan or small non-stick frying pan over a medium-low heat and wipe it with oiled kitchen paper.",
      uses: ["vegetable-oil"],
    },
    {
      text: "Pour in a thin layer of egg and tilt to cover the base. When it's almost set but still moist on top, roll it up from the far side towards you with chopsticks or a spatula.",
    },
    {
      text: "Push the roll to the far side, oil the pan again and pour in another thin layer, lifting the roll so the egg flows underneath. When nearly set, roll back over. Repeat until all the egg is used.",
    },
    {
      text: "Tip onto a bamboo mat or piece of baking paper and press into a neat block. Rest for 2 minutes, then slice into 6 pieces. Serve warm or at room temperature.",
    },
  ],
  tips: ["Keep the heat low — the egg should set gently without browning."],
  nutrition: null,
} satisfies RecipeInput;
