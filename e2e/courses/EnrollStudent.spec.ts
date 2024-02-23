import { expect, test } from "@playwright/test";
import {
  getDefaultPassword,
  getDevelopmentAdminCredentials,
  getRandomEmail,
  getRandomName,
  getRandomUniversityID
} from "e2e/Utils";

test.describe.serial("Enroll student workflow", () => {
  const teacherEmail = getRandomEmail();
  const teacherPassword = getDefaultPassword();
  const courseName = "Test course";

  const studentFullName = getRandomName();
  const studentInstitutionalID = getRandomUniversityID();
  const studentEmail = getRandomEmail();
  const studentPassword = getDefaultPassword();

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

  test("Register test student", async ({ page }) => {
    await page.goto("/register/students");
    await page.getByLabel("Full name").fill(studentFullName);
    await page.getByLabel("Institutional ID").fill(studentInstitutionalID);
    await page.getByLabel("Email").fill(studentEmail);
    await page.getByLabel("Password").fill(studentPassword);
    await page.getByLabel("Accept terms and conditions").check();
    await page.getByRole("button", { name: "Submit" }).click();
  });

  test("Enroll student in test course", async ({ page }) => {
    // Login as a teacher
    await page.goto("/login");
    await page.getByLabel("Email").fill(teacherEmail);
    await page.getByLabel("Password").fill(teacherPassword);
    await page.getByRole("button", { name: "Submit" }).click();

    // Go to the participants view
    await page.getByRole("link", { name: courseName }).click();
    await page
      .getByRole("link", { name: "Manage participants", exact: true })
      .click();

    // Open the dialog
    await page
      .getByRole("button", { name: "Enroll student", exact: true })
      .click();

    // Search the student
    await page
      .getByLabel("Search students by full name", { exact: true })
      .fill(studentFullName);

    // Assert the student is shown
    const studentButton = page.getByRole("button", {
      name: new RegExp(studentFullName)
    });
    await expect(studentButton).toBeVisible();

    // Enroll the student
    await studentButton.click();

    // Assert an alert is shown
    await expect(page.getByText("Student enrolled successfully")).toBeVisible();

    // Close the dialog
    await page.keyboard.press("Escape");

    // Assert the student is listed
    const studentRow = page.getByRole("row", {
      name: new RegExp(`^\\s*${studentFullName}`),
      exact: true
    });

    await expect(studentRow).toBeVisible();
    await expect(
      studentRow.getByRole("cell", { name: studentFullName, exact: true })
    ).toBeVisible();
    await expect(
      studentRow.getByRole("cell", { name: studentInstitutionalID })
    ).toBeVisible();
    await expect(
      studentRow.getByLabel(`Deactivate ${studentFullName}`, { exact: true })
    ).toBeVisible();
  });

  test("Deactivate student in test course", async ({ page }) => {
    // Login as a teacher
    await page.goto("/login");
    await page.getByLabel("Email").fill(teacherEmail);
    await page.getByLabel("Password").fill(teacherPassword);
    await page.getByRole("button", { name: "Submit" }).click();

    // Go to the participants view
    await page.getByRole("link", { name: courseName }).click();
    await page
      .getByRole("link", { name: "Manage participants", exact: true })
      .click();

    // Deactivate the student
    const studentRow = page.getByRole("row", {
      name: new RegExp(`^\\s*${studentFullName}`),
      exact: true
    });
    const deactivateStudentButton = studentRow.getByLabel(
      `Deactivate ${studentFullName}`,
      { exact: true }
    );

    await expect(deactivateStudentButton).toBeVisible();
    await deactivateStudentButton.click();

    // Assert an alert is shown
    await expect(
      page.getByText("Student deactivated successfully")
    ).toBeVisible();
  });

  test("Activate student in test course", async ({ page }) => {
    // Login as a teacher
    await page.goto("/login");
    await page.getByLabel("Email").fill(teacherEmail);
    await page.getByLabel("Password").fill(teacherPassword);
    await page.getByRole("button", { name: "Submit" }).click();

    // Go to the participants view
    await page.getByRole("link", { name: courseName }).click();
    await page
      .getByRole("link", { name: "Manage participants", exact: true })
      .click();

    // Activate the student
    const studentRow = page.getByRole("row", {
      name: new RegExp(`^\\s*${studentFullName}`),
      exact: true
    });
    const activateStudentButton = studentRow.getByLabel(
      `Activate ${studentFullName}`,
      { exact: true }
    );

    await expect(activateStudentButton).toBeVisible();
    await activateStudentButton.click();

    // Assert an alert is shown
    await expect(
      page.getByText("Student activated successfully")
    ).toBeVisible();
  });
});
