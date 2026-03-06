import { test, expect, request } from "@playwright/test";
import APIUtils from "./utils/APIUtils";

const loginPayLoad = {
	userEmail: "hemangshu@yahoo.com",
	userPassword: "1234@Asdf",
};

const orderPayLoad = {
	orders: [{ country: "India", productOrderedId: "6960eae1c941646b7a8b3ed3" }],
};

const fakePayLoadOrders = { data: [], message: "No Orders" };

let response: { token: string; orderId?: string };

test.beforeAll(async () => {
	const apiContext = await request.newContext();
	const apiUtils = new APIUtils(apiContext, loginPayLoad);
	response = await apiUtils.createOrder(orderPayLoad);
});

test("@SP Place the order", async ({ page }) => {
	page.addInitScript((value) => {
		window.localStorage.setItem("token", value);
	}, response.token);

	await page.route(
		"https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
		async (route) => {
			const response = await page.request.fetch(route.request());
			const body = JSON.stringify(fakePayLoadOrders);

			await route.fulfill({
				response,
				body,
			});
		},
	);

	await page.goto("https://rahulshettyacademy.com/client");

	await page.locator("button[routerlink*='myorders']").click();

	await page.waitForResponse(
		(resp) =>
			resp.url().includes("get-orders-for-customer") && resp.status() === 200,
	);

	console.log(await page.locator(".mt-4").textContent());
});
