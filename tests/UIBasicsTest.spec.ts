import { expect, test } from "@playwright/test";

test("Browser Context Playwright test", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();
	await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
	await page.locator("#username").fill("rahulshettyacademy");
	await page.locator('[type="password"]').fill("Learning@830$3mK2");
	await page.locator("#signInBtn").click();
});

test("Page Fixture Test", async ({ page }) => {
	await page.goto("https://google.com");
	await expect(page).toHaveTitle("Google");
});
