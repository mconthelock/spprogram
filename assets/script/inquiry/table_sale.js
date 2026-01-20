import * as utils from "../utils.js";

export async function setupTableDetail(data = [], group = "SEG") {
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

	const mode = data.length > 0 ? 1 : 0;
	const opt = { ...utils.tableOpt };
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
			className: "text-center text-nowrap sticky-column px-1",
			sortable: false,
			render: function (data, type, row) {
				if (type === "display") {
					return `<div class="btn btn-xs btn-circle btn-ghost add-sub-line" type="button"><span class="text-2xl text-gray-600">+</span></div>
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
					if (data % 1 !== 0) data = utils.digits(data, 2);
					const log = renderLog(data, row.logs, "INQD_SEQ");
					const str = `<input type="text" class="!w-[50px] cell-input edit-input input-number ${
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
			className: "sticky-column",
			sortable: false,
			render: function (data, type, row, meta) {
				if (type === "display") {
					const log = renderLog(data, row.logs, "INQD_CAR");
					const str = `<input type="text" class="!w-[40px] uppercase cell-input carno ${
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
					return `<input type="text" class="!w-[100px] uppercase cell-input elmes-input mfgno" maxlength="9" value="${
						data == null ? "" : data
					}">`;
				}
				return data;
			},
		},
		{
			data: "INQD_ITEM",
			title: "Item",
			className: "sticky-column item-no",
			sortable: false,
			render: function (data, type) {
				if (type === "display") {
					return `<input type="text" class="!w-[50px] cell-input elmes-input input-number itemno" value="${data}"/>`;
				}
				return data;
			},
		},
		{
			data: "INQD_PARTNAME",
			title: "Part Name",
			className: "sticky-column !px-[3px]",
			sortable: false,
			render: function (data, type, row, meta) {
				if (type === "display") {
					return `<textarea class="!w-[250px] cell-input edit-input partname" maxlength="50">${
						data == null ? "" : data
					}</textarea>`;
				}
				return data;
			},
		},
		{
			data: "INQD_DRAWING",
			title: "Drawing No.",
			className: "!px-[3px] drawing-line",
			sortable: false,
			render: function (data, type, row, meta) {
				if (type === "display") {
					return `<textarea class="!w-[225px] uppercase cell-input edit-input drawing-line" maxlength="150">${
						data == null ? "" : data
					}</textarea>`;
				}
				return data;
			},
		},
		{
			data: "INQD_VARIABLE",
			title: "Variable",
			className: "!px-[3px]",
			sortable: false,
			render: function (data, type) {
				if (type === "display") {
					return `<textarea class="!w-[200px] uppercase cell-input edit-input variable-line" maxlength="250">${
						data == null ? "" : data
					}</textarea>`;
				}
				return data;
			},
		},
		{
			data: "INQD_QTY",
			title: "Qty.",
			className: "!px-[3px]",
			sortable: false,
			render: function (data, type, row) {
				if (type === "display") {
					return `<input type="number" min="1" class="!w-[50px] cell-input edit-input" value="${data}">`;
				}
				return data;
			},
		},
		{
			data: "INQD_UM",
			title: "U/M",
			className: "!px-[3px]",
			sortable: false,
			render: function (data, type, row, meta) {
				data = data == "" ? "PC" : data;
				if (type === "display") {
					return `<input type="type" class="!w-[55px] uppercase cell-input edit-input" value="${data}">`;
				}
				return data;
			},
		},
		{
			data: "INQD_SUPPLIER",
			title: "Supplier",
			className: "!px-[3px] supplier-line",
			sortable: false,
			render: function (data, type, row) {
				if (type === "display") {
					return `<select class="!w-[100px] select select-sm supplier edit-input" ${
						row.INQD_UNREPLY == "" || row.INQD_UNREPLY == null
							? ""
							: "disabled"
					}>
                <option value=""></option>
                <option value="AMEC" ${
					data == "AMEC" ? "selected" : ""
				}>AMEC</option>
                <option value="MELINA" ${
					data == "MELINA" ? "selected" : ""
				}>MELINA</option>
                <option value="LOCAL" ${
					data == "LOCAL" ? "selected" : ""
				}>LOCAL</option>
              </select>`;
				}
				return data;
			},
		},
		{
			data: "INQD_SENDPART",
			title: `2<sup>nd</sup>`,
			className: "text-center",
			sortable: false,
			render: function (data, type, row, meta) {
				if (type === "display") {
					return `<input type="checkbox" class="checkbox checkbox-sm checkbox-primary text-black edit-input" value="1" ${
						data == 1 ? "checked" : ""
					} />`;
				}
				return data;
			},
		},
		{
			data: "INQD_UNREPLY",
			title: "U/N",
			className: "text-center",
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
			data: "INQD_DE",
			title: `<i class='fi fi-tr-share-square text-lg'></i>`,
			className: `text-center ${group == "SEG" ? "hidden" : ""}`,
			sortable: false,
			render: function (data, type, row, meta) {
				if (type === "display") {
					return `<input type="checkbox" value="1" class="checkbox checkbox-sm checkbox-warning text-white forward edit-input"
               ${data == "" || data == null ? "" : "checked"}/>`;
				}
				return data;
			},
		},
		{
			data: "INQD_MAR_REMARK",
			className: `min-w-[250px] ${mode == 0 ? "hidden" : ""}`,
			title: "MAR Remark",
			sortable: false,
			render: function (data) {
				return data == null ? "" : data;
			},
		},
		{
			data: "INQD_DES_REMARK",
			className: "remark-line",
			title: "Remark",
			sortable: false,
			render: function (data, type) {
				if (type === "display") {
					return `<textarea class="!w-[250px] cell-input edit-input remark" maxlength="250">${
						data == null ? "" : data
					}</textarea>`;
				}
				return data;
			},
		},
	];

	opt.initComplete = function (settings, json) {
		const btn = `<div class="flex gap-2 ">
      <div class="tooltip" data-tip="Add line">
        <button id="addRowBtn" class="btn btn-primary btn-sm btn-square flex items-center" type="button">
            <i class="fi fi-rr-add text-2xl text-white"></i>
        </button>
      </div>
      <div class="tooltip" data-tip="Upload inquiry">
        <button id="uploadRowBtn" class="btn btn-neutral btn-sm btn-square ${
			mode == 1 ? "hidden" : ""
		}"><i class="fi fi-rr-cloud-upload-alt text-2xl text-white"></i></button>
        <input type="file" id="import-tsv" class="hidden" />
      </div>
      <div class="tooltip" data-tip="Download template">
        <button id="downloadTemplateBtn" class="btn btn-neutral btn-sm btn-square ${
			mode == 1 ? "hidden" : ""
		}"><i class="fi fi-rr-cloud-download-alt text-2xl text-white"></i></button>
      </div>
    </div>`;
		// $("#table").closest(".dt-container").find(".table-page").append(btn);
		$("#table")
			.closest(".dt-container")
			.find(".table-search")
			.append(
				`
        <div class="tooltip tooltip-open absolute z-50 hidden" id="tip1">
            <div class="tooltip-content">
                <div class="animate-bounce text-orange-400 -rotate-10 text-2xl font-black">Wow!</div>
            </div>
        </div>`,
			);
	};
	return opt;
}
