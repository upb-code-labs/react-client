import { test, expect } from "@playwright/test";

test("App icon should redirect to home page", async ({ page, baseURL }) => {
  await page.goto("/login");
  await page.getByLabel("Go to home page").click();
  expect(page.url()).toBe(`${baseURL}/`);
});

test("Default navigation options are shown in desktop", async ({ page }) => {
  await page.goto("/");
  expect(page.getByText("Login")).toBeVisible();
  expect(page.getByText("Register")).toBeVisible();
});

test("Responsive layout is shown in mobile", async ({ page }) => {
  page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");

  await page.getByLabel("Open menu").click();
  expect(page.getByText("Login")).toBeVisible();
  expect(page.getByText("Register")).toBeVisible();

  await page.getByLabel("Close menu").click();
  expect(page.getByText("Login")).not.toBeVisible();
  expect(page.getByText("Register")).not.toBeVisible();
});
