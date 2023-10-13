import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Login as an admin
  await page.goto("/login");
  await page.getByLabel("Email").fill("development.admin@gmail.com");
  await page.getByLabel("Password").fill("changeme123*/");
  await page.getByRole("button", { name: "Submit" }).click();

  // Assert the admins page is loaded
  await page.waitForURL(/\/admins$/);
});

test("The fields are validated", async ({ page }) => {
  // Go to the register page
  await page.getByRole("link", { name: "Register admin", exact: true }).click();
  await page.waitForURL(/\/register\/admins$/);

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
    await page
      .getByRole("link", { name: "Register admin", exact: true })
      .click();
    await page.waitForURL(/\/register\/admins$/);

    // Fill the form
    const newAdminName = "Inés Alvarez";
    await page.getByLabel("Full name").fill(newAdminName);
    await page.getByLabel("Email").fill("ines.alvarez.fake@gmail.com");
    await page.getByLabel("Password").fill("upbbga2020*/");
    await page.getByRole("button", { name: "Submit" }).click();

    // Assert the alert is shown
    await expect(
      page.getByText("The admin has been registered!")
    ).toBeVisible();

    // Assert the admin is shown in the table
    await page.waitForURL(/\/admins$/);

    const newAdminRow = await page.getByRole("row", {
      name: new RegExp(newAdminName)
    });
    await expect(newAdminRow).toBeVisible();

    // Assert row cells
    await expect(
      newAdminRow.getByRole("cell", { name: newAdminName })
    ).toBeVisible();
    await expect(
      newAdminRow.getByRole("cell", { name: "a few seconds ago" })
    ).toBeVisible();
    const creatorFullName = "Development Admin";
    await expect(
      newAdminRow.getByRole("cell", { name: creatorFullName })
    ).toBeVisible();
  });

  test("Admins can't register new admins with an existing email", async ({
    page
  }) => {
    // Go to the register page
    await page
      .getByRole("link", { name: "Register admin", exact: true })
      .click();
    await page.waitForURL(/\/register\/admins$/);

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

  test("Admins can login and logout", async ({ page }) => {
    // Assert the logout option is shown
    const logout = page.getByRole("link", { name: "Logout", exact: true });
    await expect(logout).toBeVisible();

    // Logout
    await logout.click();
    await page.waitForURL(/\/login$/);
  });
});
