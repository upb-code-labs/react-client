import { expect, test } from "@playwright/test";

test("Footer should contain the correct links", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByLabel("Universidad Pontificia Bolivariana website")
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: "Information Processing and Personal Data Protection Policy",
      exact: true
    })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "User Manual", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Organization profile", exact: true })
  ).toBeVisible();
});
