import ExcelJS, { Workbook, Worksheet } from "exceljs";
import { test, expect } from "@playwright/test";

type Change = {
	rowChange: number;
	colChange: number;
};

type ExcelOutput = {
	row: number;
	column: number;
};

async function writeExcelTest(
	searchText: string,
	replaceText: string | number,
	change: Change,
	filePath: string,
): Promise<void> {
	const workbook: Workbook = new ExcelJS.Workbook();
	await workbook.xlsx.readFile(filePath);

	const worksheet: Worksheet | undefined = workbook.getWorksheet("Sheet1");
	if (!worksheet) {
		throw new Error("Worksheet not found");
	}

	const output: ExcelOutput = readExcel(worksheet, searchText);

	const cell = worksheet.getCell(
		output.row + change.rowChange,
		output.column + change.colChange,
	);

	cell.value = replaceText;

	await workbook.xlsx.writeFile(filePath);
}

function readExcel(worksheet: Worksheet, searchText: string): ExcelOutput {
	let output: ExcelOutput = { row: -1, column: -1 };

	worksheet.eachRow((row, rowNumber) => {
		row.eachCell((cell, colNumber) => {
			if (cell.value === searchText) {
				output = { row: rowNumber, column: colNumber };
			}
		});
	});

	return output;
}

// writeExcelTest(
//   "Mango",
//   350,
//   { rowChange: 0, colChange: 2 },
//   "D:\\projects\\playwright_automation\\excelSheet\\excelTest.xlsx"
// );

test("Upload download excel validation", async ({ page }) => {
	const textSearch = "Mango";
	const updateValue = "350";

	await page.goto(
		"https://rahulshettyacademy.com/upload-download-test/index.html",
	);

	const download = page.waitForEvent("download");
	await page.getByRole("button", { name: "Download" }).click();
	const dl = await download;
	const filePath = "download.xlsx";
	await dl.saveAs(filePath);

	await writeExcelTest(
		textSearch,
		updateValue,
		{ rowChange: 0, colChange: 2 },
		filePath,
	);

	await page.locator("#fileinput").setInputFiles(filePath);

	const desiredRow = page
		.getByRole("row")
		.filter({ has: page.getByText(textSearch) });
	await expect(desiredRow.locator("#cell-4-undefined")).toContainText(
		updateValue,
	);
});
