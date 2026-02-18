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

import { intVal, showMessage } from "@amec/webasset/utils";
import {
	getMainProject,
	getPartProject,
	getDummyProject,
	validateVariable,
} from "../service/index.js";
import { initRow } from "./ui.js";
import { init, events } from "./source";
import { setSelectedFilesMap } from "./store.js";
import { fileExtension, setInquiryNo } from "../utils.js";
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
				if (init[field.source]) options = await init[field.source]();
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
				if (field.onChange && events[field.onChange]) {
					jQueryElement.on("change", events[field.onChange]);
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
			if (elementToListen && field.onChange && events[field.onChange]) {
				elementToListen.addEventListener(
					"change",
					events[field.onChange],
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

export const stockHeader = async (name, item) => {
	//   const str = name.split("_");
	const customers = await cus.getCustomer();
	const value = customers.find((item) => item.CUS_NAME == name);
	if (value !== undefined) {
		$("#project-no").val(`${value.CUS_DISPLAY} STOCK`);
		$("#project-name").val(`${value.CUS_DISPLAY} STOCK`);
		$("#shop-order").val(`-`);
		const series = item >= 6 ? "JSW" : "GQXL3";
		const operation = item >= 6 ? "B2" : "2BC";
		const spec = item >= 6 ? "1200/JS-SE/03500/30" : "P1000-CO-060,05S/O";
		$("#series").val(series).trigger("change");
		$("#operation").val(operation);
		$("#spec").val(spec);
		$("#schedule").val(`201505Y`);

		const agent = `${value.CUS_AGENT} (${value.CUS_COUNTRY})`;
		$("#agent").val(agent).trigger("change");
		$("#country").val(value.CUS_COUNTRY).trigger("change");
	}
};

export const projectConclude = async (data) => {
	let q = {};
	if (data.mfgno) q = { SMFG_NO: data.mfgno };
	else q = { PRJ_NO: data.prjno, CAR_NO: data.carno };

	let prjdata = await getMainProject(q);
	if (prjdata.length == 0) await getPartProject(q);
	if (prjdata.length == 0) await getDummyProject(q);
	return prjdata;
};

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
			const variavle = validateVariable(el[6]);
			const strrow = await initRow(el[1], i + 1);
			const newRow = {
				...strrow,
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
	lines.forEach(function (row, i) {
		const el = row.split("\t");
		const variavle = dwg.validateVariable(el[6]);
		const strrow = initRow(el[1], i + 1);
		const newRow = {
			...strrow,
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
		if (events.handleProjectChange) {
			await events.handleProjectChange({ target: projectNo });
		}
	} else if (data.mfgno.toUpperCase().indexOf("STOCK") > -1) {
		const name = data.file.split("_");
		const str = name[1] == undefined ? "" : name[1];
		await stockHeader(str, data.item);
	}

	const inqno = document.querySelector("#inquiry-no");
	inqno.value = data.inquiryno;
	inqno.dispatchEvent(new Event("change"));
}

//End: Unreply

//005: Verify form before save
export async function getFormHeader() {
	const obj = $("#form-container").find("input, select, textarea");
	const header = {};
	obj.map((i, el) => {
		if ($(el).attr("name") === "INQ_NO") {
			header.INQ_NO = setInquiryNo($(el).val());
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
export async function addAttached(e) {
	const file = e.target.files;
	if (!file) {
		await showMessage("Please select a file to upload.");
		return;
	}

	let files = [];
	for (let i = 0; i < file.length; i++) {
		const ext = fileExtension(file[i].name);
		const allow = [
			"pdf",
			"jpg",
			"png",
			"docx",
			"xlsx",
			"txt",
			"csv",
			"zip",
			"dwg",
			"msg",
		];
		if (allow.includes(ext)) {
			setSelectedFilesMap(file[i].name, file[i]);
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
	return { files };
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

export async function downloadClientFile(selectedFiles, fileName) {
	const fileToDownload = selectedFiles.get(fileName);
	if (fileToDownload) {
		const fileUrl = URL.createObjectURL(fileToDownload);
		const link = document.createElement("a");
		link.href = fileUrl;
		link.download = fileToDownload.name;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(fileUrl);
	} else {
		await showMessage(`File "${fileName}" not found for download.`);
	}
}
