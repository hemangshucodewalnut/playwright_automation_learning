import { test, expect, request } from "@playwright/test";

const loginPayload = {
	userEmail: "hemangshu@yahoo.com",
	userPassword: "1234@Asdf",
};

let token: string;

test.beforeAll(async () => {
	const apiContext = await request.newContext();
	const loginResponse = await apiContext.post(
		"https://rahulshettyacademy.com/api/ecom/auth/login",
		{
			data: loginPayload,
		},
	);

	expect(loginResponse.ok()).toBeTruthy();
	const loginResponseJson = await loginResponse.json();
	token = loginResponseJson.token;
});

test("should place an order", async ({ page }) => {
	await page.addInitScript((value) => {
		window.localStorage.setItem("token", value);
	}, token);

	const email = "hemangshu@yahoo.com";
	const productName = "ZARA COAT 3";
	const products = page.locator(".card-body");
	await page.goto("https://rahulshettyacademy.com/client/");
	// await page.locator("#userEmail").fill(email);
	// await page.locator("#userPassword").fill("1234@Asdf");
	// await page.locator('[value="Login"]').click();
	// await page.locator(".card-body b").first().waitFor();
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
	const orderId: string =
		(await page.locator(".em-spacer-1 .ng-star-inserted").textContent()) || "";

	await page.locator("button[routerlink*='myorders']").click();
	await page.locator("tbody").waitFor();
	const orderDetailsRows = page.locator("tbody tr");

	for (let i = 0; i < (await orderDetailsRows.count()); ++i) {
		const productIdsInOrderDetailsTable: string =
			(await orderDetailsRows.nth(i).locator("th").textContent()) || "";
		if (orderId.includes(productIdsInOrderDetailsTable)) {
			await orderDetailsRows.nth(i).locator("button").first().click();
			break;
		}
	}
	const orderIdDetails: string =
		(await page.locator(".col-text").textContent()) || "";
	expect(orderId.includes(orderIdDetails)).toBeTruthy();
});
