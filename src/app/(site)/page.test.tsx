import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/render";
import HomePage from "./page";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn(), replace: vi.fn() }) }));

describe("HomePage", () => {
  it("renders the hero heading", () => {
    renderWithProviders(<HomePage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /cook something wonderful tonight/i }),
    ).toBeInTheDocument();
  });

  it("has a labelled recipe search that submits to /recipes", () => {
    renderWithProviders(<HomePage />);
    const input = screen.getByRole("searchbox", { name: /search recipes/i });
    expect(input).toHaveAttribute("name", "q");
    expect(input.closest("form")).toHaveAttribute("action", "/recipes");
  });

  it("shows the main sections", () => {
    renderWithProviders(<HomePage />);
    for (const name of [
      "Editor’s picks",
      "Quick & easy",
      "Browse by meal",
      "Browse by cuisine",
      "Recently added",
    ]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
    }
  });
});
