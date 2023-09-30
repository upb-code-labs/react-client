import { expect, test } from "@playwright/test";

test("Footer should contain the correct links", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByLabel("Universidad Pontificia Bolivariana website")
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Data Processing and Protection Policy" })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "User Manual" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Organization profile" })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Frontend repository" })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Main API repository" })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Tests runner repository" })
  ).toBeVisible();
});
