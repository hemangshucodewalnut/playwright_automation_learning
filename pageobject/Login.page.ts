import { Page, Locator } from "@playwright/test";

class LoginPage {
	page: Page;
	userEmail: Locator;
	userPassword: Locator;
	signInButton: Locator;

	constructor(page: Page) {
		this.page = page;
		this.userEmail = page.locator("#userEmail");
		this.userPassword = page.locator("#userPassword");
		this.signInButton = page.locator('[value="Login"]');
	}

	async goTo() {
		await this.page.goto("https://rahulshettyacademy.com/client/");
	}

	async validLogin(email: string, password: string) {
		await this.userEmail.fill(email);
		await this.userPassword.fill(password);
		await this.signInButton.click();
		await this.page.locator(".card-body b").first().waitFor();
	}
}

export default LoginPage;
