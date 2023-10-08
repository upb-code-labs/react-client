import { expect, test } from "@playwright/test";

test.describe.serial("Rename course workflow", () => {
  const teacherEmail = "catalina.bronislava.2020@upb.edu.co";
  const teacherPassword = "upbbga2020*/";
  const initialCourseName = "DS NRC 12345";
  const newCourseName = "Data Structures NRC 12345";

  test("Register test teacher", async ({ page }) => {
    // Login as an admin
    await page.goto("/login");
    await page.getByLabel("Email").fill("development.admin@gmail.com");
    await page.getByLabel("Password").fill("changeme123*/");
    await page.getByRole("button", { name: "Submit" }).click();

    // Register a teacher
    await page.getByRole("link", { name: "R. Teachers", exact: true }).click();
    await page.getByLabel("Full name").fill("Catalina Bronislava");
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
    await page.getByRole("button", { name: "Create a new course" }).click();
    await page.getByLabel("Name").fill(initialCourseName);
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText(initialCourseName)).toBeVisible();
  });

  test("Field to rename course is validated", async ({ page }) => {
    // Login as a teacher
    await page.goto("/login");
    await page.getByLabel("Email").fill(teacherEmail);
    await page.getByLabel("Password").fill(teacherPassword);
    await page.getByRole("button", { name: "Submit" }).click();

    // Open the dropdown menu
    const courseCard = page.getByRole("link", { name: initialCourseName });
    await courseCard.getByLabel("Toggle course options menu").click();

    // Open the modal
    const renameCourseButton = page.getByRole("menuitem", {
      name: "Rename course",
      exact: true
    });
    await expect(renameCourseButton).toBeVisible();
    await renameCourseButton.click();

    // Assert the modal is open
    await expect(page.getByRole("dialog")).toBeVisible();

    // Clear the course name
    await page.getByLabel("Name", { exact: true }).fill("");
    await page.getByRole("button", { name: "Rename" }).click();

    // Validate the error message
    await expect(
      page.getByText("Name must be at least 4 characters long")
    ).toBeVisible();
  });

  test("Teachers can rename a course", async ({ page }) => {
    // Login as a teacher
    await page.goto("/login");
    await page.getByLabel("Email").fill(teacherEmail);
    await page.getByLabel("Password").fill(teacherPassword);
    await page.getByRole("button", { name: "Submit" }).click();

    // Open the dropdown menu
    const courseCard = page.getByRole("link", { name: initialCourseName });
    await courseCard.getByLabel("Toggle course options menu").click();

    // Open the modal
    const renameCourseButton = page.getByRole("menuitem", {
      name: "Rename course",
      exact: true
    });
    await renameCourseButton.click();

    // Submit the form with the same name
    await page.getByRole("button", { name: "Rename" }).click();

    // Assert an alert is shown
    await expect(page.getByText("The course has the same name")).toBeVisible();

    // Submit the form with a new name
    await page.getByLabel("Name", { exact: true }).fill(newCourseName);
    await page.getByRole("button", { name: "Rename" }).click();

    // Assert an alert is shown
    await expect(page.getByText("Course renamed successfully")).toBeVisible();

    // Assert the modal is closed
    await expect(page.getByRole("dialog")).not.toBeVisible();

    // Assert the course name is updated
    await expect(page.getByText(initialCourseName)).not.toBeVisible();
    await expect(page.getByText(newCourseName)).toBeVisible();
  });
});
