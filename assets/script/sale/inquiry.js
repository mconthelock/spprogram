import "@amec/webasset/css/dataTable.min.css";

import { showLoader } from "@amec/webasset/preloader";
import { showMessage } from "@amec/webasset/utils";
import { currentUser } from "@amec/webasset/api/amec";
import { activatedBtnRow } from "@amec/webasset/components/buttons";
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
	await showLoader();
	const app = await initApp();
	if (!app) return;

	try {
		const data = await query();
		const tableOpt = await tableInquirySaleOption(data);
		table = await createTable(tableOpt);
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await showLoader({ show: false });
	}
});

async function query() {
	const pageid = $("#pageid").val();
	const q = {
		INQ_TYPE: "SP",
		INQ_STATUS: "< 20",
		IS_GROUP: 1,
		IS_TIMELINE: 1,
	};
	let data = await getInquiry(q);
	if (pageid == "1") {
		$("#page-title").text("Assign Sale Engineer");
		data = data.filter(
			(item) => item.INQ_STATUS > 1 && item.INQ_STATUS < 4,
		);
	} else {
		$("#page-title").text("Declare Inquiry List");
		const user = $("#user-login").attr("empno");
		data = data.filter(
			(item) => item.INQ_STATUS == 10 && item.timeline.SE_USER == user,
		);
	}
	return data;
}

$(document).on("click", ".process-btn", async function (e) {
	e.preventDefault();
	try {
		await activatedBtnRow($(this));
		const row = table.row($(this).closest("tr")).data();
		const timeline = row.timeline;
		const pageid = $("#pageid").val();
		if (pageid == "1" && timeline.SG_READ == null) {
			const data = {
				INQ_NO: row.INQ_NO,
				INQ_REV: row.INQ_REV,
				SG_READ: new Date(),
			};
			await updateInquiryTimeline(data);
		}
		if (pageid == "2" && timeline.SE_READ == null) {
			const data = {
				INQ_NO: row.INQ_NO,
				INQ_REV: row.INQ_REV,
				SE_READ: new Date(),
			};
			await updateInquiryTimeline(data);
		}
		window.location.replace(
			`${process.env.APP_ENV}/se/inquiry/detail/${row.INQ_ID}/${pageid}/`,
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
		await activatedBtnRow($(this));
		const pageid = $("#pageid").val();
		const q = {
			INQ_TYPE: "SP",
			INQ_STATUS: "< 20 ",
			IS_GROUP: 1,
			IS_TIMELINE: 1,
			IS_DETAILS: 1,
		};
		let data = await getInquiry(q);
		if (pageid == "1") {
			$("#page-title").text("Assign Sale Engineer");
			data = data.filter((item) => item.INQ_STATUS == 10);
		} else {
			$("#page-title").text("Declare Inquiry List");
			data = data.filter(
				(item) => item.INQ_STATUS > 10 && item.INQ_STATUS < 20,
			);
		}

		const sortData = data.sort((a, b) => a.INQ_ID - b.INQ_ID);
		let result = await dataExports(sortData);
		const template = await getTemplate(
			"export_inquiry_list_template_for_sale.xlsx",
		);
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
