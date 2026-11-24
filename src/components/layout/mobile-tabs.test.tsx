import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MobileTabsList } from "./mobile-tabs";

describe("MobileTabsList", () => {
  it("renders the five tabs", () => {
    render(<MobileTabsList pathname="/" />);
    const names = screen.getAllByRole("link").map((link) => link.textContent);
    expect(names).toEqual(["Home", "Browse", "Pantry", "Planner", "List"]);
  });

  it("marks only the current section with aria-current", () => {
    render(<MobileTabsList pathname="/recipes/lentil-soup" />);
    expect(screen.getByRole("link", { name: "Browse" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });

  it("marks nothing when the pathname is not yet known", () => {
    const { container } = render(<MobileTabsList pathname={null} />);
    expect(container.querySelector("[aria-current]")).toBeNull();
  });
});
