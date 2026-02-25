import { expect, test } from "@playwright/test";

test("Browser Context Playwright test", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();
	await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
});

test("Page Fixture Test", async ({ page }) => {
	await page.goto("https://google.com");
	await expect(page).toHaveTitle("Google");
});
