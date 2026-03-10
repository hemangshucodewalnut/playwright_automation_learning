import { Page, Locator } from "@playwright/test";

class DashboardPage {
	products: Locator;
	productsText: Locator;
	cartButton: Locator;

	constructor(page: Page) {
		this.products = page.locator(".card-body");
		this.productsText = page.locator(".card-body b");
		this.cartButton = page.locator('[routerlink*="cart"]');
	}

	async searchProduct(productName: string) {
		const productCount = await this.products.count();
		for (let i = 0; i < productCount; ++i) {
			if (
				(await this.products.nth(i).locator("b").textContent()) === productName
			) {
				await this.products.nth(i).locator("text= Add To Cart").click();
				break;
			}
		}
	}

	async goToCart() {
		await this.cartButton.click();
	}
}

export default DashboardPage;
