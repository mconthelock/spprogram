import "select2/dist/css/select2.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";

import dayjs from "dayjs";
import { showLoader } from "@amec/webasset/preloader";
import {
	showMessage,
	showDigits,
	intVal,
	showConfirm,
	revisionCode,
} from "@amec/webasset/utils";
import { setDatePicker } from "@amec/webasset/flatpickr";
import { readInput } from "@amec/webasset/excel";
import { createBtn, activatedBtn } from "@amec/webasset/components/buttons";
import { createTable } from "@amec/webasset/dataTable";
import { setupCard, getFormHeader } from "../inquiry/detail.js";
import { getAgent } from "../service/mkt.js";
import { currentPeriod } from "../service/items.js";
import { createQuotation } from "../service/quotation.js";
import {
	getDeliveryTerm,
	getMethod,
	findPriceRatio,
	getCurrency,
} from "../service/master.js";
import {
	getInquiry,
	createInquiry,
	updateInquiryHeader,
} from "../service/inquiry.js";
import { initApp, tableOpt } from "../utils.js";

var table;
$(document).ready(async () => {
	try {
		await showLoader();
		await initApp({ submenu: `.navmenu-quotation` });
		await setupCard();
		$("#trader").closest("div.grid").find("label").html("Sale Company");
		const optDetail = await tableDetail();
		table = await createTable(optDetail);
		setDatePicker({ dayOff: true });
		const save = await createBtn({
			id: "savedata",
			title: "Save Data",
			icon: `fi fi-rr-disk text-xl`,
			className: `btn-primary btn-disabled text-white hover:shadow-lg`,
		});
		const cancel = await createBtn({
			id: "cancel",
			title: "Cancel",
			type: "link",
			href: `${process.env.APP_ENV}/mar/quotation/outtoout`,
			icon: `fi fi-rr-cross-circle text-xl`,
			className: `btn-error text-white hover:shadow-lg`,
		});
		const btn1 = await createBtn({
			id: "import-data-btn",
			title: "Import data",
			icon: `fi fi-rs-progress-upload text-xl`,
			className: `btn-outline btn-accent text-accent hover:shadow-lg hover:text-white!`,
		});
		$("#btn-container").append(`${btn1}${save}${cancel}`);
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
		return;
	} finally {
		await showLoader({ show: false });
	}
});

async function tableDetail(data = []) {
	const opt = { ...tableOpt };
	opt.data = data;
	opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-auto"t><"flex mt-5"<"table-info flex flex-col flex-1 gap-5"i><"table-page flex-none"i>>`;
	opt.searching = false;
	opt.lengthChange = false;
	opt.columns = [
		{
			data: "INQD_CAR",
			title: "Ele No.",
			className: "sticky-column",
		},
		{
			data: "INQD_ITEM",
			title: "Item",
			className: "sticky-column",
		},
		{
			data: "INQD_DRAWING",
			title: "Drawing No.",
			className: "sticky-column min-w-[225px] ",
		},
		{
			data: "INQD_PARTNAME",
			title: "Part Name",
			className: "min-w-[225px]",
		},
		{
			data: "INQD_VARIABLE",
			title: "Specification",
			className: "text-start! min-w-[225px]",
		},
		{
			data: "INQD_SUPPLIER",
			title: "Supplier",
		},
		{
			data: "INQD_QTY",
			title: "Qty",
			footer: "Total",
		},
		{
			data: "INQD_UM",
			title: "UM",
		},
		{
			data: "INQD_FC_COST",
			title: `<div>SPU Price</div><div>[1]</div>`,
			className: "text-right bg-primary/20",
			render: function (data, type) {
				if (type === "display") {
					const str = `<input type="text" class="w-full! text-end text-md! fccost cell-input" value="${data == null ? "" : showDigits(data, 0)}" onfocus="this.select();"/>`;
					return str;
				}
				return data;
			},
		},
		{
			data: "INQD_FC_BASE",
			title: `<div>Exchange</div><div>[2]</div>`,
			render: function (data, type) {
				if (type === "display") {
					return showDigits(data, 2);
				}
				return data;
			},
		},
		{
			data: "INQD_TC_COST",
			title: `<div>SPU Price (THB)</div><div>[1*2]</div>`,
			render: function (data, type) {
				if (type === "display") {
					return showDigits(data, 0);
				}
				return data;
			},
		},
		{
			data: "INQD_TC_BASE",
			title: `<div>Profit</div><div>[3]</div>`,
			render: function (data, type) {
				if (type === "display") {
					return showDigits(data, 3);
				}
				return data;
			},
		},
		{
			data: "INQD_EXRATE",
			title: `<div>Exchange</div><div>[4]</div>`,
			render: function (data, type) {
				if (type === "display") {
					return showDigits(data, 2);
				}
				return data;
			},
		},
		{
			data: "INQD_UNIT_PRICE",
			title: `<div>Unit Price</div><div>[(1*2*3)/4]</div>`,
			render: function (data, type) {
				if (type === "display") {
					return showDigits(data, 0);
				}
				return data;
			},
		},
		{
			data: "INQD_UNIT_PRICE",
			title: "Amount",
			render: function (data, type, row) {
				if (type === "display") {
					const amount = intVal(data) * intVal(row.INQD_QTY);
					return showDigits(amount, 0);
				}
				return data;
			},
		},
	];
	opt.footerCallback = function () {
		const api = this.api();
		const data = api.rows().data();
		let totalqty = 0;
		let totalfccost = 0;
		let totaltccost = 0;
		let totalunit = 0;
		let total = 0;
		let currency = "";
		data.map((el) => {
			const price = calPrice(el);
			totalqty += intVal(el.INQD_QTY);
			totalfccost += intVal(el.INQD_FC_COST);
			totaltccost += intVal(price.tccost);
			totalunit += intVal(price.unitprice);
			total += intVal(price.amount);
			currency = el.INQD_TCCUR == undefined ? "" : el.INQD_TCCUR;
		});
		api.column(6).footer().innerHTML = showDigits(totalqty, 0);
		api.column(8).footer().innerHTML = showDigits(totalfccost, 0);
		api.column(10).footer().innerHTML = showDigits(totaltccost, 0);
		api.column(13).footer().innerHTML = showDigits(totalunit, 0);
		api.column(14).footer().innerHTML = showDigits(total, 0);
		api.column(12).footer().innerHTML = currency;
	};
	opt.initComplete = async function () {
		const btn1 = await createBtn({
			id: "import-data-btn",
			title: "Import data",
			icon: `fi fi-rs-progress-upload text-xl`,
			className: `btn-outline btn-accent text-accent hover:shadow-lg hover:text-white!`,
		});
		// $(".table-info").append(`<div class="flex gap-2">${btn1}</div>`);
	};
	return opt;
}

const calPrice = (data) => {
	const cost = intVal(data.INQD_FC_COST);
	const curr1 = intVal(data.INQD_FC_BASE);
	const tccost = cost * curr1;
	const profit = intVal(data.INQD_TC_BASE);
	const curr2 = intVal(data.INQD_EXRATE);
	const unitprice =
		curr2 == 0
			? 0
			: Math.ceil(intVal(showDigits((tccost * profit) / curr2), 3));
	const amount = unitprice * intVal(data.INQD_QTY);
	return { tccost, unitprice, amount };
};

async function getDataHeader(data) {
	const terms = await getDeliveryTerm();
	const term =
		typeof data[11][22] == "object" ? data[11][22].result : data[11][22];
	const termsData = terms.find((x) => x.TERM_DESC == term);

	const methods = await getMethod();
	const method =
		typeof data[11][24] == "object" ? data[11][24].result : data[11][24];
	const methodData = methods.find((x) => x.METHOD_DESC == method);

	const agents = await getAgent();
	const country =
		typeof data[6][3] == "object" ? data[6][3].result : data[6][3];
	const agn = agents.find((x) => x.country.CTNAME == country.toUpperCase());
	return {
		INQ_NO: data[11][3],
		INQ_REV: "*",
		INQ_TRADER: data[1][3],
		INQ_AGENT: agn.AGENT,
		INQ_COUNTRY: country.toUpperCase(),
		INQ_PRJNO: data[2][3],
		INQ_PRJNAME: data[3][3],
		INQ_CONTRACTOR: data[4][3],
		INQ_ENDUSER: data[5][3],
		INQ_USERPART: data[7][3],
		INQ_TYPE: "Out2out",
		INQ_QUOTATION_TYPE: 25,
		INQ_DELIVERY_TERM: termsData.TERM_ID,
		INQ_DELIVERY_METHOD: methodData.METHOD_ID,
		INQ_SHIPMENT: 1,
		//INQ_CUR: priceRatio[0].CURRENCY,
		//INQ_TCCUR: priceRatio[0].SUPPLIER_CUR,
		INQ_PORT: data[11][3],
		INQ_MAR_PIC: $("#user-login").attr("empno"),
		INQ_STATUS: 2,
		status: { id: 2, STATUS_DESC: "New" },
	};
}

async function getDataDetails(data) {
	let supplier;
	if (data[0][14].richText.length > 0) {
		const title = data[0][14].richText[1].text;
		if (title.search("TOKAN") >= 0) supplier = "TOKAN";
		else {
			if (data[11][26] != "" && data[11][26].toUpperCase() == "KISWIRE")
				supplier = "KISWIRE";
			else supplier = "TOKYO ROPE";
		}
	}

	const priceRatio = await findPriceRatio({
		TRADER: data[1][3],
		SUPPLIER: supplier,
		QUOTATION: 25,
	});
	if (priceRatio.length == 0) {
		await showMessage(`Not found price ratio for this Sale Company.`);
		return;
	}

	const period = await currentPeriod();
	const currency = await getCurrency();
	const exchange1 = currency.find(
		(x) =>
			x.CURR_CODE == priceRatio[0].SUPPLIER_CUR &&
			x.CURR_PERIOD == period.current.period &&
			x.CURR_YEAR == period.current.year,
	).CURR_RATE;
	const exchange2 = currency.find(
		(x) =>
			x.CURR_CODE == priceRatio[0].CURRENCY &&
			x.CURR_PERIOD == period.current.period &&
			x.CURR_YEAR == period.current.year,
	).CURR_RATE;

	const detail = [];
	for (let i = 11; i < data.length; i++) {
		if (data[i][3] != undefined && data[i][3] != null && data[i][3] != "") {
			const row = {
				INQD_CAR:
					typeof data[i][4] == "object"
						? data[i][4].result
						: data[i][4],
				INQD_ITEM:
					typeof data[i][14] == "object"
						? data[i][14].result
						: data[i][14],
				INQD_DRAWING:
					typeof data[i][15] == "object"
						? data[i][15].result
						: data[i][15],
				INQD_PARTNAME:
					typeof data[i][16] == "object"
						? data[i][16].result
						: data[i][16],
				INQD_VARIABLE:
					typeof data[i][17] == "object"
						? data[i][17].result
						: data[i][17],
				INQD_SUPPLIER: supplier,
				INQD_QTY:
					typeof data[i][18] == "object"
						? data[i][18].result
						: data[i][18],
				INQD_UM:
					typeof data[i][19] == "object"
						? data[i][19].result
						: data[i][19],
				INQD_FC_COST: 0,
				INQD_FC_BASE: exchange1,
				INQD_TC_COST: 0,
				INQD_TC_BASE: priceRatio[0].FORMULA,
				INQD_EXRATE: exchange2,
				INQD_UNIT_PRICE: 0,
				INQD_RUNNO: i + 1,
				INQD_SEQ: i + 1,
				INQD_TCCUR: priceRatio[0].SUPPLIER_CUR,
			};
			detail.push(row);
		}
	}
	return {
		detail,
		currency1: priceRatio[0].CURRENCY,
		currency2: priceRatio[0].SUPPLIER_CUR,
	};
}

$(document).on("click", "#import-data-btn", async function () {
	$("#importouttooutfile").click();
});

$(document).on("change", "#importouttooutfile", async function (e) {
	try {
		//showLoader({ show: true });
		const fl = e.target.files;
		const data = await readInput(fl[0]);

		const header = await getDataHeader(data);
		const { detail, currency1, currency2 } = await getDataDetails(data);
		header.INQ_CUR = currency1;
		header.INQ_TCCUR = currency2;
		if (detail.length == 0) {
			await showMessage(`Something went wrong.`);
			return;
		}

		const chkInq = await getInquiry({
			INQ_NO: data[11][3],
			INQ_LATEST: 1,
		});
		if (chkInq.length > 0) {
			const confirmed = await showConfirm({
				title: "Duplicate Inquiry No.",
				message: `Inquiry No.: ${data[11][3]} already exists. Do you want to continue?`,
				btnConfirmText: "Yes, Continue",
				btnCancelText: "No, Cancel",
			});

			if (confirmed) {
				$("#inquiry-no").attr("readonly", true);
				$("body").append(
					`<input type="hidden" id="inquiry-id" value="${chkInq[0].INQ_ID}"/>`,
				);
				header.INQ_REV = await revisionCode(chkInq[0].INQ_REV);
			} else {
				$(this).val("");
				return;
			}
		}

		$(this).val("");
		$("#form-container").html(``);
		await setupCard(header);
		setDatePicker({ dayOff: true });
		const optDetail = await tableDetail(detail);
		table = await createTable(optDetail);
		$("#import-data-btn").remove();
		$("#savedata").removeClass("btn-disabled");
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
		return;
	} finally {
		await showLoader({ show: false });
	}
});

$(document).on("change", ".fccost ", async function () {
	const row = table.row($(this).closest("tr"));
	const data = row.data();
	const cost = isNaN(intVal($(this).val()))
		? data.INQD_FC_COST
		: intVal($(this).val());
	const price = await calPrice({
		...data,
		INQD_FC_COST: cost,
	});
	row.data({
		...data,
		INQD_FC_COST: cost,
		INQD_TC_COST: price.tccost,
		INQD_UNIT_PRICE: price.unitprice,
	});
	table.draw();
});

$(document).on("click", "#savedata", async function () {
	try {
		const details = table.rows().data().toArray();
		let chkPrice = true;
		details.map((el) => {
			if (intVal(el.INQD_FC_COST) == 0) chkPrice = false;
		});
		if (!chkPrice) {
			await showMessage(`Please check SPU Price again.`);
			return;
		}
		const revise = $("#revision").val() != "*" ? true : false;
		if (revise && $("#remark").val().trim() == "") {
			await showMessage(`Please enter Remark for revision.`);
			return;
		}
		const header = await getFormHeader();
		const timelinedata = await setTimelineData();
		const history = await setLogsData();
		const fomdata = {
			header: { ...header, INQ_STATUS: 99 },
			details,
			timelinedata,
			history,
		};

		if (revise)
			await updateInquiryHeader(
				{ INQ_LATEST: 0 },
				$("#inquiry-id").val(),
			);
		await activatedBtn($(this));
		const inqs = await createInquiry(fomdata);
		const quo = await createQuotation(await setQuotationData(inqs));
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
		return;
	} finally {
		//await activatedBtn($(this), false);
	}
});

async function setTimelineData() {
	return {
		INQ_NO: $("#inquiry-no").val(),
		INQ_REV: $("#revision").val(),
		MAR_USER: $("#user-login").attr("empno"),
		MAR_SEND: new Date(),
		QT_USER: $("#user-login").attr("empno"),
		QT_READ: new Date(),
		QT_CONFIRM: new Date(),
		BYPASS_SE: 1,
		BYPASS_DE: 1,
	};
}

async function setLogsData() {
	return {
		INQ_NO: $("#inquiry-no").val(),
		INQ_REV: $("#revision").val(),
		INQH_DATE: new Date(),
		INQH_USER: $("#user-login").attr("empno"),
		INQH_ACTION: 99,
		INQH_REMARK: $("#remark").val(),
	};
}

async function setQuotationData(data) {
	return {
		QUO_INQ: data.INQ_ID,
		QUO_REV: data.INQ_REV,
		QUO_DATE: new Date(),
		QUO_VALIDITY: dayjs().add(60, "day").toDate(),
		QUO_PIC: $("#user-login").attr("empno"),
		QUO_NOTE: $("#remark").val(),
		QUO_LATEST: 1,
	};
}
