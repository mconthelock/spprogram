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
	setupSaleViewDetail,
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

		const group = inqs[0].inqgroup.find(
			(g) => g.INQG_GROUP == desgroup && g.INQG_LATEST == 1,
		);
		inqs[0].inqgroup = group;
		inqs[0].GROUP_STATUS = group.INQG_STATUS;
		inqs[0].INQ_DATE = dayjs(inqs[0].INQ_DATE).format("YYYY-MM-DD");
		inqs[0].INQ_REMARK = inqs[0].INQ_DES_REMARK;
		let revise = inqs[0].INQ_STATUS > 30 ? true : false;
		if (revise) inqs[0].INQ_REV = await revisionCode(inqs[0].INQ_REV);
		const cards = await setupCard(inqs[0]);

		// Details
		let details = inqs[0].details.filter(
			(dt) =>
				dt.INQD_LATEST == "1" &&
				Math.floor(dt.INQD_ITEM / 100) == desgroup,
		);
		const detailsOption = await setupSaleViewDetail(details);
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
		$("#add-attachment").remove();
		$("#view-deremark").closest(".grid").addClass("hidden");
		const back = await createBtn({
			id: "",
			title: "Back",
			type: "link",
			href:
				usrgroup == "DES"
					? `${process.env.APP_ENV}/des/inquiry/design/`
					: `${process.env.APP_ENV}/des/inquiry/`,
			icon: "fi fi-rr-arrow-circle-left text-xl",
			className: `btn-outline btn-neutral text-neutral hover:text-white hover:bg-neutral/70`,
		});
		$(".btn-container").append(back);
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await showLoader({ show: false });
	}
});
