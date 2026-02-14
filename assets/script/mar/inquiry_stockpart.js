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
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";
import select2 from "select2";
import { showLoader } from "@amec/webasset/preloader";
import { showMessage, intVal } from "@amec/webasset/utils";
import { createBtn, activatedBtn } from "@amec/webasset/components/buttons";
import { setDatePicker } from "@amec/webasset/flatpickr";
import { createTable } from "@amec/webasset/dataTable";
import {
	setupCard,
	setupStockTableDetail,
	setupStockPriceList,
	verifyHeader,
	getFormHeader,
} from "../inquiry/index.js";
import {
	getItemsCustomer,
	getInquiry,
	createInquiry,
	createQuotation,
} from "../service/index.js";
import { addRow, bindDeleteLine } from "../inquiry/ui.js";
import { initApp } from "../utils.js";

var table;
var tablePriceList;
select2();
$(document).ready(async () => {
	try {
		await showLoader();
		await initApp({ submenu: ".navmenu-newinq" });
		const cards = await setupCard();
		$("#inquiry-no").addClass("stockpart");
		$("#remark").closest(".grid").addClass("hidden");

		const tableContainer = await setupStockTableDetail();
		table = await createTable(tableContainer);
		await setupButton();
		await setDatePicker();
		await bindDeleteLine();
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await showLoader({ show: false });
	}
});

$(document).on("keyup", ".stockpart", async function (e) {
	$("#project-no").val($(this).val());
});

async function setupButton() {
	const additems = await createBtn({
		id: "add-item",
		title: "Add item",
		icon: "fi fi-rr-shopping-cart text-xl",
		className:
			"btn-neutral hover:bg-neutral/70 hover:shadow-lg btn-disabled",
	});

	const savedata = await createBtn({
		id: "savedata",
		title: "Save Data",
		icon: "fi fi-tr-envelope-open-text text-xl",
		className:
			"btn-primary text-white hover:shadow-lg hover:bg-primary/70 btn-disabled",
	});

	const back = await createBtn({
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
$(document).on("change", ".itemno", async function (e) {
	e.preventDefault();
	try {
		const itemno = $(this).val();
		const cusname = $("#customer option:selected").text();
		if (itemno.length < 3) return;

		const itemslist = await getItemsCustomer({
			CUSTOMER_ID: $("#customer").val(),
		});
		const pricelist = itemslist.filter(
			(item) => item.itemdesc.ITEM_NO == itemno,
		);

		if (pricelist.length == 0) {
			await showMessage(
				`Item ${itemno} is not found on ${cusname} Price List!`,
			);
			$(this).val("").focus();
			return;
		}

		const pricelistTb = await setupStockPriceList(pricelist);
		tablePriceList = await createTable(pricelistTb, {
			id: "#table-price-list",
			columnSelect: {
				status: true,
				class: "max-w-[55px]!",
				width: "55px",
			},
		});
		$("#new-stock-item").attr("checked", true);
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	}
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

	let current = intVal(data.INQD_RUNNO) + intVal(qty);
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
		await addRow({ id: no, seq: no }, table, value);
	}
	$("#new-stock-item").attr("checked", false);
});

$(document).on("click", "#add-item", async function (e) {
	e.preventDefault();
	const id = table.rows().data().length + 1;
	await addRow({ id, seq: id }, table);
	const rowNode = table.rows("tr:last").nodes();
	$(rowNode).find(".itemno").focus();
});

$(document).on("click", "#price-list-cancel", async function (e) {
	e.preventDefault();
	$("#table-price-list").html("");
	$("#new-stock-item").attr("checked", false);
});

$(document).on("click", "#price-list-confirm", async function (e) {
	e.preventDefault();
	const rows = tablePriceList.rows({ selected: true }).data().toArray();
	if (rows.length == 0) {
		await showMessage(`Please select item to add!`);
		return;
	}
	//delete last row of table
	const lastRowNode = table.rows("tr:last"); //.data().toArray();
	const lastRowIndexNo = table.rows("tr:last").nodes()[0];
	const lastRowIndex = table.row(lastRowIndexNo).index();
	const lastRowData = lastRowNode.data().toArray();
	const lastSeq = lastRowData[0].INQD_SEQ;
	table.row(lastRowIndex).remove().draw();
	console.log(lastSeq);
	var index = 0;
	rows.forEach(async (row) => {
		if (row.selected) {
			const formula = row.customer.rate.FORMULA;
			const cost = Math.ceil(row.itemdesc.prices[0].TCCOST);
			const price = Math.ceil(formula * cost);
			const newrow = {
				INQD_ITEM: row.itemdesc.ITEM_NO,
				INQD_PARTNAME: row.itemdesc.ITEM_NAME,
				INQD_DRAWING: row.itemdesc.ITEM_DWG,
				INQD_VARIABLE: row.itemdesc.ITEM_VARIABLE,
				INQD_UM: row.itemdesc.ITEM_UNIT,
				INQD_SUPPLIER: row.itemdesc.ITEM_SUPPLIER,
				INQD_FC_COST: Math.ceil(row.itemdesc.prices[0].FCCOST),
				INQD_FC_BASE: row.itemdesc.prices[0].FCBASE,
				INQD_TC_COST: Math.ceil(row.itemdesc.prices[0].TCCOST),
				INQD_TC_BASE: row.customer.rate.FORMULA,
				INQD_UNIT_PRICE: price,
				ITEMID: row.itemdesc.ITEM_ID,
				INQD_OWNER: "MAR",
			};
			const seq = lastSeq + index;
			index = index + 1;
			await addRow({ id: seq, seq: seq }, table, newrow);
		}
	});
	$("#table-price-list").html("");
	$("#new-stock-item").attr("checked", false);
	$("#savedata").removeClass("btn-disabled");
});

//Submit Form
//007: Save and send to design
$(document).on("click", "#savedata", async function (e) {
	e.preventDefault();
	try {
		await showLoader();
		const chkheader = await verifyHeader(".req-2");
		if (!chkheader) return;
		const header = await getFormHeader();
		const check_inq = await getInquiry({ INQ_NO: header.INQ_NO });
		if (check_inq.length > 0) {
			await showMessage(`Inquiry ${header.INQ_NO} is already exist!`);
			$("#inquiry-no").focus().select();
			return;
		}

		const details = table.rows().data().toArray();
		if (details.length == 0) {
			await showMessage(`Please add item to inquiry!`);
			$("#inquiry-no").focus().select();
			return;
		}

		let checkqty = true;
		let series = "GPSXL";
		details.forEach((dt) => {
			if (intVal(dt.INQD_QTY) < 1) checkqty = false;
			if (intVal(dt.INQD_ITEM) / 100 >= 6) series = "JSWZ";
		});
		if (!checkqty) {
			await showMessage(`Please enter quantity for all items!`);
			$("#inquiry-no").focus().select();
			return;
		}

		await activatedBtn($(this), true);
		header.INQ_STATUS = 99;
		header.INQ_SERIES = series;
		header.INQ_SPEC = "P1050-CO-120-10S/O";
		header.INQ_PRDSCH = "201501Z";
		header.INQ_TYPE = "Secure";
		header.INQ_MAR_SENT = new Date();
		header.UPDATE_AT = new Date();
		const fomdata = { header, details };
		const inquiry = await createInquiry(fomdata);
		const quotation = await createQuotation({
			QUO_INQ: inquiry.INQ_ID,
			QUO_REV: inquiry.INQ_REV,
			QUO_DATE: inquiry.INQ_DATE,
			QUO_VALIDITY: inquiry.INQ_CUSTRQS,
			QUO_PIC: inquiry.INQ_MAR_PIC,
			QUO_LATEST: 1,
		});
		window.location.replace(
			`${process.env.APP_ENV}/mar/quotation/detail/${inquiry.INQ_ID}/3/`,
		);
	} catch (error) {
		await showLoader({ show: false });
		await showMessage(`Something went wrong.`);
		return;
	}
});
