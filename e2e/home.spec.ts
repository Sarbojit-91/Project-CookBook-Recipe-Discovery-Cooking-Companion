import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("home page renders the hero", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/CookBook/);
  await expect(
    page.getByRole("heading", { level: 1, name: /cook something wonderful tonight/i }),
  ).toBeVisible();
});

test("search submits the query to /recipes", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("searchbox", { name: /search recipes/i }).fill("lentil soup");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page).toHaveURL(/\/recipes\?q=lentil\+soup$/);
});

test("skip link moves focus to the main content", async ({ page, isMobile }) => {
  test.skip(isMobile, "Keyboard navigation is a desktop concern");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("shows the right navigation for the screen size", async ({ page, isMobile }) => {
  await page.goto("/");
  const header = page.locator("header");
  const tabBar = page.locator("body > nav[aria-label='Main']");
  if (isMobile) {
    await expect(tabBar).toBeVisible();
    await expect(tabBar.getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(header.getByRole("link", { name: "Pantry" })).toBeHidden();
  } else {
    await expect(tabBar).toBeHidden();
    await expect(header.getByRole("link", { name: "Pantry" })).toBeVisible();
  }
});

for (const path of ["/", "/this-page-does-not-exist"]) {
  test(`${path} has no detectable accessibility violations`, async ({ page }) => {
    await page.goto(path);
    // Let entrance animations finish, or axe measures contrast on half-faded text.
    await page.waitForFunction(() =>
      document.getAnimations().every((animation) => animation.playState === "finished"),
    );
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}

test("unknown pages show the friendly 404", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /couldn’t find that page/i })).toBeVisible();
});
