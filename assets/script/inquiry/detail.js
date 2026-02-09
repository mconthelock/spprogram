/*
Funtion contents
000 - Read all field definition from json file
001 - Card management
002 - Import data from file
003 - Unreply checkbox
004 - Search Elmes data
005 - Verify form before save
*/
import "select2/dist/css/select2.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";

import dayjs from "dayjs";
import select2 from "select2";
import { setSelect2 } from "@amec/webasset/select2";
import { readInput } from "@amec/webasset/excel";
import { displayEmpInfo } from "@amec/webasset/indexDB";
import { createTable, destroyTable } from "@amec/webasset/dataTable";
import { createBtn } from "@amec/webasset/components/buttons";
import { intVal } from "@amec/webasset/utils";

import { getReason } from "../service/master";
import { getElmesItem } from "../service/elmes.js";
import { getMainProject } from "../service/mkt.js";
import * as utils from "../utils.js";
import * as dwg from "../drawing.js";
import * as source from "./source";
import * as tb from "./table.js";
select2();

export const statusColors = () => {
	return [
		{ id: 1, color: "bg-gray-300 text-gray-600" }, //Draft
		{ id: 2, color: "bg-teal-500 text-white" }, //New
		{ id: 9, color: "bg-yellow-400" }, //revise
		{ id: 19, color: "bg-cyan-500" }, //SE
		{ id: 29, color: "bg-blue-500 text-white" }, //DE
		{ id: 39, color: "bg-slate-500 text-white" }, //IS
		{ id: 49, color: "bg-amber-500 text-white" }, //FIN
		{ id: 59, color: "bg-teal-500 text-white" }, //MAR [Post process]
		{ id: 98, color: "bg-red-500 text-white" }, //Cancel
		{ id: 99, color: "bg-primary text-white" }, //Finish
	];
};
// 000: Read all field definition from json file
export async function fields() {
	const jsonContext = require.context("../../files", false, /\.json$/);
	let allfields = [];
	jsonContext.keys().forEach((key) => {
		const content = jsonContext(key);
		allfields.push(content);
	});
	return allfields;
}

// 001: Create card
export async function setupCard(data) {
	const form = $("#form-container");
	const carddata = form.attr("data");
	const cardIds = carddata.split("|");
	const cardPromises = cardIds.map(async (cardId) => {
		return new Promise(async (resolve) => {
			const formData = await fields();
			const cardData = formData.find((item) => item.id === cardId);
			if (cardData) {
				const cardElement = await createFormCard(cardData, data);
				resolve(cardElement);
			} else {
				console.error(`Card data for ID ${cardId} not found.`);
				resolve(null);
			}
		});
	});

	const cardElements = await Promise.all(cardPromises);
	cardElements.forEach((element) => {
		if (element) {
			form.append(element);
			if ($(element).find("#currency").length > 0) {
				//$(element).find("#currency").closest(".grid").addClass("hidden");
			}
		}
	});
}

export async function createFormCard(cardData, data = {}) {
	const card = document.createElement("div");
	card.className = "bg-white rounded-lg shadow-lg overflow-hidden p-4";
	const header = document.createElement("div");
	header.className = "divider divider-start divider-primary";
	const headTxt = document.createElement("span");
	headTxt.className = "font-extrabold text-md text-primary ps-3";
	headTxt.textContent = cardData.title;
	header.appendChild(headTxt);
	card.appendChild(header);

	const body = document.createElement("div");
	body.className = "space-y-4";
	// ใช้ for...of loop เพื่อให้สามารถใช้ await ได้
	if (Object.keys(data).length === 0) {
		data = {
			...data,
			INQ_DATE: dayjs().format("YYYY-MM-DD"),
			INQ_CUSTRQS: dayjs().add(61, "days").format("YYYY-MM-DD"),
			INQ_STATUS: 2,
			status: { id: 2, STATUS_DESC: "New" },
			INQ_MAR_PIC: $("#user-login").attr("empno"),
			INQ_REV: "*",
		};
	}
	for (let field of cardData.fields) {
		const fieldWrapper = document.createElement("div");
		if (field.type == "table") {
			fieldWrapper.className = `w-full mt-2 ${data.INQ_PKC_REQ == 0 ? "hidden" : ""}`;
			const inputElement = await freightTable();
			fieldWrapper.innerHTML = inputElement;
			body.appendChild(fieldWrapper);
			continue;
		}

		fieldWrapper.className = `grid grid-cols-3 items-center gap-2 min-h-[42px] m-1 ${
			field.type == "hidden" ? "hidden" : ""
		}`;
		const label = document.createElement("label");
		label.htmlFor = field.id || "";
		label.className = "text-sm font-bold text-gray-600 col-span-1";
		label.textContent = field.label;
		field = await setFieldValue(field, data);
		const inputElement = await createFieldInput(field);
		fieldWrapper.appendChild(label);
		fieldWrapper.appendChild(inputElement);
		body.appendChild(fieldWrapper);
	}

	card.appendChild(body);
	return card;
}

export async function setFieldValue(field, data = {}) {
	const dspName = async (data, field) => {
		const val =
			field.topic !== undefined
				? data[field.topic][field.name]
				: data[field.name];
		if (val == null) return field;
		const emp = await displayEmpInfo(val);
		const name = emp.SNAME.replace(/  /g, " ").toLowerCase();
		const sname = name.split(" ");
		const fname = sname[0].charAt(0).toUpperCase() + sname[0].slice(1);
		const lname = sname[1].charAt(0).toUpperCase() + sname[1].slice(1);
		field.display = `${fname} ${lname}`;
		field.value = val;
		return field;
	};

	const dspStatus = async (data, field) => {
		const colors = await statusColors();
		const cls = colors.find((item) => item.id >= data.INQ_STATUS);
		field.class = cls.color;
		field.display = data.status == null ? "N/A" : data.status.STATUS_DESC;
		return field;
	};

	const showNesting = (data, field) => {
		if (data[field.topic] == undefined) return field;
		const values = data[field.topic][field.mapping];
		field.display = values;
		return field;
	};

	const setNestingValue = async (data, field) => {
		const values = data[field.topic][field.mapping];
		field.value = values;
		return field;
	};

	// Start hear
	field.value = data[field.name];
	if (field.name == "INQ_PKC_REQ")
		field.display = data["INQ_PKC_REQ"] == 1 ? "Yes" : "No";
	if (field.type == "status") field = await dspStatus(data, field);

	if (field.class && field.class.includes("fdate"))
		field.value = dayjs(field.value).format("YYYY-MM-DD");

	if (field.class && field.class.includes("agent"))
		field.value = `${data["INQ_AGENT"]} (${data["INQ_COUNTRY"]})`;

	if (field.class && field.class.includes("shownesting"))
		field = await showNesting(data, field);

	if (field.class && field.class.includes("setnesting"))
		field = await setNestingValue(data, field);

	if (field.class && field.class.includes("displayname"))
		field = await dspName(data, field);

	return field;
}

export async function createFieldInput(field) {
	const inputContainer = document.createElement("div");
	inputContainer.className = "col-span-2";
	let elementToListen;
	const loader = document.createElement("span");
	loader.className = "loading loading-spinner";
	switch (field.type) {
		case "textarea":
			const textarea = `<textarea name="${field.name}"
        id="${field.id}" class="textarea w-full ${
			field.class !== undefined ? field.class : ""
		}" data-mapping="${field.mapping}"></textarea>`;
			inputContainer.innerHTML = textarea;
			break;

		case "select":
			let options = [];
			let optStr = "<option value=''></option>";
			if (field.source) {
				if (source.init[field.source])
					options = await source.init[field.source]();
			} else if (field.options) {
				options = field.options;
			}
			options.forEach((opt) => {
				optStr += `<option value="${opt.id}" ${
					opt.id == field.value ? "selected" : ""
				}>${opt.text}</option>`;
			});
			const selectInput = `<select name="${field.name}"
            id="${field.id}"
            class="w-full border border-gray-300 rounded-md p-2 bg-white select2 ${
				field.class !== undefined ? field.class : ""
			}"
            data-mapping="${
				field.mapping !== undefined ? field.mapping : ""
			}">${optStr}</select>`;
			inputContainer.innerHTML = selectInput;
			elementToListen = inputContainer.querySelector(`#${field.id}`);
			setTimeout(async () => {
				const jQueryElement = $(`#${field.id}`);
				//jQueryElement.select2({ width: "100%" });
				await setSelect2({
					element: `#${field.id}`,
					placeholder: field.label || "",
					allowClear: false,
				});
				jQueryElement.removeAttr("aria-hidden");
				if (field.onChange && source.events[field.onChange]) {
					jQueryElement.on("change", source.events[field.onChange]);
				}
			}, 1000);
			break;

		case "radio":
			let optionstr = ``;
			const value = field.value ? field.value : "0";
			field.options.forEach((opt) => {
				optionstr += `<label class="flex items-center gap-2 text-sm">
            <input type="radio" name="${
				field.name
			}" class="radio radio-primary" ${
				opt.value == value ? "checked" : ""
			} value="${opt.value}"/> ${opt.text}
        </label>`;
			});
			const radioGroup = `<div class="flex items-center gap-4 h-full">${optionstr}</div>`;
			inputContainer.innerHTML = radioGroup;
			break;

		case "status":
			const statusBadge = `<div class="badge ${field.class}">${field.display}</div><input type="hidden" name="${field.name}" value="${field.value}" id="${field.id}"/>`;
			inputContainer.innerHTML = statusBadge;
			break;

		case "hidden":
			const hidden = `<input type="hidden" class="${
				field.class ? field.class : ""
			}" id="${field.id ? field.id : ""}" name="${
				field.name ? field.name : ""
			}" value="${field.value ? field.value : ""}"/>`;
			inputContainer.innerHTML = hidden;
			break;

		case "staticText":
			let text = !field.display ? field.value : field.display;
			text = text == null ? "" : text;
			let staticText = `<p class="text-sm h-full flex items-center text-gray-700 border-b border-gray-300 pb-2 ps-2 ${
				field.class !== undefined ? field.class : ""
			}" data-id="${field.id}">${text}</p>`;
			if (field.input)
				staticText += `<input type="hidden" name="${field.name}" value="${field.value}" id="${field.id}"/>`;
			inputContainer.innerHTML = staticText;
			break;

		default:
			const inputLabel = `<label class="input bg-white w-full">
            <input type="${field.type}" id="${field.id}"
                name="${field.name !== undefined ? field.name : field.id}"
                class="w-full ${field.class !== undefined ? field.class : ""}"
                value="${
					field.value === undefined || field.value == null
						? ""
						: field.value
				}"
                maxlength="${
					field.maxlength !== undefined ? field.maxlength : ""
				}"
                ${field.type == "readonly" ? "readonly" : ""}
                data-mapping="${field.mapping}"/>
            <span class="loading loading-spinner text-primary  hidden"></span>
        </label>`;
			inputContainer.innerHTML = inputLabel;
			elementToListen = inputContainer.querySelector(`#${field.id}`);
			if (
				elementToListen &&
				field.onChange &&
				source.events[field.onChange]
			) {
				elementToListen.addEventListener(
					"change",
					source.events[field.onChange],
				);
			}
			break;
	}
	return inputContainer;
}

export async function freightTable() {
	const weightTypes = [
		{ id: "sea", text: "Sea" },
		{ id: "air", text: "Air" },
		{ id: "courier", text: "Courier" },
	];
	let freightTable = `<table id="table-freight" class="table table-all-cell-border display table-md">
    <thead>
        <tr class="bg-gray-200">
            <th>FREIGHT TYPE</th>
            <th>FREIGHT</th>
            <th>VOLUMN</th>
            <th>TOTAL</th>
        </tr>
    </thead>
    <tbody>`;
	weightTypes.forEach((type) => {
		freightTable += `<tr>
        <td class="px-3!">${type.text}</td>
        <td><input type="text" class="${type.id}-value freight-value" /></td>
        <td><input type="text" class="${type.id}-voulumn" readonly /></td>
        <td><input type="text" class="${type.id}-total" readonly /></td>
    </tr>`;
	});
	freightTable += `</tbody></table>`;
	return freightTable;
}

// 002: Import data from file
export async function importExcel(file) {
	const excelData = await readInput(file, {
		startRow: 2,
		endCol: 10,
		headerName: [
			"Inquiry No",
			"Seq. no",
			"Drawing No",
			"Part Name",
			"Qty",
			"Unit",
			"Variable",
			"Original MFG No",
			"Original Car No",
			"Item",
		],
	});

	if (excelData.length > 0) {
		const readdata = excelData.map(async (el, i) => {
			const variavle = dwg.validateVariable(el[6]);
			const init = await tb.initRow(el[1]);
			const newRow = {
				...init,
				INQD_CAR: el[8],
				INQD_MFGORDER: el[7],
				INQD_ITEM: el[9],
				INQD_PARTNAME: el[3],
				INQD_DRAWING: el[2],
				INQD_VARIABLE: variavle.isValid ? el[6] : "",
				INQD_MAR_REMARK: variavle.isValid ? "" : el[6],
				INQD_QTY: el[4],
				INQD_UM: el[5],
				INQD_SUPPLIER: "AMEC",
				INQD_OWNER: "MAR",
				INQ_NO: el[0],
			};

			// ---------- Check 2na on Elmes here ----------
			return newRow;
		});
		const result = await Promise.all(readdata);
		await importHeader({
			mfgno: result[0].INQD_MFGORDER,
			inquiryno: result[0].INQ_NO,
			item: result[0].INQD_ITEM,
			file: file.name,
		});
		return result;
	} else {
		return null;
	}
}

export async function importText(file) {
	const readFile = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				resolve(e.target.result);
			};
			reader.onerror = (e) => {
				reject(e);
			};
			reader.readAsText(file);
		});
	};

	const contents = await readFile(file);
	const lines = contents.split("\n").filter((line) => line.trim() !== "");
	if (lines.length == 0) return null;
	const cols = lines[0].split("\t");
	if (cols.length !== 10) return;
	const readdata = [];
	lines.forEach(function (row) {
		const el = row.split("\t");
		const variavle = dwg.validateVariable(el[6]);
		const init = tb.initRow(el[1]);
		const newRow = {
			...init,
			INQD_CAR: el[8],
			INQD_MFGORDER: el[7].replaceAll("-", ""),
			INQD_ITEM: el[9].substring(0, 3),
			INQD_PARTNAME: el[3],
			INQD_DRAWING: el[2],
			INQD_QTY: el[4],
			INQD_UM: el[5],
			INQD_SUPPLIER: "AMEC",
			INQD_OWNER: "MAR",
			INQ_NO: el[0],
			INQD_VARIABLE: variavle.isValid ? el[6] : "",
			INQD_MAR_REMARK: variavle.isValid ? "" : el[6],
		};
		// ---------- Check 2na on Elmes here ----------
		readdata.push(newRow);
	});

	await importHeader({
		mfgno: readdata[0].INQD_MFGORDER,
		inquiryno: readdata[0].INQ_NO,
		item: readdata[0].INQD_ITEM,
		file: file.name,
	});
	return readdata;
}

export async function importHeader(data) {
	const prj = await getMainProject({ SMFGNO: data.mfgno.substring(0, 8) });
	if (prj.length > 0) {
		const projectNo = document.querySelector("#project-no");
		projectNo.value = prj[0].PRJ_NO;
		if (source.events.handleProjectChange) {
			await source.events.handleProjectChange({ target: projectNo });
		}
	} else if (data.mfgno.toUpperCase().indexOf("STOCK") > -1) {
		const name = data.file.split("_");
		const str = name[1] == undefined ? "" : name[1];
		await source.stockHeader(str, data.item);
	}

	const inqno = document.querySelector("#inquiry-no");
	inqno.value = data.inquiryno;
	inqno.dispatchEvent(new Event("change"));
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

	const modal = `<input type="checkbox" id="modal-reason" class="modal-toggle" />
        <div class="modal" role="dialog">
            <div class="modal-box p-8">
                <h3 class="text-lg font-bold mb-3">Unable to reply reason</h3>
                <div class="divider"></div>
                <ul class="flex flex-col gap-3">${str}</ul>
                <input type="hidden" id="reason-target"/>
                <div class="flex gap-2">${btnSave}${btnCancel}</div>
            </div>
        </div>
    `;
	$("body").append(modal);
}

export async function clickUnreply(obj, row) {
	if (!obj.is(":checked")) {
		const tr = $(obj).closest("tr");
		tr.find(".supplier").attr("disabled", false);
		return;
	}
	//   const row = table.row($(this).parents("tr"));
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
}

export async function countReason(obj) {
	$(obj).removeClass("border-red-500");
	$(obj).closest("li").find(".text-comment-err").html("");
	$("#text-count").removeClass("text-red-500");
	const txt = $(obj).val();
	let cnt = $(obj).val().length;
	if (cnt > 100) {
		$("#text-count").addClass("text-red-500");
		$(obj).val(txt.substring(0, 100));
		$(obj).addClass("border-red-500");
		$(obj)
			.closest("li")
			.find(".text-comment-err")
			.html(`Maximun is 100 charactors.`);
		return;
	}
	$("#text-count").html(cnt);
}

export async function saveUnreply(table) {
	const selected = $(".reason-code:checked");
	const remark = selected.closest("li").find(".text-comment").val();
	if (remark == "" || selected.val() == undefined) {
		$(".text-comment").addClass("border-red-500");
		$(".text-comment-err").html(
			`Please explain reason, Why you can't reply this line.`,
		);
		return;
	}

	const groupcode = $("#user-login").attr("groupcode");
	const marremark = groupcode == "MAR" ? remark : null;
	const deremark = groupcode != "MAR" ? remark : null;
	const target = $("#reason-target").val();
	const row = table.row(target);
	const data = row.data();
	const newData = {
		...data,
		INQD_UNREPLY: selected.val(),
		INQD_MAR_REMARK: marremark == null ? data.INQD_MAR_REMARK : marremark,
		INQD_DES_REMARK: deremark == null ? data.INQD_DES_REMARK : deremark,
		INQD_SUPPLIER: "",
	};
	table.row(target).data(newData);
	await resetUnreplyForm();
}

export async function resetUnreply(table) {
	const target = $("#reason-target").val();
	const row = table.row(target);
	const data = row.data();
	const newData = {
		...data,
		INQD_UNREPLY: ``,
		// INQD_MAR_REMARK: ``,
	};
	table.row(target).data(newData);
	await resetUnreplyForm();
}

export async function resetUnreplyForm() {
	$("#text-comment-other").val(``);
	$("#text-count").html(`0`);
	$("#modal-reason").prop("checked", false);
}
//End: Unreply

//004: Search Elmes data
export async function elmesComponent() {
	const confirmBtn = await createBtn({
		id: "elmes-confirm",
		title: "Confirm",
		icon: "",
		className: "btn-primary btn-outline text-primary hover:text-white",
	});
	const cancelBtn = await createBtn({
		id: "elmes-cancel",
		title: "Cancel",
		icon: "icofont-close text-2xl",
		className: "btn-neutral btn-outline text-neutral hover:text-white",
	});

	const str = `<input type="checkbox" id="showElmes" class="modal-toggle" />
    <div class="modal" role="dialog">
        <div class="modal-box w-screen max-w-[100vw] h-screen overflow-y-scroll">
            <table id="tableElmes" class="table w-full"></table>
            <input type="hidden" id="elmes-target"/>
            <div class="flex gap-2 mt-3">${confirmBtn}${cancelBtn}</div>
        </div>
    </div>`;
	$("body").append(str);
}

export async function elmesSetup(row) {
	let tableElmes;
	const data = row.data();
	const mfgno = $(row.node()).find(".mfgno").val();
	const item = $(row.node()).find(".itemno").val();
	if (mfgno.length === 0 || item.length < 3) return;

	const elmes = await getElmesItem(mfgno, item);
	if (elmes.length > 0) {
		const setting = await tb.elmesTable(elmes);
		tableElmes = await createTable(setting, {
			id: "#tableElmes",
			columnSelect: { status: true },
		});
		$("#elmes-target").val(row.index());
		$("#showElmes").click();
	} else {
		const newData = {
			...data,
			INQD_MFGORDER: mfgno,
			INQD_ITEM: item,
		};
		row.data(newData);
		//row.draw(false);
		tableElmes = null;
		$(row.node()).find(".partname").focus();
	}
	return tableElmes;
}

export async function elmesConform(elmesData, increse, table) {
	const rowid = $("#elmes-target").val();
	const data = table.row(rowid).data();
	table.rows(rowid).remove().draw(); //Delete current row first
	//Insert rows
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

	await destroyTable("#tableElmes");
	$("#tableElmes").html("");
	$("#elmes-target").val("");
	$("#showElmes").click();
}

export async function elmesCancel(table) {
	await destroyTable("#tableElmes");
	const inx = $("#elmes-target").val();
	$("#tableElmes").html("");
	$("#elmes-target").val("");
	$("#showElmes").click();
	$(table.row(inx).node()).find(".partname").focus();
}
//End: Elmes

//005: Verify form before save
export async function getFormHeader() {
	const obj = $("#form-container").find("input, select, textarea");
	const header = {};
	obj.map((i, el) => {
		if ($(el).attr("name") === "INQ_NO") {
			header.INQ_NO = utils.setInquiryNo($(el).val());
		} else if ($(el).attr("name") === "INQ_PKC_REQ") {
			header.INQ_PKC_REQ = $('input[name="INQ_PKC_REQ"]:checked').val();
		} else if ($(el).attr("name") === "INQ_AGENT") {
			header.INQ_AGENT =
				$(el).val() == "" ? "" : $(el).val().split("(")[0].trim();
		} else {
			if ($(el).attr("name") != undefined) {
				const value = $(el).hasClass("uppercase")
					? $(el).val().toUpperCase()
					: $(el).val();
				header[$(el).attr("name")] = value;
			}
		}
	});
	return header;
}

export async function verifyHeader(cls) {
	let str = ``;
	let check = true;
	const obj = $("#form-container").find(`${cls}`);
	obj.map(async (i, el) => {
		if ($(el).val() == "") {
			const label = $(el).closest(".grid").find("label").text();
			str += str == "" ? label : `, ${label}`;
			$(el).closest("label").addClass("border-red-500");
			$(el).siblings(".select2").addClass("select2-error");
			check = false;
		}
	});

	setTimeout(() => {
		obj.map((i, el) => {
			$(el).closest("label").removeClass("border-red-500");
			$(el).siblings(".select2").removeClass("select2-error");
		});
	}, 10000);

	if (check == false) await showMessage(`Please fill ${str}`);
	return check;
}

export async function verifyDetail(table, data, savelevel = 0) {
	const errorEl = (obj) => {
		obj.addClass("!bg-red-200");
		setTimeout(() => {
			obj.removeClass("!bg-red-200");
		}, 5000);
	};

	let check = true;
	let message = [];
	const seenKeys = new Set();
	if (data.length == 0) throw new Error(`Please insert inquiry detail.`);
	data.map(async (item, i) => {
		const row = $(table.row(i).node());
		const seq = item.INQD_SEQ;
		if (seenKeys.has(item.INQD_SEQ)) {
			check = false;
			message.push(`Dupplicate sequence number. (${item.INQD_SEQ})`);
			errorEl(row.find(".seqno"));
			return;
		} else {
			seenKeys.add(item.INQD_SEQ);
		}

		if (intVal(item.INQD_SEQ) <= 0) {
			check = false;
			message.push(`Please input seq no.`);
			errorEl(row.find(".seqno"));
			return;
		}

		if (intVal(item.INQD_ITEM) < 100 || intVal(item.INQD_ITEM) > 1000) {
			check = false;
			message.push(
				`Please input item no. or item no should be number in range 100-999`,
			);
			errorEl(row.find(".item-no"));
			return;
		}
		if (item.INQD_PARTNAME == "") {
			check = false;
			message.push(`Please input Part name`);
			errorEl(row.find(".partname"));
			return;
		}

		//Save data to Database
		//MAR Send to Sale
		// - If drawing is blank, Should attached image to reference part
		if (savelevel == 1) {
			const hasAtt = $("#attachment-file")[0].files.length;
			if (item.INQD_DRAWING == "" && hasAtt == 0) {
				check = false;
				message.push(
					`Please input Drawing no. or add some attachement to reference declaring part`,
				);
				errorEl(row.find(".drawing-line"));
				return;
			}
		}

		if (savelevel == 2) {
			if (item.INQD_DRAWING == "") {
				check = false;
				message.push(`Please input Drawing no.`);
				errorEl(row.find(".drawing-line"));
				return;
			}

			const dwgno = dwg.validateDrawingNo(item.INQD_DRAWING);
			if (dwgno == null) {
				check = false;
				message.push(`Please check Drawing no. format.`);
				errorEl(row.find(".drawing-line"));
				return;
			}

			if (item.INQD_VARIABLE != "" || item.INQD_VARIABLE != null) {
				const variavle = dwg.validateVariable(item.INQD_VARIABLE);
				if (!variavle.isValid) {
					check = false;
					message.push(`Please check Variable format.`);
					errorEl(row.find(".variable-line"));
					return;
				}
			}

			if (item.INQD_UNREPLY == "" && item.INQD_SUPPLIER == "") {
				check = false;
				message.push(`Please select supplier.`);
				errorEl(row.find(".supplier-line"));
				return;
			}
			if (item.INQD_UNREPLY != "" && row.find(".remark").val() == "") {
				check = false;
				message.push(`Please input remark for unable to reply reason.`);
				errorEl(row.find(".remark-line"));
				return;
			}
		}
	});

	if (check == false) throw new Error(message);
	return check;
}
//End: Verify save form

//006: Add attachment
export async function addAttached(e, selectedFilesMap) {
	const file = e.target.files;
	if (!file) {
		await showMessage("Please select a file to upload.");
		return;
	}

	let files = [];
	for (let i = 0; i < file.length; i++) {
		const ext = utils.fileExtension(file[i].name);
		const allow = ["pdf", "jpg", "png", "docx", "xlsx", "txt"];
		if (allow.includes(ext)) {
			selectedFilesMap.set(file[i].name, file[i]);
			const fs = {
				FILE_ORIGINAL_NAME: file[i].name,
				FILE_SIZE: file[i].size,
				FILE_OWNER: file[i].type,
				FILE_DATE: new Date().toISOString(),
				FILE_CREATE_BY: $("#user-login").attr("empname"),
				FILE_CREATE_AT: new Date(),
			};
			files.push(fs);
		} else {
			await showMessage(`${file[i].name} not allowed to upload.(${ext})`);
			return;
		}
	}
	return { files, selectedFilesMap };
}

//007: Search key
export async function getSearchHeader(formdata) {
	const like_key = ["INQ_NO", "INQ_PRJNO", "INQ_PRJNAME"];
	like_key.forEach((key) => {
		if (formdata[key]) {
			const query = `LIKE ${formdata[key]}`;
			delete formdata[key];
			formdata[key] = query;
		}
	});

	const date_key = ["START_INQ_DATE", "END_INQ_DATE"];
	date_key.forEach((key) => {
		if (formdata[key]) {
			if (key.startsWith("START_")) formdata[key] = `>= ${formdata[key]}`;
			else if (key.startsWith("END_"))
				formdata[key] = `<= ${formdata[key]}`;
		}
	});

	const timeline_key = ["timeline.START_MAR_SEND", "timeline.END_MAR_SEND"];
	let timelies = {};
	timeline_key.forEach((key) => {
		if (formdata[key]) {
			const vkey = key.replace("timeline.", "");
			if (vkey.startsWith("START_"))
				timelies = { ...timelies, [vkey]: `>= ${formdata[key]}` };
			else if (vkey.startsWith("END_"))
				timelies = { ...timelies, [vkey]: `<= ${formdata[key]}` };
			delete formdata[key];
		}
	});
	if (Object.keys(timelies).length > 0) {
		formdata["timeline"] = timelies;
		formdata["IS_TIMELINE"] = true;
	}
	formdata["IS_GROUP"] = true;
	return formdata;
}
