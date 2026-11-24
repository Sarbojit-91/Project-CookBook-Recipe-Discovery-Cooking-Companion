import type { Aisle } from "@/content/schema";
import type { Unit } from "@/lib/units";

export const SLOTS = ["breakfast", "lunch", "dinner", "snack"] as const;
export type Slot = (typeof SLOTS)[number];

export type Favourite = { slug: string; addedAt: string };

export type Folder = { id: string; name: string; position: number; createdAt: string };

export type Collection = {
  id: string;
  name: string;
  description: string;
  folderId: string | null;
  recipeSlugs: string[];
  createdAt: string;
};

export type Note = { body: string; updatedAt: string };

export type PlanEntry = {
  id: string;
  /** Monday-or-Sunday ISO date of the week this entry belongs to. */
  weekStart: string;
  /** 0–6, counted from weekStart. */
  day: number;
  slot: Slot;
  slug: string;
  servings: number;
  position: number;
};

export type Amount = { quantity: number | null; unit: Unit | null };

export type ShoppingItem = {
  id: string;
  ingredientId: string | null;
  name: string;
  /** Amounts that could not be combined stay separate: 200 g + 1 cup. */
  amounts: Amount[];
  aisle: Aisle;
  purchased: boolean;
  /** Recipe slugs this item came from. */
  sources: string[];
  createdAt: string;
};

export type Profile = {
  displayName: string;
  dietaryPreference: "" | "vegetarian" | "vegan" | "pescatarian";
  weekStartsOn: 0 | 1;
};

export type PersonalData = {
  favourites: Favourite[];
  folders: Folder[];
  collections: Collection[];
  notes: Record<string, Note>;
  plan: PlanEntry[];
  shopping: ShoppingItem[];
  profile: Profile;
};

export const EMPTY_DATA: PersonalData = {
  favourites: [],
  folders: [],
  collections: [],
  notes: {},
  plan: [],
  shopping: [],
  profile: { displayName: "", dietaryPreference: "", weekStartsOn: 1 },
};

/** Limits enforced in the UI, the reducer and (for accounts) database check constraints. */
export const LIMITS = {
  name: 80,
  description: 300,
  note: 5000,
  itemName: 120,
  servings: 24,
} as const;

export type Action =
  | { type: "favourite/add"; slug: string; at: string }
  | { type: "favourite/remove"; slug: string }
  | { type: "folder/create"; folder: Folder }
  | { type: "folder/rename"; id: string; name: string }
  | { type: "folder/delete"; id: string }
  | { type: "collection/create"; collection: Collection }
  | {
      type: "collection/update";
      id: string;
      name: string;
      description: string;
      folderId: string | null;
    }
  | { type: "collection/delete"; id: string }
  | { type: "collection/add-recipe"; id: string; slug: string }
  | { type: "collection/remove-recipe"; id: string; slug: string }
  | { type: "note/set"; slug: string; body: string; at: string }
  | { type: "plan/add"; entry: PlanEntry }
  | { type: "plan/update"; id: string; slug: string; servings: number }
  | { type: "plan/remove"; id: string }
  | { type: "shopping/upsert"; items: ShoppingItem[] }
  | { type: "shopping/toggle"; id: string }
  | { type: "shopping/remove"; ids: string[] }
  | { type: "profile/update"; profile: Profile };
