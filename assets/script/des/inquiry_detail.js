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
	finalStatus,
	setAS400Data,
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
	setAS400Header,
	setAS400Detail,
	setAS400Variable,
	addAS400Data,
	updateInquiryTimeline,
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
		const pageid = $("#pageid").val();
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

		const group = inqs[0].inqgroup.find(
			(g) => g.INQG_GROUP == desgroup && g.INQG_LATEST == 1,
		);
		const groupData = {
			...group,
			INQG_ASG: group.INQG_ASG == null ? user.empno : group.INQG_ASG,
		};

		inqs[0].GROUP_STATUS = groupData.INQG_STATUS;
		inqs[0].inqgroup = groupData;
		inqs[0].INQ_DATE = dayjs(inqs[0].INQ_DATE).format("YYYY-MM-DD");
		inqs[0].INQ_REMARK = inqs[0].INQ_DES_REMARK;

		const revise = inqs[0].INQ_STATUS >= 26 ? true : false;
		if (revise) inqs[0].INQ_REV = await revisionCode(inqs[0].INQ_REV);
		const cards = await setupCard(inqs[0]);
		const cardsDecorage = await setupPage(pageid);

		//Setup Table Detail
		const details = inqs[0].details.filter((dt) => {
			let litem = Math.floor(dt.INQD_ITEM / 100);
			if (litem >= 6) litem = 6;
			else if (litem == 5) litem = 2;
			return dt.INQD_LATEST == "1" && litem == desgroup;
		});
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
		await setupButton(pageid, revise);
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await showLoader({ show: false });
	}
});

async function setupPage(pageid) {
	if (pageid == 1) {
		$("#viewdesigner").addClass("hidden");
	} else {
		$("#designer").addClass("hidden");
	}
	$("#groupstatus").closest(".grid").removeClass("hidden");
	$("#status").closest(".grid").addClass("hidden");
	$("#show-deremark").closest(".grid").addClass("hidden");
	$("#viewmar").addClass("hidden");
}

async function setupButton(pageid, revise = false) {
	const assign = await createBtn({
		id: "assign-pic",
		title: "Assign PIC",
		icon: "fi fi-rs-user-check text-xl",
		className: `btn-primary text-white hover:shadow-lg ${revise ? `revised` : ``}`,
	});

	const save = await createBtn({
		id: "save-declare",
		title: "Save",
		icon: "fi fi-rr-disk text-xl",
		className: `btn-primary btn-outline text-primary hover:shadow-lg hover:text-white ${revise ? `revised` : ``}`,
	});

	const declare = await createBtn({
		id: "declare-part",
		title: "Confirm",
		className: `btn-primary text-white hover:shadow-lg ${revise ? `revised` : ``}`,
	});

	const checker = await createBtn({
		id: "checked-confirm",
		title: "Complete",
		icon: "fi fi-rr-paper-plane text-xl",
		tooltip:
			"Finish declare part process and Pending for send to Pre-BM on AS400 (Only supply by AMEC item)",
		className: `btn-neutral text-white hover:shadow-lg hover:bg-neutral/70 ${revise ? `revised` : ``}`,
	});

	const checker_reject = await createBtn({
		id: "checked-reject",
		title: "Return",
		icon: "fi fi-rr-undo text-xl",
		// tooltip: `Finish declare part process and Pending for send to Pre-BM on AS400 (Only supply by AMEC item)`,
		className: `btn-error text-white hover:shadow-lg hover:bg-error/70`,
	});

	const back = await createBtn({
		id: "",
		title: "Back",
		type: "link",
		href: "#",
		// href:
		// 	usergroup == "DES"
		// 		? `${process.env.APP_ENV}/des/inquiry/design/`
		// 		: `${process.env.APP_ENV}/des/inquiry/`,
		icon: "fi fi-rr-arrow-circle-left text-xl",
		className: `btn-outline btn-neutral text-neutral hover:text-white hover:bg-neutral/70`,
	});

	const backed = "";
	switch (pageid) {
		case "1":
			$(".btn-container").append(assign, backed);
			break;
		case "2":
			$(".btn-container").append(save, declare, backed);
			break;
		case "3":
			$(".btn-container").append(checker, checker_reject, backed);
			break;
		default:
			$(".btn-container").append(backed);
			break;
	}
	// console.log(usergroup, $("#groupstatus").val());
	/*if (usergroup == "LDR" && $("#groupstatus").val() < 21)
		$(".btn-container").append(assign, back);
	else if (usergroup == "LDR" && $("#groupstatus").val() >= 24)
		$(".btn-container").append(checker, checker_reject, back);
	else if (usergroup == "LDR" || usergroup == "DES")
		$(".btn-container").append(confirm, back);
	else $(".btn-container").append(back);*/
}

$(document).on("click", "#assign-pic", async function (e) {
	e.preventDefault();
	const chkheader = await verifyHeader(".req-1");
	if (!chkheader) return;
	const isRevise = $(this).hasClass("revised");
	if (isRevise && $("#deremark").val().trim() === "") {
		await showMessage("Please provide a remark for the revision.");
		$("#deremark").focus();
		return;
	}
	try {
		const status = await allowForeward(21);
		const inquiry = await updatePath({
			level: status >= 24 ? 2 : 0,
			status: status,
			obj: $(this),
		});
		if (!inquiry) throw new Error("Failed to update inquiry.");

		let groupData = await setDesignGroup(inquiry.inqgroup);
		groupData = {
			...groupData,
			INQG_ASG: $("#de-leader-incharge").val(),
			INQG_DES: $("#desiger-incharge").val(),
			INQG_CHK: $("#checker-incharge").val(),
			INQG_CLASS: $("#des-class").val(),
			INQG_ASG_DATE: dayjs().format("YYYY-MM-DD HH:mm:ss"),
			INQG_DES_DATE:
				status >= 24 ? dayjs().format("YYYY-MM-DD HH:mm:ss") : null,
			INQG_CHK_DATE:
				status >= 26 ? dayjs().format("YYYY-MM-DD HH:mm:ss") : null,
			INQG_STATUS: status,
		};
		await updateInquiryGroup({
			data: groupData,
			condition: {
				INQG_LATEST: 1,
				INQG_ID: groupData.INQG_ID,
			},
		});
		await checkComplete(inquiry);
		window.location.replace(`${process.env.APP_ENV}/des/inquiry/`);
		// window.location.replace(
		// 	`${process.env.APP_ENV}/des/inquiry/show/${inquiry.INQ_ID}`,
		// );
	} catch (error) {
		console.log(error);
		await showMessage(error.message || `Something went wrong.`);
		return;
	}
});

//Declare Part Process
$(document).on("click", "#save-declare", async function (e) {
	e.preventDefault();
	try {
		const status = 22;
		const inquiry = await updatePath({
			level: 0,
			status: status,
			obj: $(this),
		});
		if (!inquiry) throw new Error("Failed to update inquiry.");

		let groupData = await setDesignGroup(inquiry.inqgroup);
		groupData = {
			...groupData,
			INQG_CLASS: $("#des-class").val(),
			INQG_STATUS: status,
		};
		await updateInquiryGroup({
			data: groupData,
			condition: {
				INQG_LATEST: 1,
				INQG_ID: groupData.INQG_ID,
			},
		});
		await showMessage(
			"Inquiry details has been saved successfully.",
			"success",
		);
		await activatedBtnRow($(this), false);
	} catch (error) {
		console.log(error);
		await showMessage(error.message || `Something went wrong.`);
		return;
	}
});

$(document).on("click", "#declare-part", async function (e) {
	e.preventDefault();
	const isRevise = $(this).hasClass("revised");
	if (isRevise && $("#view-deremark").val().trim() === "") {
		await showMessage("Please provide a remark for the revision.");
		$("#view-deremark").focus();
		return;
	}
	try {
		const status = await allowForeward(24);
		const inquiry = await updatePath({
			level: 2,
			status: status,
			obj: $(this),
		});
		if (!inquiry) throw new Error("Failed to update inquiry.");

		let groupData = await setDesignGroup(inquiry.inqgroup);
		groupData = {
			...groupData,
			INQG_CLASS: $("#des-class").val(),
			INQG_DES_DATE: dayjs().format("YYYY-MM-DD HH:mm:ss"),
			INQG_CHK_DATE:
				status >= 26 ? dayjs().format("YYYY-MM-DD HH:mm:ss") : null,
			INQG_STATUS: status,
		};
		await updateInquiryGroup({
			data: groupData,
			condition: {
				INQG_LATEST: 1,
				INQG_ID: groupData.INQG_ID,
			},
		});
		await checkComplete(inquiry);
		window.location.replace(`${process.env.APP_ENV}/des/inquiry/design/`);
	} catch (error) {
		console.log(error);
		await showMessage(error.message || `Something went wrong.`);
		return;
	}
});

$(document).on("click", "#checked-confirm", async function (e) {
	e.preventDefault();
	const user = await currentUser();
	const des = await getDesigner();
	const desgroup = des.find((d) => d.DES_USER == user.empno).DES_GROUP;

	const isRevise = $(this).hasClass("revised");
	if (isRevise && $("#view-deremark").val().trim() === "") {
		await showMessage("Please provide a remark for the revision.");
		$("#view-deremark").focus();
		return;
	}
	try {
		const status = 26;
		const inquiry = await updatePath({
			level: 2,
			status: status,
			obj: $(this),
		});
		if (!inquiry) throw new Error("Failed to update inquiry.");
		await updateGroups(inquiry, status);
		// console.log(inquiry);
		await checkComplete(inquiry);
		window.location.replace(`${process.env.APP_ENV}/des/inquiry/check/`);
		// window.location.replace(
		// 	`${process.env.APP_ENV}/des/inquiry/show/${inquiry.INQ_ID}`,
		// );
	} catch (error) {
		console.log(error);
		await showMessage(error.message || `Something went wrong.`);
		return;
	}
});

$(document).on("click", "#checked-reject", async function (e) {
	e.preventDefault();
	const user = await currentUser();
	const des = await getDesigner();
	const desgroup = des.find((d) => d.DES_USER == user.empno).DES_GROUP;
	// const isRevise = $(this).hasClass("revised");
	if ($("#view-deremark").val().trim() === "") {
		await showMessage("Please provide a remark for the revision.");
		$("#view-deremark").focus();
		return;
	}

	try {
		const status = 23;
		const inquiry = await updatePath({
			level: 0,
			status: status,
			obj: $(this),
		});
		if (!inquiry) throw new Error("Failed to update inquiry.");

		let groupData = await setDesignGroup(inquiry.inqgroup);
		groupData = {
			...groupData,
			INQG_DES_DATE: null,
			INQG_CHK_DATE: null,
			INQG_STATUS: status,
		};
		await updateInquiryGroup({
			data: groupData,
			condition: {
				INQG_LATEST: 1,
				INQG_ID: groupData.INQG_ID,
			},
		});
		window.location.replace(`${process.env.APP_ENV}/des/inquiry/check/`);
	} catch (error) {
		console.log(error);
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
		await verifyDetail(details, option.level);
		const header = {
			INQ_ID: $("#inquiry-id").val(),
			INQ_NO: $("#inquiry-no").val(),
			INQ_REV: $("#revision").val(),
			INQ_PRJNO: $("#project-no").val(),
			INQ_PRDSCH: $("#schedule").val(),
			INQ_SERIES: $("#series").val(),
			INQ_SPEC: $("#spec").val(),
			INQ_STATUS: 20,
			INQ_DE_REMARK: $("#deremark").val(),
			UPDATE_BY: $("#user-login").attr("empname"),
			UPDATE_AT: dayjs().format("YYYY-MM-DD HH:mm:ss"),
		};
		const history = await setLogsData(option.status);
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
			history,
		};

		await activatedBtnRow(option.obj);
		const inquiry = await updateInquiry(fomdata);
		//Attachment File
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

async function allowForeward(start) {
	let confirm = false;
	let status = start;
	const user = await currentUser();
	const designer = $("#desiger-incharge").val();
	const checker = $("#checker-incharge").val();
	if (user.empno == designer) {
		status = 24;
		if (user.empno == checker) {
			status = 26;
		}
		confirm = await showConfirm({
			title: "Fast-Forward Confirmation",
			message:
				"You have assigned yourself as the designer/checker. Do you want to fast-forward the inquiry to the next stage without duplication process?",
		});
	}
	if (confirm) return status;
	else return start;
}

async function updateGroups(data, status) {
	// prettier-ignore
	{
        const user = await currentUser();
        const chk = $("#designer").hasClass("hidden");
        const assign = chk ? $("#view-de-leader-incharge").val() : $("#de-leader-incharge").val();
        const designer = chk ? $("#view-desiger-incharge").val() : $("#desiger-incharge").val();
        const checker = chk ? $("#view-checker-incharge").val() : $("#checker-incharge").val();
        const desclass = chk ? $("#view-des-class").val() : $("#des-class").val();
        const des = await getDesigner();
        const desgroup = des.find((d) => d.DES_USER == user.empno).DES_GROUP;
        const groups = data.inqgroup.find((g) => g.INQG_GROUP == desgroup && g.INQG_LATEST == 1);
        const groups_data = {
            ...groups,
            INQG_ASG: assign,
            INQG_DES: designer,
            INQG_CHK: checker,
            INQG_CLASS: desclass,
            INQG_ASG_DATE: groups.INQG_ASG_DATE == null && status >= 21 ? dayjs().format("YYYY-MM-DD HH:mm:ss") : groups.INQG_ASG_DATE,
            INQG_DES_DATE: groups.INQG_DES_DATE == null && status >= 24 ? dayjs().format("YYYY-MM-DD HH:mm:ss") : groups.INQG_DES_DATE,
            INQG_CHK_DATE: groups.INQG_CHK_DATE == null && status >= 26 ? dayjs().format("YYYY-MM-DD HH:mm:ss") : groups.INQG_CHK_DATE,
            INQG_STATUS: status,
        };
        await updateInquiryGroup({
            data: groups_data,
            condition: {
                INQ_ID: data.INQ_ID,
                INQG_LATEST: 1,
                INQG_GROUP: desgroup,
            },
        });
    }
}

async function checkComplete(inquiry) {
	const inqs = await getInquiry({
		INQ_ID: inquiry.INQ_ID,
		IS_GROUP: true,
		IS_DETAILS: true,
	});
	let complete = true;
	for (const item of inqs[0].inqgroup) {
		if (item.INQG_STATUS < 26) {
			complete = false;
		}
	}

	// console.log(complete);
	if (complete) {
		const details = inqs[0].details.filter((dt) => dt.INQD_LATEST == "1");
		const status = await finalStatus(details);
		// console.log(status);
		await updateInquiryHeader(
			{
				INQ_STATUS: status,
				INQ_LATEST: 1,
				INQ_NO: inquiry.INQ_NO,
				UPDATE_AT: dayjs().format("YYYY-MM-DD HH:mm:ss"),
				UPDATE_BY: $("#user-login").attr("empname"),
			},
			inquiry.INQ_ID,
		);
		await updateInquiryTimeline({
			INQ_NO: inquiry.INQ_NO,
			INQ_REV: inquiry.INQ_REV,
			DE_CONFIRM: dayjs().format("YYYY-MM-DD HH:mm:ss"),
		});
		await setAS400Data(inqs);
	}
}

async function setLogsData(action) {
	let remark = "";
	if ($("#designer:not(.hidden)").length > 0) remark = $("#deremark").val();
	else remark = $("#view-deremark").val();

	return {
		INQ_NO: $("#inquiry-no").val(),
		INQ_REV: $("#revision").val(),
		INQH_DATE: dayjs().format("YYYY-MM-DD HH:mm:ss"),
		INQH_USER: $("#user-login").attr("empno"),
		INQH_ACTION: action,
		INQH_REMARK: remark,
	};
}

async function setDesignGroup(data) {
	const user = await currentUser();
	const des = await getDesigner();
	const desgroup = des.find((d) => d.DES_USER == user.empno).DES_GROUP;
	let groupData = data.find(
		(g) => g.INQG_GROUP == desgroup && g.INQG_LATEST == 1,
	);
	return groupData;
}
