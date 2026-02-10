import "@amec/webasset/css/dataTable.min.css";
import dayjs from "dayjs";
import { showLoader } from "@amec/webasset/preloader";
import { showMessage } from "@amec/webasset/utils";
import { createTable } from "@amec/webasset/dataTable";
// import * as inqs from "../inquiry/detail.js";
// import * as tb from "../inquiry/table.js";
// import * as service from "../service/inquiry.js";
import {
	setupCard,
	setupTableHistory,
	setupTableAttachment,
	setupPartViewDetail,
} from "../inquiry/index.js";
import {
	getInquiry,
	getInquiryHistory,
	getInquiryFile,
	dataExports,
	dataDetails,
} from "../service/inquiry.js";
import { initApp } from "../utils.js";

var table;
var tableAttach;
$(document).ready(async () => {
	try {
		await showLoader();
		await initApp({ submenu: ".navmenu-newinq" });
		const inq = await getInquiry({
			INQ_ID: $("#inquiry-id").val(),
			IS_DETAILS: true,
		});
		if (inq.length == 0) throw new Error("Inquiry do not found");
		inq[0].INQ_DATE = dayjs(inq[0].INQ_DATE).format("YYYY-MM-DD");
		$("#inquiry-title").html(inq[0].INQ_NO);
		const card = await setupCard(inq[0]);
		const details = inq[0].details.filter((dt) => dt.INQD_LATEST == 1);
		const partTable = await setupPartViewDetail(details);
		table = await createTable(partTable);

		//Inquiry History
		const logs = await getInquiryHistory(inq[0].INQ_NO);
		const history = await setupTableHistory(logs);
		await createTable(history, { id: "#history" });

		const file = await getInquiryFile({ INQ_NO: inq[0].INQ_NO });
		const attachment = await setupTableAttachment(file, true);
		tableAttach = await createTable(attachment, { id: "#attachment" });
		// const btn = await setupButton();
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
		return;
	} finally {
		await showLoader({ show: false });
	}
});

async function setupButton() {
	const exportfile = await createBtn({
		id: "export-detail",
		title: "Export",
		icon: "fi fi-tr-file-excel text-xl",
		className: "btn-neutral text-white hover:shadow-lg hover:bg-neutral/70",
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
	$("#btn-container").append(exportfile, back);
}
