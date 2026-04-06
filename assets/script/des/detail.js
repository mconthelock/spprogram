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
	try {
		await showLoader();
		await initApp();
		const user = await currentUser();
		const usrgroup = user.group; //Not use (Maybe)
		const des = await getDesigner();
		const desgroup = des.find((d) => d.DES_USER == user.empno).DES_GROUP;

		const inqs = await getInquiry({
			INQ_ID: $("#inquiry-id").val(),
			IS_DETAILS: true,
			IS_GROUP: 1,
			IS_TIMELINE: true,
		});

		let revise = inqs[0].INQ_STATUS > 30 ? true : false;
		if (revise) inqs[0].INQ_REV = await revisionCode(inqs[0].INQ_REV);
		const cards = await setupCard(inqs[0]);
		$("#showremark").closest(".grid").addClass("hidden");
		let details = inqs[0].details.filter(
			(dt) =>
				dt.INQD_LATEST == "1" &&
				Math.floor(dt.INQD_ITEM / 100) == desgroup,
		);
		details = details.map((dt) => {
			return {
				...dt,
				FORWARD: null,
			};
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
		title: "Completed",
		icon: "fi fi-ts-coins text-xl",
		tooltip:
			"Finish declare part process and Send to Pre-BM on AS400 (Only supply by AMEC item)",
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
		href: `${process.env.APP_ENV}/se/inquiry`,
		icon: "fi fi-rr-arrow-circle-left text-xl",
		className: `btn-outline btn-neutral text-neutral hover:text-white hover:bg-neutral/70`,
	});

	if (usergroup != "SLG") $(".btn-container").append(confirm, back);
	else $(".btn-container").append(assign, forwardde, sendIS, back);
}
