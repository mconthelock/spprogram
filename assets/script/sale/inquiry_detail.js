import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";

import dayjs from "dayjs";
import { showLoader } from "@amec/webasset/preloader";
import { showMessage, revisionCode } from "@amec/webasset/utils";
import { currentUser } from "@amec/webasset/api/amec";
import { setSelect2 } from "@amec/webasset/select2";
import { createBtn, activatedBtnRow } from "@amec/webasset/components/buttons";
import { createTable } from "@amec/webasset/dataTable";
import {
	setupCard,
	setupTableHistory,
	setupTableAttachment,
	setupSaleTableDetail,
	verifyHeader,
	verifyDetail,
} from "../inquiry/index.js";
import {
	getInquiry,
	getInquiryHistory,
	getInquiryFile,
	updateInquiry,
	updateInquiryGroup,
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

var table;
$(document).ready(async () => {
	try {
		await showLoader();
		await initApp();
		const user = await currentUser();
		const usrgroup = user.group;
		const inqs = await getInquiry({
			INQ_ID: $("#inquiry-id").val(),
			IS_DETAILS: true,
			IS_TIMELINE: true,
		});

		let settime = {
			SALE_CLASS: inqs[0].timeline.SALE_CLASS,
			SG_USER:
				inqs[0].timeline.SG_USER == null
					? user.empno
					: inqs[0].timeline.SG_USER,
			SG_READ:
				inqs[0].timeline.SG_READ == null
					? dayjs().format("YYYY-MM-DD HH:mm:ss")
					: inqs[0].timeline.SG_READ,
			SG_CONFIRM: inqs[0].timeline.SG_CONFIRM,
			SE_USER: inqs[0].timeline.SE_USER,
			SE_READ: inqs[0].timeline.SE_READ,
			SE_CONFIRM: inqs[0].timeline.SE_CONFIRM,
		};
		inqs[0] = { ...inqs[0], ...settime };
		inqs[0].timeline = { ...inqs[0].timeline, ...settime };
		inqs[0].INQ_DATE = dayjs(inqs[0].INQ_DATE).format("YYYY-MM-DD");
		inqs[0].INQ_REMARK = inqs[0].INQ_SALE_REMARK;

		let revise = inqs[0].INQ_STATUS > 20 ? true : false;
		if (revise) inqs[0].INQ_REV = await revisionCode(inqs[0].INQ_REV);
		if (usrgroup == "SLG") {
			const vlist = $("#form-container").attr("data");
			const vstr = vlist.replace(/viewsale/g, "sale");
			$("#form-container").attr("data", vstr);
		}
		const cards = await setupCard(inqs[0]);
		$("#showremark").closest(".grid").addClass("hidden");
		let details = inqs[0].details.filter((dt) => dt.INQD_LATEST == "1");
		details = details.map((dt) => {
			return {
				...dt,
				FORWARD: null,
			};
		});
		const detailsOption = await setupSaleTableDetail(details);
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

	const forwardde = await createBtn({
		id: "forward-de",
		title: "Forward to DE",
		tooltip: `Send the inquiry to Design Department without SE checking.`,
		icon: "fi fi-tr-share-square text-xl",
		className: `btn-accent text-white hover:shadow-lg ${revise ? `revised` : ``}`,
	});

	const sendIS = await createBtn({
		id: "send-bm",
		title: "Send to Pre-BM",
		icon: "fi fi-ts-coins text-xl",
		tooltip: "Finish declare part process and Send to Pre-BM on AS400",
		className: `btn-neutral text-white hover:shadow-lg hover:bg-neutral/70 ${revise ? `revised` : ``}`,
	});

	const confirm = await createBtn({
		id: "send-confirm",
		title: "Confirm",
		icon: "fi fi-tr-badge-check text-xl",
		className: `btn-primary text-white hover:shadow-lg ${revise ? `revised` : ``}`,
	});

	const back = await createBtn({
		id: "",
		title: "Back",
		type: "link",
		href: `${process.env.APP_ENV}/se/inquiry`,
		icon: "fi fi-rr-arrow-circle-left text-xl",
		className: `btn-outline btn-neutral text-neutral hover:text-white hover:bg-neutral/70`,
	});

	if (usergroup != "SLG") $("#btn-container").append(confirm, back);
	else $("#btn-container").append(assign, forwardde, sendIS, back);
}

// Submit Form
// 006: Assign Engineer
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
	try {
		await activatedBtnRow($(this));
		const inquiry = await updatePath(10, 1);
		const user = await currentUser();
		const group = {
			data: {
				INQG_ASG: user.empno,
				INQG_DES: $("#sale-incharge").val(),
				INQG_CHK: $("#sale-incharge").val(),
				INQG_CLASS: $("#des-class").val(),
				INQG_ASG_DATE: dayjs().format("YYYY-MM-DD HH:mm:ss"),
				INQG_DES_DATE: null,
				INQG_CHK_DATE: null,
				INQG_STATUS: 1,
			},
			condition: { INQ_ID: inquiry.INQ_ID, INQG_LATEST: 1 },
		};
		await updateInquiryGroup(group);
		await mailToSaleEngineer(inquiry);
		window.location.replace(
			`${process.env.APP_ENV}/se/inquiry/show/${inquiry.INQ_ID}`,
		);
	} catch (error) {
		await activatedBtnRow($(this), false);
		await showMessage(`Something went wrong.`);
		return;
	}
});

//007: Bypass to DE
$(document).on("click", "#forward-de", async function (e) {
	e.preventDefault();
	const chkheader = await verifyHeader(".req-1");
	if (!chkheader) return;
	const isRevise = $(this).hasClass("revised");
	if (isRevise && $("#remark").val().trim() === "") {
		await showMessage("Please provide a remark for the revision.");
		$("#remark").focus();
		return;
	}

	try {
		await activatedBtnRow($(this));
		const inquiry = await updatePath(12, 2);
		const group = {
			data: {
				INQG_ASG: null,
				INQG_DES: null,
				INQG_CHK: null,
				INQG_CLASS: null,
				INQG_ASG_DATE: null,
				INQG_DES_DATE: null,
				INQG_CHK_DATE: null,
				INQG_STATUS: 1,
			},
			condition: { INQ_ID: inquiry.INQ_ID, INQG_LATEST: 1 },
		};
		await updateInquiryGroup(group);
		await mailToDEGroupLeader(inquiry);
		window.location.replace(
			`${process.env.APP_ENV}/se/inquiry/show/${inquiry.INQ_ID}`,
		);
	} catch (error) {
		console.log(error);
		await activatedBtnRow($(this), false);
		await showMessage(`Something went wrong.`);
		return;
	}
});

//008: Save and send to AS400
$(document).on("click", "#send-bm", async function (e) {
	e.preventDefault();
	const chkheader = await verifyHeader(".req-1");
	if (!chkheader) return;
	const isRevise = $(this).hasClass("revised");
	if (isRevise && $("#remark").val().trim() === "") {
		await showMessage("Please provide a remark for the revision.");
		$("#remark").focus();
		return;
	}
	try {
		await activatedBtnRow($(this));
		const logs = await setLogsData(11, true);
		await createInquiryHistory({ ...logs, INQH_LATEST: 1 });
		const inquiry = await updatePath(30, 3, 2);
		const user = await currentUser();
		const group = {
			data: {
				INQG_ASG: user.empno,
				INQG_DES: user.empno,
				INQG_CHK: user.empno,
				INQG_CLASS: $("#des-class").val(),
				INQG_ASG_DATE: dayjs().format("YYYY-MM-DD HH:mm:ss"),
				INQG_DES_DATE: dayjs().format("YYYY-MM-DD HH:mm:ss"),
				INQG_CHK_DATE: dayjs().format("YYYY-MM-DD HH:mm:ss"),
				INQG_STATUS: 9,
			},
			condition: { INQ_ID: inquiry.INQ_ID, INQG_LATEST: 1 },
		};
		await updateInquiryGroup(group);
		await setAS400Data(inquiry);
		await mailToPKC(inquiry);
		window.location.replace(
			`${process.env.APP_ENV}/se/inquiry/show/${inquiry.INQ_ID}`,
		);
	} catch (error) {
		console.log(error);
		await activatedBtnRow($(this), false);
		await showMessage(`Something went wrong.`);
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
		await activatedBtnRow($(this));
		const user = await currentUser();
		const group = {
			data: {
				INQG_DES: user.empno,
				INQG_CHK: user.empno,
				INQG_DES_DATE: dayjs().format("YYYY-MM-DD HH:mm:ss"),
				INQG_CHK_DATE: dayjs().format("YYYY-MM-DD HH:mm:ss"),
				INQG_STATUS: 9,
			},
			condition: { INQ_ID: $("#inquiry-id").val() },
		};
		await updateInquiryGroup(group);

		const details = table.rows().data().toArray();
		let designForward = [];
		details.map((dt) => {
			if (dt.FORWARD != null) {
				const grp = Math.floor(dt.INQD_ITEM / 100);
				designForward.push(grp);
			}
		});
		designForward = [...new Set(designForward)];
		if (designForward.length > 0) {
			designForward.map(async (dg) => {
				const group = {
					data: {
						INQG_ASG: null,
						INQG_DES: null,
						INQG_CHK: null,
						INQG_CLASS: null,
						INQG_ASG_DATE: null,
						INQG_DES_DATE: null,
						INQG_CHK_DATE: null,
						INQG_STATUS: 1,
					},
					condition: {
						INQ_ID: $("#inquiry-id").val(),
						INQG_GROUP: dg,
						INQG_LATEST: 1,
					},
				};
				await updateInquiryGroup(group);
			});
			const inquiry = await updatePath(11, 4, 1);
			await mailToDEGroupLeader(inquiry);
		} else {
			const logs = await setLogsData(11, true);
			await createInquiryHistory({ ...logs, INQH_LATEST: 1 });
			const inquiry = await updatePath(30, 4, 2);
			await setAS400Data(inquiry);
			await mailToPKC(inquiry);
		}
		window.location.replace(
			`${process.env.APP_ENV}/se/inquiry/show/${$("#inquiry-id").val()}`,
		);
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
		return;
	}
});

// 015: Update and send to AS400
async function updatePath(status, action, level = 0) {
	try {
		//Get header data
		let isforward = 0;
		let details = table.rows().data().toArray();
		details = details.map((dt) => {
			if (dt.FORWARD != null) isforward = 1;
			const { FORWARD, ...rest } = dt;
			return rest;
		});
		await verifyDetail(table, details, level);
		const header = {
			INQ_ID: $("#inquiry-id").val(),
			INQ_NO: $("#inquiry-no").val(),
			INQ_REV: $("#revision").val(),
			INQ_PRJNO: $("#project-no").val(),
			INQ_PRDSCH: $("#schedule").val(),
			INQ_SERIES: $("#series").val(),
			INQ_SPEC: $("#spec").val(),
			INQ_STATUS: status,
			INQ_SALE_REMARK: $("#remark").val(),
			INQ_SALE_FORWARD: status == 12 ? 1 : isforward,
			UPDATE_BY: $("#user-login").attr("empname"),
			UPDATE_AT: new Date(),
		};
		const timelinedata = await setTimelineData(header, action);

		if (status == 30) $("#remark").val("");
		const history = await setLogsData(status);
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
		return inquiry;
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
		return;
	}
}

async function setTimelineData(header, action) {
	//action: 1=> assign, 2=> assign+confirm/forward, 3 => confirm (SE),
	const user = await currentUser();
	let data = {
		INQ_NO: header.INQ_NO,
		INQ_REV: header.INQ_REV,
		MAR_SEND: $("#mar-send").val(),
		SALE_CLASS: $("#des-class").val(),
		SG_USER: $("#sale-leader-incharge").val(),
		SG_READ: $("#sale-leader-read").val(),
		SG_CONFIRM: $("#sale-leader-confirm").val(),
		SE_USER: $("#sale-incharge").val(),
		SE_READ: $("#sale-read").val(),
		SE_CONFIRM: $("#sale-confirm").val(),
	};
	switch (action) {
		case 1:
			data.SG_CONFIRM = dayjs().format("YYYY-MM-DD HH:mm:ss");
			break;
		case 2:
			data.SG_CONFIRM = dayjs().format("YYYY-MM-DD HH:mm:ss");
			data.SE_USER = user.empno;
			data.SE_READ = dayjs().format("YYYY-MM-DD HH:mm:ss");
			data.SE_CONFIRM = dayjs().format("YYYY-MM-DD HH:mm:ss");
			break;
		case 3:
			data.SG_CONFIRM = dayjs().format("YYYY-MM-DD HH:mm:ss");
			data.SE_USER = user.empno;
			data.SE_READ = dayjs().format("YYYY-MM-DD HH:mm:ss");
			data.SE_CONFIRM = dayjs().format("YYYY-MM-DD HH:mm:ss");
			break;
		case 4:
			data.SE_CONFIRM = dayjs().format("YYYY-MM-DD HH:mm:ss");
			break;
	}
	return data;
}

async function setLogsData(action, adjust = false) {
	return {
		INQ_NO: $("#inquiry-no").val(),
		INQ_REV: $("#revision").val(),
		INQH_DATE: adjust
			? dayjs().add("-1", "second").format("YYYY-MM-DD HH:mm:ss")
			: dayjs().format("YYYY-MM-DD HH:mm:ss"),
		INQH_USER: $("#user-login").attr("empno"),
		INQH_ACTION: action,
		INQH_REMARK: $("#remark").val(),
	};
}

async function setAS400Data(inq) {
	let isAMEC = false;
	inq.details.map((dt) => {
		if (dt.INQD_SUPPLIER == "AMEC" && dt.INQD_LATEST == 1) isAMEC = true;
	});
	if (!isAMEC) return;

	const q601kp1 = await setAS400Header(inq, inq.details[0].INQD_MFGORDER);
	const q601kp2 = await setAS400Detail(inq.INQ_NO, inq.details);
	const q601kp4 = await setAS400Variable(inq.INQ_NO, inq.details);
	await addAS400Data({
		header: q601kp1,
		detail: q601kp2,
		variable: q601kp4.length > 0 ? q601kp4.flat(1) : [],
		inquiryNo: inq.INQ_NO,
	});
	return;
}
