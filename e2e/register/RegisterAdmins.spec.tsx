import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Login as an admin
  await page.goto("/login");
  await page.getByLabel("Email").fill("development.admin@gmail.com");
  await page.getByLabel("Password").fill("changeme123*/");
  await page.getByRole("button", { name: "Submit" }).click();

  // Assert the admins page is loaded
  expect(page.waitForURL(/\/admins$/)).toBeTruthy();
});

test("The fields are validated", async ({ page }) => {
  // Go to the register page
  await page.getByRole("link", { name: "Register admin" }).click();
  expect(page.waitForURL(/\/register\/admins$/)).toBeTruthy();

  // Fill the form
  await page.getByLabel("Full name").fill("a");
  await page.getByLabel("Email").fill("a");
  await page.getByLabel("Password").fill("insecure");
  await page.getByRole("button", { name: "Submit" }).click();

  // Assert the errors are shown
  await expect(
    page.getByText("Full name must be at least 4 characters long")
  ).toBeVisible();
  await expect(page.getByText("Invalid email")).toBeVisible();
  await expect(
    page.getByText(
      "Must contain at least one letter, one number and one special character"
    )
  ).toBeVisible();
});

test.describe.serial("Admin registration", () => {
  test("Admins can register new admins", async ({ page }) => {
    // Go to the register page
    await page.getByRole("link", { name: "Register admin" }).click();
    expect(page.waitForURL(/\/register\/admins$/)).toBeTruthy();

    // Fill the form
    await page.getByLabel("Full name").fill("Inés Alvarez");
    await page.getByLabel("Email").fill("ines.alvarez.fake@gmail.com");
    await page.getByLabel("Password").fill("upbbga2020*/");
    await page.getByRole("button", { name: "Submit" }).click();

    // Assert the alert is shown
    await expect(
      page.getByText("The admin has been registered!")
    ).toBeVisible();

    // Assert the admin is shown in the table
    expect(page.waitForURL(/\/admins$/)).toBeTruthy();
    await expect(page.getByText("Inés Alvarez")).toBeVisible();
  });

  test("Admins can't register new admins with an existing email", async ({
    page
  }) => {
    // Go to the register page
    await page.getByRole("link", { name: "Register admin" }).click();
    expect(page.waitForURL(/\/register\/admins$/)).toBeTruthy();

    // Fill the form
    const email = "ines.alvarez.fake@gmail.com";
    await page.getByLabel("Full name").fill("Inés Alvarez");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("upbbga2020*/");
    await page.getByRole("button", { name: "Submit" }).click();

    // Assert the alert is shown
    await expect(
      page.getByText(`Email ${email} is already in use`)
    ).toBeVisible();
  });
});
