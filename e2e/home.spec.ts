import { expect, test } from "@playwright/test";

test("home page renders the hero and sections", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/CookBook/);
  await expect(
    page.getByRole("heading", { level: 1, name: /cook something wonderful tonight/i }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Browse by cuisine" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /In season: / })).toBeVisible();
});

test("search submits the query to /recipes and shows results", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("searchbox", { name: /search recipes/i }).fill("lentil");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page).toHaveURL(/\/recipes\?q=lentil$/);
  await expect(page.getByRole("link", { name: "Everyday Red Lentil Dal" })).toBeVisible();
});

test("skip link moves focus to the main content", async ({ page, isMobile }) => {
  test.skip(isMobile, "Keyboard navigation is a desktop concern");
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("shows the right navigation for the screen size", async ({ page, isMobile }) => {
  await page.goto("/");
  const tabBar = page
    .locator("nav[aria-label='Main']")
    .filter({ has: page.getByRole("link", { name: "Home" }) });
  if (isMobile) {
    await expect(tabBar).toBeVisible();
    await expect(tabBar.getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  } else {
    await expect(tabBar).toBeHidden();
    await expect(page.locator("header").getByRole("link", { name: "Pantry" })).toBeVisible();
  }
});

test("unknown pages show the friendly 404", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /couldn’t find that page/i })).toBeVisible();

  // Recipe pages stream with Cache Components, so an unknown slug is a "soft 404": the not-found
  // page with a noindex tag (status 200). See node_modules/next/dist/docs loading.md "Status codes".
  await page.goto("/recipes/not-a-recipe");
  await expect(page.getByRole("heading", { name: /couldn’t find that page/i })).toBeVisible();
  await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toBeAttached();
});
