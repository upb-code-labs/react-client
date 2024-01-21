import test, { expect } from "@playwright/test";
import {
  getDefaultPassword,
  getDevelopmentAdminCredentials,
  getRandomEmail,
  getRandomName,
  getRandomUniversityID
} from "e2e/Utils";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test.describe.serial("Grades workflow", () => {
  const teacherEmail = getRandomEmail();

  const courseName = "Test course";
  const rubricName = "Test rubric";
  const laboratoryName = "Test laboratory";
  const testBlockName = "Test block name";

  const gradeComment = "This is a comment left by the teacher";

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

  test("Create test rubric", async ({ page }) => {
    // Login as a teacher
    await page.goto("/login");
    await page.getByLabel("Email").fill(teacherEmail);
    await page.getByLabel("Password").fill(getDefaultPassword());
    await page.getByRole("button", { name: "Submit" }).click();

    // Create a rubric
    await page.getByRole("link", { name: "Rubrics", exact: true }).click();
    await page.getByRole("button", { name: "Create rubric" }).click();
    await page.getByLabel("Name").fill("Test rubric");
    await page.getByRole("button", { name: "Create" }).click();
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

    // Select the rubric
    const editLaboratoryButton = page.getByRole("link", {
      name: `Edit ${laboratoryName} laboratory`
    });
    await expect(editLaboratoryButton).toBeVisible();
    await editLaboratoryButton.click();

    const rubricSelect = page.getByRole("combobox", { name: "Rubric" });
    await expect(rubricSelect).toBeVisible();
    await rubricSelect.click();

    const rubricOption = page.getByLabel(rubricName);
    await expect(rubricOption).toBeVisible();
    await rubricOption.click();

    // Save the changes
    const saveButton = page.getByRole("button", { name: "Save changes" });
    await expect(saveButton).toBeVisible();
    await saveButton.click();

    // Assert a toast is shown
    await expect(
      page.getByText("Laboratory details updated successfully")
    ).toBeVisible();
  });

  test("Create test block", async ({ page }) => {
    // Login as a teacher
    await page.goto("/login");
    await page.getByLabel("Email").fill(teacherEmail);
    await page.getByLabel("Password").fill(getDefaultPassword());
    await page.getByRole("button", { name: "Submit" }).click();

    // Go to the course page
    await page.getByRole("link", { name: courseName }).click();

    // Enter to the edit page of the laboratory
    const editLaboratoryButton = page.getByRole("link", {
      name: `Edit ${laboratoryName} laboratory`
    });
    await expect(editLaboratoryButton).toBeVisible();
    await editLaboratoryButton.click();

    // Add the test block
    const addTestBlockButton = page.getByRole("button", {
      name: "Add test block"
    });
    await addTestBlockButton.click();

    // set the name
    const addTestBlockModal = page.getByRole("dialog");
    await addTestBlockModal.getByLabel("Name").fill(testBlockName);

    // select the language
    const languageSelect = addTestBlockModal.getByRole("combobox", {
      name: "Language"
    });
    await expect(languageSelect).toBeVisible();
    languageSelect.click();

    const javaOption = page.getByLabel("Java");
    await expect(javaOption).toBeVisible();
    await javaOption.click();

    // Upload tests file
    const zipFile = join(__dirname, "data", "java-tests.zip");
    const zipFileInput = addTestBlockModal.getByLabel("Test file");

    const fileChooserPromise = page.waitForEvent("filechooser");
    await zipFileInput.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(zipFile);

    // Submit the form
    const submitButton = page.getByRole("button", { name: "Add" });
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    // Assert the test block is shown
    const nameInput = page.getByLabel("Block name");
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveValue(testBlockName);
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

  test("Student submits a solution", async ({ page }) => {
    // update the timeout
    const ONE_MINUTE_IN_MS = 60000;
    page.setDefaultTimeout(ONE_MINUTE_IN_MS);

    // Login as a student
    await page.goto("/login");
    await page.getByLabel("Email").fill(studentEmail);
    await page.getByLabel("Password").fill(getDefaultPassword());
    await page.getByRole("button", { name: "Submit" }).click();

    // Go to the course page
    await page.getByRole("link", { name: courseName }).click();

    // Go to the laboratory page
    await page
      .getByRole("link", { name: `Complete ${laboratoryName} laboratory` })
      .click();

    // Assert the test block is shown
    const testBlockNameInput = page.getByLabel("Test name");
    await expect(testBlockNameInput).toBeVisible();
    await expect(testBlockNameInput).toHaveValue(testBlockName);

    // Upload the solution
    const solutionFile = join(__dirname, "data", "java-tests.zip");
    const solutionFileInput = page.getByLabel("Submission file");

    const fileChooserPromise = page.waitForEvent("filechooser");
    await solutionFileInput.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(solutionFile);

    // Submit the form
    const submitButton = page.getByRole("button", { name: "Submit" });
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    // Assert the status phases are shown
    // Pending phase
    const pendingPhaseElm = page.getByTestId("pending-phase");
    await expect(pendingPhaseElm).toBeVisible();
    await expect(pendingPhaseElm).toHaveAttribute("data-reached", "true");

    // Running phase
    const runningPhaseElm = page.getByTestId("running-phase");
    await expect(runningPhaseElm).toBeVisible();
    await expect(runningPhaseElm).toHaveAttribute("data-reached", "true");

    // Ready phase
    const readyPhaseElm = page.getByTestId("ready-phase");
    await expect(readyPhaseElm).toBeVisible();
    await expect(readyPhaseElm).toHaveAttribute("data-reached", "true");

    // TODO: Assert the student can download the submitted file
    /*
    const formTab = page.getByRole("tab", {
      name: "Test block 1 submission form",
      exact: true
    });
    await formTab.click();

    const downloadButton = page.getByRole("button", {
      name: "Download current submission file for block number 1"
    });
    await expect(downloadButton).toBeVisible();

    const downloadPromise = page.waitForEvent("download");

    await downloadButton.click();
    const download = await downloadPromise;
    await download.saveAs(join(__dirname, "data", "downloaded-java-tests.zip"));
    */
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
      studentRow.getByRole("cell", { name: studentFullName, exact: true })
    ).toBeVisible();
    await expect(
      studentRow.getByRole("cell", {
        name: "N/A",
        exact: true
      })
    ).toBeVisible();
    await expect(
      studentRow.getByRole("link", {
        name: `Edit grade for student ${studentFullName}`,
        exact: true
      })
    ).toBeVisible();
  });

  test("Teacher can edit the grade", async ({ page }) => {
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

    // Edit the grade
    const studentRow = page.getByRole("row", {
      name: new RegExp(`^\\s*${studentFullName}`),
      exact: true
    });
    await expect(studentRow).toBeVisible();

    const editGradeButton = studentRow.getByRole("link", {
      name: `Edit grade for student ${studentFullName}`,
      exact: true
    });
    await editGradeButton.click();

    // ## Select a criteria from the rubric
    let criteriaCard = page.getByRole("button", {
      name: "Select criteria 1 of objective 1",
      exact: true
    });
    await criteriaCard.click();

    const criteriaWeightElm = page.getByLabel(
      "Criteria 1 of objective 1 weight"
    );
    expect(criteriaWeightElm).not.toBeNull();

    const criteriaWeight = await criteriaWeightElm.getAttribute("value");
    expect(criteriaWeight).not.toBeNull();

    // Assert a toast is shown
    await expect(page.getByText("Criteria has been selected")).toBeVisible();

    // Assert the weight was added to the student grade
    const studentGradeInput = page.getByLabel("Grade", { exact: true });
    await expect(studentGradeInput).toBeVisible();
    await expect(studentGradeInput).toHaveValue(criteriaWeight!);

    // ## Deselect the criteria
    criteriaCard = page.getByRole("button", {
      name: "De-select criteria 1 of objective 1",
      exact: true
    });
    await criteriaCard.click();

    // Assert a toast is shown
    await expect(page.getByText("Criteria has been de-selected")).toBeVisible();

    // Assert the weight was removed from the student grade
    await expect(studentGradeInput).toBeVisible();
    await expect(studentGradeInput).toHaveValue("0");

    // ## Add a comment
    const commentInput = page.getByLabel("Comment");
    await expect(commentInput).toBeVisible();
    await commentInput.fill(gradeComment);

    const updateCommentButton = page.getByRole("button", {
      name: "Update comment",
      exact: true
    });
    await updateCommentButton.click();

    // Assert a toast is shown
    await expect(
      page.getByText("The comment has been set successfully")
    ).toBeVisible();

    // Select the criteria again
    criteriaCard = page.getByRole("button", {
      name: "Select criteria 1 of objective 1",
      exact: true
    });
    await criteriaCard.click();
  });

  test("Teacher can download student submissions", async ({ page }) => {
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

    const laboratoryGradesButton = laboratoryRow.getByRole("link", {
      name: `Go to the grades of ${laboratoryName}`,
      exact: true
    });
    await laboratoryGradesButton.click();

    // Go to the grade of the student
    const studentRow = page.getByRole("row", {
      name: new RegExp(`^\\s*${studentFullName}`),
      exact: true
    });

    const editGradeButton = studentRow.getByRole("link", {
      name: `Edit grade for student ${studentFullName}`,
      exact: true
    });

    await editGradeButton.click();

    // Click on the Submission tab
    const submissionTab = page.getByRole("tab", {
      name: "Submissions",
      exact: true
    });
    await submissionTab.click();

    // Assert the teacher can download the submission
    const downloadButton = page.getByRole("button", {
      name: `Download code sent by the student for the ${testBlockName} test block`,
      exact: true
    });
    await expect(downloadButton).toBeVisible();

    const downloadPromise = page.waitForEvent("download");

    await downloadButton.click();
    const download = await downloadPromise;
    await download.saveAs(join(__dirname, "data", "downloaded-java-tests.zip"));

    // Assert a toast is shown
    await expect(
      page.getByText("The submission archive has been downloaded successfully")
    ).toBeVisible();
  });

  test("Student can see the grade", async ({ page }) => {
    // Login as a student
    await page.goto("/login");
    await page.getByLabel("Email").fill(studentEmail);
    await page.getByLabel("Password").fill(getDefaultPassword());
    await page.getByRole("button", { name: "Submit" }).click();

    // Go to the course page
    await page.getByRole("link", { name: courseName }).click();

    // Go to the grade page
    await page
      .getByRole("link", {
        name: `See grade obtained in ${laboratoryName} laboratory`
      })
      .click();

    // Assert the criteria is highlighted
    const highlightedCriteria = page.getByTestId("Criteria 1 of objective 1");
    await expect(highlightedCriteria).toBeVisible();
    await expect(highlightedCriteria).toHaveAttribute(
      "data-is-highlighted",
      "true"
    );

    const highlightedCriteriaWeightElm = page.getByLabel(
      "Criteria 1 of objective 1 weight",
      { exact: true }
    );
    await expect(highlightedCriteriaWeightElm).toBeVisible();

    const highlightedCriteriaWeight =
      await highlightedCriteriaWeightElm.getAttribute("value");
    expect(highlightedCriteriaWeight).not.toBeNull();

    // Assert the grade and comment are shown
    const studentGradeInput = page.getByLabel("Grade", { exact: true });
    await expect(studentGradeInput).toBeVisible();
    await expect(studentGradeInput).toHaveValue(highlightedCriteriaWeight!);

    const commentInput = page.getByLabel("Comment", { exact: true });
    await expect(commentInput).toBeVisible();
    await expect(commentInput).toHaveValue(
      "This is a comment left by the teacher"
    );
  });
});
