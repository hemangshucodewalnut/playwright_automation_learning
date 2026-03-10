import { test as base } from "@playwright/test";

// define an interface for the fixture value
interface TestDataProduct {
	email: string;
	password: string;
	productName: string;
}

// extend Playwright's fixtures with our custom property
type MyFixtures = {
	testDataProduct: TestDataProduct;
};

export const customTest = base.extend<MyFixtures>({
	testDataProduct: async (_, use) => {
		const data: TestDataProduct = {
			email: "hemangshu@yahoo.com",
			password: "1234@Asdf",
			productName: "ZARA COAT 3",
		};

		await use(data);
	},
});
