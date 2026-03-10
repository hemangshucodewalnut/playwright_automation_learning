import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "parallel" });

test("Popup validations", async ({ page }) => {
	await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
	await expect(page.locator("#displayed-text")).toBeVisible();
	await page.locator("#hide-textbox").click();
	await expect(page.locator("displayed-text")).toBeHidden();
	await page.locator("#show-textbox").click();
	await expect(page.locator("#displayed-text")).toBeVisible();
});

test("Alert and hover validations", async ({ page }) => {
	await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
	await page.locator("#confirmbtn").click();
	page.on("dialog", (dialog) => dialog.accept());
	await page.locator("#mousehover").hover();
});

test("Frames validations", async ({ page }) => {
	await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
	const framesPage = page.frameLocator("#courses-iframe");
	await framesPage.locator("li a[href*='lifetime-access']:visible").click();
	const text = await framesPage.locator(".text h2").textContent();
	console.log(text?.split(" ")[1]);
});
