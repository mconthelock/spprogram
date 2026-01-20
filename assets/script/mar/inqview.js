import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";
import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { showLoader } from "@amec/webasset/preloader";
import { createTable } from "@amec/webasset/dataTable";
import * as utils from "../utils.js";
import * as inqs from "../inquiry/detail.js";
import * as tb from "../inquiry/table.js";
import * as service from "../service/inquiry.js";
var table;
var tableAttach;
$(document).ready(async () => {
	try {
		await utils.initApp({ submenu: ".navmenu-newinq" });
		const inquiry = await service.getInquiryID($("#inquiry-id").val());
		if (inquiry.length == 0) throw new Error("Inquiry do not found");

		$("#inquiry-title").html(inquiry.INQ_NO);
		const cards = await inqs.setupCard(inquiry);
		const details = inquiry.details.filter((dt) => dt.INQD_LATEST == 1);
		const detail = await tb.setupTableDetailView(details);
		table = await createTable(detail);

		const logs = await service.getInquiryHistory(inquiry.INQ_NO);
		const history = await tb.setupTableHistory(logs);
		await createTable(history, { id: "#history" });

		const file = await service.getInquiryFile({ INQ_NO: inquiry.INQ_NO });
		const attachment = await tb.setupTableAttachment(file, true);
		tableAttach = await createTable(attachment, { id: "#attachment" });
		const btn = await setupButton();
	} catch (error) {
		await showErrorMessage(`Something went wrong.`, "2036");
		return;
	} finally {
		await showLoader({ show: false });
	}
});

async function setupButton() {
	const exportfile = await creatBtn({
		id: "export-detail",
		title: "Export",
		icon: "fi fi-tr-file-excel text-xl",
		className: "btn-neutral text-white hover:shadow-lg hover:bg-neutral/70",
	});

	const back = await creatBtn({
		id: "goback",
		title: "Back",
		type: "link",
		href: `${process.env.APP_ENV}/mar/inquiry`,
		icon: "fi fi-rr-arrow-circle-left text-xl",
		className:
			"btn-outline btn-neutral text-neutral hover:text-white hover:bg-neutral/70",
	});
	$("#btn-container").append(exportfile, back);
}
