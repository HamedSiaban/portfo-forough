import { expect, test } from "@playwright/test";

test("theme choice persists across reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("banner").getByRole("button", { name: "Dark theme" }).click();
  const before = await page.locator("html").getAttribute("class");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("class", before ?? "");
});

test("unknown route renders the branded 404", async ({ page }) => {
  const response = await page.goto("/nope");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("doesn't exist");
});

test("sitemap and robots are served", async ({ request }) => {
  expect((await request.get("/sitemap.xml")).ok()).toBe(true);
  expect((await request.get("/robots.txt")).ok()).toBe(true);
});

test("header fits on one row at 375px", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  const height = await page.getByRole("banner").evaluate((el) => el.getBoundingClientRect().height);
  expect(height).toBeLessThan(72);
});
