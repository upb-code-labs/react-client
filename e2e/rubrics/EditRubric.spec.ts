import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import rubricData from "./rubric.json" assert { type: "json" };

test.describe.serial("Rubrics edition workflow", () => {
  const teacherEmail = faker.internet.email({ provider: "upb.edu.co" });
  const teacherPassword = "upbbga2020*/";
  const rubricName = rubricData.name;

  test("Register test teacher", async ({ page }) => {
    // Login as an admin
    await page.goto("/login");
    await page.getByLabel("Email").fill("development.admin@gmail.com");
    await page.getByLabel("Password").fill("changeme123*/");
    await page.getByRole("button", { name: "Submit" }).click();

    // Register a teacher
    await page.getByRole("link", { name: "R. Teachers", exact: true }).click();
    await page.getByLabel("Full name").fill("Ermentrudis Klara");
    await page.getByLabel("Email").fill(teacherEmail);
    await page.getByLabel("Password").fill(teacherPassword);
    await page.getByRole("button", { name: "Submit" }).click();
  });

  test("Create test rubric", async ({ page }) => {
    // Login as the teacher
    await page.goto("/login");
    await page.getByLabel("Email").fill(teacherEmail);
    await page.getByLabel("Password").fill(teacherPassword);
    await page.getByRole("button", { name: "Submit" }).click();

    // Go to the rubrics page
    await page.getByRole("link", { name: "Rubrics", exact: true }).click();
    await page.waitForURL(/\/rubrics$/);

    // Open the create rubric dialog
    await page
      .getByRole("button", { name: "Create rubric", exact: true })
      .click();

    // Create the rubric
    await page.getByLabel("Name").fill(rubricName);
    await page.getByRole("button", { name: "Create" }).click();

    // Assert the rubric was created
    await expect(page.getByText(rubricName)).toBeVisible();
  });

  test("Add new objectives and criteria", async ({ page }) => {
    // Login as the teacher
    await page.goto("/login");
    await page.getByLabel("Email").fill(teacherEmail);
    await page.getByLabel("Password").fill(teacherPassword);
    await page.getByRole("button", { name: "Submit" }).click();

    // Go to the rubrics page
    await page.getByRole("link", { name: "Rubrics", exact: true }).click();
    await page.waitForURL(/\/rubrics$/);

    // Click on the edit rubric button
    await page.getByLabel(`Edit ${rubricName}`).click();

    // Wait for the input with the rubric name to be visible
    await expect(page.getByLabel("Name")).toBeVisible();

    // Create objectives with their criteria
    const { objectives } = rubricData;
    let objectiveIndex = 2; // Ignore the default objective

    for await (const objective of objectives) {
      // Open the modal to add an objective
      await page
        .getByRole("button", { name: "Add objective", exact: true })
        .click();

      // Assert the modal is open
      await expect(page.getByText("Add a new objective")).toBeVisible();

      // Fill the objective description
      await page.getByPlaceholder("Enter a description for the new objective").fill(objective.description);
      await page.getByRole("button", { name: "Create" }).click();

      // Assert the modal is closed
      await expect(page.getByText("Add a new objective")).not.toBeVisible();

      // Assert the objective was created
      await expect(page.getByText(`Objective ${objectiveIndex}`)).toBeVisible();
      await expect(page.getByText(objective.description)).toBeVisible();

      // Add the criteria
      for await (const criteria of objective.criteria) {
        // Open the modal to add a criteria
        await page
          .getByLabel(`Add criteria to objective ${objectiveIndex}`)
          .click();

        // Assert the modal is open
        await expect(page.getByText("Add a new criteria")).toBeVisible();

        await page.getByPlaceholder("Enter a description for the new criteria").fill(criteria.description);
        await page.getByPlaceholder("Enter a weight for the new criteria").fill(criteria.weight.toString());
        await page.getByRole("button", { name: "Create" }).click();

        // Assert the modal is closed
        await expect(page.getByText("Add a new criteria")).not.toBeVisible();

        // Assert the criteria was created
        await expect(page.getByText(criteria.description)).toBeVisible();
      }

      objectiveIndex++;
    }
  });
});
