import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";
import dayjs from "dayjs";

import { showLoader } from "@amec/webasset/preloader";
import { showMessage, intVal, showDigits } from "@amec/webasset/utils";
import { setSelect2 } from "@amec/webasset/select2";
import { createBtn, activatedBtn } from "@amec/webasset/components/buttons";
import { createTable } from "@amec/webasset/dataTable";
import {
	setupCard,
	setupTableHistory,
	setupTableAttachment,
	setupSaleTableDetail,
	createReasonModal,
} from "../inquiry/index.js";
import {
	getInquiry,
	getInquiryHistory,
	getInquiryFile,
	updateInquiryTimeline,
	createInquiryHistory,
} from "../service/index.js";
import { initApp } from "../utils.js";
import { bindDeleteLine } from "../inquiry/ui.js";
import { state } from "../inquiry/store.js";
//001: On load form
var table;
var tableElmes;
var tableAttach;
let selectedFilesMap = new Map();
let deletedFilesMap = new Map();
let deletedLineMap = new Map();

$(document).ready(async () => {
	try {
		await showLoader();
		await initApp();
		const inqs = await getInquiry({
			INQ_ID: $("#inquiry-id").val(),
			IS_DETAILS: true,
			IS_TIMELINE: true,
		});

		const user = $("#user-login").attr("empno");
		let setime = {
			SALE_CLASS: inqs[0].timeline.SALE_CLASS,
			SG_USER: inqs[0].timeline.SG_USER,
			SG_READ: inqs[0].timeline.SG_READ,
			SG_CONFIRM: inqs[0].timeline.SG_CONFIRM,
			SE_USER: inqs[0].timeline.SE_USER,
			SE_READ: inqs[0].timeline.SE_READ,
			SE_CONFIRM: inqs[0].timeline.SE_CONFIRM,
		};
		const cards = await setupCard(inqs[0]);
		const details = inqs[0].details.filter((dt) => dt.INQD_LATEST == "1");
		const detailsOption = await setupSaleTableDetail(details);
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

		await setSelect2({ allowClear: false });
		await createReasonModal();
		await bindDeleteLine();
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await showLoader({ show: false });
	}
});

/*async function setupButton(revise) {
	const usergroup = $("#user-login").attr("groupcode");
	const assign = await createBtn({
		id: "assign-pic",
		title: "Assign PIC",
		icon: "fi fi-rs-user-check text-xl",
		className: `btn-primary text-white hover:shadow-lg ${
			revise ? "revised" : ""
		}`,
	};

	const forwardde = await createBtn({
		id: "forward-de",
		title: "Forward to DE",
		icon: "fi fi-tr-share-square text-xl",
		className: `btn-neutral text-white hover:shadow-lg hover:bg-neutral/70 ${
			revise ? "revised" : ""
		}`,
	};

	const sendIS = await createBtn({
		id: "send-bm",
		title: "Send to Pre-BM",
		icon: "fi fi-ts-coins text-xl",
		className: `btn-neutral text-white hover:shadow-lg hover:bg-neutral/70 ${
			revise ? "revised" : ""
		}`,
	};

	const confirm = await createBtn({
		id: "send-confirm",
		title: "Confirm",
		icon: "fi fi-tr-badge-check text-xl",
		className: `btn-primary text-white hover:shadow-lg ${
			revise ? "revised" : ""
		}`,
	};

	const back = await createBtn({
		id: "goback",
		title: "Back",
		type: "link",
		href: `${process.env.APP_ENV}/se/inquiry`,
		icon: "fi fi-rr-arrow-circle-left text-xl",
		className:
			"btn-outline btn-neutral text-neutral hover:text-white hover:bg-neutral/70",
	};

	if (usergroup == "SEG")
		$("#btn-container").append(assign, forwardde, sendIS, back);
	else $("#btn-container").append(confirm, back);
}*/

//002: Add table detail rows
/*
$(document).on("click", "#addRowBtn", async function (e) {
	e.preventDefault();
	const lastRow = table.row(":not(.d-none):last").data();
	let id = lastRow === undefined ? 1 : parseInt(lastRow.INQD_SEQ) + 1;
	await tb.addRow(id, table);
});

$(document).on("click", ".add-sub-line", async function (e) {
	e.preventDefault();
	const data = table.row($(this).parents("tr")).data();
	const id = digits(utils.intVal(data.INQD_SEQ) + 0.01, 2);
	await tb.addRow({ id, seq: id }, table);
});

$(document).on("click", ".delete-sub-line", async function (e) {
	e.preventDefault();
	const row = table.row($(this).closest("tr"));
	const data = row.data();
	if (data.INQD_ID != "") {
		deletedLineMap.set(data.INQD_ID, data);
	}
	row.remove().draw(false);
});

$(document).on("change", ".edit-input", async function () {
	await tb.changeCell(table, this);
});

$(document).on("change", ".carno", async function (e) {
	await tb.changeCar(table, this);
});

//003: Show Elmes table
$(document).on("change", ".elmes-input", async function (e) {
	e.preventDefault();
	const row = table.row($(this).closest("tr"));
	tableElmes = await inqs.elmesSetup(row);
});

$(document).on("click", "#elmes-confirm", async function () {
	const increse = 0.01;
	const elmesData = tableElmes.rows().data();
	await inqs.elmesConform(elmesData, increse, table);
});

$(document).on("click", "#elmes-cancel", async function () {
	await inqs.elmesCancel(table);
});

//004: Unable to reply checkbox
$(document).on("click", ".unreply", async function () {
	await inqs.clickUnreply($(this), table.row($(this).parents("tr")));
});

$(document).on("click", "#cancel-reason", async function () {
	await inqs.resetUnreply(table);
});

$(document).on("click", "#save-reason", async function () {
	await inqs.saveUnreply(table);
});

$(document).on("click", ".text-comment", async function () {
	$("#reason-99").prop("checked", true);
});

$(document).on("keyup", ".text-comment", async function () {
	await inqs.countReason(this);
});
// END: Unable to reply checkbox

//005: Import data from file
$(document).on("click", "#uploadRowBtn", async function (e) {
	$("#import-tsv").click();
});

$(document).on("change", "#import-tsv", async function (e) {
	const file = e.target.files[0];
	const ext = utils.fileExtension(file.name);
	const allow = ["xlsx", "tsv", "txt"];
	if (!allow.includes(ext)) {
		const msg = `Invalid file type. Please upload one of the following types: ${allow.join(
			", ",
		)}`;
		await showMessage(msg);
		return;
	}

	var newdata = null;
	if (ext === "xlsx") {
		newdata = await inqs.importExcel(file);
	} else {
		newdata = await inqs.importText(file);
	}

	if (newdata == null) {
		await showMessage("No data found in the file.");
		return;
	}

	newdata.forEach(async function (row) {
		table.row.add(row).draw();
	});
});
//End :Import date from File

//009: Add attachment
$(document).on("change", "#attachment-file", async function (e) {
	const datafile = await inqs.addAttached(e, selectedFilesMap);
	if (datafile.files.length > 0) {
		selectedFilesMap = datafile.selectedFilesMap;
		datafile.files.map((fs) => {
			tableAttach.row.add(fs).draw();
		});
	}
});

//010: Download attached file
$(document).on("click", ".download-att-client", function (e) {
	e.preventDefault();
	const row = tableAttach.row($(this).closest("tr"));
	const data = row.data();
	const fileName = data.FILE_ORIGINAL_NAME;
	tb.downloadClientFile(selectedFilesMap, fileName);
});

//011: Delete attached file
$(document).on("click", ".delete-att", function (e) {
	e.preventDefault();
	const row = tableAttach.row($(this).closest("tr"));
	const data = row.data();
	if (data.FILE_ID !== undefined) {
		deletedFilesMap.set(data);
	}
	const fileName = data.FILE_ORIGINAL_NAME;
	selectedFilesMap.delete(fileName);
	row.remove().draw(false);
});

//Download template
$(document).on("click", "#downloadTemplateBtn", async function (e) {
	e.preventDefault();
	const link = document.createElement("a");
	link.href = `${process.env.APP_ENV}/assets/files/export/Import_inquiry_template.xlsx`;
	link.download = "Import_inquiry_template.xlsx";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
});

//Submit Form
//006: Assign Engineer
$(document).on("click", "#assign-pic", async function (e) {
	e.preventDefault();
	const isRevise = $(this).hasClass("revised");
	if (isRevise && $("#remark").val().trim() === "") {
		await showMessage("Please provide a remark for the revision.");
		$("#remark").focus();
		return;
	}

	const chkheader = await inqs.verifyHeader(".req-1");
	if (!chkheader) return;
	try {
		const inquiry = await updatePath(10);
		// const email = await mail.sendSE({
		//   ...inquiry,
		//   remark: $("#remark").val(),
		// });
		// window.location.replace(
		//   `${process.env.APP_ENV}/se/inquiry/view/${inquiry.INQ_ID}`
		// );
	} catch (error) {
		await showErrorMessage(`Something went wrong.`, "2036");
		return;
	}
});

//007: Bypass to DE
$(document).on("click", "#forward-de", async function (e) {
	e.preventDefault();
	const isRevise = $(this).hasClass("revised");
	if (isRevise && $("#remark").val().trim() === "") {
		await showMessage("Please provide a remark for the revision.");
		$("#remark").focus();
		return;
	}
	try {
		const inquiry = await updatePath(12);
		const email = await mail.sendGLD({
			...inquiry,
			remark: $("#remark").val(),
		});
		window.location.replace(
			`${process.env.APP_ENV}/se/inquiry/view/${inquiry.INQ_ID}`,
		);
	} catch (error) {
		await showErrorMessage(`Something went wrong.`, "2036");
		return;
	}
});

//008: Save and send to AS400
$(document).on("click", "#send-bm", async function (e) {
	e.preventDefault();
	const isRevise = $(this).hasClass("revised");
	if (isRevise && $("#remark").val().trim() === "") {
		await showMessage("Please provide a remark for the revision.");
		$("#remark").focus();
		return;
	}
	try {
		const inquiry = await updatePath(30, 2);
		const email = await mail.sendPKC({
			...inquiry,
			remark: $("#remark").val(),
		});
		window.location.replace(
			`${process.env.APP_ENV}/se/inquiry/view/${inquiry.INQ_ID}`,
		);
	} catch (error) {
		await showErrorMessage(`Something went wrong.`, "2036");
		return;
	}
});

//012: Update and send to design
$(document).on("click", "#send-confirm", async function (e) {
	e.preventDefault();
	const isRevise = $(this).hasClass("revised");
	if (isRevise && $("#remark").val().trim() === "") {
		await showMessage("Please provide a remark for the revision.");
		$("#remark").focus();
		return;
	}
	try {
		const inquiry = await updatePath(11, 1);
		// return;
		const grpdata = {
			data: { INQG_STATUS: 28, INQG_SKIP: 1 },
			condition: { INQ_ID: inquiry.INQ_ID },
		};
		await inqservice.updateInquiryGroup(grpdata);
		const details = table.rows().data().toArray();
		let group = [];
		for (const dt of details) {
			if (dt.INQD_DE !== null) {
				let item = Math.floor(parseInt(dt.INQD_ITEM) / 100);
				if (item == 5) item = 2;
				if (item >= 6) item = 6;
				group.push(item);
			}
		}

		if (group.length == 0) {
			const header = { INQ_STATUS: 30, INQ_NO: inquiry.INQ_NO };
			const history = await setLogsData(30);
			const fomdata = {
				header,
				history,
			};
			const inqs = await inqservice.updateInquiryStatus(
				fomdata,
				$("#inquiry-id").val(),
			);
			//   const email = await mail.sendPKC({
			//     ...inqs,
			//     remark: $("#remark").val(),
			//   });
			window.location.replace(
				`${process.env.APP_ENV}/se/inquiry/view/${inqs.INQ_ID}`,
			);
			return;
		}

		group = [...new Set(group)];
		for (const gp of group) {
			const grpdata = {
				data: { INQG_STATUS: 0, INQG_SKIP: null },
				condition: { INQ_ID: inquiry.INQ_ID, INQG_GROUP: gp },
			};
			await inqservice.updateInquiryGroup(grpdata);
			const inqs = await inqservice.getInquiryID(inquiry.INQ_ID);
			//   const email = await mail.sendGLD({
			//     ...inqs,
			//     remark: $("#remark").val(),
			//   });
			//   window.location.replace(
			//     `${process.env.APP_ENV}/se/inquiry/view/${inquiry.INQ_ID}`
			//   );
			return;
		}
		// const email = await mail.sendPKC({
		//   ...inquiry,
		//   remark: $("#remark").val(),
		// });
		// window.location.replace(
		//   `${process.env.APP_ENV}/se/inquiry/view/${inquiry.INQ_ID}`
		// );
	} catch (error) {
		await showErrorMessage(`Something went wrong.`, "2036");
		return;
	}
});

// 015: Update and send to AS400
async function updatePath(status, level = 0) {
	//Get header data
	const header = await inqs.getFormHeader();
	const details = table.rows().data().toArray();
	await inqs.verifyDetail(table, details, level);

	header.INQ_STATUS = status;
	header.UPDATE_BY = $("#user-login").attr("empname");
	header.UPDATE_AT = new Date();
	const timelinedata = await setTimelineData(header, status);
	const history = await setLogsData(status);
	let deleteLine = [];
	if (deletedLineMap.size > 0) {
		deletedLineMap.forEach((value, key) => {
			deleteLine.push(key);
		});
	}

	let deleteFile = [];
	if (deletedFilesMap.size > 0) {
		deletedFilesMap.forEach((value, key) => {
			deleteFile.push(key);
		});
	}

	await showLoader({
		show: true,
		title: "Saving data",
		clsbox: `!bg-transparent`,
	});

	const fomdata = {
		header,
		details,
		deleteLine,
		deleteFile,
		timelinedata,
		history,
	};
	//   console.log(fomdata);
	//   return;
	const inquiry = await inqservice.updateInquiry(fomdata);
	if (selectedFilesMap.size > 0) {
		const attachment_form = new FormData();
		attachment_form.append("INQ_NO", inquiry.INQ_NO);
		selectedFilesMap.forEach((file, fileName) => {
			attachment_form.append("files", file, fileName);
		});
		await inqservice.createInquiryFile(attachment_form);
	}
	return inquiry;
}

async function setTimelineData(header, status) {
	const data = {
		INQ_NO: header.INQ_NO,
		INQ_REV: header.INQ_REV,
		MAR_SEND: header.MAR_SEND,
		SG_USER: header.SG_USER,
		SG_READ: header.SG_READ,
		SG_CONFIRM: header.SG_CONFIRM == "" ? new Date() : header.SG_CONFIRM,
		SALE_CLASS: header.SALE_CLASS,
		SE_USER: header.SE_USER,
	};

	if (status > 10) {
		data.SE_READ =
			header.SE_READ == "" || header.SE_READ == null
				? new Date()
				: header.SE_READ;
		data.SE_CONFIRM =
			header.SE_CONFIRM == "" || header.SE_CONFIRM == null
				? new Date()
				: header.SE_CONFIRM;
	}
	return data;
}

async function setLogsData(action) {
	return {
		INQ_NO: $("#inquiry-no").val(),
		INQ_REV: $("#revision").val(),
		INQH_DATE: new Date(),
		INQH_USER: $("#user-login").attr("empno"),
		INQH_ACTION: action,
		INQH_REMARK: $("#remark").val(),
	};
}
*/
