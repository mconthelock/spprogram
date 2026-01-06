import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";
import { createTable } from "@amec/webasset/dataTable";
import { showbgLoader } from "@amec/webasset/preloader";
import { tableOpt } from "./table.js";
import * as service from "../service/inquiry.js";
import * as utils from "../utils.js";

var table;
$(document).ready(async () => {
	try {
		await utils.initApp({ submenu: ".navmenu-newinq" });
		const usergroup = $("#user-login").attr("groupcode");
		const q = {
			GE_INQ_STATUS: 2,
			LE_INQ_STATUS: 10,
		};
		let data = await service.getInquiry(q);
		localStorage.setItem("spinquiryquery", JSON.stringify(q));
		if (usergroup == "SEG") {
			data = data.filter((item) => item.INQ_STATUS < 10);
		} else {
			data = data.filter((item) => item.INQ_STATUS == 10);
		}
		const opt = await tableOpt(data);
		table = await createTable(opt);
	} catch (error) {
		console.log(error);
		await utils.errorMessage(error);
	} finally {
		await utils.showLoader({ show: false });
	}
});

$(document).on("click", ".btn-process", async function (e) {
	e.preventDefault();
	const row = table.row($(this).closest("tr")).data();
	const timeline = row.timeline;
	if (timeline.SG_READ == null) {
		const data = {
			INQ_NO: row.INQ_NO,
			INQ_REV: row.INQ_REV,
			SG_READ: new Date(),
		};
		await service.updateInquiryTimeline(data);
	}
	const url = $(this).attr("href");
	await showbgLoader(true);
	window.location.href = url;
});

$(document).on("click", ".btn-process", async function (e) {
	e.preventDefault();
	const row = table.row($(this).closest("tr")).data();
	const timeline = row.timeline;
	if (timeline.SG_READ == null) {
		const data = {
			INQ_NO: row.INQ_NO,
			INQ_REV: row.INQ_REV,
			SG_READ: new Date(),
		};
		await service.updateInquiryTimeline(data);
	}
	const url = $(this).attr("href");
	await showbgLoader(true);
	window.location.href = url;
});

$(document).on("click", ".btn-process-declare", async function (e) {
	e.preventDefault();
	const row = table.row($(this).closest("tr")).data();
	let data = {
		INQ_NO: row.INQ_NO,
		INQ_REV: row.INQ_REV,
	};
	const timeline = row.timeline;
	if (timeline.SG_READ == null) data = { ...data, SG_READ: new Date() };
	data = { ...data, SE_READ: new Date() };
	await service.updateInquiryTimeline(data);
	const url = $(this).attr("href");
	await showbgLoader(true);
	window.location.href = url;
});
