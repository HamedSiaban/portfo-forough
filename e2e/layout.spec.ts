import { expect, test } from "@playwright/test";

test.describe("layout shell", () => {
  test("Pricing scrolls to the pricing section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Pricing" }).click();
    await expect(page.locator("#pricing")).toBeInViewport();
  });

  test("Start a conversation opens the inquiry modal and Esc returns focus", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Start a conversation" });
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: "Project enquiry" });
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });
});
