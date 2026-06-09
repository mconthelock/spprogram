import "select2/dist/css/select2.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";

import dayjs from "dayjs";
import { showLoader } from "@amec/webasset/preloader";
import { showMessage, showDigits, intVal } from "@amec/webasset/utils";
import { createTable } from "@amec/webasset/dataTable";
import { setDatePicker } from "@amec/webasset/flatpickr";
import { createBtn, activatedBtnRow } from "@amec/webasset/components/buttons";
import { initApp } from "../utils.js";
import {
	setupTableHistory,
	setupTableAttachment,
	setupCard,
	verifyHeader,
	verifyDetail,
	getFormHeader,
} from "../inquiry/index.js";
import {
	tablePartOption,
	tableViewFactOption,
	tableViewOutOption,
	tableViewWeightOption,
} from "../quotation/index.js";
import {
	getInquiry,
	getInquiryHistory,
	getInquiryFile,
	getCustomer,
	createQuotation,
	updateInquiry,
	findPriceRatio,
} from "../service/index.js";
import * as exportquo from "../quotation/export_excel.js";

var table;
$(document).ready(async () => {
	try {
		await showLoader({ show: true });
		await initApp({ submenu: `.navmenu-quotation` });
		const inq = await getInquiry({
			INQ_ID: $("#inquiry-id").val(),
			IS_DETAILS: true,
			IS_QUOTATION: true,
			IS_WEIGHT: true,
			IS_TIMELINE: true,
		});
		if (inq.length == 0) throw new Error("Inquiry do not found");
		inq[0].INQ_DATE = dayjs(inq[0].INQ_DATE).format("YYYY-MM-DD");
		$("#inquiry-title").html(`${inq[0].INQ_NO}`);

		if (inq[0].INQ_TYPE == "SP") {
			await quotationPart(inq);
		} else if (inq[0].INQ_TYPE == "Out2out") {
			await quotationOut(inq);
		} else {
			await quotationFactory(inq);
		}
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
		return;
	} finally {
		await showLoader({ show: false });
	}
});

async function quotationPart(inq) {
	let mode = intVal($("#inquiry-mode").val());
	if (inq[0].INQ_PKC_REQ == 0) $("#with-tab").remove();
	else {
		//const freight = await freightData(inq[0].weight);
		const weightOpt = await tableViewWeightOption(inq[0].weight);
		const tableWeight = await createTable(weightOpt, {
			id: "#table-weight",
		});
		$("#without-tab").remove();
		if (
			mode < 3 &&
			inq[0].timeline.PKC_CONFIRM == null &&
			inq[0].INQ_STATUS != 50
		) {
			mode = 3;
		}
	}

	const vlist = $("#form-container").attr("data");
	const vstr = vlist.replace(/quotation/g, "quo_part");
	$("#form-container").attr("data", vstr);

	inq[0].QUO_DATE =
		inq[0].quotation == null
			? dayjs().format("YYYY-MM-DD")
			: dayjs(inq[0].quotation.QUO_DATE).format("YYYY-MM-DD");
	inq[0].QUO_VALIDITY =
		inq[0].quotation == null
			? dayjs().add(180, "day").format("YYYY-MM-DD")
			: dayjs(inq[0].quotation.QUO_VALIDITY).format("YYYY-MM-DD");
	const card = await setupCard(inq[0]);
	// Table Detail
	const ratio = await findPriceRatio({
		TRADER: inq[0].INQ_TRADER,
		QUOTATION: inq[0].INQ_QUOTATION_TYPE,
	});
	let optDetail;
	if (mode == 3) optDetail = await tableViewFactOption(inq[0].details);
	else optDetail = await tablePartOption(inq[0].details, ratio);
	table = await createTable(optDetail);

	await setDatePicker();
	//Inquiry History
	const logs = await getInquiryHistory(inq[0].INQ_NO);
	const history = await setupTableHistory(logs);
	await createTable(history, { id: "#history" });

	const file = await getInquiryFile({ INQ_NO: inq[0].INQ_NO });
	const attachment = await setupTableAttachment(file, true);
	const tableAttach = await createTable(attachment, { id: "#attachment" });
	await setupButton(mode);
}

async function quotationFactory(inq) {
	$("#with-tab").remove();
	$("#additional-info").remove();
	const vlist = $("#form-container").attr("data");
	const vstr = vlist.replace(/quotation/g, "viewquo_fact");
	$("#form-container").attr("data", vstr);

	const customers = await getCustomer();
	const customer = customers.find((c) => c.CUS_ID == inq[0].INQ_CUSTOMER);
	inq[0].QUO_CUSTOMER = customer == undefined ? "" : customer.CUS_NAME;
	inq[0].INQ_ACTUAL_PO =
		inq[0].INQ_ACTUAL_PO == null
			? null
			: inq[0].INQ_ACTUAL_PO.toUpperCase();
	inq[0].INQ_CUSTRQS = dayjs(inq[0].INQ_CUSTRQS).format("YYYY-MM-DD");
	const card = await setupCard(inq[0]);
	const optDetail = await tableViewFactOption(inq[0].details);
	//const tableDetail =
	table = await createTable(optDetail);
	await setupButton(3);
}

async function quotationOut(inq) {
	const vlist = $("#form-container").attr("data");
	const vstr = vlist.replace(/quotation/g, "viewquo_out");
	$("#form-container").attr("data", vstr);

	const card = await setupCard(inq[0]);
	$("#with-tab").remove();
	$("#additional-info").remove();
	$("#viewquo").addClass("hidden");
	// console.log(inq[0]);
	const optDetail = await tableViewOutOption(inq[0].details);
	table = await createTable(optDetail);
	await setupButton(3);
}

async function setupButton(group) {
	const detail = table.rows().data().toArray();
	const isAmec = detail.filter((dt) => {
		return dt.INQD_SUPPLIER == "AMEC";
	});

	const issue = await createBtn({
		id: "issue-quotation",
		title: "Issue Quotation",
		className: "btn-primary text-white shadow-lg",
		icon: "fi fi-tr-paper-plane-top text-xl rotate-[-45deg]",
	});

	const reject = await createBtn({
		id: "reject-quotation",
		title: "Unable Process",
		className:
			"btn-error text-white shadow-lg hover:bg-transparent hover:text-error",
		icon: "fi fi-tr-circle-xmark text-xl",
	});

	const returnFnc = `<div class="dropdown dropdown-right dropdown-center">
        <div tabindex="0" role="button" class="btn btn-accent text-white shadow-lg hover:bg-transparent hover:text-accent">
            <i class="fi fi-rr-edit text-xl"></i> Edit
        </div>
        <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li class="${isAmec.length == 0 ? "text-gray-500 menu-disabled" : ""}"><a id="${isAmec.length > 0 ? "returnfin" : ""}" >Return to Finance</a></li>
            <li><a href="${process.env.APP_ENV}/mar/inquiry/detail/${$("#inquiry-id").val()}">Revise Inquiry</a></li>
        </ul>
    </div>`;

	const back = await createBtn({
		id: "goback",
		title: "Back",
		type: "link",
		href: `${process.env.APP_ENV}/mar/quotation`,
		icon: "fi fi-rr-arrow-circle-left text-xl",
		className:
			"btn-outline btn-accent text-neutral hover:text-white hover:bg-accent",
	});

	const exportBtn = await createBtn({
		id: "export-excel-quotation",
		title: "Export Excel",
		icon: "fi fi-tr-file-excel text-xl",
		className: `btn-accent text-white hover:text-white export-excel-quotation`,
		other: `data-id="${$("#inquiry-id").val()}"`,
	});

	switch (group) {
		case 3:
			$(".btn-container").append(exportBtn, back);
			break;
		case 2:
			$(".btn-container").append(issue, reject, returnFnc, back);
			break;
		default:
			$(".btn-container").append(issue, reject, returnFnc, back);
			break;
	}
}

$(document).on("change", ".inqty", async function () {
	console.log("sss");
	const qty = $(this).val();
	const row = table.row($(this).closest("tr")).data();
	const tccost = intVal(row.INQD_TC_COST);
	const unitprice = Math.ceil(tccost * row.INQD_TC_BASE);
	const data = { ...row, INQD_QTY: qty, INQD_UNIT_PRICE: unitprice };
	table.row($(this).closest("tr")).data(data).draw();
});

$(document).on("change", ".inqprice", async function () {
	const tccost = intVal($(this).val());
	const row = table.row($(this).closest("tr")).data();
	const unitprice = Math.ceil(tccost * row.INQD_TC_BASE);
	const data = { ...row, INQD_TC_COST: tccost, INQD_UNIT_PRICE: unitprice };
	table.row($(this).closest("tr")).data(data).draw();
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

$(document).on("click", "#issue-quotation", async function (e) {
	e.preventDefault();
	try {
		await updatePath({ level: 2, status: 99, obj: $(this) });
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.: ${error.message}`);
	}
});

$(document).on("click", "#reject-quotation", async function (e) {
	e.preventDefault();
	try {
		await updatePath({ level: 0, status: 98, obj: $(this) });
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.: ${error.message}`);
	}
});

$(document).on("click", "#returnfin", async function (e) {
	e.preventDefault();
	if ($("#remark").val() == "") {
		await showMessage("Please enter remark for your reason.");
		$("#remark").focus();
		return;
	}
	await updatePath({ level: 0, status: 39, obj: $(this) });
});

async function updatePath(opt) {
	try {
		//1. Check ว่ากรอก Required ครบหรือไม่
		const chkheader = await verifyHeader(".req-2");
		if (!chkheader) return;

		const header = await getFormHeader();
		const { QUO_DATE, QUO_VALIDITY, QUO_NOTE, GROUP_STATUS, ...inqheader } =
			header;
		inqheader.INQ_STATUS = opt.status;
		inqheader.UPDATE_BY = $("#user-login").attr("empname");
		inqheader.UPDATE_AT = new Date();
		const details = table
			.rows()
			.data()
			.toArray()
			.map((detail, index) => ({
				...detail,
				rowIndex: index,
			}));

		// console.log(details);
		await verifyDetail(table, details, opt.level);
		await activatedBtnRow($(this));
		let deleteLine = [];
		let deleteFile = [];
		const timelinedata = await setTimelineData();
		const history = await setLogsData(opt.status);
		//console.log(inqheader);
		const fomdata = {
			header: inqheader,
			details,
			deleteLine,
			deleteFile,
			timelinedata,
			history,
		};
		const inquiry = await updateInquiry(fomdata);
		const quo = await createQuotation(await setQuotationData(inquiry));
		window.location.replace(
			`${process.env.APP_ENV}/mar/quotation/detail/${inquiry.INQ_ID}/3/`,
		);
	} catch (error) {
		console.log(error);
		//await activatedBtnRow(opt.obj, false);
		await showMessage(`Something went wrong.`);
	}
}

async function setTimelineData() {
	return {
		INQ_NO: $("#inquiry-no").val(),
		INQ_REV: $("#revision").val(),
		MAR_USER: $("#user-login").attr("empno"),
		MAR_SEND: new Date(),
	};
}

async function setLogsData(action) {
	return {
		INQ_NO: $("#inquiry-no").val(),
		INQ_REV: $("#revision").val(),
		INQH_DATE: new Date(),
		INQH_USER: $("#user-login").attr("empno"),
		INQH_ACTION: action,
		INQH_REMARK: $("#remark").val(),
	};
}

async function setQuotationData(data) {
	return {
		QUO_INQ: data.INQ_ID,
		QUO_REV: data.INQ_REV,
		QUO_DATE: new Date(),
		QUO_VALIDITY: $("#expiredate").val(),
		QUO_PIC: $("#user-login").attr("empno"),
		QUO_NOTE: $("#remark").val(),
		QUO_LATEST: 1,
	};
}
