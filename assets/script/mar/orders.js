import "@amec/webasset/css/dataTable.min.css";
import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { createTable } from "@amec/webasset/dataTable";
import { getInquiryReport } from "../service/inquiry.js";
import { getTemplate, exportExcel, cloneRows } from "../service/excel";
import * as utils from "../utils.js";

var table;
$(async function () {
	try {
		await utils.initApp();
		const data = await getInquiryReport({
			SINQ_DATE: dayjs().subtract(3, "month").format("YYYY-MM-DD"),
			IS_ORDERS: 1,
		});
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
	const uniqueData = data.reduce((acc, current) => {
		const exists = acc.find(
			(item) =>
				item.INQUIRY_NO === current.INQUIRY_NO &&
				item.PRJ_NO === current.PRJ_NO
		);
		if (!exists) {
			acc.push(current);
		}
		return acc;
	}, []);
	data = uniqueData;
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
			data: "INQ_NO",
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
		const docs = table.row($(this).closest("tr")).data().PRJ_NO;
		const data = await loadTableData({ PRJ_NO: docs, IS_ORDERS: 1 });
		const template = await getTemplate("cover_sheet_orders.xlsx");
		await exportDocument(template, data);
	} catch (error) {
		console.log(error);
		await utils.errorMessage(error);
	}
});

$(document).on("click", "#export1", async function (e) {
	e.preventDefault();
	try {
		const template = await getTemplate("export_secure_orders.xlsx");
		const data = table.rows().data().toArray();
		await exportExcel(data, template, {
			filename: "Secure Orders.xlsx",
		});
	} catch (error) {
		console.log(error);
		await utils.errorMessage(error);
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
			link.download = "Cover Sheet Orders.xlsx";
			link.click();
		});
	});
}

//Sheet 1: Cover Page
async function sheet1(workbook, data) {
	const sheet = workbook.worksheets[0];
	sheet.getCell("D2").value = dayjs(data[0].IDS_DATE).format("YYYY-MM-DD");
	sheet.getCell("D3").value = data[0].CREATEBY;
	sheet.getCell("D9").value = data[0].TRADER;
	sheet.getCell("D10").value = data[0].PRJ_NO;
	sheet.getCell("D11").value = data[0].PRJ_NAME;
	sheet.getCell("D12").value = data[0].MFGNO;
	sheet.getCell("D13").value = data[0].INQ_NO;

	sheet.getCell("S9").value = data[0].AGENT;
	sheet.getCell("S10").value = data[0].DSTN;
	sheet.getCell("S11").value = data[0].AMEC_SCHDL;
	sheet.getCell("S12").value = dayjs(data[0].CUST_RQS).format("YYYY-MM-DD");
	sheet.getCell("S13").value = data[0].SHIP;
	sheet.getCell("Z11").value = data[0].PT;

	let i = 17;
	let j = 1;
	data.forEach((val) => {
		if (j > 14) {
			cloneRows(sheet, 17, i);
			mergedCells(sheet, i);
		}
		sheet.getCell(i, 1).value = j;
		sheet.getCell(i, 2).value = val.CAR_NO;
		sheet.getCell(i, 3).value = val.INQD_ITEM;
		sheet.getCell(i, 5).value = val.INQD_PARTNAME;
		sheet.getCell(i, 8).value = val.INQD_DRAWING;
		sheet.getCell(i, 11).value = val.INQD_VARIABLE;
		sheet.getCell(i, 14).value = val.CSQTY;
		sheet.getCell(i, 15).value = val.INQD_UM;
		sheet.getCell(i, 16).value = "";
		sheet.getCell(i, 18).value = val.MFGNO;
		sheet.getCell(i, 21).value = getSchedule(val.MARREQPRDN);
		sheet.getCell(i, 23).value = getSchedule(val.AMEC_SCHDL);
		sheet.getCell(i, 25).value = val.REMARK;
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
	const sheet = workbook.worksheets[1];
	sheet.name = data[0].PRJ_NO;
	let i = 2;
	data.forEach((val) => {
		if (i > 25) cloneRows(sheet, 2, i);
		sheet.getCell(i, 1).value = val.SERIES;
		sheet.getCell(i, 2).value = val.INQ_TYPE;
		sheet.getCell(i, 3).value = val.AGENT;
		sheet.getCell(i, 4).value = "0";
		sheet.getCell(i, 5).value = dayjs(val.IDS_DATE).format("YYYY-MM-DD");
		sheet.getCell(i, 6).value = val.PRJ_NO;
		sheet.getCell(i, 7).value = val.ORDER_NO;
		sheet.getCell(i, 8).value = val.CAR_NO;
		sheet.getCell(i, 9).value = val.TRADER;
		sheet.getCell(i, 10).value = val.CSQTY;
		sheet.getCell(i, 11).value = val.PRJ_NAME;
		sheet.getCell(i, 12).value = val.DSTN;
		sheet.getCell(i, 13).value = getSchedule(val.AMEC_SCHDL);
		sheet.getCell(i, 14).value = dayjs(val.Cust_rqs).format("YYYY-MM-DD");
		sheet.getCell(i, 15).value = val.PT;
		sheet.getCell(i, 16).value = val.INQ_NO;
		sheet.getCell(i, 17).value = val.MFGNO;
		sheet.getCell(i, 18).value = val.PO_MELTEC;
		sheet.getCell(i, 19).value = val.INQD_DRAWING;
		sheet.getCell(i, 20).value = val.INQD_PARTNAME;
		sheet.getCell(i, 21).value = ""; //amount usd
		sheet.getCell(i, 22).value = "";
		sheet.getCell(i, 23).value = "";
		sheet.getCell(i, 24).value = "";
		sheet.getCell(i, 25).value = "";
		sheet.getCell(i, 26).value = "";
		sheet.getCell(i, 27).value = "";
		sheet.getCell(i, 28).value = "";
		sheet.getCell(i, 29).value = "";
		i++;
	});
}

//Sheet 3: Form1
async function sheet3(workbook, data) {
	const sheet = workbook.worksheets[2];
	sheet.getCell("J7").value = data[0].MFGNO;
	sheet.getCell("J8").value = data[0].PRJ_NO;
	sheet.getCell("J9").value = data[0].DSTN;
	sheet.getCell("J10").value = data[0].TRADER;
}

//Sheet 4: Check Sheet
async function sheet4(workbook, data) {
	const sheet = workbook.worksheets[3];
	sheet.getCell("D2").value = data[0].PRJ_NO;
	sheet.getCell("D3").value = data[0].MFGNO;
	sheet.getCell("K4").value = data[0].CREATEBY;
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
