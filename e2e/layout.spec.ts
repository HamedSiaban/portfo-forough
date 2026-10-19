import { expect, test } from "@playwright/test";

test.describe("layout shell", () => {
  test("header Projects button scrolls to the work section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("banner").getByRole("link", { name: "Projects" }).click();
    await expect(page.locator("#work")).toBeInViewport();
  });

  test("Start a conversation opens the contact modal and Esc returns focus", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("banner").getByRole("button", { name: "Start a conversation" });
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: "Let's talk" });
    await expect(dialog).toBeVisible();
    for (const name of ["WhatsApp", "LinkedIn", "Calendly", "Email"]) {
      await expect(dialog.getByRole("link", { name })).toBeVisible();
    }

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });
});
