import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";
import { showConfirm, showMessage } from "@amec/webasset/utils";
import { setSelect2 } from "@amec/webasset/select2";
import { setDatePicker } from "@amec/webasset/flatpickr";
import { createTable } from "@amec/webasset/dataTable";
import { activatedBtnRow } from "@amec/webasset/components/buttons";
import { bindSearchReport } from "../inquiry/ui.js";
import {
	tableInquiryOption,
	setSeries,
	setOrderType,
	setTrader,
	setAgent,
	setCountry,
	setStatus,
	setReportButton,
} from "../inquiry/index.js";
import {
	getInquiry,
	dataDetails,
	getTemplate,
	exportExcel,
	deleteInquiry,
} from "../service/index.js";
import { dataExports } from "./data.js";
import { initApp } from "../utils.js";

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
		await bindSearchReport(createReportTable);
		$("#report-table").addClass("hidden");
		$("#form-container").removeClass("hidden");
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	}
});

async function createReportTable(formdata) {
	try {
		let data = await getInquiry({ ...formdata });
		data = data.map((item) => {
			return {
				...item,
				priority: [4, 27].includes(item.INQ_STATUS) ? 100 : 0,
			};
		});
		const opt = await tableInquiryOption(data, { back: true });
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
		const q = JSON.parse(localStorage.getItem("spinquiryquery") || "{}");
		const query = {
			...q,
			IS_DETAILS: true,
			IS_ORDERS: true,
			IS_TIMELINE: true,
			IS_FIN: true,
		};
		let data = await getInquiry(query);
		const template = await getTemplate(
			"export_inquiry_list_template_for_mar.xlsx",
		);
		let result = await dataExports(data);
		await exportExcel(result, template, {
			filename: "Inquiry List.xlsx",
			rowstart: 3,
		});
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await activatedBtnRow($(this), false);
	}
});

$(document).on("click", "#export2", async function (e) {
	e.preventDefault();
	try {
		await activatedBtnRow($(this));
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
		await showMessage(error.message || `Something went wrong.`);
	} finally {
		await activatedBtnRow($(this), false);
	}
});

$(document).on("click", ".delete-inquiry", async function (e) {
	e.preventDefault();
	const $btn = $(this);
	const $row = $btn.closest("tr");
	try {
		const data = table.row($row).data();
		const confirm = await showConfirm();
		if (confirm) {
			const val = await deleteInquiry({
				INQ_ID: data.INQ_ID,
				INQ_MAR_PIC: $("#user-login").attr("empno"),
				INQ_MAR_REMARK: "",
			});

			$row.css("background-color", "#ffcccc");
			$row.fadeOut(400, function () {
				table.row($row).remove().draw(false);
				showMessage(
					`Inquiry ${data.INQ_NO} has been deleted.`,
					"success",
				);
			});
		}
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	}
});
