import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";
import select2 from "select2";
import { setDatePicker } from "@amec/webasset/flatpickr";
import { setSelect2 } from "@amec/webasset/select2";
import { showLoader } from "@amec/webasset/preloader";
import { showMessage } from "@amec/webasset/utils";
import { createTable } from "@amec/webasset/dataTable";
import { activatedBtnRow } from "@amec/webasset/components/buttons";
import {
	tableInquirySaleOption,
	setSeries,
	setOrderType,
	setTrader,
	setAgent,
	setCountry,
	setStatus,
	setSaleEngineer,
	setReportButton,
} from "../inquiry/index.js";
import { getInquiry, getTemplate, exportExcel } from "../service/index.js";
import { dataExports } from "./data.js";
import { bindSearchReport } from "../inquiry/ui.js";
import { initApp } from "../utils.js";
select2();

var table;
$(async function () {
	try {
		await initApp();
		await setSeries();
		await setOrderType();
		await setTrader();
		await setAgent();
		await setCountry();
		await setStatus();
		await setSaleEngineer();
		await setDatePicker();
		await setSelect2({ allowClear: false });
		await setReportButton();
		await bindSearchReport(createReportTable);
		$("#report-table").addClass("hidden");
		$("#form-container").removeClass("hidden");
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await showLoader({ show: false });
	}
});

async function createReportTable(formdata) {
	try {
		let data = await getInquiry(formdata);
		const opt = await tableInquirySaleOption(data, { back: true });
		table = await createTable(opt);
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	}
}

$(document).on("click", "#export1", async function (e) {
	e.preventDefault();
	try {
		await activatedBtnRow($(this));
		const template = await getTemplate(
			"export_inquiry_list_template_for_sale.xlsx",
		);
		const q = JSON.parse(localStorage.getItem("spinquiryquery") || "{}");
		const query = {
			...q,
			INQ_TYPE: "SP",
			IS_TIMELINE: true,
			IS_DETAILS: true,
		};
		let data = await getInquiry(query);
		const sortData = data.sort((a, b) => a.INQ_DATE - b.INQ_DATE);
		let result = await dataExports(sortData);
		await exportExcel(result, template, {
			filename: "Inquiry List.xlsx",
		});
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await activatedBtnRow($(this), false);
	}
});
