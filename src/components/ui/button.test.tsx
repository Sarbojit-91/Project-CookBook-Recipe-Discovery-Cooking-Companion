import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button, buttonVariants } from "./button";

describe("Button", () => {
  it("defaults to type=button so it never submits a form by accident", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("type", "button");
  });

  it("keeps a 44px touch target for the icon size", () => {
    expect(buttonVariants({ size: "icon" })).toContain("size-11");
  });

  it("appends custom class names", () => {
    expect(buttonVariants({ className: "w-full" })).toMatch(/w-full$/);
  });
});
