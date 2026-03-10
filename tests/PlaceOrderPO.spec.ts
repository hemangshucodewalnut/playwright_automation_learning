import { test, expect } from "@playwright/test";
import POManager from "../pageobject/POManager";
import { testData } from "./utils/PlaceOrderPO.testdata";
import { customTest } from "./utils/test-base";

test("should place an order", async ({ page }) => {
	const poManager = new POManager(page);
	const loginPage = poManager.getLoginPage();
	const dashboardPage = poManager.getDashboardPage();
	const email = testData.email;
	const password = testData.password;
	const productName = testData.productName;

	await loginPage.goTo();
	await loginPage.validLogin(email, password);

	dashboardPage.searchProduct(productName);
	await dashboardPage.goToCart();

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

customTest(
	"should place an order with custom test data",
	async ({ page, testDataProduct }) => {
		const poManager = new POManager(page);
		const loginPage = poManager.getLoginPage();
		const dashboardPage = poManager.getDashboardPage();
		const email = testDataProduct.email;
		const password = testDataProduct.password;
		const productName = testDataProduct.productName;

		await loginPage.goTo();
		await loginPage.validLogin(email, password);

		dashboardPage.searchProduct(productName);
		await dashboardPage.goToCart();

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
		const dropdownOptionsCount = await dropdownOptions
			.locator("button")
			.count();

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
			(await page.locator(".em-spacer-1 .ng-star-inserted").textContent()) ||
			"";

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
	},
);
