import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";

import dayjs from "dayjs";
import { showLoader } from "@amec/webasset/preloader";
import { showMessage, intVal, showDigits } from "@amec/webasset/utils";
import { currentUser } from "@amec/webasset/api/amec";
import { setSelect2 } from "@amec/webasset/select2";
import { createBtn, activatedBtn } from "@amec/webasset/components/buttons";
import { createTable } from "@amec/webasset/dataTable";
import {
	setupCard,
	setupTableHistory,
	setupTableAttachment,
	setupSaleViewDetail,
} from "../inquiry/index.js";
import {
	getInquiry,
	getInquiryHistory,
	getInquiryFile,
} from "../service/index.js";
import { initApp } from "../utils.js";

var table;
$(document).ready(async () => {
	try {
		await showLoader();
		await initApp();
		const user = await currentUser();
		const usrgroup = user.group;
		const inqs = await getInquiry({
			INQ_ID: $("#inquiry-id").val(),
			IS_DETAILS: true,
			IS_TIMELINE: true,
		});

		let setime = {
			SALE_CLASS: inqs[0].timeline.SALE_CLASS,
			SG_USER: inqs[0].timeline.SG_USER,
			SG_READ: inqs[0].timeline.SG_READ,
			SG_CONFIRM: inqs[0].timeline.SG_CONFIRM,
			SE_USER: inqs[0].timeline.SE_USER,
			SE_READ: inqs[0].timeline.SE_READ,
			SE_CONFIRM: inqs[0].timeline.SE_CONFIRM,
		};
		inqs[0] = { ...inqs[0], ...setime };
		inqs[0].INQ_DATE = dayjs(inqs[0].INQ_DATE).format("YYYY-MM-DD");

		const cards = await setupCard(inqs[0]);
		$("#remark").closest(".grid").addClass("hidden");

		const details = inqs[0].details.filter((dt) => dt.INQD_LATEST == "1");
		const detailsOption = await setupSaleViewDetail(details);
		table = await createTable(detailsOption);
		//Inquiry History and Attachment
		const logs = await getInquiryHistory(inqs[0].INQ_NO);
		const file = await getInquiryFile({ INQ_NO: inqs[0].INQ_NO });
		const history = await setupTableHistory(logs);
		const tableHistory = await createTable(history, { id: "#history" });
		const attachment = await setupTableAttachment(file, true);
		const tableAttach = await createTable(attachment, {
			id: "#attachment",
		});

		await setupButton();
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await showLoader({ show: false });
	}
});

async function setupButton() {
	const exportxls = await createBtn({
		id: "export-detail",
		title: "Export to Excel",
		icon: "fi fi-sr-file-excel text-xl",
		className: `btn-accent text-white hover:shadow-lg `,
	});

	const back = await createBtn({
		id: "back",
		title: "Back",
		type: "link",
		href: `${process.env.APP_ENV}/se/inquiry`,
		icon: "fi fi-rr-arrow-circle-left text-xl",
		className: `btn-outline btn-accent text-accent hover:text-white`,
	});
	$("#btn-container").append(exportxls, back);
}
