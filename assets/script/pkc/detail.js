import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";

import dayjs from "dayjs";
import select2 from "select2";
import { showLoader } from "@amec/webasset/preloader";
import { setSelect2 } from "@amec/webasset/select2";
import { showMessage, intVal, showDigits } from "@amec/webasset/utils";
import { createBtn, activatedBtn } from "@amec/webasset/components/buttons";
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
	createWeight,
	updateInquiryTimeline,
	createInquiryHistory,
} from "../service/index.js";
import { initApp } from "../utils.js";

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

		const save = await createBtn();

		const back = await createBtn({
			id: "goback",
			title: "Back",
			type: "link",
			href: `${process.env.APP_ENV}/pkc/inquiry`,
			icon: "fi fi-rr-arrow-circle-left text-xl",
			className: `btn-outline btn-neutral text-neutral hover:text-white hover:bg-neutral/70`,
		});
		$("#btn-container").append(save, back);
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
		PACKAGE_TYPE: "Wooden package",
		NO_WEIGHT: 1,
		NET_WEIGHT: 0,
		GROSS_WEIGHT: 0,
		WIDTH_WEIGHT: 0,
		LENGTH_WEIGHT: 0,
		HEIGHT_WEIGHT: 0,
		VOLUMN_WEIGHT: 0,
		ROUND_WEIGHT: 0,
	};
	tableWeight.row.add(data).draw();
	$("#table-weight").find("tbody tr:last").find("td:eq(3) input").focus();
	setSelect2({ allowClear: false });
});

$(document).on("click", ".delete-weight-row", async function (e) {
	e.preventDefault();
	const selectedRow = $(this).closest("tr");
	const found = tableWeight.row(selectedRow).data();
	const seq = intVal(found.SEQ_WEIGHT);
	tableWeight.row(selectedRow).remove().draw();
	var i = seq;
	tableWeight.rows().every(function (rw) {
		const dt = this.data();
		if (intVal(dt.SEQ_WEIGHT) >= seq) {
			this.cells(rw, 1).every(function () {
				this.data(i++);
			});
		}
	});
});

$(document).on("change", ".cell-input", async function (e) {
	e.preventDefault();
	const selectedRow = $(this).closest("tr");
	const selectedCol = $(this).closest("td");
	let row = tableWeight.row(selectedRow).data();
	const name = $(this).attr("data-name");
	row[name] = intVal($(this).val());
	row = await volumn(row);
	tableWeight.row(selectedRow).data(row).draw(false);
	const next = $(selectedCol).index() + 1;
	const nexCol = tableWeight.row(selectedRow).column(next).nodes().to$();
	if ($(nexCol).find("input").length > 0) $(nexCol).find("input").select();
	setSelect2({ allowClear: false });
});

$(document).on("click", "#btn-save", async function (e) {
	e.preventDefault();
	try {
		await activatedBtn($(this));
		const data = tableWeight.data().toArray();
		const weight = data.map(async (dt) => {
			dt.INQ_ID = $("#inquiry-id").val();
			await createWeight(dt);
		});
		const timeline = {
			INQ_NO: $("#inquiry-no").val(),
			INQ_REV: $("#revision").val(),
			PKC_USER: $("#user-login").attr("empno"),
			PKC_CONFIRM: new Date(),
		};
		await updateInquiryTimeline(timeline);
		const history = {
			INQ_NO: $("#inquiry-no").val(),
			INQ_REV: $("#revision").val(),
			INQH_DATE: new Date(),
			INQH_USER: $("#user-login").attr("empno"),
			INQH_ACTION: 25,
			INQH_LATEST: 1,
		};
		await createInquiryHistory(history);
		window.location.replace(`${process.env.APP_ENV}/pkc/inquiry`);
	} catch (error) {
		console.log(error);
		await showMessage(error);
		await activatedBtn($(this), false);
	}
});

function volumn(el) {
	const w = intVal(el.WIDTH_WEIGHT);
	const l = intVal(el.LENGTH_WEIGHT);
	const h = intVal(el.HEIGHT_WEIGHT);
	const val = (w * l * h) / 1000000;
	el.VOLUMN_WEIGHT = val;
	el.ROUND_WEIGHT = Math.ceil(val);
	return el;
}
