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

		inqs[0].GROUP_STATUS = set_des_group.INQG_STATUS;
		inqs[0].inqgroup = set_des_group;
		inqs[0].INQ_DATE = dayjs(inqs[0].INQ_DATE).format("YYYY-MM-DD");
		inqs[0].INQ_REMARK = inqs[0].INQ_DES_REMARK;

		let revise = inqs[0].INQ_STATUS > 30 ? true : false;
		if (revise) inqs[0].INQ_REV = await revisionCode(inqs[0].INQ_REV);
		const cards = await setupCard(inqs[0]);

		if ($("#groupstatus").val() > 20) $("#designer").addClass("hidden");
		else $("#viewdesigner").addClass("hidden");
		$("#groupstatus").closest(".grid").removeClass("hidden");
		$("#status").closest(".grid").addClass("hidden");
		$("#view-deremark").closest(".grid").addClass("hidden");
		$("#viewmar").addClass("hidden");
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

	const confirm = await createBtn({
		id: "send-confirm",
		title: "Confirm",
		className: `btn-primary text-white hover:shadow-lg ${revise ? `revised` : ``}`,
	});

	const checker = await createBtn({
		id: "send-checked",
		title: "Complete",
		icon: "fi fi-rr-paper-plane text-xl",
		tooltip:
			"Finish declare part process and Pending for send to Pre-BM on AS400 (Only supply by AMEC item)",
		className: `btn-neutral text-white hover:shadow-lg hover:bg-neutral/70 ${revise ? `revised` : ``}`,
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

	if (usergroup == "LDR" && $("#groupstatus").val() < 21)
		$(".btn-container").append(assign, back);
	else if (usergroup == "LDR" && $("#groupstatus").val() >= 24)
		$(".btn-container").append(checker, back);
	else if (usergroup == "LDR" && usergroup == "DES")
		$(".btn-container").append(confirm, back);
	else $(".btn-container").append(back);
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
		var { fw, status } = await allowForeward();
		if (!fw) status = 21;
		const inquiry = await updatePath({
			level: status >= 24 ? 2 : 0,
			status: status,
			obj: $(this),
		});
		await updateGroups(inquiry, status);
		await checkComplete(inquiry);
		window.location.replace(
			`${process.env.APP_ENV}/des/inquiry/show/${inquiry.INQ_ID}`,
		);
	} catch (error) {
		console.log(error);
		await showMessage(error.message || `Something went wrong.`);
		return;
	}
});

$(document).on("click", "#send-confirm", async function (e) {
	e.preventDefault();
	const isRevise = $(this).hasClass("revised");
	if (isRevise && $("#view-deremark").val().trim() === "") {
		await showMessage("Please provide a remark for the revision.");
		$("#view-deremark").focus();
		return;
	}
	try {
		const status = 24;
		const inquiry = await updatePath({
			level: 2,
			status: status,
			obj: $(this),
		});
		await updateGroups(inquiry, status);
		window.location.replace(
			`${process.env.APP_ENV}/des/inquiry/show/${inquiry.INQ_ID}`,
		);
	} catch (error) {
		console.log(error);
		await showMessage(error.message || `Something went wrong.`);
		return;
	}
});

$(document).on("click", "#send-checked", async function (e) {
	e.preventDefault();
	const isRevise = $(this).hasClass("revised");
	if (isRevise && $("#view-deremark").val().trim() === "") {
		await showMessage("Please provide a remark for the revision.");
		$("#view-deremark").focus();
		return;
	}
	try {
		const status = 24;
		const inquiry = await updatePath({
			level: 2,
			status: status,
			obj: $(this),
		});
		await updateGroups(inquiry, status);
		await checkComplete(inquiry);
		window.location.replace(
			`${process.env.APP_ENV}/des/inquiry/show/${inquiry.INQ_ID}`,
		);
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
		await verifyDetail(table, details, option.level);
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

async function allowForeward() {
	let confirm = false;
	let status = 21;
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

	return { fw: confirm, status: status };
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
            INQG_CLASS: status > 21 ? groups.INQG_CLASS : desclass,
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
	const data = await getInquiry({
		INQ_ID: inquiry.INQ_ID,
		IS_GROUP: true,
	});
	let complete = true;
	for (const item of data[0].inqgroup) {
		if (item.INQG_STATUS < 26) {
			complete = false;
		}
	}
	if (complete) {
		const details = table.rows().data().toArray();
		const status = await finalStatus(details);
		await updateInquiryHeader(
			{
				INQ_STATUS: status,
			},
			id,
		);
		await updateInquiryTimeline({
			INQ_NO: inquiry.INQ_NO,
			INQ_REV: inquiry.INQ_REV,
			DE_CONFIRM: dayjs().format("YYYY-MM-DD HH:mm:ss"),
		});
		await setAS400Data(inquiry);
	}
}

async function setLogsData(action) {
	return {
		INQ_NO: $("#inquiry-no").val(),
		INQ_REV: $("#revision").val(),
		INQH_DATE: dayjs().format("YYYY-MM-DD HH:mm:ss"),
		INQH_USER: $("#user-login").attr("empno"),
		INQH_ACTION: action,
		INQH_REMARK: $("#deremark").val(),
	};
}
