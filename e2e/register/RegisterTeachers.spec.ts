import { expect, test } from "@playwright/test";
import {
  getDefaultPassword,
  getDevelopmentAdminCredentials,
  getRandomEmail,
  getRandomName
} from "e2e/Utils";

test.beforeEach(async ({ page }) => {
  // Login as an admin
  const adminCredentials = getDevelopmentAdminCredentials();
  await page.goto("/login");
  await page.getByLabel("Email").fill(adminCredentials.email);
  await page.getByLabel("Password").fill(adminCredentials.password);
  await page.getByRole("button", { name: "Submit" }).click();

  // Assert the admins page is loaded
  await page.waitForURL(/\/admins$/);

  // Go to the teachers register page
  await page
    .getByRole("link", { name: "Register Teachers", exact: true })
    .click();
});

test("The fields are validated", async ({ page }) => {
  // Fill the form
  await page.getByLabel("Full name").fill("a");
  await page.getByLabel("Email").fill("a@gmail.com");
  await page.getByLabel("Password").fill("insecure");
  await page.getByRole("button", { name: "Submit" }).click();

  // Assert the errors are shown
  await expect(
    page.getByText("Full name must be at least 4 characters long")
  ).toBeVisible();
  await expect(page.getByText("Must be an UPB email")).toBeVisible();
  await expect(
    page.getByText(
      "Must contain at least one letter, one number and one special character"
    )
  ).toBeVisible();
});

test.describe.serial("Teacher registration", () => {
  const newTeacherEmail = getRandomEmail();

  test("Admins can register new teachers", async ({ page }) => {
    // Select the forms
    const fullNameInput = page.getByLabel("Full name");
    const emailInput = page.getByLabel("Email");
    const passwordInput = page.getByLabel("Password");

    // Fill the form
    await fullNameInput.fill(getRandomName());
    await emailInput.fill(newTeacherEmail);
    await passwordInput.fill(getDefaultPassword());
    await page.getByRole("button", { name: "Submit" }).click();

    // Assert the alert is shown
    await expect(
      page.getByText("The teacher has been registered!")
    ).toBeVisible();

    // Assert the form is reset
    await expect(fullNameInput).toHaveValue("");
    await expect(emailInput).toHaveValue("");
    await expect(passwordInput).toHaveValue("");
  });

  test("Admins can't register new teachers with an existing email", async ({
    page
  }) => {
    await page.getByLabel("Full name").fill(getRandomName());
    await page.getByLabel("Email").fill(newTeacherEmail);
    await page.getByLabel("Password").fill(getDefaultPassword());
    await page.getByRole("button", { name: "Submit" }).click();

    // Assert the alert is shown
    await expect(
      page.getByText(`Email ${newTeacherEmail} is already in use`)
    ).toBeVisible();
  });

  test("Teacher can login and logout", async ({ page }) => {
    // Logout from the admin account
    await page.getByRole("link", { name: "Logout", exact: true }).click();
    await page.waitForURL(/\/login$/);

    // Login as a teacher
    await page.goto("/login");
    await page.getByLabel("Email").fill(newTeacherEmail);
    await page.getByLabel("Password").fill(getDefaultPassword());
    await page.getByRole("button", { name: "Submit" }).click();

    // Assert the teacher is redirected
    await page.waitForURL(/\/courses$/);

    // Assert the navbar options were updated
    await expect(
      page.getByRole("link", { name: "Courses", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Rubrics", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Profile", exact: true })
    ).toBeVisible();

    // Assert the logout option works
    const logout = page.getByRole("link", { name: "Logout", exact: true });
    await expect(logout).toBeVisible();
    await logout.click();
    await page.waitForURL(/\/login$/);
  });

  test("Teachers can update their profile", async ({ page }) => {
    // Logout from the admin account
    const logout = page.getByRole("link", { name: "Logout", exact: true });
    await expect(logout).toBeVisible();
    await logout.click();
    await page.waitForURL(/\/login$/);

    // Login as a teacher
    await page.goto("/login");
    await page.getByLabel("Email").fill(newTeacherEmail);
    await page.getByLabel("Password").fill(getDefaultPassword());
    await page.getByRole("button", { name: "Submit" }).click();

    await page.waitForURL(/\/courses$/);

    // Navigate to the profile view
    await page.getByRole("link", { name: "Profile", exact: true }).click();
    await page.waitForURL(/\/profile$/);

    // Update the profile
    const newName = getRandomName();
    const newEmail = getRandomEmail();

    await page.getByLabel("Full name").fill(newName);
    await page.getByLabel("Email").fill(newEmail);
    await page.getByLabel("Password confirmation").fill(getDefaultPassword());
    await page.getByRole("button", { name: "Update" }).click();

    // Assert the alert is shown
    await expect(
      page.getByText("Your profile has been updated successfully")
    ).toBeVisible();
  });
});
