import type { SupabaseClient } from "@supabase/supabase-js";
import { EMPTY_DATA, type Action, type PersonalData, type Profile } from "./types";

/* Row shapes, matching supabase/migrations. */
type FavouriteRow = { recipe_slug: string; created_at: string };
type FolderRow = { id: string; name: string; position: number; created_at: string };
type CollectionRow = {
  id: string;
  name: string;
  description: string;
  folder_id: string | null;
  created_at: string;
  collection_recipes: { recipe_slug: string; position: number }[];
};
type NoteRow = { recipe_slug: string; body: string; updated_at: string };
type PlanRow = {
  id: string;
  week_start: string;
  day: number;
  slot: PersonalData["plan"][number]["slot"];
  recipe_slug: string;
  servings: number;
  position: number;
};
type ItemRow = {
  id: string;
  ingredient_id: string | null;
  name: string;
  amounts: PersonalData["shopping"][number]["amounts"];
  aisle: PersonalData["shopping"][number]["aisle"];
  is_purchased: boolean;
  source_recipe_slugs: string[];
  created_at: string;
};
type ProfileRow = {
  display_name: string;
  dietary_preference: Profile["dietaryPreference"];
  week_starts_on: 0 | 1;
};

function check<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  return result.data as T;
}

/** Loads everything for the signed-in user. RLS limits every query to their own rows. */
export async function loadAccount(db: SupabaseClient): Promise<PersonalData> {
  const [favourites, folders, collections, notes, plan, items, profile] = await Promise.all([
    db
      .from("favourites")
      .select("recipe_slug, created_at")
      .order("created_at", { ascending: false }),
    db.from("collection_folders").select("id, name, position, created_at").order("position"),
    db
      .from("collections")
      .select(
        "id, name, description, folder_id, created_at, collection_recipes(recipe_slug, position)",
      )
      .order("created_at"),
    db.from("recipe_notes").select("recipe_slug, body, updated_at"),
    db
      .from("meal_plan_entries")
      .select("id, week_start, day, slot, recipe_slug, servings, position"),
    db
      .from("shopping_list_items")
      .select(
        "id, ingredient_id, name, amounts, aisle, is_purchased, source_recipe_slugs, created_at",
      )
      .order("created_at"),
    db.from("profiles").select("display_name, dietary_preference, week_starts_on").maybeSingle(),
  ]);

  const p = check<ProfileRow | null>(profile);
  return {
    favourites: check<FavouriteRow[]>(favourites).map((r) => ({
      slug: r.recipe_slug,
      addedAt: r.created_at,
    })),
    folders: check<FolderRow[]>(folders).map((r) => ({
      id: r.id,
      name: r.name,
      position: r.position,
      createdAt: r.created_at,
    })),
    collections: check<CollectionRow[]>(collections).map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      folderId: r.folder_id,
      createdAt: r.created_at,
      recipeSlugs: [...r.collection_recipes]
        .sort((a, b) => a.position - b.position)
        .map((x) => x.recipe_slug),
    })),
    notes: Object.fromEntries(
      check<NoteRow[]>(notes).map((r) => [
        r.recipe_slug,
        { body: r.body, updatedAt: r.updated_at },
      ]),
    ),
    plan: check<PlanRow[]>(plan).map((r) => ({
      id: r.id,
      weekStart: r.week_start,
      day: r.day,
      slot: r.slot,
      slug: r.recipe_slug,
      servings: r.servings,
      position: r.position,
    })),
    shopping: check<ItemRow[]>(items).map((r) => ({
      id: r.id,
      ingredientId: r.ingredient_id,
      name: r.name,
      amounts: r.amounts,
      aisle: r.aisle,
      purchased: r.is_purchased,
      sources: r.source_recipe_slugs,
      createdAt: r.created_at,
    })),
    profile: p
      ? {
          displayName: p.display_name,
          dietaryPreference: p.dietary_preference,
          weekStartsOn: p.week_starts_on,
        }
      : EMPTY_DATA.profile,
  };
}

/**
 * Writes one action to the database. Called after the reducer has already updated the screen;
 * if this throws, the store reloads from the server so the screen never shows unsaved data.
 */
export async function syncAction(
  db: SupabaseClient,
  userId: string,
  action: Action,
  next: PersonalData,
): Promise<void> {
  const run = async (query: PromiseLike<{ error: { message: string } | null }>) => {
    const { error } = await query;
    if (error) throw new Error(error.message);
  };

  switch (action.type) {
    case "favourite/add":
      return run(
        db
          .from("favourites")
          .upsert(
            { user_id: userId, recipe_slug: action.slug, created_at: action.at },
            { ignoreDuplicates: true },
          ),
      );
    case "favourite/remove":
      return run(db.from("favourites").delete().eq("recipe_slug", action.slug));
    case "folder/create": {
      const f = next.folders.find((x) => x.id === action.folder.id)!;
      return run(
        db.from("collection_folders").insert({
          id: f.id,
          user_id: userId,
          name: f.name,
          position: f.position,
          created_at: f.createdAt,
        }),
      );
    }
    case "folder/rename": {
      const f = next.folders.find((x) => x.id === action.id);
      return f
        ? run(db.from("collection_folders").update({ name: f.name }).eq("id", f.id))
        : undefined;
    }
    case "folder/delete":
      return run(db.from("collection_folders").delete().eq("id", action.id));
    case "collection/create": {
      const c = next.collections.find((x) => x.id === action.collection.id)!;
      await run(
        db.from("collections").insert({
          id: c.id,
          user_id: userId,
          name: c.name,
          description: c.description,
          folder_id: c.folderId,
          created_at: c.createdAt,
        }),
      );
      if (c.recipeSlugs.length > 0) {
        await run(
          db.from("collection_recipes").insert(
            c.recipeSlugs.map((slug, position) => ({
              collection_id: c.id,
              recipe_slug: slug,
              position,
            })),
          ),
        );
      }
      return;
    }
    case "collection/update": {
      const c = next.collections.find((x) => x.id === action.id);
      return c
        ? run(
            db
              .from("collections")
              .update({ name: c.name, description: c.description, folder_id: c.folderId })
              .eq("id", c.id),
          )
        : undefined;
    }
    case "collection/delete":
      return run(db.from("collections").delete().eq("id", action.id));
    case "collection/add-recipe": {
      const c = next.collections.find((x) => x.id === action.id);
      if (!c) return;
      return run(
        db.from("collection_recipes").upsert(
          {
            collection_id: c.id,
            recipe_slug: action.slug,
            position: c.recipeSlugs.indexOf(action.slug),
          },
          { ignoreDuplicates: true },
        ),
      );
    }
    case "collection/remove-recipe":
      return run(
        db
          .from("collection_recipes")
          .delete()
          .eq("collection_id", action.id)
          .eq("recipe_slug", action.slug),
      );
    case "note/set": {
      const note = next.notes[action.slug];
      return note
        ? run(
            db.from("recipe_notes").upsert({
              user_id: userId,
              recipe_slug: action.slug,
              body: note.body,
              updated_at: note.updatedAt,
            }),
          )
        : run(db.from("recipe_notes").delete().eq("recipe_slug", action.slug));
    }
    case "plan/add": {
      const e = next.plan.find((x) => x.id === action.entry.id)!;
      return run(
        db.from("meal_plan_entries").insert({
          id: e.id,
          user_id: userId,
          week_start: e.weekStart,
          day: e.day,
          slot: e.slot,
          recipe_slug: e.slug,
          servings: e.servings,
          position: e.position,
        }),
      );
    }
    case "plan/update": {
      const e = next.plan.find((x) => x.id === action.id);
      return e
        ? run(
            db
              .from("meal_plan_entries")
              .update({ recipe_slug: e.slug, servings: e.servings })
              .eq("id", e.id),
          )
        : undefined;
    }
    case "plan/remove":
      return run(db.from("meal_plan_entries").delete().eq("id", action.id));
    case "shopping/upsert": {
      const ids = new Set(action.items.map((i) => i.id));
      const rows = next.shopping
        .filter((i) => ids.has(i.id))
        .map((i) => ({
          id: i.id,
          user_id: userId,
          ingredient_id: i.ingredientId,
          name: i.name,
          amounts: i.amounts,
          aisle: i.aisle,
          is_purchased: i.purchased,
          source_recipe_slugs: i.sources,
          created_at: i.createdAt,
        }));
      return run(db.from("shopping_list_items").upsert(rows));
    }
    case "shopping/toggle": {
      const item = next.shopping.find((i) => i.id === action.id);
      return item
        ? run(
            db
              .from("shopping_list_items")
              .update({ is_purchased: item.purchased })
              .eq("id", item.id),
          )
        : undefined;
    }
    case "shopping/remove":
      return run(db.from("shopping_list_items").delete().in("id", action.ids));
    case "profile/update":
      return run(
        db
          .from("profiles")
          .update({
            display_name: next.profile.displayName,
            dietary_preference: next.profile.dietaryPreference,
            week_starts_on: next.profile.weekStartsOn,
          })
          .eq("id", userId),
      );
  }
}
