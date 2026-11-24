import { describe, expect, it } from "vitest";
import { isActivePath } from "./nav-items";

describe("isActivePath", () => {
  it("matches home only on the home page", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/recipes", "/")).toBe(false);
  });

  it("matches a section and its sub-pages", () => {
    expect(isActivePath("/recipes", "/recipes")).toBe(true);
    expect(isActivePath("/recipes/lentil-soup", "/recipes")).toBe(true);
  });

  it("does not match a path that only shares a prefix", () => {
    expect(isActivePath("/recipes-old", "/recipes")).toBe(false);
  });

  it("is false when the pathname is unknown", () => {
    expect(isActivePath(null, "/recipes")).toBe(false);
  });
});
