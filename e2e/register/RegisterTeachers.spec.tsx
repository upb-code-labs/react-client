import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Login as an admin
  await page.goto("/login");
  await page.getByLabel("Email").fill("development.admin@gmail.com");
  await page.getByLabel("Password").fill("changeme123*/");
  await page.getByRole("button", { name: "Submit" }).click();

  // Assert the admins page is loaded
  expect(page.waitForURL(/\/admins$/)).toBeTruthy();

  // Go to the teachers register page
  await page.getByRole("link", { name: "R. Teachers" }).click();
});

test("The fields are validated", async ({ page }) => {
  // Fill the form
  await page.getByLabel("Full name").fill("a");
  await page.getByLabel("Email").fill("a@gmail.com");
  await page.getByLabel("Password").fill("insecure");
  await page.getByRole("button", { name: "Submit" }).click();

  // Assert the errors are shown
  await expect(
    page.getByText("Full name must be at least 4 characters long")
  ).toBeVisible();
  await expect(page.getByText("Must be an UPB email")).toBeVisible();
  await expect(
    page.getByText(
      "Must contain at least one letter, one number and one special character"
    )
  ).toBeVisible();
});

test.describe.serial("Teacher registration", () => {
  test("Admins can register new teachers", async ({ page }) => {
    // Select the forms
    const fullNameInput = page.getByLabel("Full name");
    const emailInput = page.getByLabel("Email");
    const passwordInput = page.getByLabel("Password");

    // Fill the form
    await fullNameInput.fill("Angel Martin");
    await emailInput.fill("angel.martin.2020@upb.edu.co");
    await passwordInput.fill("upbbga2020*/");
    await page.getByRole("button", { name: "Submit" }).click();

    // Assert the alert is shown
    await expect(
      page.getByText("The teacher has been registered!")
    ).toBeVisible();

    // Assert the form is reset
    await expect(fullNameInput).toHaveValue("");
    await expect(emailInput).toHaveValue("");
    await expect(passwordInput).toHaveValue("");
  });

  test("Admins can't register new teachers with an existing email", async ({
    page
  }) => {
    const email = "angel.martin.2020@upb.edu.co";
    await page.getByLabel("Full name").fill("Angel Martin");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("upbbga2020*/");
    await page.getByRole("button", { name: "Submit" }).click();

    // Assert the alert is shown
    await expect(
      page.getByText(`Email ${email} is already in use`)
    ).toBeVisible();
  });
});
