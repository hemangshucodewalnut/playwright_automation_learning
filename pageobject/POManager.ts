import { Page } from "@playwright/test";
import LoginPage from "./Login.page";
import DashboardPage from "./Dashboard.page";

class POManager {
	page: Page;
	loginPage: LoginPage;
	dashboardPage: DashboardPage;

	constructor(page: Page) {
		this.page = page;
		this.loginPage = new LoginPage(this.page);
		this.dashboardPage = new DashboardPage(this.page);
	}

	getLoginPage() {
		return this.loginPage;
	}

	getDashboardPage() {
		return this.dashboardPage;
	}
}

export default POManager;
