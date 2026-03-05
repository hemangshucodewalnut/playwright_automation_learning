import { test, expect, request } from "@playwright/test";
import APIUtils from "./utils/APIUtils";

const loginPayload = {
	userEmail: "hemangshu@yahoo.com",
	userPassword: "1234@Asdf",
};

const orderPayload = {
	orders: [{ country: "Cuba", productOrderedId: "6960eae1c941646b7a8b3ed3" }],
};

let token: string;
let orderId: string;

test.beforeAll(async () => {
	const apiContext = await request.newContext();
	const apiUtils = new APIUtils(apiContext, loginPayload);

	const response = await apiUtils.createOrder(orderPayload);

	token = response.token;
	orderId = response.orderId;
});

test("should place an order", async ({ page }) => {
	await page.addInitScript((value) => {
		window.localStorage.setItem("token", value);
	}, token);

	await page.goto("https://rahulshettyacademy.com/client/");

	await page.locator("button[routerlink*='myorders']").click();
	await page.locator("tbody").waitFor();

	const orderDetailsRows = page.locator("tbody tr");

	for (let i = 0; i < (await orderDetailsRows.count()); ++i) {
		const productIdsInOrderDetailsTable =
			(await orderDetailsRows.nth(i).locator("th").textContent()) || "";

		if (orderId.includes(productIdsInOrderDetailsTable)) {
			await orderDetailsRows.nth(i).locator("button").first().click();
			break;
		}
	}

	const orderIdDetails = (await page.locator(".col-text").textContent()) || "";

	expect(orderId.includes(orderIdDetails)).toBeTruthy();
});
