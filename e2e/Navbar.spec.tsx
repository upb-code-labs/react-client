import { expect, test } from "@playwright/test";

test("App icon should redirect to home page", async ({ page, baseURL }) => {
  await page.goto("/login");
  await page.getByRole("link", { name: "Code Labs" }).click();
  expect(page.url()).toBe(`${baseURL}/`);
});

test("Default navigation options are shown in desktop", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Login", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Register", exact: true })
  ).toBeVisible();
});

test("Responsive layout is shown in mobile", async ({ page }) => {
  page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");

  await page.getByLabel("Open menu").click();
  await expect(
    page.getByRole("link", { name: "Login", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Register", exact: true })
  ).toBeVisible();

  await page.getByLabel("Close menu").click();
  await expect(
    page.getByRole("link", { name: "Login", exact: true })
  ).not.toBeVisible();
  await expect(
    page.getByRole("link", { name: "Register", exact: true })
  ).not.toBeVisible();
});
