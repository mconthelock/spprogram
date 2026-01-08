import "@amec/webasset/css/dataTable.min.css";
import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { createTable } from "@amec/webasset/dataTable";
import { getTemplate, exportExcel } from "../service/excel";
import * as utils from "../utils.js";

var table;
$(async function () {
	try {
		await utils.initApp();
		const data = await loadTableData({ ORDER_NO: "PT-4362-0-D" });
		const opt = await tableOrdersOption(data);
		table = await createTable(opt);
	} catch (error) {
		console.log(error);
		await utils.errorMessage(error);
	} finally {
		await utils.showLoader({ show: false });
	}
});

async function tableOrdersOption(data) {
	const opt = { ...utils.tableOpt };
	opt.data = data;
	opt.columns = [
		{
			data: "IDS_DATE",
			title: "IDS Date",
			className: "text-center! text-nowrap sticky-column",
			render: function (data, type, row) {
				return dayjs(data).format("YYYY-MM-DD");
			},
		},
		{
			data: "INQUIRY_NO",
			title: "Inquiry No.",
			className: "text-nowrap",
		},
		{
			data: "PRJ_NO",
			title: "Project",
			className: "text-nowrap",
		},
		{
			data: "PCATE_NAME",
			title: "PO Type",
			className: "text-nowrap sticky-column",
		},
		{
			data: "AGENT",
			title: "Agent",
			className: "text-nowrap",
		},
		{
			data: "TRADER",
			title: "Trader",
			className: "text-nowrap",
		},
		{
			data: "DSTN",
			title: "Coutnry",
			className: "text-nowrap",
		},
		{
			data: "CUST_RQS",
			title: "Cus. Rqs.",
			className: "text-nowrap text-center!",
			render: function (data, type, row) {
				return dayjs(data).format("YYYY-MM-DD");
			},
		},
		{
			data: "CREATEBY",
			title: "Inchage",
			className: "text-nowrap",
		},
		{
			data: "INQUIRY_NO",
			className: "w-fit !max-w-[110px] !justify-center",
			sortable: false,
			title: `<div class="flex justify-center"><i class="fi fi-rr-settings-sliders text-lg"></i></div>`,
			render: function (data, type, row) {
				return `<a class="export-docs" href="#"><i class="fi fi-rr-clip text-lg"></i></a>`;
			},
		},
	];
	opt.initComplete = async function () {
		const export1 = await utils.creatBtn({
			id: "export1",
			title: "Export to Excel",
			icon: "fi fi-tr-file-excel text-xl",
			className: `btn-neutral text-white hover:shadow-lg`,
		});
		$(".table-info").append(`<div class="flex gap-2">${export1}</div>`);
	};
	return opt;
}

async function loadTableData(q) {
	try {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: `${process.env.APP_API}/mkt/part/sp-orders`,
				type: "POST",
				dataType: "json",
				data: q,
				success: function (response) {
					resolve(response);
				},
				error: function (error) {
					reject(error);
				},
			});
		});
	} catch (error) {
		console.log(error);
		await utils.errorMessage(error);
	}
}

$(document).on("click", ".export-docs", async function (e) {
	e.preventDefault();
	try {
		const template = await getTemplate("cover_sheet_orders.xlsx");
		await exportDocument(template);
	} catch (error) {
		console.log(error);
		await utils.errorMessage(error);
	}
});

$(document).on("click", "#export-btn", async function (e) {
	e.preventDefault();
	try {
		const template = await getTemplate("export_item_directsale.xlsx");
		const data = table.rows().data().toArray();
		await exportExcel(data, template, {
			filename: "Price List Items master.xlsx",
		});
	} catch (error) {
		console.log(error);
		await utils.errorMessage(error);
	}
});

async function exportDocument(template) {
	const file = template.buffer;
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.load(file).then(async (workbook) => {
		//Process sheets
		await sheet1(workbook);
		await sheet2(workbook);
		await sheet3(workbook);
		await sheet4(workbook);

		//Save to file
		await workbook.xlsx.writeBuffer().then(function (buffer) {
			const blob = new Blob([buffer], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = "Cover Sheet Orders.xlsx";
			link.click();
		});
	});
}

//Sheet 1: Cover Page
async function sheet1(workbook) {
	const sheet = workbook.worksheets[0];
	sheet.getCell(1, 1).value = "AAA";
}

//Sheet 2: Order list
async function sheet2(workbook) {
	const sheet = workbook.worksheets[1];
	sheet.getCell(1, 1).value = "AAA";
}

//Sheet 3: Form1
async function sheet3(workbook) {
	const sheet = workbook.worksheets[2];
	sheet.getCell(1, 1).value = "AAA";
	sheet.getCell(1, 1).value = "AAA";
	sheet.getCell(1, 1).value = "AAA";
	sheet.getCell(1, 1).value = "AAA";
}

//Sheet 4: Check Sheet
async function sheet4(workbook) {
	const sheet = workbook.worksheets[3];
	sheet.getCell(1, 1).value = "AAA";
	sheet.getCell(1, 1).value = "AAA";
	sheet.getCell(1, 1).value = "AAA";
}
