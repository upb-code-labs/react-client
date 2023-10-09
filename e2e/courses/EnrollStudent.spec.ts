import { expect, test } from "@playwright/test";

test.describe.serial("Enroll student workflow", () => {
  const teacherEmail = "iveta.ciel.2020@upb.edu.co";
  const teacherPassword = "upbbga2020*/";
  const courseName = "Programming I NRC 23456";

  const studentFullName = "Narcisa Annalee";
  const studentInstitutionalID = "000987654";
  const studentEmail = "narcisa.annalee.2020@upb.edu.co";
  const studentPassword = "upbbga2020*/";

  test("Register test teacher", async ({ page }) => {
    // Login as an admin
    await page.goto("/login");
    await page.getByLabel("Email").fill("development.admin@gmail.com");
    await page.getByLabel("Password").fill("changeme123*/");
    await page.getByRole("button", { name: "Submit" }).click();

    // Register a teacher
    await page.getByRole("link", { name: "R. Teachers", exact: true }).click();
    await page.getByLabel("Full name").fill("Iveta Ciel");
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
    await expect(
      page.getByText("Student was enrolled successfully")
    ).toBeVisible();

    // Close the dialog
    await page.keyboard.press("Escape");

    // Assert the student is listed
    const studentRow = page.getByRole("row", {
      name: new RegExp(studentFullName)
    });
    await expect(studentRow).toBeVisible();
    await expect(
      studentRow.getByRole("cell", { name: studentFullName })
    ).toBeVisible();
    await expect(
      studentRow.getByRole("cell", { name: studentInstitutionalID })
    ).toBeVisible();
    await expect(
      studentRow.getByRole("button", { name: "Deactivate", exact: true })
    ).toBeVisible();
  });
});
