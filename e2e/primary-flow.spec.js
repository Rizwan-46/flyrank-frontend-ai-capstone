import { test, expect } from "@playwright/test";

const DEMO_EMAIL = "sarah@example.com";
const DEMO_PASSWORD = "Password123";

test("a user can log in, view their pets, and open a pet's profile", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel(/email/i).fill(DEMO_EMAIL);
  await page.getByLabel(/password/i).fill(DEMO_PASSWORD);
  await page.getByRole("button", { name: /log in/i }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText(/welcome back/i)).toBeVisible();

await page.getByRole("navigation").getByRole("link", { name: "Pets" }).click();
  await expect(page).toHaveURL(/\/dashboard\/pets$/);
  await expect(page.getByText("Max")).toBeVisible();

  await page.getByText("Max").click();
  await expect(page).toHaveURL(/\/dashboard\/pets\/.+/);
  await expect(page.getByRole("tab", { name: "Overview" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Vaccinations" })).toBeVisible();
});