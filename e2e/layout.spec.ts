import { expect, test } from "@playwright/test";

test.describe("layout shell", () => {
  test("Start a conversation opens the inquiry modal and Esc returns focus", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("banner").getByRole("button", { name: "Start a conversation" });
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: "Let's talk" });
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });
});
