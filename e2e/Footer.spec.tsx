import { expect, test } from "@playwright/test";

test("Footer should contain the correct links", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByLabel("Universidad Pontificia Bolivariana website")
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: "Data Processing and Protection Policy",
      exact: true
    })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "User Manual", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Organization profile", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Frontend repository", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Main API repository", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Tests runner repository", exact: true })
  ).toBeVisible();
});
