import { APIRequestContext } from "@playwright/test";

interface LoginPayload {
	userEmail: string;
	userPassword: string;
}

interface OrderPayload {
	orders: {
		country: string;
		productOrderedId: string;
	}[];
}

interface LoginResponse {
	token: string;
}

interface OrderResponse {
	orders: string[];
	productOrderId: string[];
	message: string;
}

class APIUtils {
	constructor(
		private apiContext: APIRequestContext,
		private loginPayload: LoginPayload,
	) {}

	async getAuthorizationToken(): Promise<string> {
		const loginResponse = await this.apiContext.post(
			"https://rahulshettyacademy.com/api/ecom/auth/login",
			{
				data: this.loginPayload,
			},
		);

		const loginResponseJson: LoginResponse = await loginResponse.json();
		return loginResponseJson.token;
	}

	async createOrder(
		orderPayload: OrderPayload,
	): Promise<{ token: string; orderId: string }> {
		const token = await this.getAuthorizationToken();

		const orderResponse = await this.apiContext.post(
			"https://rahulshettyacademy.com/api/ecom/order/create-order",
			{
				data: orderPayload,
				headers: {
					Authorization: token,
				},
			},
		);

		const orderResponseJson: OrderResponse = await orderResponse.json();
		const orderId = orderResponseJson.orders[0];

		return { token, orderId };
	}
}

export default APIUtils;
