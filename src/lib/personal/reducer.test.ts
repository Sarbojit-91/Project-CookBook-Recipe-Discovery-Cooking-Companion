import { describe, expect, it } from "vitest";
import { reducer } from "./reducer";
import { EMPTY_DATA, type PersonalData } from "./types";

const at = "2026-11-24T10:00:00.000Z";
const run = (state: PersonalData, ...actions: Parameters<typeof reducer>[1][]) =>
  actions.reduce(reducer, state);

describe("personal data reducer", () => {
  it("adds favourites once and removes them", () => {
    const s = run(
      EMPTY_DATA,
      { type: "favourite/add", slug: "dal", at },
      { type: "favourite/add", slug: "dal", at },
    );
    expect(s.favourites).toHaveLength(1);
    expect(run(s, { type: "favourite/remove", slug: "dal" }).favourites).toEqual([]);
  });

  it("returns the same state when nothing changes", () => {
    const s = run(EMPTY_DATA, { type: "favourite/add", slug: "dal", at });
    expect(reducer(s, { type: "favourite/add", slug: "dal", at })).toBe(s);
  });

  it("keeps collections when their folder is deleted", () => {
    const s = run(
      EMPTY_DATA,
      {
        type: "folder/create",
        folder: { id: "f1", name: "Weeknights", position: 0, createdAt: at },
      },
      {
        type: "collection/create",
        collection: {
          id: "c1",
          name: "Quick",
          description: "",
          folderId: "f1",
          recipeSlugs: [],
          createdAt: at,
        },
      },
      { type: "folder/delete", id: "f1" },
    );
    expect(s.folders).toEqual([]);
    expect(s.collections[0].folderId).toBeNull();
  });

  it("does not add a recipe to a collection twice", () => {
    const s = run(
      EMPTY_DATA,
      {
        type: "collection/create",
        collection: {
          id: "c1",
          name: "Quick",
          description: "",
          folderId: null,
          recipeSlugs: [],
          createdAt: at,
        },
      },
      { type: "collection/add-recipe", id: "c1", slug: "dal" },
      { type: "collection/add-recipe", id: "c1", slug: "dal" },
    );
    expect(s.collections[0].recipeSlugs).toEqual(["dal"]);
  });

  it("trims names and enforces limits", () => {
    const s = run(EMPTY_DATA, {
      type: "collection/create",
      collection: {
        id: "c1",
        name: `  ${"x".repeat(200)}  `,
        description: "",
        folderId: null,
        recipeSlugs: [],
        createdAt: at,
      },
    });
    expect(s.collections[0].name).toHaveLength(80);
  });

  it("ignores a folder that doesn't exist when updating a collection", () => {
    const s = run(
      EMPTY_DATA,
      {
        type: "collection/create",
        collection: {
          id: "c1",
          name: "A",
          description: "",
          folderId: null,
          recipeSlugs: [],
          createdAt: at,
        },
      },
      { type: "collection/update", id: "c1", name: "B", description: "d", folderId: "nope" },
    );
    expect(s.collections[0]).toMatchObject({ name: "B", description: "d", folderId: null });
  });

  it("deletes a note when it's emptied", () => {
    const s = run(EMPTY_DATA, { type: "note/set", slug: "dal", body: "More chilli", at });
    expect(s.notes.dal.body).toBe("More chilli");
    expect(run(s, { type: "note/set", slug: "dal", body: "   ", at }).notes).toEqual({});
  });

  it("clamps planner servings", () => {
    const s = run(EMPTY_DATA, {
      type: "plan/add",
      entry: {
        id: "e1",
        weekStart: "2026-11-23",
        day: 0,
        slot: "dinner",
        slug: "dal",
        servings: 99,
        position: 0,
      },
    });
    expect(s.plan[0].servings).toBe(24);
    expect(
      run(s, { type: "plan/update", id: "e1", slug: "dal", servings: 0 }).plan[0].servings,
    ).toBe(1);
  });

  it("toggles and removes shopping items", () => {
    const item = {
      id: "i1",
      ingredientId: null,
      name: "Lemons",
      amounts: [],
      aisle: "produce" as const,
      purchased: false,
      sources: [],
      createdAt: at,
    };
    let s = run(
      EMPTY_DATA,
      { type: "shopping/upsert", items: [item] },
      { type: "shopping/toggle", id: "i1" },
    );
    expect(s.shopping[0].purchased).toBe(true);
    s = run(s, { type: "shopping/remove", ids: ["i1"] });
    expect(s.shopping).toEqual([]);
  });
});
