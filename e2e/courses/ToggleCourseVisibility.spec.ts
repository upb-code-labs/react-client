import { expect, test } from "@playwright/test";
import {
  getDefaultPassword,
  getDevelopmentAdminCredentials,
  getRandomEmail
} from "e2e/Utils";

test.describe.serial("User can toggle the course visibility", () => {
  const teacherEmail = getRandomEmail();
  const teacherPassword = getDefaultPassword();
  const courseName = "Programming I NRC 12345";

  test("Register test teacher", async ({ page }) => {
    // Login as an admin
    const adminCredentials = getDevelopmentAdminCredentials();
    await page.goto("/login");
    await page.getByLabel("Email").fill(adminCredentials.email);
    await page.getByLabel("Password").fill(adminCredentials.password);
    await page.getByRole("button", { name: "Submit" }).click();

    // Register a teacher
    await page
      .getByRole("link", { name: "Register Teachers", exact: true })
      .click();
    await page.getByLabel("Full name").fill(getRandomEmail());
    await page.getByLabel("Email").fill(teacherEmail);
    await page.getByLabel("Password").fill(teacherPassword);
    await page.getByRole("button", { name: "Submit" }).click();
  });

  test("Create the course", async ({ page }) => {
    // Login as a teacher
    await page.goto("/login");
    await page.getByLabel("Email").fill(teacherEmail);
    await page.getByLabel("Password").fill(teacherPassword);
    await page.getByRole("button", { name: "Submit" }).click();

    // Create a course
    const createCourseButton = page.getByRole("button", {
      name: "Create a new course"
    });
    await createCourseButton.click();

    // Fill the form
    await page.getByLabel("Name").fill(courseName);
    await page.getByRole("button", { name: "Create" }).click();
  });

  test("Teacher can hide a course", async ({ page }) => {
    // Login as a teacher
    await page.goto("/login");
    await page.getByLabel("Email").fill(teacherEmail);
    await page.getByLabel("Password").fill(teacherPassword);
    await page.getByRole("button", { name: "Submit" }).click();

    // Open the dropdown menu
    const courseCard = page.getByRole("link", { name: courseName });
    const dropdownButton = courseCard.getByLabel("Toggle course options menu");
    await expect(dropdownButton).toBeVisible();
    await dropdownButton.click();

    // Assert the dropdown menu is open
    const dropdownMenu = page.getByRole("menu");
    await expect(dropdownMenu).toBeVisible();

    // Click the option to hide the course
    const hideButton = dropdownMenu.getByRole("menuitem", {
      name: "Hide course"
    });
    await expect(hideButton).toBeVisible();
    await hideButton.click();

    // Assert the dropdown menu is closed
    await expect(dropdownMenu).not.toBeVisible();

    // Assert an alert is shown
    await expect(page.getByText("Course hidden successfully")).toBeVisible();

    // Assert the course is not listed in the "Your courses" list
    await expect(page.getByText(courseName)).not.toBeVisible();

    // Assert the course is listed in the "Hidden courses" list
    await page.getByText("Hidden courses", { exact: true }).click();
    await expect(page.getByText(courseName)).toBeVisible();
  });

  test("Teacher can show a course", async ({ page }) => {
    // Login as a teacher
    await page.goto("/login");
    await page.getByLabel("Email").fill(teacherEmail);
    await page.getByLabel("Password").fill(teacherPassword);
    await page.getByRole("button", { name: "Submit" }).click();

    // Open the "Hidden courses" list
    await page.getByText("Hidden courses", { exact: true }).click();

    // Open the dropdown menu
    const courseCard = page.getByRole("link", { name: courseName });
    const dropdownButton = courseCard.getByLabel("Toggle course options menu");
    await expect(dropdownButton).toBeVisible();
    await dropdownButton.click();

    // Assert the dropdown menu is open
    const dropdownMenu = page.getByRole("menu");
    await expect(dropdownMenu).toBeVisible();

    // Click the option to show the course
    const showButton = dropdownMenu.getByRole("menuitem", {
      name: "Show course"
    });
    await expect(showButton).toBeVisible();
    await showButton.click();

    // Assert the dropdown menu is closed
    await expect(dropdownMenu).not.toBeVisible();

    // Assert an alert is shown
    await expect(page.getByText("Course shown successfully")).toBeVisible();

    // Close the "Hidden courses" list
    await page.getByText("Hidden courses", { exact: true }).click();

    // Assert the course is listed in the "Your courses" list
    await expect(page.getByText(courseName)).toBeVisible();
  });
});
