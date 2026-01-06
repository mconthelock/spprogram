/*
Funtion contents
001 - On load form
002 - Add table detail rows
003 - Show Elmes table
004 - Unable to reply checkbox
005 - Import data from file
007 - Save and create Quotation
009 - Add attachment
010 - Download attached file
011 - Delete attached file
*/
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/flatpickr.min.css";
import "@styles/dataTable.min.css";

import { createTable } from "@public/dataTable";
import { setDatePicker, fpkDayOff } from "@public/flatpickr";
import * as inqservice from "../service/inquiry.js";
import * as quoservice from "../service/quotation.js";
import * as items from "../service/items.js";
import * as utils from "../utils.js";
import * as inqs from "../inquiry/detail.js";
import * as tb from "../inquiry/table.js";
import * as tbmar from "../inquiry/table_stock.js";

//001: On load form
var table;
var tablePriceList;
let deletedLineMap = new Map();
let selectedFilesMap = new Map();
let deletedFilesMap = new Map();

$(document).ready(async () => {
	try {
		await utils.initApp({ submenu: ".navmenu-newinq" });
		let logs, inquiry, details, file;
		let mode = "create";
		const currentUrl = window.location.href;
		if (currentUrl.includes("edit") && $("#inquiry-id").val() != "") {
			inquiry = await inqservice.getInquiryID($("#inquiry-id").val());
			if (inquiry.length == 0) throw new Error("Inquiry do not found");

			if (inquiry.INQ_STATUS >= 10)
				inquiry.INQ_REV = utils.revision_code(inquiry.INQ_REV);

			mode = "edit";
			details = inquiry.details.filter((dt) => dt.INQD_LATEST == "1");
			logs = await inqservice.getInquiryHistory(inquiry.INQ_NO);
			file = await inqservice.getInquiryFile({ INQ_NO: inquiry.INQ_NO });
		}

		const cards = await inqs.setupCard(inquiry);
		const tableContainer = await tbmar.setupTableDetail(details);
		table = await createTable(tableContainer);

		const btn = await setupButton(mode);
		$("#inquiry-no").addClass("stockpart");
		$("#remark").closest(".grid").addClass("hidden");
		$("#currency").closest(".grid").removeClass("hidden");
		const date = await setDatePicker({ ...fpkDayOff() });
	} catch (error) {
		console.log(error);
		await utils.errorMessage(error);
	} finally {
		await utils.showLoader({ show: false });
	}
});

$(document).on("keyup", ".stockpart", async function (e) {
	$("#project-no").val($(this).val());
});

async function setupButton(mode) {
	const additems = await utils.creatBtn({
		id: "add-item",
		title: "Add item",
		icon: "fi fi-rr-shopping-cart text-xl",
		className:
			"btn-neutral hover:bg-neutral/70 hover:shadow-lg btn-disabled",
	});

	const savedata = await utils.creatBtn({
		id: "savedata",
		title: "Save Data",
		icon: "fi fi-tr-envelope-open-text text-xl",
		className:
			"btn-primary text-white hover:shadow-lg hover:bg-primary/70 btn-disabled",
	});

	const back = await utils.creatBtn({
		id: "goback",
		title: "Back",
		type: "link",
		href: `${process.env.APP_ENV}/mar/inquiry`,
		icon: "fi fi-rr-arrow-circle-left text-xl",
		className:
			"btn-outline btn-neutral text-neutral hover:text-white hover:bg-neutral/70",
	});

	$("#btn-container").append(additems, savedata, back);
}

//002: Add table detail rows
$(document).on("click", "#add-item", async function (e) {
	e.preventDefault();
	const id = utils.digits(table.rows().data().length + 1);
	await tb.addRow({ id, seq: id }, table);
	const rowNode = table.rows("tr:last").nodes();
	$(rowNode).find(".itemno").focus();
});

$(document).on("change", ".itemno", async function (e) {
	e.preventDefault();
	console.log("keyup itemno");

	const itemno = $(this).val();
	if (itemno.length < 3) return;

	const itemslist = await items.getItemsCustomer({
		CUSTOMER_ID: $("#customer").val(),
	});
	const pricelist = itemslist.filter(
		(item) => item.itemdesc.ITEM_NO == itemno
	);
	if (pricelist.length == 0) {
		await utils.showMessage(`Item ${itemno} is not found on Price List!`);
		$(this).val("").focus();
		return;
	}

	const pricelistTb = await tbmar.setupTablePriceList(pricelist);
	tablePriceList = await createTable(pricelistTb, {
		id: "#table-price-list",
		columnSelect: { status: true },
	});
	$("#new-stock-item").prop("checked", true);
});

$(document).on("click", "#price-list-cancel", async function (e) {
	e.preventDefault();
	$("#table-price-list").html("");
	$("#new-stock-item").prop("checked", false);
});

$(document).on("click", "#price-list-confirm", async function (e) {
	e.preventDefault();
	const rows = tablePriceList.rows({ selected: true }).data().toArray();
	if (rows.length == 0) {
		await utils.showMessage(`Please select item to add!`);
		return;
	}

	//delete last row of table
	const lastRowNode = table.rows("tr:last").nodes()[0];
	const lastRowIndex = table.row(lastRowNode).index();
	let index = lastRowIndex;
	table.row(lastRowIndex).remove().draw();
	rows.forEach(async (row) => {
		if (row.selected) {
			index = index + 1;
			const formula = row.customer.rate.FORMULA;
			const cost = row.itemdesc.prices[0].TCCOST;
			const price = formula * cost;
			const newrow = {
				INQD_ITEM: row.itemdesc.ITEM_NO,
				INQD_PARTNAME: row.itemdesc.ITEM_NAME,
				INQD_DRAWING: row.itemdesc.ITEM_DWG,
				INQD_VARIABLE: row.itemdesc.ITEM_VARIABLE,
				INQD_UM: row.itemdesc.ITEM_UNIT,
				INQD_SUPPLIER: row.itemdesc.ITEM_SUPPLIER,
				INQD_FC_COST: row.itemdesc.prices[0].FCCOST,
				INQD_FC_BASE: row.itemdesc.prices[0].FCBASE,
				INQD_TC_COST: row.itemdesc.prices[0].TCCOST,
				INQD_TC_BASE: row.customer.rate.FORMULA,
				INQD_UNIT_PRICE: price,
				ITEMID: row.itemdesc.ITEM_ID,
				INQD_OWNER: "MAR",
			};
			await tb.addRow({ id: index, seq: index }, table, newrow);
		}
	});
	$("#table-price-list").html("");
	$("#new-stock-item").prop("checked", false);
	$("#savedata").removeClass("btn-disabled");
});

$(document).on("click", ".delete-sub-line", async function (e) {
	e.preventDefault();
	const row = table.row($(this).closest("tr"));
	const data = row.data();
	if (data.INQD_ID != "") {
		deletedLineMap.set(data.INQD_ID, data);
	}
	row.remove().draw(false);
});

$(document).on("change", ".edit-input", async function () {
	await tb.changeCell(table, this);
});

$(document).on("change", ".qty-input", async function (e) {
	e.preventDefault();
	const qty = $(this).val();
	const row = table.row($(this).closest("tr"));
	const data = row.data();
	if (
		!(
			(data.INQD_ITEM == "101" && data.INQD_PARTNAME == "T/M") ||
			(data.INQD_ITEM == "125" && data.INQD_PARTNAME == "T/M ASSY")
		)
	) {
		table.cell($(this).closest("td")).data(qty).draw();
		return;
	}

	let current = utils.intVal(data.INQD_RUNNO) + utils.intVal(qty);
	table.rows().every(function () {
		const dt = this.data();
		if (dt.INQD_RUNNO > data.INQD_RUNNO) {
			const newrow = { ...dt, INQD_SEQ: current, INQD_RUNNO: current };
			this.data(newrow).draw();
			current++;
		}
	});

	table.row(row).remove().draw();
	let seq = data.INQD_SEQ;
	for (let i = 0; i < qty; i++) {
		const no = seq + i;
		const value = {
			...data,
			INQD_SEQ: no,
			INQD_RUNNO: no,
			INQD_QTY: 1,
		};
		await tb.addRow({ id: no, seq: no }, table, value);
	}

	$("#new-stock-item").prop("checked", false);
});

//Submit Form
//007: Save and send to design
$(document).on("click", "#savedata", async function (e) {
	e.preventDefault();
	const chkheader = await inqs.verifyHeader(".req-2");
	if (!chkheader) return;
	const header = await inqs.getFormHeader();
	const check_inq = await inqservice.getInquiry({ INQ_NO: header.INQ_NO });
	if (check_inq.length > 0) {
		await utils.showMessage(`Inquiry ${header.INQ_NO} is already exist!`);
		$("#inquiry-no").focus().select();
		return;
	}

	const details = table.rows().data().toArray();
	try {
		if (details.length == 0) throw new Error("Please add item to inquiry!");
		let qty = true;
		let isEso = false;
		details.forEach((dt) => {
			if (dt.INQD_QTY == "" || dt.INQD_QTY == null || dt.INQD_QTY == 0)
				qty = false;

			if (parseInt(parseInt(dt.INQD_ITEM) / 100) >= 6) isEso = true;
		});
		if (!qty) throw new Error("Please enter quantity for all items!");
		await utils.showLoader({
			show: true,
			title: "Saving data",
			clsbox: `!bg-transparent`,
		});

		header.INQ_STATUS = 99;
		header.INQ_SERIES = isEso ? "JSWZ" : "GPSXL";
		header.INQ_SPEC = "P1050-CO-120-10S/O";
		header.INQ_PRDSCH = "201501Z";
		header.INQ_TYPE = "Secure";
		header.INQ_MAR_SENT = new Date();
		const fomdata = { header, details };
		const inquiry = await inqservice.createInquiry(fomdata);
		//Create Quotation data
		const quotation = await quoservice.createQuotation({
			QUO_INQ: inquiry.INQ_ID,
			QUO_REV: inquiry.INQ_REV,
			QUO_DATE: inquiry.INQ_DATE,
			QUO_VALIDITY: inquiry.INQ_CUSTRQS,
			QUO_PIC: inquiry.INQ_MAR_PIC,
			QUO_LATEST: 1,
		});

		window.location.replace(
			`${process.env.APP_ENV}/mar/quotation/view/${inquiry.INQ_ID}`
		);
	} catch (error) {
		await utils.errorMessage(error);
		return;
	}
});
