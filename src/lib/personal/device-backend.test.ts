import { beforeEach, describe, expect, it } from "vitest";
import { hydrate, loadDevice, saveDevice } from "./device-backend";
import { EMPTY_DATA } from "./types";

describe("device storage", () => {
  beforeEach(() => window.localStorage.clear());

  it("round-trips data", () => {
    const data = { ...EMPTY_DATA, favourites: [{ slug: "dal", addedAt: "2026-11-24" }] };
    expect(saveDevice(data)).toBe(true);
    expect(loadDevice()).toEqual(data);
  });

  it("recovers from missing or damaged data", () => {
    expect(loadDevice()).toEqual(EMPTY_DATA);
    window.localStorage.setItem("cookbook:v1:device", "{not json");
    expect(loadDevice()).toEqual(EMPTY_DATA);
    expect(hydrate({ favourites: "nope", profile: { weekStartsOn: 0 } })).toEqual({
      ...EMPTY_DATA,
      profile: { ...EMPTY_DATA.profile, weekStartsOn: 0 },
    });
  });
});
