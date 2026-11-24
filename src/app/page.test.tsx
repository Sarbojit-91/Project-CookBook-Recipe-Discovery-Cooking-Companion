import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  it("renders the hero heading", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /cook something wonderful tonight/i }),
    ).toBeInTheDocument();
  });

  it("has a labelled recipe search that submits to /recipes", () => {
    render(<HomePage />);
    const input = screen.getByRole("searchbox", { name: /search recipes/i });
    expect(input).toHaveAttribute("name", "q");
    expect(input.closest("form")).toHaveAttribute("action", "/recipes");
  });
});
