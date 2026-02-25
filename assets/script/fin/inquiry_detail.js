import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";

import dayjs from "dayjs";
import { showLoader } from "@amec/webasset/preloader";
import { showMessage, showDigits, intVal } from "@amec/webasset/utils";
import { createTable } from "@amec/webasset/dataTable";
import { createBtn, activatedBtnRow } from "@amec/webasset/components/buttons";
import { readInput } from "@amec/webasset/excel";
import { initApp } from "../utils.js";
import {
	setupTableHistory,
	setupTableAttachment,
	setupCard,
} from "../inquiry/index.js";
import { tableCostOption, tableViewCostOption } from "../quotation/index.js";
import {
	getInquiry,
	getInquiryHistory,
	getInquiryFile,
	updateInquiry,
} from "../service/index.js";

var table;
$(async function () {
	try {
		await showLoader({ show: true });
		await initApp();
		const pageid = $("#page-id").val() || "4";
		const inq = await getInquiry({
			INQ_ID: $("#inquiry-id").val(),
			IS_DETAILS: true,
			IS_TIMELINE: true,
		});
		if (inq.length == 0) throw new Error("Inquiry do not found");
		inq[0].INQ_DATE = dayjs(inq[0].INQ_DATE).format("YYYY-MM-DD");
		$("#inquiry-title").html(`${inq[0].INQ_NO}`);
		$("#fin-confirm-date").val(
			inq[0].timeline?.FIN_CONFIRM
				? dayjs(inq[0].timeline.FIN_CONFIRM).format(
						"YYYY-MM-DD HH:mm:ss",
					)
				: "",
		);
		$("#fck-confirm-date").val(
			inq[0].timeline?.FCK_CONFIRM
				? dayjs(inq[0].timeline.FCK_CONFIRM).format(
						"YYYY-MM-DD HH:mm:ss",
					)
				: "",
		);
		$("#fmn-confirm-date").val(
			inq[0].timeline?.FMN_CONFIRM
				? dayjs(inq[0].timeline.FMN_CONFIRM).format(
						"YYYY-MM-DD HH:mm:ss",
					)
				: "",
		);
		const card = await setupCard(inq[0]);
		let optDetail;
		if (pageid == 1) optDetail = await tableCostOption(inq[0].details);
		else optDetail = await tableViewCostOption(inq[0].details);
		table = await createTable(optDetail);

		//Inquiry History
		const logs = await getInquiryHistory(inq[0].INQ_NO);
		const history = await setupTableHistory(logs);
		await createTable(history, { id: "#history" });

		const file = await getInquiryFile({ INQ_NO: inq[0].INQ_NO });
		const attachment = await setupTableAttachment(file, true);
		const tableAttach = await createTable(attachment, {
			id: "#attachment",
		});
		await setupButton(pageid);
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
		return;
	} finally {
		await showLoader({ show: false });
	}
});

async function setupButton(pageid) {
	const back = {
		id: "back-link",
		title: "Back",
		type: "link",
		icon: "fi fi-rr-arrow-circle-left text-xl",
		className: `btn-outline btn-accent text-accent hover:text-white`,
	};
	switch (pageid) {
		case "1":
			const saveBtn = await createBtn({
				id: "save-btn",
				title: "Confirm",
				className: `btn-primary text-white fin-confirm-btn`,
				other: "data-action='43'",
			});
			const importBtn = await createBtn({
				id: "import-btn",
				title: "Import",
				icon: "fi fi-rr-cloud-upload-alt text-2xl",
				className: `btn-accent text-white`,
			});

			const returnMar = await createBtn({
				id: "return-btn",
				title: "Return",
				icon: "fi fi-br-undo text-xl",
				className: `btn-error text-white fin-confirm-btn`,
				other: "data-action='39'",
			});

			const backBtn = await createBtn({
				...back,
				href: `${process.env.APP_ENV}/fin/inquiry`,
			});
			const importInt = `<input type="file" id="import-file" class="hidden" accept=".xlsx, .xls"/>`;

			$("#btn-container").append(
				saveBtn,
				importBtn,
				importInt,
				returnMar,
				backBtn,
			);
			break;
		case "2":
			const confirmBtn = await createBtn({
				id: "check-btn",
				title: "Confirm",
				className: `btn-primary text-white! fin-confirm-btn`,
				other: "data-action='44'",
			});
			const returnBtn = await createBtn({
				id: "return-btn",
				title: "Return",
				icon: "fi fi-br-undo text-xl",
				className: `btn-error text-white fin-confirm-btn`,
				other: "data-action='41'",
			});
			const backChecker = await createBtn({
				...back,
				href: `${process.env.APP_ENV}/fin/inquiry/index/2`,
			});
			$("#btn-container").append(confirmBtn, returnBtn, backChecker);
			break;
		case "3":
			const approve = await createBtn({
				id: "approve-btn",
				title: "Approve",
				className: `btn-error text-white fin-confirm-btn`,
				other: "data-action='45'",
			});
			const reject = await createBtn({
				id: "reject-btn",
				title: "Reject",
				className: `btn-error text-white fin-confirm-btn`,
				other: "data-action='42'",
			});
			const backMan = await createBtn({
				...back,
				href: `${process.env.APP_ENV}/fin/inquiry/index/3`,
			});
			$("#btn-container").append(approve, reject, backMan);
			break;
		case "4":
			const show = await createBtn({
				id: "export-detail-fin",
				title: "Export to Excel",
				icon: "fi fi-sr-file-excel text-xl",
				className: `btn-accent text-white hover:shadow-lg `,
			});
			const backView = await createBtn({
				...back,
				href: `${process.env.APP_ENV}/fin/inquiry/index/4`,
			});
			$("#btn-container").append(show, backView);
			break;
		default:
			const showreport = await createBtn({
				id: "export-detail-fin",
				title: "Export to Excel",
				icon: "fi fi-sr-file-excel text-xl",
				className: `btn-accent text-white hover:shadow-lg `,
			});
			const backDefault = await createBtn({
				...back,
				href: `${process.env.APP_ENV}/fin/inquiry/report/2/`,
			});
			$("#btn-container").append(showreport, backDefault);
			break;
	}
}

$(document).on("change", ".inqprice", async function () {
	const row = table.row($(this).closest("tr")).data();
	const tr = $(this).closest("tr");
	const fccost = intVal(tr.find(".fccost").val());
	const fcbase = intVal(tr.find(".fcbase").val());
	const tccost = Math.ceil(fccost * fcbase);
	const unitprice = Math.ceil(tccost * row.INQD_TC_BASE);
	const data = {
		...row,
		INQD_FC_COST: fccost,
		INQD_FC_BASE: fcbase,
		INQD_TC_COST: tccost,
		INQD_UNIT_PRICE: unitprice,
	};
	table.row($(this).closest("tr")).data(data).draw();
});

$(document).on("change", "#fcbase-all", async function (e) {
	e.preventDefault();
	const fcbase = intVal($(this).val());
	const details = table.rows().data().toArray();
	details.map((el, index) => {
		const data = {
			...el,
			INQD_FC_BASE: fcbase,
			INQD_TC_COST: Math.ceil(el.INQD_FC_COST * fcbase),
			INQD_UNIT_PRICE: Math.ceil(
				Math.ceil(el.INQD_FC_COST * fcbase) * el.INQD_TC_BASE,
			),
		};
		table.row(index).data(data).draw();
	});
});

$(document).on("click", "#import-btn", async function (e) {
	e.preventDefault();
	$("#import-file").trigger("click");
});

$(document).on("change", "#import-file", async function (e) {
	const file = e.target.files[0];
	const excelData = await readInput(file, { startRow: 2, endCol: 3 });
	for (const key in excelData) {
		const row = table.row(key).data();
		if (row) {
			const fccost = excelData[key][1];
			const remark = excelData[key][2] == "" ? null : excelData[key][2];
			const tccost = Math.ceil(fccost * row.INQD_FC_BASE);
			const data = {
				...row,
				INQD_FC_COST: fccost,
				INQD_TC_COST: tccost,
				INQD_UNIT_PRICE: Math.ceil(tccost * row.INQD_TC_BASE),
				INQD_FIN_REMARK: remark,
			};
			table.row(key).data(data).draw();
		}
	}
});

$(document).on("click", ".fin-confirm-btn", async function (e) {
	e.preventDefault();
	try {
		await activatedBtnRow($(this));
		const pageid = $("#page-id").val() || "4";
		const action = intVal($(this).attr("data-action"));
		const timeline = {
			FIN_CONFIRM:
				action == 43 ? new Date() : $("#fin-confirm-date").val(),
			FCK_CONFIRM:
				action == 44 ? new Date() : $("#fck-confirm-date").val(),
			FMN_CONFIRM:
				action == 45 ? new Date() : $("#fmn-confirm-date").val(),
		};
		const inquiry = await updatePath({
			status: action,
			timeline: timeline,
		});
		return;
		window.location.replace(
			`${process.env.APP_ENV}/fin/inquiry/show/${inquiry.INQ_ID}/${pageid}/`,
		);
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
		return;
	} finally {
		await activatedBtnRow($(this), false);
	}
});

async function updatePath(opt) {
	try {
		const header = {
			INQ_ID: $("#inquiry-id").val(),
			INQ_NO: $("#inquiry-no").val(),
			INQ_REV: $("#revision").val(),
			INQ_STATUS: opt.status,
		};
		const details = table.rows().data().toArray();
		const timelinedata = {
			...opt.timeline,
			INQ_NO: $("#inquiry-no").val(),
			INQ_REV: $("#revision").val(),
		};
		const history = {
			INQ_NO: $("#inquiry-no").val(),
			INQ_REV: $("#revision").val(),
			INQH_DATE: new Date(),
			INQH_USER: $("#user-login").attr("empno"),
			INQH_ACTION: opt.status,
			INQH_REMARK: $("#remark").val(),
		};
		const fomdata = {
			header,
			details,
			deleteLine: [],
			deleteFile: [],
			timelinedata,
			history,
		};
		return await updateInquiry(fomdata);
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
		return;
	} finally {
		await showLoader({ show: false });
	}
}
