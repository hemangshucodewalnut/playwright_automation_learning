import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: "./tests",
	retries: 1,
	workers: 5,
	timeout: 40 * 1000,
	expect: {
		timeout: 5 * 1000,
	},
	reporter: "html",

	projects: [
		{
			name: "chromium",
			use: {
				browserName: "chromium",
				headless: true,
				// viewport: { width: 1280, height: 720 },
			},
		},
		{
			name: "safari",
			use: {
				browserName: "webkit",
				headless: true,
				// ...devices["iPhone 12"],
				// ignoreHTTPSErrors: true,
				// permissions: ["geolocation"],
			},
		},
	],
});
