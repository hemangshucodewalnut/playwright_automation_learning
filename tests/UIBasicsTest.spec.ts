import { expect, test } from "@playwright/test";

test("Browser Context Playwright test", async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();
	await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
	await page.locator("#username").fill("abcd");
	await page.locator('[type="password"]').fill("Learning");
	await page.locator("#signInBtn").click();
	console.log(await page.locator("[style*=block]").textContent());
	await expect(page.locator("[style*=block]")).toContainText("Incorrect");
});
