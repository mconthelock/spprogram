import ExcelJS from "exceljs";
import { intVal, showDigits } from "@amec/webasset/utils";
import { setSelect2 } from "@amec/webasset/select2";
import { getExportTemplate, getInquiryID } from "../service/inquiry.js";
import { cloneRows } from "../service/excel.js";
import {
	addRow,
	changeCar,
	changeCell,
	elmesSetup,
	elmesConform,
	elmesCancel,
} from "./detail.js";

export const statusColors = () => {
	return [
		{ id: 1, color: "bg-gray-300 text-gray-600" }, //Draft
		{ id: 2, color: "bg-teal-500 text-white" }, //New
		{ id: 9, color: "bg-yellow-400" }, //Revise
		{ id: 19, color: "bg-cyan-500" }, //SE
		{ id: 29, color: "bg-blue-500 text-white" }, //DE
		{ id: 39, color: "bg-slate-500 text-white" }, //IS
		{ id: 49, color: "bg-amber-500 text-white" }, //FIN
		{ id: 59, color: "bg-teal-500 text-white" }, //MAR [Post process]
		{ id: 98, color: "bg-red-500 text-white" }, //Cancel
		{ id: 99, color: "bg-primary text-white" }, //Finish
	];
};

$(document).on("mouseenter", ".detail-log", function () {
	const data = $(this).closest("td").find("ul");
	const content = $("#tip1");
	content.find(".tooltip-content").html("");
	content.find(".tooltip-content").append(`<ul>${data.html()}</ul>`);
	const rect = $(this)[0].getBoundingClientRect();
	content.css("top", rect.bottom + window.scrollY + "px");
	content.css("left", rect.left + window.scrollX + "px");
	content.removeClass("hidden");
});

$(document).on("mouseleave", ".detail-log", function () {
	$("#tip1").addClass("hidden");
});

$(document).on("click", "#add-attachment", async function (e) {
	e.preventDefault();
	$("#attachment-file").click();
});

$(document).on("click", ".view-last-revision", function (e) {
	e.preventDefault();
	$("#inquiry-last-revision").prop("checked", true);
});

$(document).on("click", "#export-detail", async function (e) {
	e.preventDefault();
	const setdata = async (sheet, el, r, num) => {
		sheet.getCell(r, 1).value = el.INQD_SEQ;
		sheet.getCell(r, 2).value = el.INQD_CAR;
		sheet.getCell(r, 3).value = el.INQD_MFGORDER;
		sheet.getCell(r, 5).value = el.INQD_ITEM;
		sheet.getCell(r, 6).value = el.INQD_PARTNAME;
		sheet.getCell(r, 10).value = el.INQD_DRAWING;
		sheet.getCell(r, 14).value = el.INQD_VARIABLE;
		sheet.getCell(r, 18).value = num;
		sheet.getCell(r, 19).value = el.INQD_SUPPLIER;
		sheet.getCell(r, 21).value = el.INQD_QTY;
		sheet.getCell(r, 22).value = el.INQD_UM;
		sheet.getCell(r, 23).value = el.INQD_SENDPART !== null ? "P" : "";
		sheet.getCell(r, 24).value = el.INQD_UNREPLY !== null ? "P" : "";
		sheet.getCell(r, 25).value = el.INQD_MAR_REMARK;
	};

	const template = await getExportTemplate({
		name: `exportinquirydetail.xlsx`,
	});

	const info = await getInquiryID($("#inquiry-id").val());
	const file = template.buffer;
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.load(file).then(async (workbook) => {
		const sheet = workbook.worksheets[0];
		sheet.getCell(2, 22).value = info.INQ_NO;
		sheet.getCell(4, 22).value = info.INQ_TRADER;
		sheet.getCell(5, 1).value = `Email: ${info.maruser.SRECMAIL}`;
		sheet.getCell(6, 1).value =
			`Tel: +66 (038) 93 6600 Ext.${info.maruser.NTELNO}`;

		sheet.getCell(9, 5).value = info.maruser.SNAME;
		sheet.getCell(10, 5).value = moment(info.INQ_DATE).format("DD/MM/YYYY");
		sheet.getCell(11, 5).value = info.INQ_AGENT;
		sheet.getCell(12, 5).value = info.INQ_COUNTRY;

		sheet.getCell(9, 19).value = moment(info.INQ_MAR_SENT).format(
			"DD/MM/YYYY",
		);
		sheet.getCell(10, 19).value = info.INQ_REV;
		sheet.getCell(11, 19).value = info.INQ_PRJNO;
		sheet.getCell(12, 19).value = info.INQ_PRJNAME;

		let s = 16;
		const details = info.details
			.filter((dt) => dt.INQD_LATEST == 1)
			.sort((a, b) => a.INQD_RUNNO - b.INQD_RUNNO);
		for (const i in details) {
			const rowdata = details[i];
			if (s > 36) await cloneRows(sheet, 20, s);
			await setdata(sheet, rowdata, s, info.shipment.SHIPMENT_VALUE);
			s++;
		}
		await workbook.xlsx.writeBuffer().then(function (buffer) {
			const blob = new Blob([buffer], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = `${info.INQ_NO}.xlsx`;
			link.click();
		});
	});
});

// Inquiry Detail Table
$(document).on("click", "#addRowBtn", async function (e) {
	e.preventDefault();
	const table = $("#table").DataTable();
	const lastRow = table.row(":not(.d-none):last").data();
	let id = lastRow === undefined ? 1 : parseInt(lastRow.INQD_RUNNO) + 1;
	let seq = lastRow === undefined ? 1 : parseInt(lastRow.INQD_SEQ) + 1;
	await addRow({ id, seq }, table);
	await setSelect2({ allowClear: false });
});

$(document).on("click", ".add-sub-line", async function (e) {
	e.preventDefault();
	const table = $("#table").DataTable();
	const data = table.row($(this).parents("tr")).data();
	const seq = showDigits(intVal(data.INQD_SEQ) + 0.01, 2);
	const id = parseInt(data.INQD_RUNNO) + 0.1;
	await addRow({ id, seq }, table);
	await setSelect2({ allowClear: false });
});

$(document).on("click", ".delete-sub-line", async function (e) {
	e.preventDefault();
	const table = $("#table").DataTable();
	const row = table.row($(this).closest("tr"));
	const data = row.data();
	if (data.INQD_ID != "") {
		deletedLineMap.set(data.INQD_ID, data);
	}
	row.remove().draw(false);
});

$(document).on("change", ".carno", async function (e) {
	e.preventDefault();
	const table = $("#table").DataTable();
	await changeCar(table, this);
});

$(document).on("change", ".edit-input", async function (e) {
	e.preventDefault();
	const table = $("#table").DataTable();
	await changeCell(table, this);
});

$(document).on("change", ".elmes-input", async function (e) {
	e.preventDefault();
	const table = $("#table").DataTable();
	const row = table.row($(this).closest("tr"));
	const node = table.row($(this).closest("tr")).node();
	const item = $(node).find(".itemno").val();
	const mfg = $(node).find(".mfgno").val();
	let data = row.data();
	row.data({ ...data, INQD_ITEM: item, INQD_MFGORDER: mfg }).draw();
	if (item != "" && mfg != "") {
		await elmesSetup(row);
	}
});

//003: Show Elmes table
$(document).on("click", "#elmes-confirm", async function (e) {
	e.preventDefault();
	const table = $("#table").DataTable();
	const tableElmes = $("#tableElmes").DataTable();

	const increse = 1;
	const elmesData = tableElmes.rows().data();
	await elmesConform(elmesData, increse, table);
});

$(document).on("click", "#elmes-cancel", async function (e) {
	e.preventDefault();
	const table = $("#table").DataTable();
	await elmesCancel(table);
});
