import ExcelJS from "exceljs";
import dayjs from "dayjs";
import { intVal, showDigits, showMessage } from "@amec/webasset/utils";
import { currentUser } from "@amec/webasset/api/amec";
import { setSelect2 } from "@amec/webasset/select2";
import { createTable, destroyTable } from "@amec/webasset/dataTable";
import { createBtn } from "@amec/webasset/components/buttons";
import {
	getExportTemplate,
	getInquiry,
	getElmesItem,
	getSecondItem,
	getReason,
} from "../service/index.js";
import {
	projectConclude,
	addAttached,
	getFormHeader,
	getSearchHeader,
} from "./detail.js";
import { cloneRows } from "../service/excel.js";
import { setupElmesTable } from "./table_elmes.js";
import { setDeletedLineMap } from "./store.js";

export function initRow(id, seq) {
	return {
		INQD_ID: "",
		INQD_SEQ: seq,
		INQD_RUNNO: id,
		INQD_MFGORDER: "",
		INQD_ITEM: "",
		INQD_CAR: "",
		INQD_PARTNAME: "",
		INQD_DRAWING: "",
		INQD_VARIABLE: "",
		INQD_QTY: 1,
		INQD_UM: "PC",
		INQD_SUPPLIER: "",
		INQD_SENDPART: "",
		INQD_UNREPLY: "",
		INQD_FC_COST: "",
		INQD_TC_COST: "",
		INQD_UNIT_PRICE: "",
		INQD_FC_BASE: "",
		INQD_TC_BASE: "",
		INQD_MAR_REMARK: "",
		INQD_DES_REMARK: "",
		INQD_FIN_REMARK: "",
		INQD_LATEST: 1,
		INQD_OWNER_GROUP: $("#user-login").attr("groupcode"),
		CREATE_BY: $("#user-login").attr("empname"),
		UPDATE_BY: $("#user-login").attr("empname"),
		FORWARD: null,
	};
}

export async function addRow({ id, seq }, table, data = {}) {
	const newRow = await initRow(id, seq);
	data = { ...newRow, ...data };
	const row = table.row.add(data).draw();
	if ($(row.node()).find("td:eq(3) input").length > 0)
		$(row.node()).find("td:eq(3) input").focus();
}

//003: Unreply checkbox
export async function createReasonModal() {
	const reason = await getReason();
	let str = ``;
	reason.map((item) => {
		if (item.REASON_ID == 99) {
			str += `<li class="flex flex-col gap-2">
        <div>
            <input type="radio" name="reason"
                class="radio radio-sm radio-neutral me-2 reason-code"
                id="reason-${item.REASON_ID}"
                value="${item.REASON_ID}" />
            <span>${item.REASON_DESC}</span>
        </div>
        <div>
            <fieldset class="fieldset">
                <textarea class="textarea w-full text-comment" placeholder="Explain why can't reply this line" id="text-comment-other" maxlength="100"></textarea>
                <div class="label text-xs justify-start text-red-500 text-comment-err"></div>
                <div class="label text-xs justify-end"><span id="text-count">0</span>/100</div>
            </fieldset>
        </div>
      </li>`;
		} else {
			str += `<li>
        <input type="radio" name="reason"
            class="radio radio-sm radio-neutral me-2 reason-code"
            id="reason-${item.REASON_ID}" value="${item.REASON_ID}"/>
        <input type="hidden" class="text-comment" value="${item.REASON_DESC}"/>
        <span>${item.REASON_DESC}</span>
      </li>`;
		}
	});

	const btnSave = await createBtn({
		id: "save-reason",
		className: "btn-outline  btn-primary  text-primary hover:text-white",
	});
	const btnCancel = await createBtn({
		id: "cancel-reason",
		title: "Cancel",
		icon: "icofont-close text-2xl",
		className: "btn-outline  btn-neutral  text-neutral hover:text-white",
	});

	const modal = `
        <div id="reason_modal_wapper">
            <input type="checkbox" id="modal-reason" class="modal-toggle" />
            <div class="modal" role="dialog">
                <div class="modal-box p-8">
                    <h3 class="text-lg font-bold mb-3">Unable to reply reason</h3>
                    <div class="divider"></div>
                    <ul class="flex flex-col gap-3">${str}</ul>
                    <input type="hidden" id="reason-target"/>
                    <div class="flex gap-2">${btnSave}${btnCancel}</div>
                </div>
            </div>
        </div>`;
	$("body").append(modal);
}

export async function destroyReasonModal() {
	$("#reason_modal_wapper").remove();
}

//003: Unreply checkbox
export async function createElmesModal() {
	const modal = `
        <div id="elmes_modal_wapper">
            <input type="checkbox" id="elmes_modal" class="modal-toggle" />
            <div class="modal" role="dialog">
                <div class="modal-box p-8 min-w-8/12 min-h-[95vh]">
                <h3 class="text-lg font-bold">General Part List</h3>
                    <div class="divider"></div>
                    <input type="text" id="elmes-target" class="hidden">
                    <input type="text" id="elmes-type" class="hidden">
                    <table id="tableElmes" class="table table-zebra text-xs"></table>
                </div>
            </div>
        </div>
    `;
	$("body").append(modal);
}

export async function destroyElmesModal() {
	$("#elmes_modal_wapper").remove();
}

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

	const info = await getInquiry({
		INQ_ID: $("#inquiry-id").val(),
		IS_DETAILS: true,
	});
	const file = template.buffer;
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.load(file).then(async (workbook) => {
		const sheet = workbook.worksheets[0];
		sheet.getCell(2, 22).value = info[0].INQ_NO;
		sheet.getCell(4, 22).value = info[0].INQ_TRADER;
		sheet.getCell(5, 1).value = `Email: ${info[0].maruser.SRECMAIL}`;
		sheet.getCell(6, 1).value =
			`Tel: +66 (038) 93 6600 Ext.${info[0].maruser.NTELNO}`;

		sheet.getCell(9, 5).value = info[0].maruser.SNAME;
		sheet.getCell(10, 5).value = dayjs(info[0].INQ_DATE).format(
			"DD/MM/YYYY",
		);
		sheet.getCell(11, 5).value = info[0].INQ_AGENT;
		sheet.getCell(12, 5).value = info[0].INQ_COUNTRY;

		sheet.getCell(9, 19).value = dayjs(info[0].INQ_MAR_SENT).format(
			"DD/MM/YYYY",
		);
		sheet.getCell(10, 19).value = info[0].INQ_REV;
		sheet.getCell(11, 19).value = info[0].INQ_PRJNO;
		sheet.getCell(12, 19).value = info[0].INQ_PRJNAME;

		let s = 16;
		const details = info[0].details
			.filter((dt) => dt.INQD_LATEST == 1)
			.sort((a, b) => a.INQD_RUNNO - b.INQD_RUNNO);
		for (const i in details) {
			const rowdata = details[i];
			if (s > 36) await cloneRows(sheet, 20, s);
			await setdata(sheet, rowdata, s, info[0].shipment.SHIPMENT_VALUE);
			s++;
		}
		await workbook.xlsx.writeBuffer().then(function (buffer) {
			const blob = new Blob([buffer], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = `${info[0].INQ_NO}.xlsx`;
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

export function bindDeleteLine() {
	$(document).on("click", ".delete-sub-line", async function (e) {
		e.preventDefault();
		const table = $("#table").DataTable();
		const row = table.row($(this).closest("tr"));
		const data = row.data();
		if (data.INQD_ID != "") {
			//deletedLineMap.set(data.INQD_ID, data);
			setDeletedLineMap(data.INQD_ID, data);
		}
		row.remove().draw(false);
	});
}

$(document).on("change", ".carno", async function (e) {
	e.preventDefault();
	const table = $("#table").DataTable();
	const row = table.row($(this).closest("tr"));
	try {
		const data = row.data();
		const prjno = $("#project-no").val();
		const currentmfg = data.INQD_MFGORDER;
		const carno = $(this).val();
		const orders = await projectConclude({ prjno, carno });
		const mfgno = orders.length > 0 ? orders[0].MFGNO : "";
		const newData = {
			...data,
			INQD_CAR: carno,
			INQD_MFGORDER: mfgno,
		};
		row.data(newData);
		row.draw(false);
		await setSelect2({ allowClear: false });
		if (currentmfg !== mfgno && mfgno !== "") {
			$(row.node()).find(".elmes-input").trigger("change");
		}
	} catch (error) {
		console.log(error);
		await showMessage(error);
	} finally {
		$(row.node()).find(".mfgno").focus();
	}
});

$(document).on("change", ".edit-input", async function (e) {
	e.preventDefault();
	const table = $("#table").DataTable();
	const cell = table.cell($(this).closest("td"));
	let newValue = $(this).val();
	if ($(this).attr("type") === "checkbox" && !$(this).is(":checked"))
		newValue = null;
	if ($(this).attr("type") === "date") newValue = newValue.replace(/-/g, "/");
	if ($(this).attr("type") === "number") newValue = intVal(newValue);
	if ($(this).hasClass("uppercase")) newValue = newValue.toUpperCase();
	cell.data(newValue);
	setSelect2({ allowClear: false });
});

// 003: Show Elmes table
$(document).on("change", ".elmes-input", async function (e) {
	e.preventDefault();
	console.log("I've changed");
	const table = $("#table").DataTable();
	const row = table.row($(this).closest("tr"));
	const node = table.row($(this).closest("tr")).node();
	const item = $(node).find(".itemno").val();
	const mfg = $(node).find(".mfgno").val();
	let data = row.data();
	row.data({ ...data, INQD_ITEM: item, INQD_MFGORDER: mfg }).draw();
	if (mfg.length > 0 && item.length == 3) {
		let tableElmes;
		await createElmesModal();
		const elmes = await getElmesItem(mfg, item);
		const user = await currentUser();
		const type = user.group == "MAR" ? 1 : 0.01;
		if (elmes.length > 0) {
			const setting = await setupElmesTable(elmes);
			tableElmes = await createTable(setting, {
				id: "#tableElmes",
				columnSelect: {
					status: true,
					class: "max-w-[55px]!",
					width: "55px",
				},
			});

			$("#elmes-target").val(row.index());
			$("#elmes-type").val(type);
			$("#elmes_modal").attr("checked", true);
		} else {
			const newData = {
				...data,
				INQD_MFGORDER: mfg,
				INQD_ITEM: item,
			};
			row.data(newData);
			tableElmes = null;
			$(row.node()).find(".partname").focus();
		}
	}
});

$(document).on("click", "#elmes-confirm", async function (e) {
	e.preventDefault();
	const table = $("#table").DataTable();
	const tableElmes = $("#tableElmes").DataTable();
	try {
		const increse = Number($("#elmes-type").val());
		const elmesData = tableElmes.rows().data();
		const rowid = $("#elmes-target").val();
		const data = table.row(rowid).data();
		//1. Delete current row first
		table.rows(rowid).remove().draw();
		//2.Insert rows
		let i = 0;
		let id = intVal(data.INQD_SEQ);
		elmesData.map((val) => {
			if (val.selected !== undefined) {
				let supplier = `AMEC`;
				if (val.supply === "R") supplier = `LOCAL`;
				if (val.supply === "J") supplier = `MELINA`;
				if (val.supply === "U") supplier = ``;

				let second = `0`;
				if (val.scndpart != "" && val.scndpart.toUpperCase() !== "X")
					second = `1`;

				const newRow = {
					...data,
					id: id + i,
					INQD_SEQ: id + i,
					INQD_CAR: val.carno,
					INQD_MFGORDER: val.orderno,
					INQD_ITEM: val.itemno,
					INQD_PARTNAME: val.partname,
					INQD_DRAWING: val.drawing,
					INQD_VARIABLE: val.variable,
					INQD_QTY: val.qty,
					INQD_SUPPLIER: supplier,
					INQD_SENDPART: second,
				};
				table.row.add(newRow).draw(false);
				i = increse + i;
			}
		});
		setSelect2({ allowClear: false });
	} catch (error) {
		console.log(error);
		await showMessage(error);
	} finally {
		$("#elmes_modal").attr("checked", false);
		await destroyElmesModal();
	}
});

$(document).on("click", "#elmes-cancel", async function (e) {
	e.preventDefault();
	const inx = $("#elmes-target").val();
	const table = $("#table").DataTable();
	$("#elmes_modal").attr("checked", false);
	await destroyElmesModal();
	$(table.row(inx).node()).find(".partname").focus();
	setSelect2({ allowClear: false });
});

// 004: Second part checkbox
$(document).on("change", ".ndpartlist", async function (e) {
	e.preventDefault();
	const table = $("#table").DataTable();
	const row = table.row($(this).closest("tr"));
	const node = table.row($(this).closest("tr")).node();
	const item = $(node).find(".itemno").val();
	const mfg = $(node).find(".mfgno").val();
	let data = row.data();
	row.data({ ...data, INQD_ITEM: item, INQD_MFGORDER: mfg }).draw();
	if (mfg.length > 0 && item.length == 3) {
		let tableElmes;
		await createElmesModal();
		const elmes = await getSecondItem(mfg, item);
		const user = await currentUser();
		const type = user.group == "MAR" ? 1 : 0.01;
		if (elmes.length == 0) {
			row.data({
				...data,
				INQD_ITEM: item,
				INQD_MFGORDER: mfg,
				INQD_SENDPART: "1",
			}).draw();
			await destroyElmesModal();
			await setSelect2({ allowClear: false });
			return;
		}

		const setting = await setupElmesTable(elmes);
		tableElmes = await createTable(setting, {
			id: "#tableElmes",
			columnSelect: {
				status: true,
				class: "max-w-[55px]!",
				width: "55px",
			},
		});

		$("#elmes-target").val(row.index());
		$("#elmes-type").val(type);
		$("#elmes_modal").attr("checked", true);
	}
});

$(document).on("change", ".revokepartlist", async function (e) {
	e.preventDefault();
	const table = $("#table").DataTable();
	const row = table.row($(this).closest("tr"));
	row.data({ ...data, INQD_SENDPART: null }).draw();
});

// 004: Unable to reply checkbox
$(document).on("click", ".unreply", async function (e) {
	//e.preventDefault();
	const table = $("#table").DataTable();
	const row = table.row($(this).parents("tr"));
	if (!$(this).is(":checked")) {
		const data = row.data();
		const newData = {
			...data,
			INQD_UNREPLY: null,
			INQD_SUPPLIER: "",
		};
		row.data(newData).draw();
		setSelect2({ allowClear: false });
		return;
	}

	await createReasonModal();
	const data = row.data();
	if (data.INQD_UNREPLY != "") {
		$(`#reason-${data.INQD_UNREPLY}`).prop("checked", true);
		if (data.INQD_UNREPLY == 99)
			$("#text-comment-other").val(data.INQD_MAR_REMARK);
	} else {
		$(`.reason-code:first`).prop("checked", true);
	}
	$("#reason-target").val(row.index());
	$("#modal-reason").click();
});

$(document).on("click", ".text-comment", async function () {
	$("#reason-99").prop("checked", true);
});

$(document).on("keyup", ".text-comment", async function () {
	$(this).removeClass("border-red-500");
	$(this).closest("li").find(".text-comment-err").html("");
	$("#text-count").removeClass("text-red-500");
	const txt = $(this).val();
	let cnt = $(this).val().length;
	if (cnt > 100) {
		$("#text-count").addClass("text-red-500");
		$(this).val(txt.substring(0, 100));
		$(this).addClass("border-red-500");
		$(this)
			.closest("li")
			.find(".text-comment-err")
			.html(`Maximun is 100 charactors.`);
		return;
	}
	$("#text-count").html(cnt);
});

$(document).on("click", "#save-reason", async function (e) {
	e.preventDefault();
	try {
		const table = $("#table").DataTable();
		const selected = $(".reason-code:checked");
		const remark = selected.closest("li").find(".text-comment").val();
		if (remark.trim().length < 3 || selected.val() == undefined) {
			$(".text-comment").addClass("border-red-500");
			$(".text-comment-err").html(
				`Please explain reason, Why you can't reply this line. (Minimum 3 characters)`,
			);
			return;
		}
		const groupcode = (await currentUser()).group;
		const marremark = groupcode == "MAR" ? remark : null;
		const deremark = groupcode != "MAR" ? remark : null;
		const target = $("#reason-target").val();
		const row = table.row(target);
		const data = row.data();
		const newData = {
			...data,
			INQD_UNREPLY: selected.val(),
			INQD_MAR_REMARK:
				marremark == null ? data.INQD_MAR_REMARK : marremark,
			INQD_DES_REMARK: deremark == null ? data.INQD_DES_REMARK : deremark,
			INQD_SUPPLIER: "N/A",
		};
		table.row(target).data(newData);
		setSelect2({ allowClear: false });
		$("#text-comment-other").val(``);
		$("#text-count").html(`0`);
		$("#modal-reason").prop("checked", false);
		await destroyReasonModal();
	} catch (error) {
		console.log(error);
		await showMessage(error);
	}
});

$(document).on("click", "#cancel-reason", async function (e) {
	e.preventDefault();
	try {
		const table = $("#table").DataTable();
		const target = $("#reason-target").val();
		const row = table.row(target);
		const data = row.data();
		const newData = {
			...data,
			INQD_UNREPLY: ``,
			// INQD_MAR_REMARK: ``,
		};
		table.row(target).data(newData);
		setSelect2({ allowClear: false });
		$("#text-comment-other").val(``);
		$("#text-count").html(`0`);
		$("#modal-reason").prop("checked", false);
	} catch (error) {
		console.log(error);
		await showMessage(error);
	}
});

//009: Add attachment
$(document).on("change", "#attachment-file", async function (e) {
	const table = $("#attachment").DataTable();
	const datafile = await addAttached(e);
	if (datafile.files.length > 0) {
		//selectedFilesMap = datafile.selectedFilesMap;
		datafile.files.map((fs) => {
			table.row.add(fs).draw();
		});
	}
});

//010: Download attached file
$(document).on("click", ".download-att-client", async function (e) {
	e.preventDefault();
	const row = tableAttach.row($(this).closest("tr"));
	const data = row.data();
	const fileName = data.FILE_ORIGINAL_NAME;
	await downloadClientFile(selectedFilesMap, fileName);
});

//011: Delete attached file
$(document).on("click", ".delete-att", function (e) {
	e.preventDefault();
	const row = tableAttach.row($(this).closest("tr"));
	const data = row.data();
	if (data.FILE_ID !== undefined) {
		deletedFilesMap.set(data);
	}
	const fileName = data.FILE_ORIGINAL_NAME;
	selectedFilesMap.delete(fileName);
	row.remove().draw(false);
});

//012: Reset report form
$(document).on("click", "#reset-report", async function (e) {
	e.preventDefault();
	$("#form-container")[0].reset();
	$(".select").val(null).trigger("change");
	localStorage.removeItem("spinquiryquery");
});

export function bindSearchReport(callback) {
	$(document).on("click", "#search", async function (e) {
		e.preventDefault();
		try {
			localStorage.removeItem("spinquiryquery");
			let formdata = await getFormHeader();
			Object.keys(formdata).forEach(
				(key) => formdata[key] == "" && delete formdata[key],
			);
			if (Object.keys(formdata).length == 0) {
				await showMessage(
					"Please select at least one filter criteria.",
				);
				return;
			}
			formdata = await getSearchHeader(formdata);
			await callback(formdata);
			$("#form-container").addClass("hidden");
			$("#report-table").removeClass("hidden");
			localStorage.setItem("spinquiryquery", JSON.stringify(formdata));
			history.pushState({ page: "results" }, "Search Results");
		} catch (error) {
			console.log(error);
			await showMessage(`Something went wrong.`);
		}
	});

	window.onpopstate = async function (event) {
		$("#report-table").addClass("hidden");
		$("#form-container").removeClass("hidden");
		localStorage.removeItem("spinquiryquery");
		await destroyTable();
	};
}
