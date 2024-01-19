import test, { expect } from "@playwright/test";
import {
  getDefaultPassword,
  getDevelopmentAdminCredentials,
  getRandomEmail,
  getRandomName,
  getRandomUniversityID
} from "e2e/Utils";

test.describe.serial("Grades workflow", () => {
  const teacherEmail = getRandomEmail();

  const courseName = "Test course";
  const laboratoryName = "Test laboratory";

  const studentFullName = getRandomName();
  const studentEmail = getRandomEmail();

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
    await page.getByLabel("Password").fill(getDefaultPassword());
    await page.getByRole("button", { name: "Submit" }).click();
  });

  test("Register test student", async ({ page }) => {
    await page.goto("/register/students");
    await page.getByLabel("Full name").fill(studentFullName);
    await page.getByLabel("Institutional ID").fill(getRandomUniversityID());
    await page.getByLabel("Email").fill(studentEmail);
    await page.getByLabel("Password").fill(getDefaultPassword());
    await page.getByRole("button", { name: "Submit" }).click();
  });

  test("Create test course", async ({ page }) => {
    // Login as a teacher
    await page.goto("/login");
    await page.getByLabel("Email").fill(teacherEmail);
    await page.getByLabel("Password").fill(getDefaultPassword());
    await page.getByRole("button", { name: "Submit" }).click();

    // Create a course
    const createCourseButton = page.getByRole("button", {
      name: "Create a new course"
    });
    await createCourseButton.click();
    await page.getByLabel("Name").fill(courseName);
    await page.getByRole("button", { name: "Create" }).click();
  });

  test("Create test laboratory", async ({ page }) => {
    // Login as a teacher
    await page.goto("/login");
    await page.getByLabel("Email").fill(teacherEmail);
    await page.getByLabel("Password").fill(getDefaultPassword());
    await page.getByRole("button", { name: "Submit" }).click();

    // Go to the course page
    await page.getByRole("link", { name: courseName }).click();

    // Open the modal
    const createLaboratoryButton = page.getByRole("button", {
      name: "Create Laboratory"
    });
    await createLaboratoryButton.click();
    await page.getByLabel("Name").fill(laboratoryName);
    await page.getByLabel("Opening date").fill("2023-12-01T00:00");
    await page.getByLabel("Closing date").fill("2032-12-01T23:59");
    await page.getByRole("button", { name: "Create" }).click();
  });

  test("Enroll student in test course", async ({ page }) => {
    // Login as a teacher
    await page.goto("/login");
    await page.getByLabel("Email").fill(teacherEmail);
    await page.getByLabel("Password").fill(getDefaultPassword());
    await page.getByRole("button", { name: "Submit" }).click();

    // Go to the participants view
    await page.getByRole("link", { name: courseName }).click();
    await page.getByRole("link", { name: "Manage participants" }).click();

    // Open the dialog
    await page
      .getByRole("button", { name: "Enroll student", exact: true })
      .click();

    // Search the student
    await page
      .getByLabel("Search students by full name", { exact: true })
      .fill(studentFullName);

    // Select the student
    const studentButton = page.getByRole("button", {
      name: new RegExp(studentFullName)
    });

    // Enroll the student
    await studentButton.click();
  });

  test("Student appears in the grades list", async ({ page }) => {
    // Login as a teacher
    await page.goto("/login");
    await page.getByLabel("Email").fill(teacherEmail);
    await page.getByLabel("Password").fill(getDefaultPassword());
    await page.getByRole("button", { name: "Submit" }).click();

    // Go to the course page
    await page.getByRole("link", { name: courseName }).click();

    // Go to the grades view of the laboratory
    const laboratoryRow = page.getByRole("row", {
      name: new RegExp(`^\\s*${laboratoryName}`),
      exact: true
    });
    await expect(laboratoryRow).toBeVisible();

    const laboratoryGradesButton = laboratoryRow.getByRole("link", {
      name: `Go to the grades of ${laboratoryName}`,
      exact: true
    });
    await laboratoryGradesButton.click();

    // Assert the student is listed
    const studentRow = page.getByRole("row", {
      name: new RegExp(`^\\s*${studentFullName}`),
      exact: true
    });
    await expect(studentRow).toBeVisible();

    await expect(
      studentRow.getByRole("cell", { name: studentFullName })
    ).toBeVisible();
    await expect(
      studentRow.getByRole("cell", {
        name: "N/A"
      })
    ).toBeVisible();
  });
});
