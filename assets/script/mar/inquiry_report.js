import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";

import select2 from "select2";
import { showLoader } from "@amec/webasset/preloader";
import { showMessage } from "@amec/webasset/utils";
import { setSelect2 } from "@amec/webasset/select2";
import { setDatePicker } from "@amec/webasset/flatpickr";
import { createTable, destroyTable } from "@amec/webasset/dataTable";
import { activatedBtn } from "@amec/webasset/components/buttons";
import {
	tableInquiryOption,
	setSeries,
	setOrderType,
	setTrader,
	setAgent,
	setCountry,
	setStatus,
	setReportButton,
	getFormHeader,
	getSearchHeader,
} from "../inquiry/index.js";
import { getTemplate, exportExcel } from "../service/excel";
import { getInquiry, dataExports, dataDetails } from "../service/inquiry.js";
import { initApp } from "../utils.js";
select2();

var table;
$(async function () {
	try {
		await initApp({ submenu: ".navmenu-newinq" });
		await setSeries();
		await setOrderType();
		await setTrader();
		await setAgent();
		await setCountry();
		await setStatus();
		await setDatePicker();
		await setSelect2({ allowClear: false });
		await setReportButton();
		$("#form-container").removeClass("hidden");
	} catch (error) {
		console.log(error);
		await showMessage(error);
	} finally {
		await showLoader({ show: false });
	}
});

$(document).on("click", "#reset-report", async function (e) {
	e.preventDefault();
	$("#form-container").find("select").val("").trigger("change");
	$("#form-container").find("input").val("");
	localStorage.removeItem("spinquiryquery");
});

$(document).on("click", "#back-report", async function (e) {
	e.preventDefault();
	await destroyTable();
	$("#form-container").removeClass("hidden");
	localStorage.removeItem("spinquiryquery");
});

$(document).on("click", "#search", async function (e) {
	e.preventDefault();
	try {
		await activatedBtn($(this));
		let formdata = await getFormHeader();
		Object.keys(formdata).forEach(
			(key) => formdata[key] == "" && delete formdata[key],
		);
		if (Object.keys(formdata).length == 0) {
			await showMessage("Please select at least one filter criteria.");
			return;
		}
		formdata = await getSearchHeader(formdata);
		let data = await getInquiry(formdata);
		data = data.map((el) => {
			el.priority = [4, 27].includes(el.INQ_STATUS) ? 100 : 0;
			return el;
		});
		const table_option = await tableInquiryOption(data, {
			new: false,
			back: true,
		});
		await createTable(table_option);
		$("#form-container").addClass("hidden");
		$("#table").removeClass("hidden");
		localStorage.setItem("spinquiryquery", JSON.stringify(formdata));
	} catch (error) {
		console.log(error);
		await showMessage(error);
	} finally {
		await activatedBtn($(this), false);
	}
});

$(document).on("click", "#export1", async function (e) {
	e.preventDefault();
	try {
		await activatedBtn($(this));
		const q = JSON.parse(localStorage.getItem("spinquiryquery") || "{}");
		const query = {
			...q,
			IS_DETAILS: true,
			IS_ORDERS: true,
			IS_TIMELINE: true,
			IS_FIN: true,
		};
		let data = await getInquiry(query);
		const template = await getTemplate("export_inquiry_list.xlsx");
		if ($("#pageid").val() == "2") data = await prebmdata(data);
		const sortData = data.sort((a, b) => a.INQ_ID - b.INQ_ID);
		let result = await dataExports(sortData);
		await exportExcel(result, template, {
			filename: "Inquiry List.xlsx",
			rowstart: 3,
		});
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await activatedBtn($(this), false);
	}
});

$(document).on("click", "#export2", async function (e) {
	e.preventDefault();
	try {
		await activatedBtn($(this));
		const q = JSON.parse(localStorage.getItem("spinquiryquery") || "{}");
		const query = {
			...q,
			IS_DETAILS: true,
			IS_ORDERS: true,
			IS_TIMELINE: true,
		};
		let data = await getInquiry(query);
		if ($("#pageid").val() == "2") data = await prebmdata(data);
		const result = await dataDetails(data);
		const template = await getTemplate("export_inquiry_list_detail.xlsx");
		await exportExcel(result, template, {
			filename: "Inquiry Detail List.xlsx",
			rowstart: 3,
		});
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await activatedBtn($(this), false);
	}
});
