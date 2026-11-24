import { describe, expect, it } from "vitest";
import { addDays, isISODate, startOfWeek, weekLabel } from "./week";

describe("week helpers", () => {
  it("finds the start of the week for Monday and Sunday starts", () => {
    const wed = new Date(2026, 10, 25); // Wednesday 25 Nov 2026
    expect(startOfWeek(wed, 1)).toBe("2026-11-23");
    expect(startOfWeek(wed, 0)).toBe("2026-11-22");
    expect(startOfWeek(new Date(2026, 10, 23), 1)).toBe("2026-11-23");
  });

  it("adds days across month boundaries", () => {
    expect(addDays("2026-11-29", 3)).toBe("2026-12-02");
  });

  it("validates ISO dates", () => {
    expect(isISODate("2026-11-23")).toBe(true);
    expect(isISODate("23/11/2026")).toBe(false);
    expect(isISODate(null)).toBe(false);
  });

  it("labels a week", () => {
    expect(weekLabel("2026-11-23")).toBe("23 Nov – 29 Nov");
  });
});
