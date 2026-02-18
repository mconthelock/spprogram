/*
Funtion contents
001 - On load form
002 - Add table detail rows
003 - Show Elmes table
004 - Unable to reply checkbox
005 - Import data from file
006 - Save Draft
007 - Save and send to design
008 - Save and send to AS400
009 - Add attachment
010 - Download attached file
011 - Delete attached file
*/
// import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";
import select2 from "select2";
import { showLoader } from "@amec/webasset/preloader";
import { setSelect2 } from "@amec/webasset/select2";
import { showMessage, revisionCode } from "@amec/webasset/utils";
import { createBtn } from "@amec/webasset/components/buttons";
import { setDatePicker } from "@amec/webasset/flatpickr";
import { createTable } from "@amec/webasset/dataTable";
import {
	setupCard,
	setupTableHistory,
	setupTableAttachment,
	setupPartTableDetail,
	importExcel,
	importText,
	getFormHeader,
	verifyHeader,
	verifyDetail,
} from "../inquiry/index.js";
import {
	bindDeleteLine,
	createReasonModal,
	createElmesModal,
} from "../inquiry/ui.js";
import { state } from "../inquiry/store.js";
import {
	getInquiry,
	getInquiryHistory,
	getInquiryFile,
	createInquiry,
	createInquiryFile,
	updateInquiry,
} from "../service/index.js";
import { initApp, fileExtension } from "../utils.js";

//001: On load form
var table;
select2();
$(document).ready(async () => {
	try {
		await showLoader();
		await initApp({ submenu: ".navmenu-newinq" });
		let inqs, inq, details, logs, file;
		let mode = "create";
		const currentUrl = window.location.href;
		if (currentUrl.includes("detail") && $("#inquiry-id").val() != "") {
			inqs = await getInquiry({
				INQ_ID: $("#inquiry-id").val(),
				IS_DETAILS: true,
			});
			if (inqs.length == 0) throw new Error("Inquiry do not found");
			mode = "edit";
			inq = inqs[0];
			if (inqs[0].INQ_STATUS >= 10) {
				inqs[0].INQ_REV = await revisionCode(inqs[0].INQ_REV);
				inqs[0].INQ_MAR_PIC = $("#user-login").attr("empno");
				mode = "revise";
			}
			details = inqs[0].details.filter((dt) => dt.INQD_LATEST == "1");
			logs = await getInquiryHistory(inqs[0].INQ_NO);
			file = await getInquiryFile({ INQ_NO: inqs[0].INQ_NO });
		}
		const cards = await setupCard(inq);
		const tableContainer = await setupPartTableDetail(details);
		table = await createTable(tableContainer);
		//Inquiry History and Attachment
		const history = await setupTableHistory(logs);
		const tableHistory = await createTable(history, { id: "#history" });
		const attachment = await setupTableAttachment(file, false);
		const tableAttach = await createTable(attachment, {
			id: "#attachment",
		});

		await setSelect2({ allowClear: false });
		await setDatePicker();
		await createReasonModal();
		await createElmesModal();
		await setupButton(mode);
		await bindDeleteLine();
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await showLoader({ show: false });
	}
});

async function setupButton(mode) {
	const sendDE = await createBtn({
		id: "send-de",
		title: "Send to Design",
		icon: "fi fi-tr-envelope-open-text text-xl",
		className: `btn-primary text-white hover:shadow-lg ${mode}`,
	});

	const updateDE = await createBtn({
		id: "update-de",
		title: "Send to Design",
		icon: "fi fi-tr-envelope-open-text text-xl",
		className: `btn-primary text-white hover:shadow-lg ${mode}`,
	});

	const sendIS = await createBtn({
		id: "send-bm",
		title: "Send to Pre-BM",
		icon: "fi fi-ts-coins text-xl",
		className: `btn-neutral text-white hover:shadow-lg hover:bg-neutral/70 ${mode}`,
	});

	const updateIS = await createBtn({
		id: "update-bm",
		title: "Send to Pre-BM",
		icon: "fi fi-ts-coins text-xl",
		className: `btn-neutral text-white hover:shadow-lg hover:bg-neutral/70 ${mode}`,
	});

	const draft = await createBtn({
		id: "draft",
		title: "Send Draft",
		icon: "fi fi-ts-clipboard-list text-xl",
		className: `btn-outline btn-neutral text-neutral hover:text-white hover:shadow-lg`,
	});

	const back = await createBtn({
		id: "goback",
		title: "Back",
		type: "link",
		href: `#`,
		icon: "fi fi-rr-arrow-circle-left text-xl",
		className:
			"btn-outline btn-neutral text-neutral hover:text-white hover:bg-neutral/70",
	});

	if (mode == "create")
		$("#btn-container").append(sendDE, sendIS, draft, back);
	else $("#btn-container").append(updateDE, updateIS, back);
}

//Download template
$(document).on("click", "#downloadTemplateBtn", async function (e) {
	e.preventDefault();
	const link = document.createElement("a");
	link.href = `${process.env.APP_ENV}/assets/Import_inquiry_template.xlsx`;
	link.download = "Import_inquiry_template.xlsx";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
});

//005: Import data from file
$(document).on("click", "#uploadRowBtn", async function (e) {
	$("#import-tsv").click();
});

$(document).on("change", "#import-tsv", async function (e) {
	const file = e.target.files[0];
	const ext = fileExtension(file.name);
	const allow = ["xlsx", "tsv", "txt"];
	if (!allow.includes(ext)) {
		const msg = `Invalid file type. Please upload one of the following types: ${allow.join(
			", ",
		)}`;
		await showMessage(msg);
		return;
	}

	let newdata = null;
	if (ext === "xlsx") newdata = await importExcel(file);
	else newdata = await importText(file);
	if (newdata == null) {
		await showMessage("No data found in the file.");
		return;
	}

	newdata.forEach(async function (row) {
		table.row.add(row).draw();
	});
	setSelect2({ allowClear: false });
});
//End :Import date from File

//Submit Form
//006: Save Draft
$(document).on("click", "#draft", async function (e) {
	e.preventDefault();
	await createPath({ level: 0, status: 1 });
});

//007: Save and send to design
$(document).on("click", "#send-de", async function (e) {
	e.preventDefault();
	await createPath({ level: 1, status: 2 });
});

//008: Save and send to AS400
$(document).on("click", "#send-bm", async function (e) {
	e.preventDefault();
	await createPath({ level: 2, status: 30 });
});

async function createPath(opt) {
	try {
		await showLoader();
		const chkheader = await verifyHeader(
			opt.level == 0 ? ".req-1" : ".req-2",
		);
		if (!chkheader) return;
		const header = await getFormHeader();
		const check_inq = await getInquiry({ INQ_NO: header.INQ_NO });
		if (check_inq.length > 0) {
			await showMessage(`Inquiry ${header.INQ_NO} is already exist!`);
			$("#inquiry-no").focus().select();
			return;
		}

		header.INQ_STATUS = opt.status;
		header.INQ_TYPE = "SP";
		const details = table.rows().data().toArray();
		await verifyDetail(table, details, opt.level);
		const timelinedata = await setTimelineData(opt.status);
		const history = await setLogsData(opt.status);
		const fomdata = { header, details, timelinedata, history };
		const inquiry = await createInquiry(fomdata);

		//Attachments
		if (state.selectedFilesMap.size > 0) {
			const attachment_form = new FormData();
			attachment_form.append("INQ_NO", inquiry.INQ_NO);
			state.selectedFilesMap.forEach((file, fileName) => {
				attachment_form.append("files", file, fileName);
			});
			await createInquiryFile(attachment_form);
		}
		const url =
			opt.status == 1
				? `${process.env.APP_ENV}/mar/inquiry/edit/${inquiry.INQ_ID}`
				: `${process.env.APP_ENV}/mar/inquiry/show/${inquiry.INQ_ID}`;
		window.location.replace(url);
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await showLoader({ show: false });
	}
}

//012: Update and send to design
$(document).on("click", "#update-de", async function (e) {
	e.preventDefault();
	if ($(this).hasClass("revise") && $("#remark").val() == "") {
		await showMessage("Please enter remark for revise inquiry.");
		$("#remark").focus();
		return;
	}

	if ($("#status").val() >= 10) {
		await updatePath({ level: 1, status: 3 });
	} else {
		await updatePath({ level: 1, status: 2 });
	}
});

//013: Update and send to AS400
$(document).on("click", "#update-bm", async function (e) {
	e.preventDefault();
	if ($(this).hasClass("revise") && $("#remark").val() == "") {
		await showMessage("Please enter remark for revise inquiry.");
		$("#remark").focus();
		return;
	}
	await updatePath({ level: 2, status: 30 });
});

async function updatePath(opt) {
	try {
		await showLoader();
		const chkheader = await verifyHeader(".req-2");
		if (!chkheader) return;
		const header = await getFormHeader();
		const check_inq = await getInquiry({ INQ_NO: header.INQ_NO });
		if (check_inq.length == 0) {
			await showMessage(
				`Inquiry ${header.INQ_NO} is not found on System!`,
			);
			$("#inquiry-no").focus().select();
			return;
		}

		header.INQ_STATUS = opt.status;
		header.UPDATE_BY = $("#user-login").attr("empname");
		header.UPDATE_AT = new Date();

		const details = table.rows().data().toArray();
		await verifyDetail(table, details, opt.level);
		let deleteLine = [];
		if (state.deletedLineMap.size > 0) {
			state.deletedLineMap.forEach((value, key) => {
				deleteLine.push(key);
			});
		}

		let deleteFile = [];
		if (state.deletedFilesMap.size > 0) {
			state.deletedFilesMap.forEach((value, key) => {
				deleteFile.push(key);
			});
		}

		const timelinedata = await setTimelineData();
		const history = await setLogsData(opt.status);
		const fomdata = {
			header,
			details,
			deleteLine,
			deleteFile,
			timelinedata,
			history,
		};
		const inquiry = await updateInquiry(fomdata);
		if (state.selectedFilesMap.size > 0) {
			const attachment_form = new FormData();
			attachment_form.append("INQ_NO", inquiry.INQ_NO);
			state.selectedFilesMap.forEach((file, fileName) => {
				attachment_form.append("files", file, fileName);
			});
			await createInquiryFile(attachment_form);
		}
		window.location.replace(
			`${process.env.APP_ENV}/mar/inquiry/show/${inquiry.INQ_ID}`,
		);
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
		return;
	} finally {
		await showLoader({ show: false });
	}
}

async function setTimelineData() {
	return {
		INQ_NO: $("#inquiry-no").val(),
		INQ_REV: $("#revision").val(),
		MAR_USER: $("#user-login").attr("empno"),
		MAR_SEND: new Date(),
	};
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
