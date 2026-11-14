import { expect, test } from "@playwright/test";

test("home page responds with 200", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
});

test("work grid has four tagged cards right after the hero", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator("#work > div > ul > li");
  await expect(cards).toHaveCount(4);
  await expect(cards.first().getByText("AI Systems")).toBeVisible();
});

test("case study shows a four-up executive metric grid", async ({ page }) => {
  await page.goto("/work/wondrfly-pro");
  await expect(page.locator("dl[aria-label='Key results'] > div")).toHaveCount(4);
});
