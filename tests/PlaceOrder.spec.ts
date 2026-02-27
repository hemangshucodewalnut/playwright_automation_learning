import { test, expect } from "@playwright/test";

test("should place an order", async ({ page }) => {
	const productName = "ZARA COAT 3";
	const products = page.locator(".card-body");
	await page.goto("https://rahulshettyacademy.com/client/");
	await page.locator("#userEmail").fill("hemangshu@yahoo.com");
	await page.locator("#userPassword").fill("1234@Asdf");
	await page.locator('[value="Login"]').click();
	await page.waitForLoadState("networkidle");
	await page.locator(".card-body b").first().waitFor();
	const productCount = await products.count();
	for (let i = 0; i < productCount; ++i) {
		if ((await products.nth(i).locator("b").textContent()) === productName) {
			await products.nth(i).locator("text= Add To Cart").click();
			break;
		}
	}
});
