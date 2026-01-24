import "@amec/webasset/css/dataTable.min.css";
import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { showLoader } from "@amec/webasset/preloader";
import { creatBtn, activatedBtn } from "@amec/webasset/components/buttons";
import { showMessage } from "@amec/webasset/utils";
import { createTable } from "@amec/webasset/dataTable";
import { getTemplate, exportExcel, cloneRows } from "../service/excel";
import { getInquiry, dataDetails } from "../service/inquiry.js";
import { initApp, tableOpt } from "../utils.js";

var table;
$(async function () {
	try {
		await showLoader({ show: true });
		await initApp();
		const data = await getInquiry({
			INQ_DATE: `>= ${dayjs().subtract(3, "month").format("YYYY-MM-DD")}`,
			IS_DETAILS: true,
			IS_ORDERS: true,
		});
		const opt = await tableOrdersOption(data);
		table = await createTable(opt);
	} catch (error) {
		console.log(error);
		await showMessage(error);
	} finally {
		await showLoader({ show: false });
	}
});

async function tableOrdersOption(data) {
	data = data.filter((el) => el.orders.length > 0);
	const opt = { ...tableOpt };
	opt.data = data;
	opt.columns = [
		{
			data: "orders",
			title: "IDS Date",
			className: "text-center! text-nowrap sticky-column",
			render: function (data, type, row) {
				return dayjs(data[0].IDS_DATE).format("YYYY-MM-DD");
			},
		},
		{
			data: "INQ_NO",
			title: "Inquiry No.",
			className: "text-nowrap",
		},
		{
			data: "orders",
			title: "Project",
			className: "text-nowrap",
			render: function (data) {
				return data[0].PRJ_NO;
			},
		},
		{
			data: "pcategory",
			title: "PO Type",
			className: "text-nowrap sticky-column",
			render: function (data) {
				return data.length > 0 ? data[0].PCATE_NAME : "";
			},
		},
		{
			data: "orders",
			title: "Agent",
			className: "text-nowrap",
			render: function (data) {
				return data[0].AGENT;
			},
		},
		{
			data: "orders",
			title: "Trader",
			className: "text-nowrap",
			render: function (data) {
				return data[0].TRADER;
			},
		},
		{
			data: "orders",
			title: "Coutnry",
			className: "text-nowrap",
			render: function (data) {
				return data[0].DSTN;
			},
		},
		{
			data: "orders",
			title: "Cus. Rqs.",
			className: "text-nowrap text-center!",
			render: function (data) {
				return dayjs(data[0].CUST_RQS).format("YYYY-MM-DD");
			},
		},
		{
			data: "orders",
			title: "Inchage",
			className: "text-nowrap",
			render: function (data) {
				return data[0].CREATEBY;
			},
		},
		{
			data: "INQ_NO",
			className: "w-fit !max-w-[110px] !justify-center",
			sortable: false,
			title: `<div class="flex justify-center"><i class="fi fi-rr-settings-sliders text-lg"></i></div>`,
			render: function (data, type, row) {
				return `<a class="export-docs" href="#"><i class="fi fi-rr-clip text-lg"></i></a>`;
			},
		},
	];
	opt.initComplete = async function () {
		const export1 = await creatBtn({
			id: "export1",
			title: "Export Excel",
			icon: "fi fi-tr-file-excel text-xl",
			className: `btn-accent text-white hover:shadow-lg`,
		});
		$(".table-info").append(`<div class="flex gap-2">${export1}</div>`);
	};
	return opt;
}

$(document).on("click", "#export1", async function (e) {
	e.preventDefault();
	try {
		await activatedBtn($(this));
		const template = await getTemplate("export_orders.xlsx");
		const data = table.rows().data().toArray();
		let result = await dataDetails(data);
		result = result.filter((el) => el.LINENO !== undefined);
		await exportExcel(result, template, {
			filename: "Secure Orders.xlsx",
		});
	} catch (error) {
		console.log(error);
		await showErrorMessage(`Something went wrong.`, "2036");
	} finally {
		await activatedBtn($(this), false);
	}
});

$(document).on("click", ".export-docs", async function (e) {
	e.preventDefault();
	try {
		const data = table.row($(this).closest("tr")).data();
		const template = await getTemplate("export_orders_detail.xlsx");
		await exportDocument(template, data);
	} catch (error) {
		console.log(error);
		await showMessage(error);
	}
});

async function exportDocument(template, data) {
	const file = template.buffer;
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.load(file).then(async (workbook) => {
		//Process sheets
		await sheet1(workbook, data);
		await sheet2(workbook, data);
		await sheet3(workbook, data);
		await sheet4(workbook, data);

		//Save to file
		await workbook.xlsx.writeBuffer().then(function (buffer) {
			const blob = new Blob([buffer], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = `Cover Sheet Orders ${data.orders[0].PRJ_NO}.xlsx`;
			link.click();
		});
	});
}

//Sheet 1: Cover Page
async function sheet1(workbook, data) {
	const sheet = workbook.worksheets[0];
	const ords = data.orders;
	sheet.getCell("D2").value = dayjs(ords[0].IDS_DATE).format("YYYY-MM-DD");
	sheet.getCell("D3").value = ords[0].CREATEBY;
	sheet.getCell("D9").value = ords[0].TRADER;
	sheet.getCell("D10").value = ords[0].PRJ_NO;
	sheet.getCell("D11").value = ords[0].PRJ_NAME;
	sheet.getCell("D12").value = ords[0].MFGNO;
	sheet.getCell("D13").value = ords[0].INQUIRY_NO;

	sheet.getCell("S9").value = ords[0].AGENT;
	sheet.getCell("S10").value = ords[0].DSTN;
	sheet.getCell("S11").value = ords[0].AMEC_SCHDL;
	sheet.getCell("S12").value = dayjs(ords[0].CUST_RQS).format("YYYY-MM-DD");
	sheet.getCell("S13").value = data.method.METHOD_DESC;
	sheet.getCell("Z11").value = 1;

	let i = 17;
	let j = 1;
	const sheets = data.sheet;
	sheets.forEach((val) => {
		const item = data.details.find((el) => el.INQD_SEQ === val.LINENO);
		const ordpart = data.orders.find((el) => el.ELV_NO === val.ELVNO);
		if (j > 14) {
			cloneRows(sheet, 17, i);
			mergedCells(sheet, i);
		}
		sheet.getCell(i, 1).value = val.LINENO;
		sheet.getCell(i, 2).value = val.ELVNO;
		sheet.getCell(i, 3).value = item.INQD_ITEM;
		sheet.getCell(i, 5).value = item.INQD_PARTNAME;
		sheet.getCell(i, 8).value = item.INQD_DRAWING;
		sheet.getCell(i, 11).value = item.INQD_VARIABLE;
		sheet.getCell(i, 14).value = val.CSQTY;
		sheet.getCell(i, 15).value = item.INQD_UM;
		sheet.getCell(i, 16).value = "";
		sheet.getCell(i, 18).value = ordpart.MFGNO;
		sheet.getCell(i, 21).value = getSchedule(val.MARREQPRDN);
		sheet.getCell(i, 23).value = getSchedule(ordpart.AMEC_SCHDL);
		i++;
		j++;
	});

	let page = 0;
	if (j > 14) page = Math.ceil((j - 14) / 28);
	sheet.getCell("D4").value = page + 1;
}

function mergedCells(sheet, rows) {
	const cells = [
		{ from: "C", to: "D" },
		{ from: "E", to: "G" },
		{ from: "H", to: "J" },
		{ from: "K", to: "M" },
		{ from: "P", to: "Q" },
		{ from: "R", to: "T" },
		{ from: "U", to: "V" },
		{ from: "W", to: "X" },
		{ from: "Y", to: "AA" },
	];
	for (const cell of cells) {
		sheet.mergeCells(`${cell.from}${rows}:${cell.to}${rows}`);
	}
	return;
}

//Sheet 2: Order list
async function sheet2(workbook, data) {
	console.log(data);
	const ords = data.orders;
	const sheets = data.sheet;
	const sheet = workbook.worksheets[1];
	sheet.name = ords[0].PRJ_NO;
	let i = 2;
	ords.forEach((val) => {
		const sh = sheets.filter((el) => el.ELVNO === val.ELV_NO);
		if (i > 25) cloneRows(sheet, 2, i);
		sheet.getCell(i, 1).value = val.SERIES;
		sheet.getCell(i, 2).value = data.INQ_SERIES;
		sheet.getCell(i, 3).value = val.AGENT;
		sheet.getCell(i, 4).value = "0";
		sheet.getCell(i, 5).value = dayjs(val.IDS_DATE).format("YYYY-MM-DD");
		sheet.getCell(i, 6).value = val.PRJ_NO;
		sheet.getCell(i, 7).value = val.ORDER_NO;
		sheet.getCell(i, 8).value = val.ELV_NO;
		sheet.getCell(i, 9).value = val.TRADER;
		sheet.getCell(i, 10).value = sh.CSQTY;
		sheet.getCell(i, 11).value = val.PRJ_NAME;
		sheet.getCell(i, 12).value = val.DSTN;
		sheet.getCell(i, 13).value = getSchedule(val.AMEC_SCHDL);
		sheet.getCell(i, 14).value = dayjs(val.CUST_RQS).format("YYYY-MM-DD");
		sheet.getCell(i, 15).value = sh.PT;
		sheet.getCell(i, 16).value = data.INQ_NO;
		sheet.getCell(i, 17).value = val.MFGNO;
		sheet.getCell(i, 18).value = val.PO_MELTEC;
		sheet.getCell(i, 19).value = val.DWGNO_MELTEC;
		sheet.getCell(i, 20).value = val.PARTNAME_MELTEC;
		i++;
	});
}

//Sheet 3: Form1
async function sheet3(workbook, data) {
	const ords = data.orders;
	const sheet = workbook.worksheets[2];
	sheet.getCell("J7").value = ords[0].MFGNO;
	sheet.getCell("J8").value = ords[0].PRJ_NO;
	sheet.getCell("J9").value = ords[0].DSTN;
	sheet.getCell("J10").value = ords[0].TRADER;
}

//Sheet 4: Check Sheet
async function sheet4(workbook, data) {
	const ords = data.orders;
	const sheet = workbook.worksheets[3];
	sheet.getCell("D2").value = ords[0].PRJ_NO;
	sheet.getCell("D3").value = ords[0].MFGNO;
	sheet.getCell("K4").value = ords[0].CREATEBY;
}

function getSchedule(val) {
	if (val == "" || val == undefined || val == null) return "";

	const str1 = dayjs(val).format("YYMM");
	let jun = "";
	switch (dayjs(val).format("DD")) {
		case "05":
			jun = `${str1}X`;
			break;
		case "10":
			jun = `${str1}A`;
			break;
		case "15":
			jun = `${str1}Y`;
			break;
		case "20":
			jun = `${str1}B`;
			break;
		case "25":
			jun = `${str1}Z`;
			break;
		default:
			jun = `${str1}C`;
			break;
	}
	return jun;
}
