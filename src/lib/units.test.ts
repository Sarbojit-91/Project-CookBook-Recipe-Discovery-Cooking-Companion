import { describe, expect, it } from "vitest";
import { areCompatible, convert } from "./units";

describe("units", () => {
  it("converts within the same dimension", () => {
    expect(convert(1, "kg", "g")).toBe(1000);
    expect(convert(3, "tsp", "tbsp")).toBe(1);
    expect(convert(1, "l", "ml")).toBe(1000);
  });

  it("never converts between mass and volume", () => {
    expect(areCompatible("g", "ml")).toBe(false);
    expect(convert(100, "g", "cup")).toBeNull();
  });

  it("keeps count-like units apart", () => {
    expect(areCompatible("clove", "piece")).toBe(false);
    expect(areCompatible("bunch", "handful")).toBe(false);
    expect(areCompatible("piece", "piece")).toBe(true);
  });
});
