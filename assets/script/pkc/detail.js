import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";

import dayjs from "dayjs";
import select2 from "select2";
import { showLoader } from "@amec/webasset/preloader";
import { setSelect2 } from "@amec/webasset/select2";
import { showMessage, intVal, showDigits } from "@amec/webasset/utils";
import { createBtn } from "@amec/webasset/components/buttons";
import { createTable } from "@amec/webasset/dataTable";
import {
	setupCard,
	setupTableHistory,
	setupTableAttachment,
	setupPartViewDetail,
} from "../inquiry/index.js";
import { tableWeightOption } from "../quotation/index.js";
import {
	getInquiry,
	getInquiryHistory,
	getInquiryFile,
} from "../service/index.js";
import { initApp } from "../utils.js";
import { node } from "@rspack/core";

var tableWeight;
$(async function () {
	try {
		await showLoader();
		await initApp();

		const inqs = await getInquiry({
			INQ_ID: $("#inquiry-id").val(),
			IS_DETAILS: true,
		});

		inqs[0].INQ_MAR_PIC = $("#user-login").attr("empno");
		inqs[0].INQ_DATE = dayjs(inqs[0].INQ_DATE).format("YYYY-MM-DD");
		const cards = await setupCard(inqs[0]);
		const details = inqs[0].details.filter((dt) => dt.INQD_LATEST == "1");
		const detailsOption = await setupPartViewDetail(details);
		const table = await createTable(detailsOption);

		const weightOption = await tableWeightOption();
		tableWeight = await createTable(weightOption, {
			id: "#table-weight",
		});

		//Inquiry History and Attachment
		const logs = await getInquiryHistory(inqs[0].INQ_NO);
		const file = await getInquiryFile({ INQ_NO: inqs[0].INQ_NO });
		const history = await setupTableHistory(logs);
		const tableHistory = await createTable(history, { id: "#history" });
		const attachment = await setupTableAttachment(file, true);
		const tableAttach = await createTable(attachment, {
			id: "#attachment",
		});
	} catch (error) {
		console.log(error);
		await showMessage(error);
	} finally {
		await showLoader({ show: false });
	}
});

$(document).on("click", "#add-weight-row", async function (e) {
	e.preventDefault();
	const data = {
		SEQ_WEIGHT: tableWeight.data().count() + 1,
		PACKAGE_TYPE: "",
		NO_WEIGHT: 1,
		NET_WEIGHT: 0,
		GROSS_WEIGHT: 0,
		WIDTH_WEIGHT: 0,
		LENGTH_WEIGHT: 0,
		HEIGHT_WEIGHT: 0,
		VOLUMN_WEIGHT: 12,
		ROUND_WEIGHT: 0,
	};
	tableWeight.row.add(data).draw();
	setSelect2({ allowClear: false });
});

$(document).on("change", ".cell-input", async function (e) {
	e.preventDefault();
	const newValue = intVal($(this).val());
	const rowData = tableWeight.row($(this).closest("tr")).data();
	const columnIndex = $(this).closest("td")[0].cellIndex;
	const key = Object.keys(rowData)[columnIndex - 1];
	const data = { ...rowData, [key]: newValue };
	tableWeight.row($(this).closest("tr")).data(data).draw();
	// const nextCell = $(this).closest("td").next("td");
	// if (nextCell.length) {
	// 	nextCell.find("input").focus();
	// }
});
