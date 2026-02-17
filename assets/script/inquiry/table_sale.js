import { showDigits } from "@amec/webasset/utils";
import { createBtn } from "@amec/webasset/components/buttons";
import { setSelect2 } from "@amec/webasset/select2";
import { tableOpt } from "../utils.js";
export async function setupSaleTableDetail(data = []) {
	const renderText = (str, logs, key) => {
		if (logs == undefined) return str;
		let li = ``;
		const log = logs.sort(
			(a, b) => new Date(b.LOG_DATE) - new Date(a.LOG_DATE),
		);
		log.map((el) => {
			li += `<li class="flex gap-4 p-1 border-b">
        <div>${el[key] == null ? "" : el[key]}</div>
        <div class="text-xs">${moment(el.UPDATE_AT).format(
			"yyyy-MM-DD h:mm a",
		)}</div>
        <div class="text-xs">${displayname(el.UPDATE_BY).fname}</div>
      </li>`;
		});
		const element = `<ul class="hidden">${li}</ul>${str}`;
		return element;
	};

	const renderLog = (data, logs, key) => {
		let update = false;
		if (logs == undefined) return update;
		if (logs.length > 0) {
			logs.map((log) => {
				if (log[key] != data) update = true;
			});
		}
		return update;
	};

	const renderSupplier = (data) => {
		const sup = ["", "AMEC", "MELINA", "LOCAL"];
		let selector = `<select class="w-25! s2 edit-input supplier">`;
		sup.forEach((el) => {
			selector += `<option value="${el}" ${el == data ? "selected" : ""}>${el}</option>`;
		});
		selector += `</select>`;
		return selector;
	};

	const mode = data.length > 0 ? 1 : 0;
	const opt = { ...tableOpt };
	opt.data = data;
	opt.paging = false;
	opt.searching = false;
	opt.responsive = false;
	opt.info = false;
	opt.orderFixed = [0, "asc"];
	opt.dom = `<"flex "<"table-search flex flex-1 gap-5 "f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-auto max-h-[92vh]"t><"flex mt-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
	opt.columns = [
		{
			data: "INQD_RUNNO",
			className: "hidden",
		},
		{
			data: "INQD_ID",
			title: "<i class='icofont-settings text-lg'></i>",
			className:
				"sticky-column text-center text-nowrap cell-display px-3! border-r!",
			sortable: false,
			render: function (data, type, row) {
				if (type === "display") {
					return `<div class="btn btn-xs btn-circle btn-ghost add-sub-line" type="button">
                        <span class="text-2xl text-gray-600">+</span>
                    </div>
                    <button class="btn btn-xs btn-circle btn-ghost ${
						row.INQD_OWNER_GROUP != "MAR"
							? "delete-sub-line text-red-500"
							: "btn-disabled"
					}"><i class="fi fi-bs-cross"></i></button>`;
				}
				return data;
			},
		},
		{
			data: "INQD_SEQ",
			title: "No",
			className: "sticky-column seqno",
			sortable: false,
			render: function (data, type, row) {
				if (type === "display") {
					if (data % 1 !== 0) data = showDigits(data, 2);
					const log = renderLog(data, row.logs, "INQD_SEQ");
					const str = `<input type="text" class="w-12.5! cell-input input-number ${
						log ? "detail-log" : ""
					}" value="${data}">`;
					return renderText(str, row.logs, "INQD_SEQ");
				}
				return data;
			},
		},
		{
			data: "INQD_CAR",
			title: "CAR",
			className: "sticky-column text-center!",
			sortable: false,
			render: function (data, type, row) {
				if (type === "display") {
					const log = renderLog(data, row.logs, "INQD_CAR");
					const str = `<input type="text" class="w-10! uppercase cell-input carno ${
						log ? "detail-log" : ""
					}" maxlength="2" value="${data == null ? "" : data}"/>`;
					return renderText(str, row.logs, "INQD_CAR");
				}
				return data;
			},
		},
		{
			data: "INQD_MFGORDER",
			title: "MFG No.",
			className: "sticky-column",
			sortable: false,
			render: function (data, type) {
				if (type === "display") {
					return `<textarea class="w-25! cell-input elmes-input mfgno" maxlength="50">${data == null ? "" : data}</textarea>`;
				}
				return data;
			},
		},
		{
			data: "INQD_ITEM",
			title: "Item",
			className: "sticky-column",
			sortable: false,
			render: function (data, type) {
				if (type === "display") {
					return `<textarea class="w-12.5! cell-input elmes-input itemno" maxlength="50">${data == null ? "" : data}</textarea>`;
				}
				return data;
			},
		},
		{
			data: "INQD_PARTNAME",
			title: "Part Name",
			className: "sticky-column ",
			sortable: false,
			render: function (data, type, row, meta) {
				if (type === "display") {
					return `<textarea class="w-62! cell-input edit-input partname" maxlength="50">${
						data == null ? "" : data
					}</textarea>`;
				}
				return data;
			},
		},
		{
			data: "INQD_DRAWING",
			title: "Drawing No.",
			className: " drawing-line",
			sortable: false,
			render: function (data, type) {
				if (type === "display") {
					return `<textarea class="w-62! uppercase cell-input edit-input drawing-line" maxlength="150">${
						data == null ? "" : data
					}</textarea>`;
				}
				return data;
			},
		},
		{
			data: "INQD_VARIABLE",
			title: "Variable",
			className: "",
			sortable: false,
			render: function (data, type) {
				if (type === "display") {
					return `<textarea class="w-62! uppercase cell-input edit-input variable-line" maxlength="250">${
						data == null ? "" : data
					}</textarea>`;
				}
				return data;
			},
		},
		{
			data: "INQD_QTY",
			title: "Qty.",
			className: "",
			sortable: false,
			render: function (data, type, row) {
				if (type === "display") {
					return `<textarea class="w-12.5! uppercase cell-input edit-input variable-line">${
						data == null ? "" : data
					}</textarea>`;
				}
				return data;
			},
		},
		{
			data: "INQD_UM",
			title: "U/M",
			className: "",
			sortable: false,
			render: function (data, type, row, meta) {
				data = data == "" ? "PC" : data;
				if (type === "display") {
					return `<input type="type" class="w-12.5! uppercase cell-input edit-input" value="${data}">`;
				}
				return data;
			},
		},
		{
			data: "INQD_SUPPLIER",
			title: "Supplier",
			className: "supplier-line",
			sortable: false,
			render: function (data, type) {
				if (type === "display") {
					return renderSupplier(data);
				}
				return data;
			},
		},
		{
			data: "INQD_SENDPART",
			title: `2<sup>nd</sup>`,
			className: "text-center!",
			sortable: false,
			render: function (data, type) {
				if (type === "display") {
					return `<input type="checkbox" class="checkbox checkbox-sm checkbox-primary text-black ndpartlist" value="1" ${
						data == 1 ? "checked" : ""
					} />`;
				}
				return data;
			},
		},
		{
			data: "INQD_UNREPLY",
			title: "U/N",
			className: "text-center!",
			sortable: false,
			render: function (data, type, row, meta) {
				if (type === "display") {
					return `<input type="checkbox" class="checkbox checkbox-sm checkbox-error text-white unreply edit-input"
           ${data == "" || data == null ? "" : "checked"}/>`;
				}
				return data;
			},
		},
		{
			data: "INQD_MAR_REMARK",
			className: `w-62 min-w-62 cell-display border-r!`,
			title: "MAR Remark",
			sortable: false,
			render: function (data, type) {
				return data == null ? "" : data;
			},
		},
		{
			data: "INQD_DES_REMARK",
			className: `w-62 min-w-62 remark-line`,
			title: "Sale Remark",
			sortable: false,
			render: function (data, type) {
				if (type === "display") {
					return `<textarea class="w-62! cell-input edit-input remark" maxlength="250">${
						data == null ? "" : data
					}</textarea>`;
				}
				return data;
			},
		},
	];
	return opt;
}
