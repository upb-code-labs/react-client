import { expect, test } from "@playwright/test";
import {
  getDefaultPassword,
  getDevelopmentAdminCredentials,
  getRandomEmail,
  getRandomName
} from "e2e/Utils";

test.describe.serial("Teachers can create laboratories", () => {
  const teacherEmail = getRandomEmail();
  const teacherPassword = getDefaultPassword();
  const courseName = "Create laboratories - course";

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
    await page.getByLabel("Full name").fill(getRandomName());
    await page.getByLabel("Email").fill(teacherEmail);
    await page.getByLabel("Password").fill(teacherPassword);
    await page.getByRole("button", { name: "Submit" }).click();
  });

  test("Create test course", async ({ page }) => {
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
    await page.getByLabel("Name").fill(courseName);
    await page.getByRole("button", { name: "Create" }).click();
  });

  test("Create a laboratory", async ({ page }) => {
    // Login as a teacher
    await page.goto("/login");
    await page.getByLabel("Email").fill(teacherEmail);
    await page.getByLabel("Password").fill(teacherPassword);
    await page.getByRole("button", { name: "Submit" }).click();

    // Go to the course page
    await page.getByRole("link", { name: courseName }).click();

    // Open the modal
    const createLaboratoryButton = page.getByRole("button", {
      name: "Create Laboratory"
    });
    await createLaboratoryButton.click();

    // Assert the modal is open
    await expect(page.getByRole("dialog")).toBeVisible();

    // Fill the form
    const laboratoryName = "Laboratory 1";
    await page.getByLabel("Name").fill(laboratoryName);
    await page.getByLabel("Opening date").fill("2023-12-01T00:00");
    await page.getByLabel("Closing date").fill("2023-12-01T23:59");
    await page.getByRole("button", { name: "Create" }).click();

    // Assert the modal is close and an alert is shown
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(
      page.getByText("The laboratory has been created successfully")
    ).toBeVisible();

    // Assert the laboratory is created
    await expect(page.getByText("Laboratory 1")).toBeVisible();

    // Assert actions buttons are shown
    await expect(
      page.getByRole("link", { name: `Edit ${laboratoryName} laboratory` })
    ).toBeVisible();
  });
});
