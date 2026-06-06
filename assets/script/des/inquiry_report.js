import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";
import select2 from "select2";
import { setDatePicker } from "@amec/webasset/flatpickr";
import { setSelect2 } from "@amec/webasset/select2";
import { showLoader } from "@amec/webasset/preloader";
import { currentUser } from "@amec/webasset/api/amec";
import { showMessage } from "@amec/webasset/utils";
import { createTable } from "@amec/webasset/dataTable";
import { activatedBtnRow } from "@amec/webasset/components/buttons";
import {
	tableInquiryDEOption,
	setSeries,
	setOrderType,
	setTrader,
	setAgent,
	setCountry,
	setStatus,
	setDesignLeader,
	setDesigner,
	setDesignChecker,
	setReportButton,
} from "../inquiry/index.js";
import { getInquiry, getTemplate, exportExcel } from "../service/index.js";
import { bindSearchReport } from "../inquiry/ui.js";
import { initApp } from "../utils.js";
import { getDesigner, dataExports } from "./data.js";

select2();
var table;
$(async function () {
	await showLoader();
	await initApp();
	try {
		await setSeries();
		await setOrderType();
		await setTrader();
		await setAgent();
		await setCountry();
		await setStatus();
		await setDesignLeader();
		await setDesigner();
		await setDesignChecker();
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
		const user = await currentUser();
		const usrgroup = user.group;
		const des = await getDesigner();
		const desgroup = des.find((d) => d.DES_USER == user.empno).DES_GROUP;

		const data = await getInquiry({ ...formdata, INQ_TYPE: "SP" });
		const result = data.filter((d) => {
			return d.inqgroup.some(
				(g) => g.INQG_GROUP == desgroup && g.INQG_LATEST == 1,
			);
		});

		const opt = await tableInquiryDEOption(result, { back: true });
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

$(document).on("click", ".process-btn", async function (e) {
	e.preventDefault();
	try {
		const user = await currentUser();
		const group = user.group;
		const row = table.row($(this).closest("tr")).data();
		// console.log(row);
		// const timeline = row.timeline;
		// if (timeline.DE_READ == null) {
		// 	await activatedBtnRow($(this));
		// 	const data = {
		// 		INQ_NO: row.INQ_NO,
		// 		INQ_REV: row.INQ_REV,
		// 		DE_READ: new Date(),
		// 	};
		// 	await updateInquiryTimeline(data);
		// }
		window.location.replace(
			`${process.env.APP_ENV}/des/inquiry/detail/${row.INQ_ID}/`,
		);
	} catch (error) {
		console.log(error);
		await showMessage(error);
		await activatedBtn($(this), false);
	}
});
