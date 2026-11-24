import { LIMITS, type Action, type PersonalData } from "./types";

const clip = (text: string, max: number) => text.trim().slice(0, max);
const clampServings = (n: number) => Math.min(LIMITS.servings, Math.max(1, Math.round(n) || 1));

/** Pure state transitions for personal data. Shared by the device and account backends. */
export function reducer(state: PersonalData, action: Action): PersonalData {
  switch (action.type) {
    case "favourite/add":
      if (state.favourites.some((f) => f.slug === action.slug)) return state;
      return {
        ...state,
        favourites: [{ slug: action.slug, addedAt: action.at }, ...state.favourites],
      };

    case "favourite/remove":
      return { ...state, favourites: state.favourites.filter((f) => f.slug !== action.slug) };

    case "folder/create":
      return {
        ...state,
        folders: [
          ...state.folders,
          { ...action.folder, name: clip(action.folder.name, LIMITS.name) },
        ],
      };

    case "folder/rename":
      return {
        ...state,
        folders: state.folders.map((f) =>
          f.id === action.id ? { ...f, name: clip(action.name, LIMITS.name) } : f,
        ),
      };

    case "folder/delete":
      // Collections in the folder are kept and moved out of it.
      return {
        ...state,
        folders: state.folders.filter((f) => f.id !== action.id),
        collections: state.collections.map((c) =>
          c.folderId === action.id ? { ...c, folderId: null } : c,
        ),
      };

    case "collection/create":
      return {
        ...state,
        collections: [
          ...state.collections,
          {
            ...action.collection,
            name: clip(action.collection.name, LIMITS.name),
            description: clip(action.collection.description, LIMITS.description),
          },
        ],
      };

    case "collection/update":
      return {
        ...state,
        collections: state.collections.map((c) =>
          c.id === action.id
            ? {
                ...c,
                name: clip(action.name, LIMITS.name),
                description: clip(action.description, LIMITS.description),
                folderId: state.folders.some((f) => f.id === action.folderId)
                  ? action.folderId
                  : null,
              }
            : c,
        ),
      };

    case "collection/delete":
      return { ...state, collections: state.collections.filter((c) => c.id !== action.id) };

    case "collection/add-recipe":
      return {
        ...state,
        collections: state.collections.map((c) =>
          c.id === action.id && !c.recipeSlugs.includes(action.slug)
            ? { ...c, recipeSlugs: [...c.recipeSlugs, action.slug] }
            : c,
        ),
      };

    case "collection/remove-recipe":
      return {
        ...state,
        collections: state.collections.map((c) =>
          c.id === action.id
            ? { ...c, recipeSlugs: c.recipeSlugs.filter((s) => s !== action.slug) }
            : c,
        ),
      };

    case "note/set": {
      const notes = { ...state.notes };
      const body = action.body.slice(0, LIMITS.note);
      if (body.trim()) notes[action.slug] = { body, updatedAt: action.at };
      else delete notes[action.slug];
      return { ...state, notes };
    }

    case "plan/add":
      return {
        ...state,
        plan: [...state.plan, { ...action.entry, servings: clampServings(action.entry.servings) }],
      };

    case "plan/update":
      return {
        ...state,
        plan: state.plan.map((e) =>
          e.id === action.id
            ? { ...e, slug: action.slug, servings: clampServings(action.servings) }
            : e,
        ),
      };

    case "plan/remove":
      return { ...state, plan: state.plan.filter((e) => e.id !== action.id) };

    case "shopping/upsert": {
      const byId = new Map(state.shopping.map((i) => [i.id, i]));
      for (const item of action.items)
        byId.set(item.id, { ...item, name: clip(item.name, LIMITS.itemName) });
      return { ...state, shopping: [...byId.values()] };
    }

    case "shopping/toggle":
      return {
        ...state,
        shopping: state.shopping.map((i) =>
          i.id === action.id ? { ...i, purchased: !i.purchased } : i,
        ),
      };

    case "shopping/remove": {
      const ids = new Set(action.ids);
      return { ...state, shopping: state.shopping.filter((i) => !ids.has(i.id)) };
    }

    case "profile/update":
      return {
        ...state,
        profile: { ...action.profile, displayName: clip(action.profile.displayName, LIMITS.name) },
      };
  }
}
