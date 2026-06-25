import "@amec/webasset/css/dataTable.min.css";
import dayjs from "dayjs";
import { showLoader } from "@amec/webasset/preloader";
import { showMessage, intVal } from "@amec/webasset/utils";
import { currentUser } from "@amec/webasset/api/amec";
import { createTable } from "@amec/webasset/dataTable";
import { activatedBtnRow } from "@amec/webasset/components/buttons";
import { tableInquiryFinOption } from "../inquiry/index.js";
import {
	getInquiry,
	updateInquiryHeader,
	updateInquiryTimeline,
	createInquiryHistory,
	getTemplate,
	exportExcel,
} from "../service/index.js";
import { dataFilter, dataExports, finApproveStatus } from "./data.js";
import { initApp } from "../utils.js";

var table;
$(async function () {
	try {
		await showLoader();
		const app = await initApp();
		if (!app) return;

		const pageid = $("#pageid").val() || "1";
		let q = {
			INQ_STATUS: ">= 30 && < 45",
			IS_TIMELINE: 1,
		};
		if (pageid == "3") q = { ...q, IS_DETAILS: 1 };
		let data = await getInquiry(q);
		data = await dataFilter(data, pageid);
		const opt = await tableInquiryFinOption(data);
		const sel = {
			columnSelect: {
				status: true,
				class: "w-[50px]! max-w-[50px]! px-[10px]!",
			},
		};
		table = await createTable(opt, pageid == "3" ? sel : {});
		localStorage.setItem("spinquiryquery", JSON.stringify(q));
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await showLoader({ show: false });
	}
});

$(document).on("change", ".quick-remark", async function (e) {
	e.preventDefault();
	const data = table.row($(this).closest("tr")).data();
	const remark = $(this).val();
	const load = $(this).siblings(".quick-remark-load");
	try {
		load.removeClass("hidden");
		const inq = await updateInquiryHeader(
			{
				INQ_FIN_REMARK: remark,
				INQ_LATEST: 1,
				INQ_NO: data.INQ_NO,
				INQ_STATUS: 40,
			},
			data.INQ_ID,
		);
		table.row($(this).closest("tr")).data(inq).draw(false);
		const logs = {
			INQ_NO: data.INQ_NO,
			INQ_REV: data.INQ_REV,
			INQH_USER: $("#user-login").attr("empno"),
			INQH_ACTION: 40,
			INQH_LATEST: 1,
			INQH_DATE: new Date(),
			INQH_REMARK: remark,
		};
		await createInquiryHistory(logs);
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		load.addClass("hidden");
	}
});

$(document).on("click", ".process-btn", async function (e) {
	e.preventDefault();
	try {
		const row = table.row($(this).closest("tr")).data();
		const timeline = row.timeline;
		// console.log(timeline);
		const user = await currentUser();
		const group = user.group;
		let datatimeline = {
			INQ_NO: row.INQ_NO,
			INQ_REV: row.INQ_REV,
		};
		const pageid = intVal($("#pageid").val()) || 1;
		if (pageid == 1 && timeline.FIN_READ == null) {
			datatimeline = {
				...datatimeline,
				FIN_USER: $("#user-login").attr("empno"),
				FIN_READ: dayjs().format("YYYY-MM-DD HH:mm:ss"),
			};
		}

		if (pageid == 2 && timeline.FCK_READ == null) {
			datatimeline = {
				...datatimeline,
				FCK_USER: $("#user-login").attr("empno"),
				FCK_READ: dayjs().format("YYYY-MM-DD HH:mm:ss"),
			};
		}

		if (pageid == 3 && timeline.FMN_READ == null) {
			datatimeline = {
				...datatimeline,
				FMN_USER: $("#user-login").attr("empno"),
				FMN_READ: dayjs().format("YYYY-MM-DD HH:mm:ss"),
			};
		}
		await updateInquiryTimeline(datatimeline);
		window.location.href = `${process.env.APP_ENV}/fin/inquiry/detail/${row.INQ_ID}/${pageid}/`;
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
		const template = await getTemplate(
			"export_inquiry_list_template_for_fin.xlsx",
		);
		const pageid = $("#pageid").val() || "1";
		const q = JSON.parse(localStorage.getItem("spinquiryquery") || "{}");
		let data = await getInquiry(q);
		data = await dataFilter(data, pageid);
		const sortData = data.sort((a, b) => a.INQ_ID - b.INQ_ID);
		let result = await dataExports(sortData);
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

$(document).on("click", ".approval", async function (e) {
	e.preventDefault();
	const action = $(this).attr("data-action");
	let status = action;
	try {
		const data = table
			.rows()
			.data()
			.toArray()
			.filter((row) => row.selected === true);
		if (data.length === 0) {
			await showMessage("Please select at least one item.");
			return;
		}
		await activatedBtnRow($(this));
		for (const row of data) {
			if (action == "45") status = await finApproveStatus(row.details);
			await updateInquiryHeader(
				{ INQ_STATUS: status, INQ_LATEST: 1, INQ_NO: row.INQ_NO },
				row.INQ_ID,
			);
			let datatimeline = {
				INQ_NO: row.INQ_NO,
				INQ_REV: row.INQ_REV,
				FMN_CONFIRM: dayjs().format("YYYY-MM-DD HH:mm:ss"),
			};
			await updateInquiryTimeline(datatimeline);
			const history = {
				INQ_NO: row.INQ_NO,
				INQ_REV: row.INQ_REV,
				INQH_DATE: new Date(),
				INQH_USER: $("#user-login").attr("empno"),
				INQH_ACTION: action,
				INQH_LATEST: 1,
			};
			await createInquiryHistory(history);
		}
		window.location.reload();
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
		await activatedBtnRow($(this), false);
	}
});
