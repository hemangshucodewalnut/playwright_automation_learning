import { expect, test } from "@playwright/test";

test("should show error message for invalid login", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();

	const userName = page.locator("#username");
	const password = page.locator('[type="password"]');
	const signin = page.locator("#signInBtn");

	await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

	await userName.fill("abcd");
	await password.fill("Learning@830$3mK2");
	await signin.click();

	await expect(page.locator("[style*=block]")).toContainText("Incorrect");
});

test("should grab text content of first card after valid login", async ({
	page,
}) => {
	const userName = page.locator("#username");
	const password = page.locator('[type="password"]');
	const signin = page.locator("#signInBtn");
	const cardTitles = page.locator(".card-body a");

	await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

	await userName.fill("rahulshettyacademy");
	await password.fill("Learning@830$3mK2");
	await signin.click();

	const firstCardText = await cardTitles.nth(0).textContent();
	console.log(firstCardText);
});

test("should grab all card titles after valid login", async ({ page }) => {
	const userName = page.locator("#username");
	const password = page.locator('[type="password"]');
	const signin = page.locator("#signInBtn");
	const cardTitles = page.locator(".card-body a");

	await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

	await userName.fill("rahulshettyacademy");
	await password.fill("Learning@830$3mK2");
	await signin.click();

	await expect(cardTitles.first()).toBeVisible();
	const allTitles = await cardTitles.allTextContents();
	console.log(allTitles);
});

test(" should select dropdown, checkboxes and radio buttons", async ({
	page,
}) => {
	const dropdown = page.locator("select.form-control");
	const documentLink = page.locator("[href*='documents-request']");
	await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
	await dropdown.selectOption("consult");
	await page.locator(".radiotextsty").last().click();
	await page.locator("#okayBtn").click();
	await expect(page.locator(".radiotextsty").last()).toBeChecked();
	await page.locator("#terms").click();
	await expect(page.locator("#terms")).toBeChecked();
	await expect(documentLink).toHaveAttribute("class", "blinkingText");
});

test.only("handle child windows", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();
	await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
	const documentLink = page.locator("[href*='documents-request']");

	const [newPage] = await Promise.all([
		context.waitForEvent("page"),
		documentLink.click(),
	]);

	const text = await newPage.locator(".red").textContent();
	if (!text) throw new Error("Text not found");
	const arrayText = text.split("@");
	const domain = arrayText[1].split(" ")[0];
	await page.locator("#username").fill(domain);
	console.log(await page.locator("#username").inputValue());
});
