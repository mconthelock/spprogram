import "select2/dist/css/select2.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";

import select2 from "select2";
import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { showLoader } from "@amec/webasset/preloader";
import { showMessage, showDigits } from "@amec/webasset/utils";
import { createTable } from "@amec/webasset/dataTable";
import { setDatePicker } from "@amec/webasset/flatpickr";
import { createBtn, activatedBtn } from "@amec/webasset/components/buttons";
import { initApp } from "../utils.js";
import { setupCard } from "../inquiry/detail.js";
import { tableWeightOption } from "../quotation/table_weight.js";
import * as tb from "../inquiry/table.js";
import { tablePartOption } from "../quotation/view_part.js";
import {
	getInquiry,
	getInquiryHistory,
	getInquiryFile,
} from "../service/inquiry.js";
import * as cus from "../service/customers.js";
var table;
var tableAttach;
var tableWeight;

$(document).ready(async () => {
	try {
		await showLoader({ show: true });
		await initApp({ submenu: `.navmenu-quotation` });
		const inq = await getInquiry({
			INQ_ID: $("#inquiry-id").val(),
			IS_QUOTATION: true,
			IS_WEIGHT: true,
		});
		if (inq.length == 0) throw new Error("Inquiry do not found");

		const inquiry = inq[0];
		const quotation = inq[0].quotation;
		const weight = inq[0].weight;
		inquiry.INQ_DATE = dayjs(inquiry.INQ_DATE).format("YYYY-MM-DD");

		//1=New, 2=edit , 3=view
		if ($("#inquiry-mode").val() == 1) {
			$("#inquiry-title").html(`${inquiry.INQ_NO}`);
		} else {
			$("#inquiry-title").html(`${inquiry.INQ_NO}`);
			inquiry.QUO_DATE = quotation.QUO_DATE;
			inquiry.QUO_VALIDITY = quotation.QUO_VALIDITY;
		}

		if (inquiry.INQ_TYPE == "SP") {
			await quotationPart(inquiry, weight);
		} else if (inquiry.INQ_TYPE == "Out2out") {
			await quotationOut();
		} else {
			await quotationFactory();
		}
		await setupButton($("#inquiry-mode").val());
		await setDatePicker();
		// const customers = await cus.getCustomer();
		// const customer = customers.find(
		// 	(c) => c.CUS_ID == inquiry.INQ_CUSTOMER,
		// );
		// inquiry.QUO_CUSTOMER = customer == undefined ? "" : customer.CUS_NAME;

		// if (inquiry.INQ_PKC_REQ == 0) {
		// 	$("#tabs-lift").remove();
		// 	$("#table-freight").remove();
		// } else {
		// 	$("#without-tab").remove();
		// 	await freightData(inquiry.weight);
		// }

		// //Inquiry Detail
		// const details = inquiry.details.filter((dt) => dt.INQD_LATEST == 1);
		// const tableContainer = await tbquo.setupTableDetail(
		// 	details,
		// 	inquiry.INQ_TYPE,
		// );

		//Weight Package
		const weightContainer = await tableWeightOption(weight);
		tableWeight = await createTable(weightContainer, {
			id: "#table-weight",
		});

		// //Inquiry History
		// table = await createTable(tableContainer);
		const logs = await getInquiryHistory(inquiry.INQ_NO);
		const history = await tb.setupTableHistory(logs);
		await createTable(history, { id: "#history" });

		const file = await getInquiryFile({ INQ_NO: inquiry.INQ_NO });
		const attachment = await tb.setupTableAttachment(file, true);
		tableAttach = await createTable(attachment, { id: "#attachment" });
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
		return;
	} finally {
		await showLoader({ show: false });
	}
});

async function quotationPart(inquiry, weight) {
	const vlist = $("#form-container").attr("data");
	const vstr = vlist.replace(/quotation/g, "quo_part");
	$("#form-container").attr("data", vstr);
	const card = await setupCard(inquiry);
	const freight = await freightData(weight);
	const optDetail = await tablePartOption();
	const tableDetail = await createTable(optDetail);
}

function quotationFactory() {}

function quotationOut() {}

async function setupButton() {
	const issue = await createBtn({
		id: "issue",
		title: "Issue Quotation",
		className: "btn-primary text-white shadow-lg",
		icon: "fi fi-tr-paper-plane-top text-xl rotate-[-45deg]",
	});

	const reject = await createBtn({
		id: "reject",
		title: "Unable Process",
		className:
			"btn-error text-white shadow-lg hover:bg-transparent hover:text-error",
		icon: "fi fi-tr-circle-xmark text-xl",
	});

	const edit = await createBtn({
		id: "edit",
		title: "Revise Inquiry",
		type: "link",
		href: `${process.env.APP_ENV}/mar/inquiry/edit/${$(
			"#inquiry-id",
		).val()}`,
		className:
			"btn-accent text-white shadow-lg hover:bg-transparent hover:text-accent",
		icon: "fi fi-tr-feedback-cycle-loop text-xl",
	});

	const back = await createBtn({
		id: "goback",
		title: "Back",
		type: "link",
		href: `#`,
		icon: "fi fi-rr-arrow-circle-left text-xl",
		className:
			"btn-outline btn-accent text-neutral hover:text-white hover:bg-accent",
	});
	$("#btn-container").append(issue, reject, edit, back);
}

$(document).on("change", ".inqty", async function () {
	const qty = $(this).val();
	const row = table.row($(this).closest("tr")).data();
	const data = { ...row, INQD_QTY: qty };
	table.row($(this).closest("tr")).data(data).draw();
	// await totalDetail();
});

$(document).on("change", ".inqprice", async function () {
	const tccost = utils.intVal($(this).val());
	const row = table.row($(this).closest("tr")).data();
	const unitprice = Math.ceil(tccost * row.INQD_TC_BASE);
	const data = { ...row, INQD_TC_COST: tccost, INQD_UNIT_PRICE: unitprice };
	table.row($(this).closest("tr")).data(data).draw();
	// await totalDetail();
});

$(document).on("change", ".freight-value", async function () {
	const value = $(this).val();
	if (isNaN(value) || value < 0) {
		$(this).val(0);
		await showMessage("Please enter a valid number");
		return;
	}

	const voulumn = $(this).closest("tr").find("input").eq(1).val();
	const total = voulumn * value;
	$(this).closest("tr").find("input").eq(2).val(showDigits(total, 0));
});

async function freightData(data) {
	if (data.length == 0) return;
	const totalVolume = data.reduce((a, b) => a + (b.ROUND_WEIGHT || 0), 0);
	const totalWeight = data.reduce((a, b) => a + (b.GROSS_WEIGHT || 0), 0);

	//Sae Freight Table
	const sea = $("#table-freight").find(".sea-value").val();
	$("#table-freight").find(".sea-voulumn").val(showDigits(totalVolume, 0));
	$("#table-freight")
		.find(".sea-total")
		.val(showDigits(totalVolume * sea, 0) || 0);
	//Air Freight Table
	const air = $("#table-freight").find(".sea-value").val();
	$("#table-freight").find(".air-voulumn").val(showDigits(totalWeight, 0));
	$("#table-freight")
		.find(".air-total")
		.val(showDigits(totalWeight * air, 0) || 0);
	//Courier Freight Table
	const courier = $("#table-freight").find(".sea-value").val();
	$("#table-freight")
		.find(".courier-voulumn")
		.val(showDigits(totalWeight, 0));
	$("#table-freight")
		.find(".courier-total")
		.val(showDigits(totalWeight * courier, 0) || 0);
}

// async function totalDetail() {
// 	//Summary
// 	let totalcost = 0;
// 	let totalunit = 0;
// 	let grandtotal = 0;

// 	table.rows().every(function () {
// 		const data = this.data();
// 		totalcost += Math.ceil(data.INQD_TC_COST);
// 		totalunit += Math.ceil(data.INQD_UNIT_PRICE);
// 		const unit = Math.ceil(data.INQD_UNIT_PRICE) * data.INQD_QTY;
// 		grandtotal += unit;
// 	});

// 	$(table.table().footer()).find(".total-tc").text(showDigits(totalcost, 0));
// 	$(table.table().footer())
// 		.find(".total-unit")
// 		.text(showDigits(totalunit, 0));
// 	$(table.table().footer())
// 		.find(".grand-total")
// 		.text(showDigits(grandtotal, 0));
// }
