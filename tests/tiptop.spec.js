// to execute the code --> npx playwright test tests/tiptop.spec.js --reporter=html
// to see the report after execution --> npx playwright show-report

const { test, expect } = require('@playwright/test');

const URL_To_Launch = "https://d3pv22lioo8876.cloudfront.net/tiptop/";

test.describe("Assignment: Tip Top", () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(URL_To_Launch); //to launch the url before each test case execution
  });

  // 1) Verify that the text input element with xpath .//input[@name='my-disabled'] is disabled in the form

  test("TC001: Disabled text input element", async ({ page }) => {
   
    const disabledInput = page.locator("//input[@name='my-disabled']");
    await expect(disabledInput).toBeDisabled();

  });

  // 2) Verify that the text input with value 'Readonly input' is in readonly state by using 2 xpaths

  test("TC002: Readonly input state by using 2 xpaths", async ({ page }) => {
    
    // XPath #1
    const xpath1 = page.locator("//input[@value='Readonly input']");
    await expect(xpath1).toHaveAttribute("readonly", "");

    // XPath #2
    const xpath2 = page.locator("//input[@readonly]");
    await expect(xpath2).toHaveAttribute("value", "Readonly input");

    // Try an input forcefully but the field value should NOT change
    const oldValue = await xpath1.inputValue(); //retrieving the current value as oldValue
    await xpath1.type("try to type on the field");
    const newValue = await xpath1.inputValue(); //retrieving the value after typing a text as newValue
    expect(newValue).toBe(oldValue); //comparing both the values to be equal since its a read only field
  });

  // 3) Verify that the dropdown field to select color is having 8 elements using 2 xpaths

  test("TC003: Select Color dropdown has 8 options using 2 xpaths", async ({ page }) => {
    // XPath #1
    const options1 = page.locator("//select[@name='my-select']//option");
    await expect(options1).toHaveCount(8);

    // XPath #2
    const options2 = page.locator("//select/option");
    await expect(options2).toHaveCount(8);
  });

  // 4) Verify that the submit button is disabled when no data is entered in Name & Password field

  test("TC004: Submit button is disabled without any data entered", async ({ page }) => {
    const nameInput = page.locator("//input[@name='my-name']");
    const passwordInput = page.locator("//input[@name='my-password']");
    const submitBtn = page.locator("//button[@type='submit']");

    await nameInput.fill(""); // ensure empty
    await passwordInput.fill(""); // ensure empty

    await expect(submitBtn).toBeDisabled();
  });

  // 5) Verify that the submit button enabled when both Name and Password field is entered

  test("TC005: Submit button is enabled when Name & Password entered", async ({ page }) => {
    const nameInput = page.locator("//input[@name='my-name']");
    const passwordInput = page.locator("//input[@name='my-password']");
    const submitBtn = page.locator("//button[@type='submit']");

    await nameInput.fill("MyName");
    await passwordInput.fill("MyPassword");

    await expect(submitBtn).toBeEnabled();
  });

  // 6) Verify that on submit of 'Submit' button the page shows 'Received' text

  test("TC006: After Submit the page shows Received text", async ({ page }) => {
    const nameInput = page.locator("//input[@name='my-name']");
    const passwordInput = page.locator("//input[@name='my-password']");
    const submitBtn = page.locator("//button[@type='submit']");

    await nameInput.fill("MyName");
    await passwordInput.fill("MyPassword");
    await submitBtn.click();

    const receivedText = page.locator("//p[contains(text(), 'Received')]");
    await expect(receivedText).toBeVisible();
  });

  // 7) Verify that on submit of form all the data passed to the URL

  test("TC007: Verify name & password data getting passed in URL after submit", async ({ page }) => {
    const nameInput = page.locator("//input[@name='my-name']");
    const passwordInput = page.locator("//input[@name='my-password']");
    const submitBtn = page.locator("//button[@type='submit']");

    const nameValue = "MyName";
    const passwordValue = "MyPassword";
    
    await nameInput.fill(nameValue);
    await passwordInput.fill(passwordValue);
    await submitBtn.click();

    await page.waitForTimeout(1000); // 1 second wait for the redirect url to load

    const currentUrl = page.url();

    // Assert values appear in GET query string
    expect(currentUrl).toContain('name=',nameValue);
    expect(currentUrl).toContain('password=',passwordValue);

  });

});