import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";

import dayjs from "dayjs";
import { showLoader } from "@amec/webasset/preloader";
import { showMessage, revisionCode, showConfirm } from "@amec/webasset/utils";
import { currentUser } from "@amec/webasset/api/amec";
import { setSelect2 } from "@amec/webasset/select2";
import { createBtn, activatedBtnRow } from "@amec/webasset/components/buttons";
import { createTable } from "@amec/webasset/dataTable";
import {
	setupCard,
	setupTableHistory,
	setupTableAttachment,
	setupDETableDetail,
	verifyHeader,
	verifyDetail,
} from "../inquiry/index.js";
import {
	getInquiry,
	getInquiryHistory,
	getInquiryFile,
	updateInquiry,
	updateInquiryGroup,
	updateInquiryHeader,
	createInquiryFile,
	createInquiryHistory,
	mailToSaleEngineer,
	mailToDEGroupLeader,
	mailToPKC,
	setAS400Header,
	setAS400Detail,
	setAS400Variable,
	addAS400Data,
} from "../service/index.js";
import { bindDeleteLine } from "../inquiry/ui.js";
import { state } from "../inquiry/store.js";
import { initApp } from "../utils.js";
import { getDesigner, dataExports } from "./data.js";

var table;
$(document).ready(async () => {
	await showLoader();
	await initApp();
	try {
		const user = await currentUser();
		const usrgroup = user.group;
		const des = await getDesigner();
		const desgroup = des.find((d) => d.DES_USER == user.empno).DES_GROUP;
		const inqs = await getInquiry({
			INQ_ID: $("#inquiry-id").val(),
			IS_DETAILS: true,
			IS_GROUP: true,
			IS_TIMELINE: true,
		});
		const group = inqs[0].inqgroup.find((g) => g.INQG_GROUP == desgroup);
		let set_des_group = {
			...group,
			INQG_ASG: group.INQG_ASG == null ? user.empno : group.INQG_ASG,
		};

		inqs[0].inqgroup = set_des_group;
		inqs[0].INQ_DATE = dayjs(inqs[0].INQ_DATE).format("YYYY-MM-DD");
		inqs[0].INQ_REMARK = inqs[0].INQ_DES_REMARK;

		let revise = inqs[0].INQ_STATUS > 30 ? true : false;
		if (revise) inqs[0].INQ_REV = await revisionCode(inqs[0].INQ_REV);
		const cards = await setupCard(inqs[0]);
		if (user.group == "LDR" && $("#status").val() <= 22) {
			$("#viewdesigner").addClass("hidden");
		} else {
			$("#designer").addClass("hidden");
		}

		$("#viewmar").addClass("hidden");
		$("#showremark").closest(".grid").addClass("hidden");
		let details = inqs[0].details.filter(
			(dt) =>
				dt.INQD_LATEST == "1" &&
				Math.floor(dt.INQD_ITEM / 100) == desgroup,
		);
		const detailsOption = await setupDETableDetail(details);
		table = await createTable(detailsOption);
		//Inquiry History and Attachment
		const logs = await getInquiryHistory(inqs[0].INQ_NO);
		const file = await getInquiryFile({ INQ_NO: inqs[0].INQ_NO });
		const history = await setupTableHistory(logs);
		const tableHistory = await createTable(history, { id: "#history" });
		const attachment = await setupTableAttachment(file);
		const tableAttach = await createTable(attachment, {
			id: "#attachment",
		});

		await setSelect2({ allowClear: false });
		await bindDeleteLine();
		await setupButton(revise, usrgroup);
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await showLoader({ show: false });
	}
});

async function setupButton(revise, usergroup) {
	const assign = await createBtn({
		id: "assign-pic",
		title: "Assign PIC",
		icon: "fi fi-rs-user-check text-xl",
		className: `btn-primary text-white hover:shadow-lg ${revise ? `revised` : ``}`,
	});

	const sendIS = await createBtn({
		id: "send-complete",
		title: "Complete",
		icon: "fi fi-rr-paper-plane text-xl",
		tooltip:
			"Finish declare part process and Pending for send to Pre-BM on AS400 (Only supply by AMEC item)",
		className: `btn-neutral text-white hover:shadow-lg hover:bg-neutral/70 ${revise ? `revised` : ``}`,
	});

	const confirm = await createBtn({
		id: "send-confirm",
		title: "Confirm",
		className: `btn-primary text-white hover:shadow-lg ${revise ? `revised` : ``}`,
	});

	const back = await createBtn({
		id: "",
		title: "Back",
		type: "link",
		href:
			usergroup == "DES"
				? `${process.env.APP_ENV}/des/inquiry/design/`
				: `${process.env.APP_ENV}/des/inquiry/`,
		icon: "fi fi-rr-arrow-circle-left text-xl",
		className: `btn-outline btn-neutral text-neutral hover:text-white hover:bg-neutral/70`,
	});

	if (usergroup == "DES") $(".btn-container").append(confirm, back);
	else if (usergroup == "LDR" && $("#status").val() >= 24)
		$(".btn-container").append(sendIS, back);
	else if (usergroup == "LDR") $(".btn-container").append(assign, back);
	else $(".btn-container").append(back);
}

$(document).on("click", "#assign-pic", async function (e) {
	e.preventDefault();
	const chkheader = await verifyHeader(".req-1");
	if (!chkheader) return;
	const isRevise = $(this).hasClass("revised");
	if (isRevise && $("#remark").val().trim() === "") {
		await showMessage("Please provide a remark for the revision.");
		$("#remark").focus();
		return;
	}
	var { fw, status } = await allowForeward();
	if (!fw) status = 21;
	try {
		const inquiry = await updatePath({
			level: status >= 24 ? 2 : 0,
			status: status,
			obj: $(this),
		});

		const user = await currentUser();
		const designer = $("#desiger-incharge").val();
		const checker = $("#checker-incharge").val();
		const des = await getDesigner();
		const desgroup = des.find((d) => d.DES_USER == user.empno).DES_GROUP;
		const group = {
			data: {
				INQG_ASG: user.empno,
				INQG_DES: designer,
				INQG_CHK: checker,
				INQG_CLASS: $("#des-class").val(),
				INQG_ASG_DATE: dayjs().format("YYYY-MM-DD HH:mm:ss"),
				INQG_DES_DATE:
					status >= 24 ? dayjs().format("YYYY-MM-DD HH:mm:ss") : null,
				INQG_CHK_DATE:
					status >= 28 ? dayjs().format("YYYY-MM-DD HH:mm:ss") : null,
				INQG_STATUS: status,
			},
			condition: {
				INQ_ID: inquiry.INQ_ID,
				INQG_LATEST: 1,
				INQG_GROUP: desgroup,
			},
		};
		await updateInquiryGroup(group);
		const completed = await checkComplete(inquiry.INQ_ID);
		window.location.replace(
			`${process.env.APP_ENV}/des/inquiry/show/${inquiry.INQ_ID}`,
		);
	} catch (error) {
		await showMessage(error.message || `Something went wrong.`);
		return;
	}
});

$(document).on("click", "#send-confirm", async function (e) {
	e.preventDefault();
	//const chkheader = await verifyHeader(".req-1");
	//if (!chkheader) return;
	const isRevise = $(this).hasClass("revised");
	if (isRevise && $("#remark").val().trim() === "") {
		await showMessage("Please provide a remark for the revision.");
		$("#remark").focus();
		return;
	}
	try {
		const status = 24;
		const inquiry = await updatePath({
			level: 2,
			status: status,
			obj: $(this),
		});

		const user = await currentUser();
		const des = await getDesigner();
		const desgroup = des.find((d) => d.DES_USER == user.empno).DES_GROUP;
		const group = {
			data: {
				INQG_DES_DATE: dayjs().format("YYYY-MM-DD HH:mm:ss"),
				INQG_STATUS: status,
			},
			condition: {
				INQ_ID: inquiry.INQ_ID,
				INQG_LATEST: 1,
				INQG_GROUP: desgroup,
			},
		};
		await updateInquiryGroup(group);
		const completed = await checkComplete(inquiry.INQ_ID);
		window.location.replace(
			`${process.env.APP_ENV}/des/inquiry/show/${inquiry.INQ_ID}`,
		);
	} catch (error) {
		await showMessage(error.message || `Something went wrong.`);
		return;
	}
});

$(document).on("click", "#send-complete", async function (e) {
	e.preventDefault();
	//const chkheader = await verifyHeader(".req-1");
	//if (!chkheader) return;
	const isRevise = $(this).hasClass("revised");
	if (isRevise && $("#remark").val().trim() === "") {
		await showMessage("Please provide a remark for the revision.");
		$("#remark").focus();
		return;
	}

	try {
		const status = 26;
		const inquiry = await updatePath({
			level: 2,
			status: status,
			obj: $(this),
		});
		const user = await currentUser();
		const des = await getDesigner();
		const desgroup = des.find((d) => d.DES_USER == user.empno).DES_GROUP;
		const group = {
			data: {
				INQG_CHK_DATE: dayjs().format("YYYY-MM-DD HH:mm:ss"),
				INQG_STATUS: status,
			},
			condition: {
				INQ_ID: inquiry.INQ_ID,
				INQG_LATEST: 1,
				INQG_GROUP: desgroup,
			},
		};
		await updateInquiryGroup(group);
		window.location.replace(
			`${process.env.APP_ENV}/des/inquiry/show/${inquiry.INQ_ID}`,
		);
	} catch (error) {
		await showMessage(error.message || `Something went wrong.`);
		return;
	}
});

async function updatePath(option) {
	try {
		let details = table
			.rows()
			.data()
			.toArray()
			.map((detail, index) => ({
				...detail,
				rowIndex: index,
			}));
		await verifyDetail(table, details, option.level);
		const header = {
			INQ_ID: $("#inquiry-id").val(),
			INQ_NO: $("#inquiry-no").val(),
			INQ_REV: $("#revision").val(),
			INQ_PRJNO: $("#project-no").val(),
			INQ_PRDSCH: $("#schedule").val(),
			INQ_SERIES: $("#series").val(),
			INQ_SPEC: $("#spec").val(),
			INQ_STATUS: option.status,
			INQ_SALE_REMARK: $("#remark").val(),
			UPDATE_BY: $("#user-login").attr("empname"),
			UPDATE_AT: new Date(),
		};
		if (option.status == 30) $("#remark").val("");
		//const history = await setLogsData(status, true);
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

		details = details.map((dt) => {
			const { rowIndex, ...rest } = dt;
			return rest;
		});
		const fomdata = {
			header,
			details,
			deleteLine,
			deleteFile,
		};

		await activatedBtnRow(option.obj);
		const inquiry = await updateInquiry(fomdata);
		if (state.selectedFilesMap.size > 0) {
			const attachment_form = new FormData();
			attachment_form.append("INQ_NO", inquiry.INQ_NO);
			state.selectedFilesMap.forEach((file, fileName) => {
				attachment_form.append("files", file, fileName);
			});
			await createInquiryFile(attachment_form);
		}
		return inquiry;
	} catch (error) {
		console.log(error);
		await showMessage(error.message || `Something went wrong.`);
		await activatedBtnRow(option.obj, false);
	}
}

async function allowForeward() {
	let confirm = false;
	let status = 21;
	const user = await currentUser();
	const designer = $("#desiger-incharge").val();
	const checker = $("#checker-incharge").val();
	if (user.empno == designer) {
		status = 24;
		if (user.empno == checker) {
			status = 28;
		}
		confirm = await showConfirm({
			title: "Fast-Forward Confirmation",
			message:
				"You have assigned yourself as the designer/checker. Do you want to fast-forward the inquiry to the next stage without duplication process?",
		});
	}

	return { fw: confirm, status: status };
}

async function checkComplete(id) {
	const data = await getInquiry({
		INQ_ID: id,
	});
}
