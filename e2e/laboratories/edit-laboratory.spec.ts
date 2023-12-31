import { expect, test } from "@playwright/test";
import {
  getDefaultPassword,
  getDevelopmentAdminCredentials,
  getRandomEmail,
  getRandomName
} from "e2e/Utils";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test.describe.serial("Edit laboratory workflow", () => {
  const teacherEmail = getRandomEmail();
  const teacherPassword = getDefaultPassword();
  const courseName = "Edit laboratories - course";
  const laboratoryName = "Edit laboratories - laboratory";

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
    await page.getByLabel("Name").fill(laboratoryName);
    await page.getByRole("button", { name: "Create" }).click();
    await page.getByLabel("Opening date").fill("2023-12-01T00:00");
    await page.getByLabel("Closing date").fill("2023-12-01T23:59");
    await page.getByRole("button", { name: "Create" }).click();
  });

  test("Add and edit markdown blocks", async ({ page }) => {
    // Login as a teacher
    await page.goto("/login");
    await page.getByLabel("Email").fill(teacherEmail);
    await page.getByLabel("Password").fill(teacherPassword);
    await page.getByRole("button", { name: "Submit" }).click();

    // Go to the course page
    await page.getByRole("link", { name: courseName }).click();

    // Enter to the edit page
    const editLaboratoryButton = page.getByRole("link", {
      name: `Edit ${laboratoryName} laboratory`
    });
    await expect(editLaboratoryButton).toBeVisible();
    await editLaboratoryButton.click();

    // Assert the laboratory data is shown
    await expect(page.getByLabel("Name")).toHaveValue(laboratoryName);
    await expect(page.getByLabel("Opening date")).toHaveValue(
      "2023-12-01T00:00"
    );
    await expect(page.getByLabel("Closing date")).toHaveValue(
      "2023-12-01T23:59"
    );

    // Assert the buttons to add blocks are shown
    const addTextBlockButton = page.getByRole("button", {
      name: "Add text block"
    });
    await expect(addTextBlockButton).toBeVisible();

    // ## Add a markdown block
    await addTextBlockButton.click();

    // Assert an alert is shown
    await expect(
      page.getByText("The new markdown block has been created successfully")
    ).toBeVisible();

    const markdownBlockContent = "# This is a title";
    await page
      .getByLabel("Laboratory block 1 markdown content")
      .fill(markdownBlockContent);

    // Open block dropdown
    const blockDropdownButton = page.getByRole("button", {
      name: "Toggle options for block number 1"
    });
    await expect(blockDropdownButton).toBeVisible();
    await blockDropdownButton.click();

    // Click on the save option
    const saveBlockButton = page.getByRole("menuitem", {
      name: "Save changes"
    });
    await expect(saveBlockButton).toBeVisible();
    await saveBlockButton.click();

    // Assert an alert is shown
    await expect(
      page.getByText("The markdown block has been updated successfully")
    ).toBeVisible();
  });

  test("Add and edit test blocks", async ({ page }) => {
    // Login as a teacher
    await page.goto("/login");
    await page.getByLabel("Email").fill(teacherEmail);
    await page.getByLabel("Password").fill(teacherPassword);
    await page.getByRole("button", { name: "Submit" }).click();

    // Go to the course page
    await page.getByRole("link", { name: courseName }).click();

    // Enter to the edit page
    const editLaboratoryButton = page.getByRole("link", {
      name: `Edit ${laboratoryName} laboratory`
    });
    await expect(editLaboratoryButton).toBeVisible();
    await editLaboratoryButton.click();

    // Assert the buttons to add blocks are shown
    const addTestBlockButton = page.getByRole("button", {
      name: "Add test block"
    });
    await expect(addTestBlockButton).toBeVisible();

    // ## Add a test block
    await addTestBlockButton.click();

    // Assert the modal is opened
    const addTestBlockModal = page.getByRole("dialog");
    await expect(addTestBlockModal).toBeVisible();

    // Set a name for the test block
    const testBlockName = "Test block name";
    await addTestBlockModal.getByLabel("Name").fill(testBlockName);

    // Select a language
    const languageSelect = addTestBlockModal.getByRole("combobox", {
      name: "Language"
    });
    await expect(languageSelect).toBeVisible();
    languageSelect.click();

    const javaOption = page.getByLabel("Java");
    await expect(javaOption).toBeVisible();
    await javaOption.click();

    // Open the zip archive
    const zipFile = join(__dirname, "data", "java.zip");

    // Upload the zip archive
    const zipFileInput = addTestBlockModal.getByLabel("Test file");
    await expect(zipFileInput).toBeVisible();

    const fileChooserPromise = page.waitForEvent("filechooser");
    await zipFileInput.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(zipFile);

    // Submit the form
    const submitButton = page.getByRole("button", { name: "Add" });
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    // Assert an alert is shown
    await expect(
      page.getByText("The new test block has been created successfully")
    ).toBeVisible();

    // Open block dropdown
    const blockDropdownButton = page.getByRole("button", {
      name: "Toggle options for block number 2"
    });
    await expect(blockDropdownButton).toBeVisible();
    await blockDropdownButton.click();

    // Click on the save option
    /** 
    const saveBlockButton = page.getByRole("menuitem", {
      name: "Save changes"
    });
    await expect(saveBlockButton).toBeVisible();
    await saveBlockButton.click();

    // Assert an alert is shown
    await expect(
      page.getByText("The test block has been updated successfully")
    ).toBeVisible();
    */
  });
});
