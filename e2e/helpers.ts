import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

/** Waits for entrance animations so axe measures final colours, then checks WCAG A/AA. */
export async function expectAccessible(page: Page) {
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every((a) => a.playState === "finished" || a.effect?.getTiming().iterations === Infinity),
  );
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target.join(" ")) })),
  ).toEqual([]);
}
