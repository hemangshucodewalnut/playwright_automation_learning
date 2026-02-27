import { test, expect } from "@playwright/test";

test("should place an order", async ({ page }) => {
	await page.goto("https://rahulshettyacademy.com/client/");
	await page.locator("#userEmail").fill("hemangshu@yahoo.com");
	await page.locator("#userPassword").fill("1234@Asdf");
	await page.locator('[value="Login"]').click();
});
