import { expect, test, type Page } from "@playwright/test";

async function openFiltersIfCollapsed(page: Page) {
  const toggle = page.getByRole("button", { name: /^Filters/ });
  if (await toggle.isVisible()) await toggle.click();
}

test("browse: filter by text and diet, kept in the URL", async ({ page }) => {
  await page.goto("/recipes");
  await page.getByLabel("Search recipes").fill("chickpeas");
  await expect(page).toHaveURL(/q=chickpeas/);
  await expect(page.getByRole("link", { name: "Extra-Smooth Hummus" })).toBeVisible();

  await page.getByLabel("Search recipes").fill("");
  await openFiltersIfCollapsed(page);
  await page.getByLabel("Diet").selectOption("vegetarian-no-egg");
  await expect(page).toHaveURL(/diet=vegetarian-no-egg/);
  await expect(page.getByRole("link", { name: "Shakshuka" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Everyday Red Lentil Dal" })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("link", { name: "Shakshuka" })).toHaveCount(0);
});

test("recipe page: scale servings", async ({ page }) => {
  await page.goto("/recipes/red-lentil-dal");
  await expect(
    page.getByRole("heading", { level: 1, name: "Everyday Red Lentil Dal" }),
  ).toBeVisible();
  const ingredients = page.getByRole("region", { name: "Ingredients" });
  await expect(ingredients.getByText("250 g", { exact: true })).toBeVisible();
  for (let i = 0; i < 4; i++)
    await ingredients.getByRole("button", { name: "Increase servings" }).click();
  await expect(ingredients.getByText("500 g", { exact: true })).toBeVisible();
  await expect(ingredients.getByText(/Quantities scaled from 4 servings/)).toBeVisible();
});

test("favourites and collections are saved and shown on /saved", async ({ page }) => {
  await page.goto("/recipes/shakshuka");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByRole("button", { name: "Saved", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.getByRole("button", { name: "Add to collection" }).click();
  const dialog = page.getByRole("dialog", { name: "Add to a collection" });
  await dialog.getByLabel("New collection").fill("Brunch ideas");
  await dialog.getByRole("button", { name: "Create" }).click();
  await expect(dialog.getByRole("checkbox", { name: /Brunch ideas/ })).toBeChecked();
  await dialog.getByRole("button", { name: "Close" }).click();

  await page.goto("/saved");
  await expect(page.getByRole("link", { name: "Shakshuka" })).toBeVisible();
  await page.getByRole("link", { name: /Collections/ }).click();
  await page.getByRole("link", { name: /Brunch ideas/ }).click();
  await expect(page.getByRole("heading", { name: "Brunch ideas" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Shakshuka" })).toBeVisible();

  // Survives a reload (saved on the device).
  await page.reload();
  await expect(page.getByRole("link", { name: "Shakshuka" })).toBeVisible();
});

test("notes persist", async ({ page }) => {
  await page.goto("/recipes/egg-fried-rice");
  await page.getByLabel("Notes for this recipe").fill("Add extra garlic next time");
  await page.getByRole("button", { name: "Save note" }).click();
  await page.reload();
  await expect(page.getByLabel("Notes for this recipe")).toHaveValue("Add extra garlic next time");
  await page.goto("/saved?tab=notes");
  await expect(page.getByText("Add extra garlic next time")).toBeVisible();
});

test("planner → shopping list → tick off items", async ({ page }) => {
  await page.goto("/planner");
  const firstDay = page
    .getByRole("listitem")
    .filter({ has: page.getByRole("heading", { level: 3 }) })
    .first();
  await firstDay.getByRole("button", { name: /^Add dinner on/ }).click();
  const dialog = page.getByRole("dialog", { name: "Add a meal" });
  await dialog.getByLabel("Find a recipe").fill("dal");
  await dialog.getByRole("radio", { name: /Everyday Red Lentil Dal/ }).check();
  await dialog.getByRole("button", { name: "Add to plan" }).click();
  await expect(firstDay.getByRole("link", { name: "Everyday Red Lentil Dal" })).toBeVisible();
  await expect(page.getByText("1 meal planned this week.")).toBeVisible();

  await page.getByRole("button", { name: "Generate shopping list" }).click();
  await page.goto("/shopping-list");
  const produce = page.getByRole("region", { name: "Fruit & vegetables" });
  await expect(produce.getByText("garlic")).toBeVisible();
  await expect(page.getByText("split red lentils")).toBeVisible();
  await expect(page.getByText("For Everyday Red Lentil Dal").first()).toBeVisible();

  await page.getByLabel("Add an item").fill("Tomatoes");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await expect(produce.getByText("tomato", { exact: true })).toBeVisible();

  await page.getByRole("checkbox", { name: /split red lentils/ }).check();
  await expect(
    page.getByRole("region", { name: "In your basket" }).getByText("split red lentils"),
  ).toBeVisible();
});

test("pantry search shows complete matches and what's missing", async ({ page }) => {
  await page.goto("/pantry");
  const box = page.getByRole("combobox", { name: "Add an ingredient you have" });
  for (const name of ["chickpeas", "tahini", "lemon", "garlic", "ground cumin", "sweet paprika"]) {
    await box.fill(name);
    await page
      .getByRole("option", { name: new RegExp(`^${name}`) })
      .first()
      .click();
  }
  await expect(page).toHaveURL(/have=/);
  const complete = page
    .getByRole("region", { name: /You have everything/ })
    .or(
      page
        .locator("section")
        .filter({ has: page.getByRole("heading", { name: /You have everything/ }) }),
    );
  await expect(complete.getByRole("link", { name: "Extra-Smooth Hummus" })).toBeVisible();
  await expect(page.getByText(/Missing: /).first()).toBeAttached();
});

test("cooking mode: steps, keyboard, timer and finish", async ({ page, isMobile }) => {
  await page.goto("/recipes/shakshuka/cook");
  await expect(page.getByText("Step 1 of 6").first()).toBeVisible();
  await page.getByRole("button", { name: "Start 10 minutes timer" }).click();
  await expect(page.getByRole("list", { name: "Timers" })).toContainText("Step 1");
  await page.getByRole("button", { name: "Next step" }).click();
  await expect(page.getByText("Step 2 of 6").first()).toBeVisible();
  if (!isMobile) {
    await page.keyboard.press("ArrowRight");
    await expect(page.getByText("Step 3 of 6").first()).toBeVisible();
    await page.keyboard.press("ArrowLeft");
  }
  for (let i = 0; i < 5; i++) await page.getByRole("button", { name: /Next step|Finish/ }).click();
  await expect(page.getByRole("heading", { name: "Enjoy your meal!" })).toBeVisible();
});

test("account page works without an account backend", async ({ page }) => {
  await page.goto("/account");
  await expect(page.getByRole("heading", { name: "Using CookBook on this device" })).toBeVisible();
  await page.getByLabel("Week starts on").selectOption("0");
  await page.getByRole("button", { name: "Save preferences" }).click();
  await page.reload();
  await expect(page.getByLabel("Week starts on")).toHaveValue("0");
  await page.goto("/login");
  await expect(
    page.getByRole("heading", { name: "Accounts aren’t switched on yet" }),
  ).toBeVisible();
});
