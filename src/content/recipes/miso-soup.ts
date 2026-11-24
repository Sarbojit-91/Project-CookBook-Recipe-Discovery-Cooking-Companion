import type { RecipeInput } from "../schema";

export const recipe = {
  slug: "miso-soup",
  title: "Miso Soup with Tofu",
  description:
    "A light, savoury Japanese soup of kombu stock, white miso, silky tofu and wakame. Made with kombu, so it's fully vegan.",
  cuisine: "japanese",
  mealTypes: ["lunch", "snack"],
  difficulty: "easy",
  servings: 4,
  prepMinutes: 5,
  cookMinutes: 10,
  totalMinutes: 45,
  tags: ["light", "soup"],
  seasons: ["autumn", "winter"],
  addedAt: "2026-10-21",
  featured: false,
  image: {
    file: "miso-soup.jpg",
    alt: "A bowl of miso soup with cubes of tofu and seaweed",
    credit: {
      photographer: "note thanun",
      sourceUrl: "https://unsplash.com/photos/bowl-of-miso-soup-with-tofu-and-seaweed-HQNhc58_6mI",
      license: "unsplash",
    },
  },
  ingredients: [
    { ingredient: "water", quantity: 1, unit: "l" },
    { ingredient: "dried-kombu", quantity: 10, unit: "g", note: "About a 10 cm piece" },
    { ingredient: "dried-wakame", quantity: 1, unit: "tbsp" },
    { ingredient: "silken-tofu", quantity: 200, unit: "g", preparation: "cut into 1.5 cm cubes" },
    { ingredient: "white-miso", quantity: 3, unit: "tbsp", note: "Adjust to taste" },
    { ingredient: "spring-onion", quantity: 2, unit: "piece", preparation: "thinly sliced" },
  ],
  steps: [
    {
      text: "Put the kombu in a saucepan with the water and leave to soak for 30 minutes.",
      timerSeconds: 30 * 60,
      uses: ["water", "dried-kombu"],
    },
    {
      text: "Heat slowly until it's just about to simmer, then lift out the kombu before the water boils — boiling makes it bitter and slimy.",
    },
    {
      text: "Meanwhile, soak the wakame in a bowl of water for 5 minutes, then drain.",
      timerSeconds: 5 * 60,
      uses: ["dried-wakame"],
    },
    {
      text: "Add the tofu and wakame to the stock and heat gently for 2 minutes.",
      uses: ["silken-tofu"],
    },
    {
      text: "Turn off the heat. Whisk the miso with a ladle of the hot stock until smooth, then stir it into the pan. Don't let the soup boil once the miso is in.",
      uses: ["white-miso"],
    },
    { text: "Ladle into bowls and top with spring onions.", uses: ["spring-onion"] },
  ],
  tips: ["Traditional dashi uses bonito flakes (fish); kombu alone keeps this soup vegan."],
  nutrition: null,
} satisfies RecipeInput;
