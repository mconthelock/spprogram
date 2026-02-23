import "@amec/webasset/css/dataTable.min.css";

import { showLoader } from "@amec/webasset/preloader";
import { showMessage } from "@amec/webasset/utils";
import { currentUser } from "@amec/webasset/api/amec";
import { activatedBtn } from "@amec/webasset/components/buttons";
import { createTable } from "@amec/webasset/dataTable";
import { tableInquirySaleOption } from "../inquiry/index.js";
import {
	getInquiry,
	updateInquiryTimeline,
	getTemplate,
	exportExcel,
} from "../service/index.js";
import { dataExports } from "./data.js";
import { initApp } from "../utils.js";

var table;
$(document).ready(async () => {
	try {
		await showLoader();
		await initApp({ submenu: ".navmenu-newinq" });
		const usergroup = $("#user-login").attr("groupcode");
		const q = {
			INQ_STATUS: "<= 10",
			IS_GROUP: 1,
			IS_TIMELINE: 1,
		};
		let data = await getInquiry(q);
		if (usergroup == "SLE") {
			data = data.filter((item) => item.INQ_STATUS == 10);
		} else {
			data = data.filter(
				(item) => item.INQ_STATUS < 10 && item.INQ_STATUS != 4,
			);
		}
		const opt = await tableInquirySaleOption(data);
		table = await createTable(opt);
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await showLoader({ show: false });
	}
});

$(document).on("click", ".process-btn", async function (e) {
	e.preventDefault();
	try {
		const row = table.row($(this).closest("tr")).data();
		const timeline = row.timeline;
		const user = await currentUser();
		const group = user.group;
		if (group == "SLG" && timeline.SG_READ == null) {
			await activatedBtn($(this));
			const data = {
				INQ_NO: row.INQ_NO,
				INQ_REV: row.INQ_REV,
				SG_USER: $("#user-login").attr("empno"),
				SG_READ: new Date(),
			};
			await updateInquiryTimeline(data);
		} else if (group == "SLE" && timeline.SE_READ == null) {
			await activatedBtn($(this));
			const data = {
				INQ_NO: row.INQ_NO,
				INQ_REV: row.INQ_REV,
				SE_READ: new Date(),
			};
			await updateInquiryTimeline(data);
		}
		window.location.replace(
			`${process.env.APP_ENV}/se/inquiry/detail/${row.INQ_ID}/`,
		);
	} catch (error) {
		console.log(error);
		await showMessage(error);
		await activatedBtn($(this), false);
	}
});

$(document).on("click", "#export1", async function (e) {
	e.preventDefault();
	try {
		await activatedBtn($(this));
		const usergroup = $("#user-login").attr("groupcode");
		const template = await getTemplate(
			"export_inquiry_list_template_for_sale.xlsx",
		);
		const q = {
			INQ_STATUS: "<= 10",
			IS_GROUP: 1,
			IS_TIMELINE: 1,
			IS_DETAILS: 1,
		};
		let data = await getInquiry(q);
		if (usergroup == "SLE") {
			data = data.filter((item) => item.INQ_STATUS == 10);
		} else {
			data = data.filter(
				(item) => item.INQ_STATUS < 10 && item.INQ_STATUS != 4,
			);
		}
		const sortData = data.sort((a, b) => a.INQ_ID - b.INQ_ID);
		let result = await dataExports(sortData);
		await exportExcel(result, template, {
			filename: "Inquiry List.xlsx",
		});
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await activatedBtn($(this), false);
	}
});
