import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";

import dayjs from "dayjs";
import { showLoader } from "@amec/webasset/preloader";
import { showMessage, intVal, showDigits } from "@amec/webasset/utils";
import { currentUser } from "@amec/webasset/api/amec";
import { setSelect2 } from "@amec/webasset/select2";
import {
	createBtn,
	activatedBtn,
	activatedBtnRow,
} from "@amec/webasset/components/buttons";
import { createTable } from "@amec/webasset/dataTable";
import {
	setupCard,
	setupTableHistory,
	setupTableAttachment,
	setupSaleTableDetail,
	getFormHeader,
	verifyHeader,
	verifyDetail,
} from "../inquiry/index.js";
import {
	getInquiry,
	getInquiryHistory,
	getInquiryFile,
	updateInquiry,
	createInquiryFile,
	createInquiryHistory,
	mailToSaleEngineer,
	mailToDEGroupLeader,
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

		let setime = {
			SALE_CLASS: inqs[0].timeline.SALE_CLASS,
			SG_USER: inqs[0].timeline.SG_USER,
			SG_READ: inqs[0].timeline.SG_READ,
			SG_CONFIRM: inqs[0].timeline.SG_CONFIRM,
			SE_USER: inqs[0].timeline.SE_USER,
			SE_READ: inqs[0].timeline.SE_READ,
			SE_CONFIRM: inqs[0].timeline.SE_CONFIRM,
		};
		inqs[0] = { ...inqs[0], ...setime };
		inqs[0].INQ_DATE = dayjs(inqs[0].INQ_DATE).format("YYYY-MM-DD");
		inqs[0].INQ_REMARK = inqs[0].INQ_SALE_REMARK;
		if (usrgroup != "SLG") {
			const vlist = $("#form-container").attr("data");
			const vstr = vlist.replace(/sale/g, "viewsale");
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
		await setupButton(false, usrgroup);
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
		className: `btn-primary text-white hover:shadow-lg ${
			revise ? "revised" : ""
		}`,
	});

	const forwardde = await createBtn({
		id: "forward-de",
		title: "Forward to DE",
		tooltip: `Send the inquiry to Design Department without SE checking.`,
		icon: "fi fi-tr-share-square text-xl",
		className: `btn-accent text-white hover:shadow-lg ${
			revise ? "revised" : ""
		}`,
	});

	const sendIS = await createBtn({
		id: "send-bm",
		title: "Send to Pre-BM",
		icon: "fi fi-ts-coins text-xl",
		tooltip: "Finish declare part process and Send to Pre-BM on AS400",
		className: `btn-neutral text-white hover:shadow-lg hover:bg-neutral/70 ${
			revise ? "revised" : ""
		}`,
	});

	const confirm = await createBtn({
		id: "send-confirm",
		title: "Confirm",
		icon: "fi fi-tr-badge-check text-xl",
		className: `btn-primary text-white hover:shadow-lg ${
			revise ? "revised" : ""
		}`,
	});

	const back = await createBtn({
		id: "",
		title: "Back",
		type: "link",
		href: `${process.env.APP_ENV}/se/inquiry`,
		icon: "fi fi-rr-arrow-circle-left text-xl",
		className:
			"btn-outline btn-neutral text-neutral hover:text-white hover:bg-neutral/70",
	});

	if (usergroup == "SLG")
		$("#btn-container").append(assign, forwardde, sendIS, back);
	else $("#btn-container").append(confirm, back);
}

// Submit Form
// 006: Assign Engineer
$(document).on("click", "#assign-pic", async function (e) {
	e.preventDefault();
	const isRevise = $(this).hasClass("revised");
	if (isRevise && $("#remark").val().trim() === "") {
		await showMessage("Please provide a remark for the revision.");
		$("#remark").focus();
		return;
	}

	const chkheader = await verifyHeader(".req-1");
	if (!chkheader) return;
	try {
		await activatedBtnRow($(this));
		const inquiry = await updatePath(10, 1);
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
	const isRevise = $(this).hasClass("revised");
	if (isRevise && $("#remark").val().trim() === "") {
		await showMessage("Please provide a remark for the revision.");
		$("#remark").focus();
		return;
	}
	try {
		await activatedBtnRow($(this));
		const inquiry = await updatePath(12, 2);
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
	const isRevise = $(this).hasClass("revised");
	if (isRevise && $("#remark").val().trim() === "") {
		await showMessage("Please provide a remark for the revision.");
		$("#remark").focus();
		return;
	}
	try {
		const logs = await setLogsData(11);
		await createInquiryHistory({ ...logs, INQH_LATEST: 1 });

		const inquiry = await updatePath(30, 3, 2);
		// const email = await mail.sendPKC({
		// 	...inquiry,
		// 	remark: $("#remark").val(),
		// });
		// window.location.replace(
		// 	`${process.env.APP_ENV}/se/inquiry/view/${inquiry.INQ_ID}`,
		// );
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
		//12	Foreward to DE
		//30	Add AS400
		const inquiry = await updatePath(11, 4, 1);
		// return;
		// const grpdata = {
		// 	data: { INQG_STATUS: 28, INQG_SKIP: 1 },
		// 	condition: { INQ_ID: inquiry.INQ_ID },
		// };
		// await inqservice.updateInquiryGroup(grpdata);
		// const details = table.rows().data().toArray();
		// let group = [];
		// for (const dt of details) {
		// 	if (dt.INQD_DE !== null) {
		// 		let item = Math.floor(parseInt(dt.INQD_ITEM) / 100);
		// 		if (item == 5) item = 2;
		// 		if (item >= 6) item = 6;
		// 		group.push(item);
		// 	}
		// }

		// if (group.length == 0) {
		// 	const header = { INQ_STATUS: 30, INQ_NO: inquiry.INQ_NO };
		// 	const history = await setLogsData(30);
		// 	const fomdata = {
		// 		header,
		// 		history,
		// 	};
		// 	const inqs = await inqservice.updateInquiryStatus(
		// 		fomdata,
		// 		$("#inquiry-id").val(),
		// 	);
		// 	//   const email = await mail.sendPKC({
		// 	//     ...inqs,
		// 	//     remark: $("#remark").val(),
		// 	//   });
		// 	window.location.replace(
		// 		`${process.env.APP_ENV}/se/inquiry/view/${inqs.INQ_ID}`,
		// 	);
		// 	return;
		// }

		// group = [...new Set(group)];
		// for (const gp of group) {
		// 	const grpdata = {
		// 		data: { INQG_STATUS: 0, INQG_SKIP: null },
		// 		condition: { INQ_ID: inquiry.INQ_ID, INQG_GROUP: gp },
		// 	};
		// 	await inqservice.updateInquiryGroup(grpdata);
		// 	const inqs = await inqservice.getInquiryID(inquiry.INQ_ID);
		// 	//   const email = await mail.sendGLD({
		// 	//     ...inqs,
		// 	//     remark: $("#remark").val(),
		// 	//   });
		// 	//   window.location.replace(
		// 	//     `${process.env.APP_ENV}/se/inquiry/view/${inquiry.INQ_ID}`
		// 	//   );
		// 	return;
		// }
		// const email = await mail.sendPKC({
		//   ...inquiry,
		//   remark: $("#remark").val(),
		// });
		// window.location.replace(
		//   `${process.env.APP_ENV}/se/inquiry/view/${inquiry.INQ_ID}`
		// );
	} catch (error) {
		await showMessage(`Something went wrong.`);
		return;
	}
});

async function sendToDE() {}

// 015: Update and send to AS400
async function updatePath(status, action, level = 0) {
	try {
		//Get header data
		const header = {
			INQ_ID: $("#inquiry-id").val(),
			INQ_NO: $("#inquiry-no").val(),
			INQ_REV: $("#revision").val(),
			INQ_STATUS: status,
			INQ_SALE_REMARK: $("#remark").val(),
			UPDATE_BY: $("#user-login").attr("empname"),
			UPDATE_AT: new Date(),
		};
		let details = table.rows().data().toArray();
		details = details.map((dt) => {
			const { FORWARD, ...rest } = dt;
			return rest;
		});

		await verifyDetail(table, details, level);
		return;
		const timelinedata = await setTimelineData(header, status);
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
