import { expect, type Page, test } from "@playwright/test";

async function fillValid(page: Page) {
  await page.getByRole("textbox", { name: "Name*" }).fill("Ada Lovelace");
  await page.getByRole("textbox", { name: "Email*" }).fill("ada@example.com");
  await page.getByRole("combobox", { name: "Budget range*" }).click();
  await page.getByRole("option", { name: /€3,000 – €6,000/ }).click();
}

test.describe("inquiry modal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Start a conversation" }).first().click();
    await expect(page.getByRole("dialog", { name: "Project enquiry" })).toBeVisible();
  });

  test("Send is disabled until valid, then submits and shows success", async ({ page }) => {
    let calls = 0;
    await page.route("**/api/inquiry", async (route) => {
      calls += 1;
      await new Promise((r) => setTimeout(r, 200));
      await route.fulfill({ json: { ok: true } });
    });

    const send = page.getByRole("button", { name: "Send", exact: true });
    await expect(send).toBeDisabled();
    await fillValid(page);
    await expect(send).toBeEnabled();

    await send.dblclick();
    await expect(page.getByText("Thank you — message sent.")).toBeVisible();
    expect(calls).toBe(1);

    await page.getByRole("button", { name: "Close", exact: true }).first().click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("shows an inline error and retries", async ({ page }) => {
    let attempt = 0;
    await page.route("**/api/inquiry", async (route) => {
      attempt += 1;
      await route.fulfill(
        attempt === 1
          ? { status: 502, json: { ok: false, error: "server" } }
          : { json: { ok: true } },
      );
    });
    await fillValid(page);
    await page.getByRole("button", { name: "Send", exact: true }).click();
    await expect(page.getByRole("alert")).toContainText("wasn't sent");
    await page.getByRole("button", { name: "Try again" }).click();
    await expect(page.getByText("Thank you — message sent.")).toBeVisible();
  });

  test("announces validation errors", async ({ page }) => {
    const email = page.getByRole("textbox", { name: "Email*" });
    await email.fill("nope");
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#inquiry-email-error")).not.toBeEmpty();
  });

  test("guards closing a dirty form", async ({ page }) => {
    await page.getByRole("textbox", { name: "Name*" }).fill("Ada");
    await page.keyboard.press("Escape");
    const confirm = page.getByRole("alertdialog");
    await expect(confirm).toBeVisible();
    await confirm.getByRole("button", { name: "Keep editing" }).click();
    await expect(page.getByRole("dialog", { name: "Project enquiry" })).toBeVisible();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Discard" }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("a clean form closes straight away", async ({ page }) => {
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});

test("pricing plan prefills the inquiry", async ({ page }) => {
  await page.goto("/");
  await page.locator("#pricing").scrollIntoViewIfNeeded();
  await page.getByRole("tab", { name: "Recurring" }).click();
  await page
    .locator("#pricing")
    .getByRole("button", { name: "Start a conversation" })
    .first()
    .click();
  await expect(page.getByText("Recurring · Standard")).toBeVisible();
});

test("mobile: single-column full-height sheet", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await page.getByRole("button", { name: "Start a conversation" }).first().click();
  const box = await page.getByRole("dialog").boundingBox();
  expect(box?.width).toBe(375);
  expect(box?.height).toBe(800);
});
