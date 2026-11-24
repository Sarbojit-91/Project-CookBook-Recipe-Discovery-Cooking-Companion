import { test } from "@playwright/test";
import { expectAccessible } from "./helpers";

const pages = [
  "/",
  "/recipes",
  "/recipes/red-lentil-dal",
  "/recipes/red-lentil-dal/cook",
  "/pantry",
  "/pantry?have=onion,garlic,egg",
  "/saved",
  "/saved?tab=collections",
  "/planner",
  "/shopping-list",
  "/account",
  "/login",
  "/signup",
  "/cuisines/indian",
  "/meals/dinner",
  "/seasons/winter",
  "/about",
  "/credits",
  "/privacy",
  "/this-page-does-not-exist",
];

for (const path of pages) {
  test(`${path} has no detectable accessibility violations`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await expectAccessible(page);
  });
}
