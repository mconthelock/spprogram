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
	tableInquiryFinOption,
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
import { dataExports, dataFilter } from "./data.js";
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

		const actionid = $("#actionid").val() || "1";
		const loc = localStorage.getItem("spinquiryquery");
		if (actionid == "2" && loc) {
			$("#search").trigger("click");
		} else {
			$("#actionid").val("1");
			$("#report-table").addClass("hidden");
			$("#form-container").removeClass("hidden");
		}
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await showLoader({ show: false });
	}
});

async function createReportTable(formdata) {
	try {
		let data = await getInquiry({ ...formdata, IS_TIMELINE: 1 });
		data = data.filter((el) => {
			if (
				(el.INQ_TYPE == "SP" || el.INQ_TYPE == "Price") &&
				el.INQ_STATUS >= 30
			)
				return el;
		});
		const opt = await tableInquiryFinOption(data, { back: true });
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
		const pageid = $("#pageid").val() || "5";
		const template = await getTemplate(
			"export_inquiry_list_template_for_sale.xlsx",
		);
		let q = JSON.parse(localStorage.getItem("spinquiryquery") || "{}");
		q = { ...q, IS_TIMELINE: 1, IS_DETAILS: 1 };
		let data = await getInquiry(q);
		data = await dataFilter(data, pageid);
		const sortData = data.sort((a, b) => a.INQ_ID - b.INQ_ID);
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
