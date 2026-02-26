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
	browser,
}) => {
	const context = await browser.newContext();
	const page = await context.newPage();

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
