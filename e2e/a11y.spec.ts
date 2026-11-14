import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = ["/", "/privacy", "/work/wondrfly-pro"];

for (const theme of ["light", "dark"] as const) {
  test.describe(`axe · ${theme}`, () => {
    test.use({ colorScheme: theme });

    for (const route of routes) {
      test(`${route} has no violations`, async ({ page }) => {
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        const { violations } = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
          .analyze();
        expect(violations).toEqual([]);
      });
    }

    test("contact modal has no violations", async ({ page }) => {
      await page.goto("/");
      await page
        .getByRole("banner")
        .getByRole("button", { name: /Start a conversation|Contact/ })
        .click();
      await expect(page.getByRole("dialog")).toBeVisible();
      // Let the enter animation settle so axe doesn't sample mid-fade colours.
      await page.waitForTimeout(800);
      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
        .analyze();
      expect(violations).toEqual([]);
    });
  });
}
