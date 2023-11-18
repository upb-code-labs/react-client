import { expect, test } from "@playwright/test";

import rubricData from "./rubric.json" assert { type: "json" };

import {
  getDefaultPassword,
  getDevelopmentAdminCredentials,
  getRandomEmail
} from "e2e/Utils";

test.describe.serial("Rubrics edition workflow", () => {
  const teacherEmail = getRandomEmail();
  const teacherPassword = getDefaultPassword();
  let rubricName = rubricData.name;

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

  test("Update rubric name", async ({ page }) => {
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
    const inputLabelText = "Rubric name";
    await expect(page.getByLabel(inputLabelText)).toBeVisible();

    // Change the rubric name
    const newRubricName = "New Rubric Name";
    await page.getByLabel(inputLabelText).fill(newRubricName);
    await page.getByRole("button", { name: "Update" }).click();

    // Assert an alert is shown
    await expect(
      page.getByText("Rubric name has been updated successfully")
    ).toBeVisible();

    // Reload the page and assert the rubric name was updated
    await page.reload();
    await expect(page.getByLabel(inputLabelText)).toHaveValue(newRubricName);

    // Update the rubric name
    rubricName = newRubricName;
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
      await page
        .getByPlaceholder("Enter a description for the new objective")
        .fill(objective.description);
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

        await page
          .getByPlaceholder("Enter a description for the new criteria")
          .fill(criteria.description);
        await page
          .getByPlaceholder("Enter a weight for the new criteria")
          .fill(criteria.weight.toString());
        await page.getByRole("button", { name: "Create" }).click();

        // Assert the modal is closed
        await expect(page.getByText("Add a new criteria")).not.toBeVisible();

        // Assert the criteria was created
        await expect(page.getByText(criteria.description)).toBeVisible();
      }

      objectiveIndex++;
    }
  });

  test("Update objective description", async ({ page }) => {
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

    // Update the objective description
    const objectiveIndex = 1;
    const newObjectiveDescription = "New objective description";
    await page
      .getByLabel(`Objective ${objectiveIndex} description`, { exact: true })
      .fill(newObjectiveDescription);

    // Open the dropdown to save the changes
    await page
      .getByLabel(`Toggle options for objective ${objectiveIndex}`, {
        exact: true
      })
      .click();
    await page.getByText("Save changes").click();

    // Assert the changes were saved
    await expect(
      page.getByText("The objective has been updated successfully")
    ).toBeVisible();

    // Reload the page and assert the changes were saved
    await page.reload();
    await expect(
      page.getByLabel(`Objective ${objectiveIndex} description`, {
        exact: true
      })
    ).toHaveValue(newObjectiveDescription);
  });

  test("Update criteria", async ({ page }) => {
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

    // Update the criteria
    const objectiveIndex = 1;
    const criteriaIndex = 1;
    const newCriteriaDescription = "New criteria description";
    const newCriteriaWeight = "2";
    await page
      .getByLabel(
        `Criteria ${criteriaIndex} of objective ${objectiveIndex} description`,
        { exact: true }
      )
      .fill(newCriteriaDescription);
    await page
      .getByLabel(
        `Criteria ${criteriaIndex} of objective ${objectiveIndex} weight`,
        { exact: true }
      )
      .fill(newCriteriaWeight);

    // Open the dropdown to save the changes
    await page
      .getByLabel(
        `Toggle options for criteria ${criteriaIndex} of objective ${objectiveIndex}`,
        { exact: true }
      )
      .click();
    await page.getByText("Save changes").click();

    // Assert the changes were saved
    await expect(
      page.getByText("The criteria has been updated successfully")
    ).toBeVisible();

    // Reload the page and assert the changes were saved
    await page.reload();
    await expect(
      page.getByLabel(
        `Criteria ${criteriaIndex} of objective ${objectiveIndex} description`,
        { exact: true }
      )
    ).toHaveValue(newCriteriaDescription);
    await expect(
      page.getByLabel(
        `Criteria ${criteriaIndex} of objective ${objectiveIndex} weight`,
        { exact: true }
      )
    ).toHaveValue(newCriteriaWeight);
  });
});
