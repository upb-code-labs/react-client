import { expect, test } from "@playwright/test";
import {
  getDefaultPassword,
  getRandomEmail,
  getRandomName,
  getRandomUniversityID
} from "e2e/Utils";

test("The fields are validated", async ({ page }) => {
  await page.goto("/register/students");

  await page.getByLabel("Full name").fill("a");
  await page.getByLabel("Email").fill("a@gmail.com");
  await page.getByLabel("Institutional ID").fill("No number");
  await page.getByLabel("Password").fill("insecure");
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(
    page.getByText("Full name must be at least 4 characters long")
  ).toBeVisible();
  await expect(page.getByText("Must be an UPB email")).toBeVisible();
  await expect(page.getByText("Must be numeric")).toBeVisible();
  await expect(
    page.getByText(
      "Must contain at least one letter, one number and one special character"
    )
  ).toBeVisible();
  await expect(
    page.getByText(
      "You can't register without accepting the terms and conditions"
    )
  ).toBeVisible();
});

test.describe.serial("Student registration", () => {
  let newStudentEmail = getRandomEmail();
  const newStudentID = getRandomUniversityID();

  test("An student can register", async ({ page, baseURL }) => {
    await page.goto("/register/students");

    await page.getByLabel("Full name").fill(getRandomName());
    await page.getByLabel("Email").fill(newStudentEmail);
    await page.getByLabel("Institutional ID").fill(newStudentID);
    await page.getByLabel("Password").fill(getDefaultPassword());
    await page.getByLabel("Accept terms and conditions").check();
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(
      page.getByText("Your account has been created!")
    ).toBeVisible();
    expect(page.url()).toBe(`${baseURL}/login`);
  });

  test("An student can't register with an existing email", async ({ page }) => {
    await page.goto("/register/students");

    await page.getByLabel("Full name").fill(getRandomName());
    await page.getByLabel("Email").fill(newStudentEmail);
    await page.getByLabel("Institutional ID").fill(getRandomUniversityID());
    await page.getByLabel("Password").fill(getDefaultPassword());
    await page.getByLabel("Accept terms and conditions").check();
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(
      page.getByText(`Email ${newStudentEmail} is already in use`)
    ).toBeVisible();
  });

  test("An student can't register with an existing institutional ID", async ({
    page
  }) => {
    await page.goto("/register/students");

    await page.getByLabel("Full name").fill(getRandomName());
    await page.getByLabel("Email").fill(getRandomEmail());
    await page.getByLabel("Institutional ID").fill(newStudentID);
    await page.getByLabel("Password").fill(getDefaultPassword());
    await page.getByLabel("Accept terms and conditions").check();
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(
      page.getByText(`Institutional ID ${newStudentID} is already in use`)
    ).toBeVisible();
  });

  test("Student can login and logout", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(newStudentEmail);
    await page.getByLabel("Password").fill("wrong");
    await page.getByRole("button", { name: "Submit" }).click();

    // Assert the wrong credentials alert is shown
    await expect(page.getByText("Credentials are wrong")).toBeVisible();

    // Fill the form with the correct credentials
    await page.getByLabel("Password").fill(getDefaultPassword());
    await page.getByRole("button", { name: "Submit" }).click();

    // Assert the alert is shown
    await expect(page.getByText("You have been logged in!")).toBeVisible();

    // Assert the student is redirected
    await page.waitForURL(/\/courses$/);

    // Assert the navbar options were updated
    await expect(
      page.getByRole("link", { name: "Courses", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Profile", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Logout", exact: true })
    ).toBeVisible();

    // Assert the logout option works
    await page.getByRole("link", { name: "Logout", exact: true }).click();
    await page.waitForURL(/\/login$/);
  });

  test("Student can update their profile", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(newStudentEmail);
    await page.getByLabel("Password").fill(getDefaultPassword());
    await page.getByRole("button", { name: "Submit" }).click();

    await page.waitForURL(/\/courses$/);

    // Navigate to the profile view
    await page.getByRole("link", { name: "Profile", exact: true }).click();
    await page.waitForURL(/\/profile$/);

    // Update the profile
    const newName = getRandomName();
    const newEmail = getRandomEmail();
    const newID = getRandomUniversityID();

    await page.getByLabel("Full name").fill(newName);
    await page.getByLabel("Email").fill(newEmail);
    await page.getByLabel("Institutional ID").fill(newID);
    await page.getByLabel("Password confirmation").fill(getDefaultPassword());
    await page.getByRole("button", { name: "Update" }).click();

    // Assert the alert is shown
    await expect(
      page.getByText("Your profile has been updated successfully")
    ).toBeVisible();

    newStudentEmail = newEmail;
  });

  test("Students can update their password", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(newStudentEmail);
    await page.getByLabel("Password").fill(getDefaultPassword());
    await page.getByRole("button", { name: "Submit" }).click();

    await page.waitForURL(/\/courses$/);

    // Navigate to the profile view
    await page.getByRole("link", { name: "Profile", exact: true }).click();
    await page.waitForURL(/\/profile$/);

    // Select the tab to change the password
    await page.getByRole("tab", { name: "Change password" }).click();

    // Change the password
    await page.getByLabel("Current password").fill(getDefaultPassword());

    const newPassword = getDefaultPassword() + "/*updated*/";
    await page.getByLabel("New password", { exact: true }).fill(newPassword);
    await page
      .getByLabel("Confirm new password", { exact: true })
      .fill(newPassword);

    await page.getByRole("button", { name: "Update" }).click();

    // Assert the alert is shown
    await expect(
      page.getByText("Your password has been updated")
    ).toBeVisible();

    // Logout
    await page.getByRole("link", { name: "Logout", exact: true }).click();
    await page.waitForURL(/\/login$/);

    // Login with the new password
    await page.getByLabel("Email").fill(newStudentEmail);
    await page.getByLabel("Password").fill(newPassword);
    await page.getByRole("button", { name: "Submit" }).click();
    await page.waitForURL(/\/courses$/);
  });
});
