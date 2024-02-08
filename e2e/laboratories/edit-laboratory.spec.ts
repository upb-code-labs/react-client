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

    // ### Edit the markdown block
    const markdownBlockContentLabel = "Laboratory block 1 markdown content";
    const markdownBlockContent = "# This is a title";
    await page.getByLabel(markdownBlockContentLabel).fill(markdownBlockContent);

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

    // Assert the teacher can download the template
    const languageTemplateDownloadButton = addTestBlockModal.getByRole(
      "button",
      {
        name: "Download template"
      }
    );
    await expect(languageTemplateDownloadButton).toBeVisible();

    // Assert the template is downloaded
    const downloadPromise = page.waitForEvent("download");

    await languageTemplateDownloadButton.click();
    const download = await downloadPromise;
    await download.saveAs(join(__dirname, "data", "java-downloaded.zip"));

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

    // Assert teachers can download the language template from the test block
    const blockLanguageDownloadButton = page.getByLabel(
      "Download language template for block number 2"
    );
    await expect(blockLanguageDownloadButton).toBeVisible();

    // Assert the template is downloaded
    const blockLanguageDownloadPromise = page.waitForEvent("download");

    await blockLanguageDownloadButton.click();
    const blockLanguageDownloadEvent = await blockLanguageDownloadPromise;
    await blockLanguageDownloadEvent.saveAs(
      join(__dirname, "data", "java-downloaded.zip")
    );

    // Assert teachers can download the tests archive from the test block
    const blockTestsArchiveDownloadButton = page.getByLabel(
      "Download tests archive for block number 2"
    );
    await expect(blockTestsArchiveDownloadButton).toBeVisible();

    // Assert the tests archive is downloaded
    const blockTestsArchiveDownloadPromise = page.waitForEvent("download");

    await blockTestsArchiveDownloadButton.click();

    const blockTestsArchiveDownloadEvent =
      await blockTestsArchiveDownloadPromise;
    await blockTestsArchiveDownloadEvent.saveAs(
      join(__dirname, "data", `${testBlockName}.zip`)
    );

    // ## Edit the test block
    // Update the block name
    const nameInput = page.getByLabel("Block name");
    await expect(nameInput).toBeVisible();
    await nameInput.fill("New test block name");

    // Open block dropdown
    const blockDropdownButton = page.getByRole("button", {
      name: "Toggle options for block number 2"
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
      page.getByText("The test block has been updated successfully")
    ).toBeVisible();
  });

  test("Swap index of blocks", async ({ page }) => {
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

    // Move the first block (markdown) to the second position
    let markdownBlockDropdownMenu = page.getByRole("button", {
      name: "Toggle options for block number 1"
    });
    await expect(markdownBlockDropdownMenu).toBeVisible();
    await markdownBlockDropdownMenu.click();

    const moveDownMarkdownBlockButton = page.getByRole("menuitem", {
      name: "Move down"
    });
    await expect(moveDownMarkdownBlockButton).toBeVisible();
    await moveDownMarkdownBlockButton.click();

    // Assert an alert is shown
    await expect(
      page.getByText("The markdown block has been moved down successfully")
    ).toBeVisible();

    // Now, the test block is in the first position and the markdown block is in the second position
    // Assert the markdown block is in the second position
    let markdownBlockContentLabel = "Laboratory block 2 markdown content";
    await expect(page.getByLabel(markdownBlockContentLabel)).toBeVisible();

    // Move the first block (test) to the second position
    let testBlockDropdownButton = page.getByRole("button", {
      name: "Toggle options for block number 1"
    });
    await expect(testBlockDropdownButton).toBeVisible();
    await testBlockDropdownButton.click();

    const moveDownTestBlockButton = page.getByRole("menuitem", {
      name: "Move down"
    });
    await expect(moveDownTestBlockButton).toBeVisible();
    await moveDownTestBlockButton.click();

    // Assert an alert is shown
    await expect(
      page.getByText("The test block has been moved down successfully")
    ).toBeVisible();

    // Now, the test block is in the second position and the markdown block is in the first position
    // Assert the markdown block is in the first position
    markdownBlockContentLabel = "Laboratory block 1 markdown content";
    await expect(page.getByLabel(markdownBlockContentLabel)).toBeVisible();

    // Move the second block (test) to the first position
    testBlockDropdownButton = page.getByRole("button", {
      name: "Toggle options for block number 2"
    });
    await expect(testBlockDropdownButton).toBeVisible();
    await testBlockDropdownButton.click();

    const moveUpTestBlockButton = page.getByRole("menuitem", {
      name: "Move up"
    });
    await expect(moveUpTestBlockButton).toBeVisible();
    await moveUpTestBlockButton.click();

    // Assert an alert is shown
    await expect(
      page.getByText("The test block has been moved up successfully")
    ).toBeVisible();

    // Now, the test block is in the first position and the markdown block is in the second position
    // Assert the markdown block is in the second position
    markdownBlockContentLabel = "Laboratory block 2 markdown content";
    await expect(page.getByLabel(markdownBlockContentLabel)).toBeVisible();

    // Move the second block (markdown) to the first position
    markdownBlockDropdownMenu = page.getByRole("button", {
      name: "Toggle options for block number 2"
    });
    await expect(markdownBlockDropdownMenu).toBeVisible();
    await markdownBlockDropdownMenu.click();

    const moveUpMarkdownBlockButton = page.getByRole("menuitem", {
      name: "Move up"
    });
    await expect(moveUpMarkdownBlockButton).toBeVisible();
    await moveUpMarkdownBlockButton.click();

    // Assert an alert is shown
    await expect(
      page.getByText("The markdown block has been moved up successfully")
    ).toBeVisible();

    // Now, the test block is in the second position and the markdown block is in the first position
    // Assert the markdown block is in the first position
    markdownBlockContentLabel = "Laboratory block 1 markdown content";
    await expect(page.getByLabel(markdownBlockContentLabel)).toBeVisible();
  });

  test("Delete blocks", async ({ page }) => {
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

    // Delete the markdown block
    const markdownBlockDropdownMenu = page.getByRole("button", {
      name: "Toggle options for block number 1"
    });
    await expect(markdownBlockDropdownMenu).toBeVisible();
    await markdownBlockDropdownMenu.click();

    const deleteMarkdownBlockButton = page.getByRole("menuitem", {
      name: "Delete block"
    });
    await expect(deleteMarkdownBlockButton).toBeVisible();
    await deleteMarkdownBlockButton.click();

    // Click on the "proceed" button
    let proceedButton = page.getByRole("button", { name: "Proceed" });
    await expect(proceedButton).toBeVisible();
    await proceedButton.click();

    // Assert an alert is shown
    await expect(
      page.getByText("The markdown block has been deleted successfully")
    ).toBeVisible();

    // Assert the block is not shown
    const markdownBlockContentLabel = "Laboratory block 1 markdown content";
    await expect(page.getByLabel(markdownBlockContentLabel)).not.toBeVisible();

    // Delete the test block
    const testBlockDropdownMenu = page.getByRole("button", {
      name: "Toggle options for block number 1"
    });
    await expect(testBlockDropdownMenu).toBeVisible();
    await testBlockDropdownMenu.click();

    const deleteTestBlockButton = page.getByRole("menuitem", {
      name: "Delete block"
    });
    await expect(deleteTestBlockButton).toBeVisible();
    await deleteTestBlockButton.click();

    // Click on the "proceed" button
    proceedButton = page.getByRole("button", { name: "Proceed" });
    await expect(proceedButton).toBeVisible();
    await proceedButton.click();

    // Assert an alert is shown
    await expect(
      page.getByText("The test block has been deleted successfully")
    ).toBeVisible();

    // Assert the block is not shown
    const testBlockNameLabel = "Block name";
    await expect(page.getByLabel(testBlockNameLabel)).not.toBeVisible();
  });
});
