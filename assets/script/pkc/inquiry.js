import "@amec/webasset/css/dataTable.min.css";

import { showLoader } from "@amec/webasset/preloader";
import { showMessage } from "@amec/webasset/utils";
import { createTable } from "@amec/webasset/dataTable";
import { activatedBtn } from "@amec/webasset/components/buttons";
import { tableInquiryPKCOption } from "../inquiry/index.js";
import { getTemplate, exportExcel } from "../service/excel";
import {
	getInquiry,
	updateInquiryTimeline,
	dataExports,
	dataDetails,
} from "../service/inquiry.js";
import { initApp } from "../utils.js";

var table;
$(async function () {
	try {
		await showLoader();
		await initApp();
		const data = await getInquiry({
			INQ_STATUS: "< 80",
			INQ_PKC_REQ: "1",
			IS_TIMELINE: 1,
			timeline: {
				PKC_CONFIRM: "IS NULL",
			},
		});
		const opt = await tableInquiryPKCOption(data);
		table = await createTable(opt);
	} catch (error) {
		console.log(error);
		await showMessage(error);
	} finally {
		await showLoader({ show: false });
	}
});

$(document).on("click", ".process-btn", async function (e) {
	e.preventDefault();
	try {
		const data = table.row($(this).closest("tr")).data();
		if (data.timeline.PKC_READ == null) {
			await activatedBtn($(this));
			const timelines = {
				INQ_NO: data.INQ_NO,
				INQ_REV: data.INQ_REV,
				PKC_USER: $("#user-login").attr("empno"),
				PKC_READ: new Date(),
			};
			await updateInquiryTimeline(timelines);
		}
		window.location.replace(
			`${process.env.APP_ENV}/pkc/inquiry/detail/${data.INQ_ID}/`,
		);
	} catch (error) {
		console.log(error);
		await showMessage(error);
	}
});
