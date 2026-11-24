import { render, screen } from "@testing-library/react";
import { Heart } from "lucide-react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("shows the title, description and action", () => {
    render(
      <EmptyState
        icon={Heart}
        title="No saved recipes yet"
        description="Tap the heart on any recipe."
        action={<a href="/recipes">Browse recipes</a>}
      />,
    );
    expect(screen.getByRole("heading", { name: "No saved recipes yet" })).toBeInTheDocument();
    expect(screen.getByText("Tap the heart on any recipe.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse recipes" })).toHaveAttribute(
      "href",
      "/recipes",
    );
  });
});
