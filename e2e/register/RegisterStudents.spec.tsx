import { expect, test } from "@playwright/test";

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
});

test.describe.serial("Student registration", () => {
  test("An student can register", async ({ page, baseURL }) => {
    await page.goto("/register/students");

    await page.getByLabel("Full name").fill("John Doe");
    await page.getByLabel("Email").fill("john.doe.2020@upb.edu.co");
    await page.getByLabel("Institutional ID").fill("000123456");
    await page.getByLabel("Password").fill("upbbga2020*/");
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(
      page.getByText("Your account has been created!")
    ).toBeVisible();
    expect(page.url()).toBe(`${baseURL}/login`);
  });

  test("An student can't register with an existing email", async ({ page }) => {
    await page.goto("/register/students");

    const email = "john.doe.2020@upb.edu.co";
    await page.getByLabel("Full name").fill("John Doe");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Institutional ID").fill("000234561");
    await page.getByLabel("Password").fill("upbbga2020*/");
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(
      page.getByText(`Email ${email} is already in use`)
    ).toBeVisible();
  });

  test("An student can't register with an existing institutional ID", async ({
    page
  }) => {
    await page.goto("/register/students");

    const institutionalId = "000123456";
    await page.getByLabel("Full name").fill("John Doe");
    await page.getByLabel("Email").fill("doe.john.2020@upb.edu.co");
    await page.getByLabel("Institutional ID").fill(institutionalId);
    await page.getByLabel("Password").fill("upbbga2020*/");
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(
      page.getByText(`Institutional ID ${institutionalId} is already in use`)
    ).toBeVisible();
  });

  test("Student can logout and logout", async ({ page, baseURL }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("john.doe.2020@upb.edu.co");
    await page.getByLabel("Password").fill("wrong");
    await page.getByRole("button", { name: "Submit" }).click();

    // Assert the wrong credentials alert is shown
    await expect(page.getByText("Invalid credentials")).toBeVisible();

    // Fill the form with the correct credentials
    await page.getByLabel("Password").fill("upbbga2020*/");
    await page.getByRole("button", { name: "Submit" }).click();

    // Assert the alert is shown
    await expect(page.getByText("You have been logged in!")).toBeVisible();

    // Assert the student is redirected
    await expect(page.url()).toBe(`${baseURL}/courses`);

    // Assert the navbar options were updated
    await expect(page.getByRole("link", { name: "Courses" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Profile" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Logout" })).toBeVisible();

    // Assert the logout option works
    await page.getByRole("link", { name: "Logout" }).click();
    expect(page.waitForURL(/\/login$/)).toBeTruthy();
  });
});
