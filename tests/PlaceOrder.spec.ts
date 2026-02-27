import { test, expect } from "@playwright/test";

test("should place an order", async ({ page }) => {
	const email = "hemangshu@yahoo.com";
	const productName = "ZARA COAT 3";
	const products = page.locator(".card-body");
	await page.goto("https://rahulshettyacademy.com/client/");
	await page.locator("#userEmail").fill(email);
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

	await page.locator('[routerlink*="cart"]').click();
	await page.locator("div li").first().waitFor();
	const isProductVisibleInCart = await page
		.locator(`h3:has-text("${productName}")`)
		.isVisible();
	expect(isProductVisibleInCart).toBeTruthy();

	await page.locator("text=Checkout").click();
	await page
		.locator("[placeholder*='Country']")
		.pressSequentially("ind", { delay: 150 });
	const dropdownOptions = page.locator(".ta-results");
	await dropdownOptions.waitFor();
	const dropdownOptionsCount = await dropdownOptions.locator("button").count();

	for (let i = 0; i < dropdownOptionsCount; ++i) {
		const text = await dropdownOptions.locator("button").nth(i).textContent();
		if (text === " India") {
			await dropdownOptions.locator("button").nth(i).click();
			break;
		}
	}
	expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
	await page.locator("text=Place Order").click();
	await expect(page.locator(".hero-primary")).toHaveText(
		" Thankyou for the order. ",
	);
	const orderId = await page
		.locator(".em-spacer-1 .ng-star-inserted")
		.textContent();
});
