import { showDigits } from "@amec/webasset/utils";
import { currentUser } from "@amec/webasset/api/amec";
import { tableOpt } from "../utils.js";

export async function setupDETableDetail(data = []) {
	const renderText = (data) => {
		return `<div class="w-full text-xs text-start! px-2 py-3">${data == null ? "" : data}</div>`;
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

	const renderSupplier = (data, id) => {
		const sup = ["", "AMEC", "MELINA", "LOCAL"];
		let selector = `<select class="select select-sm w-25! border-none rounded-none bg-transparent! supplier" name="supplier[]">`;
		sup.forEach((el) => {
			selector += `<option class="bg-white! rounded-none" value="${el}" ${el == data ? "selected" : ""}>${el}</option>`;
		});
		selector += `</select>`;
		return selector;
	};

	//const mode = data.length > 0 ? 1 : 0;
	const isRevise = $("#revision").val() != "*" ? true : false;
	const user = await currentUser();
	const usrgroup = user.group;
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
			className: `sticky-column text-center text-nowrap cell-display px-3! border-r!`,
			sortable: false,
			render: function (data, type, row) {
				if (type === "display") {
					if (row.INQD_DE == "1") {
						return `<div class="btn btn-xs btn-circle btn-ghost add-sub-line" type="button">
                            <span class="text-2xl text-gray-600">+</span>
                        </div>
                        <button class="btn btn-xs btn-circle btn-ghost ${
							row.INQD_OWNER_GROUP != "MAR"
								? "delete-sub-line text-red-500"
								: "btn-disabled text-gray-300!"
						}"><i class="fi fi-bs-cross"></i></button>`;
					}

					return `<div class="btn btn-xs btn-circle btn-ghost btn-disabled text-gray-300!" type="button"><span class="text-2xl">+</span></div>
                    <button class="btn btn-xs btn-circle btn-ghost btn-disabled text-gray-300!" ><i class="fi fi-bs-cross"></i></button>`;
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
					if (row.INQD_DE != "1") return renderText(data);
					return `<input type="text" class="w-12.5! cell-input input-number edit-input" name="seq[]" value="${data}">`;
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
					if (row.INQD_DE != "1") return renderText(data);
					return `<input type="text" class="w-10! uppercase cell-input carno edit-input" name="carno[]" value="${data == null ? "" : data}">`;
				}
				return data;
			},
		},
		{
			data: "INQD_MFGORDER",
			title: "MFG No.",
			className: "sticky-column",
			sortable: false,
			render: function (data, type, row) {
				if (type === "display") {
					if (row.INQD_DE != "1") return renderText(data);
					return `<textarea class="w-25! cell-input elmes-input mfgno" name="mfgno[]" readonly maxlength="50">${data == null ? "" : data}</textarea>`;
				}
				return data;
			},
		},
		{
			data: "INQD_ITEM",
			title: "Item",
			className: "sticky-column",
			sortable: false,
			render: function (data, type, row) {
				if (type === "display") {
					if (row.INQD_DE != "1") return renderText(data);
					return `<textarea class="w-12.5! cell-input elmes-input itemno" name="itemno[]" maxlength="50">${data == null ? "" : data}</textarea>`;
				}
				return data;
			},
		},
		{
			data: "INQD_PARTNAME",
			title: "Part Name",
			className: "sticky-column ",
			sortable: false,
			render: function (data, type, row) {
				if (type === "display") {
					if (row.INQD_DE != "1") return renderText(data);
					return `<textarea class="w-62! cell-input edit-input partname" name="partname[]" maxlength="50">${
						data == null ? "" : data
					}</textarea>`;
				}
				return data;
			},
		},
		{
			data: "INQD_DRAWING",
			title: "Drawing No.",
			className: "drawing-line",
			sortable: false,
			render: function (data, type, row) {
				if (type === "display") {
					if (row.INQD_DE != "1") return renderText(data);
					return `<textarea class="w-62! uppercase cell-input edit-input drawing-line" name="drawing[]" maxlength="150">${
						data == "null" || data == null ? "" : data
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
			render: function (data, type, row) {
				if (type === "display") {
					if (row.INQD_DE != "1") return renderText(data);
					return `<textarea class="w-62! uppercase cell-input edit-input variable-line" name="variable[]" maxlength="250">${
						data == "null" || data == null ? "" : data
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
					if (row.INQD_DE != "1") return renderText(data);
					return `<textarea class="w-12.5! uppercase cell-input edit-input variable-line" name="qty[]">${
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
			render: function (data, type, row) {
				data = data == "" ? "PC" : data;
				if (type === "display") {
					if (row.INQD_DE != "1") return renderText(data);
					return `<input type="type" class="w-12.5! uppercase cell-input edit-input" name="um[]" value="${data}">`;
				}
				return data;
			},
		},
		{
			data: "INQD_SUPPLIER",
			title: "Supplier",
			className: "supplier-line",
			sortable: false,
			render: function (data, type, row) {
				if (type === "display") {
					if (row.INQD_DE != "1") return renderText(data);
					if (row.INQD_UNREPLY != "" && row.INQD_UNREPLY != null) {
						return renderSupplier(data, true);
					}
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
			render: function (data, type, row) {
				if (type === "display") {
					if (row.INQD_DE != "1") return renderText(data);
					if (data == null || data == "")
						return `<input type="checkbox" class="checkbox checkbox-sm checkbox-primary text-black ndpartlist" name="ndpartlist[]" value="" />`;
					else if (data == "1")
						return `<input type="checkbox" class="checkbox checkbox-sm checkbox-primary text-black revokepartlist" name="revokepartlist[]" value="1" checked/>`;
					else
						return `<div class="tooltip tooltip-left" data-tip="Click to revoke 2nd part">
                            <button class="btn btn-xs btn-circle btn-ghost revokepartlist">${data}</button>
                        </div>`;
				}
				return data;
			},
		},
		{
			data: "INQD_UNREPLY",
			title: "U/N",
			className: "text-center!",
			sortable: false,
			render: function (data, type, row) {
				if (type === "display") {
					if (row.INQD_DE != "1") return renderText(data);

					return `<input type="checkbox" class="checkbox checkbox-sm checkbox-error text-white unreply edit-input" name="unreply[]" ${data == "" || data == null ? "" : "checked"}/>`;
				}
				return data;
			},
		},
		{
			data: "INQD_DES_REMARK",
			title: "D/E Remark",
			className: `w-62 min-w-62 remark-line`,
			sortable: false,
			render: function (data, type, row) {
				if (type === "display") {
					if (row.INQD_DE != "1") return renderText(data);
					return `<textarea class="w-62! cell-input edit-input remark bg-primary/10" name="des_remark[]" maxlength="250">${
						data == null ? "" : data
					}</textarea>`;
				}
				return data;
			},
		},

		{
			data: "INQD_MAR_REMARK",
			className: `w-62 min-w-62 cell-display border-r! bg-slate-200 text-xs`,
			title: "MAR Remark",
			sortable: false,
			render: function (data, type) {
				return data == null ? "" : data;
			},
		},
		{
			data: "INQD_SALE_REMARK",
			className: `w-62 min-w-62 cell-display border-r! bg-slate-200 text-xs`,
			title: "Sale Remark",
			sortable: false,
			render: function (data, type) {
				return data == null ? "" : data;
			},
		},
		{
			data: "INQD_FC_BASE",
			className: "hiddenx",
		},
		{
			data: "INQD_FC_COST",
			className: "hiddenx",
		},
		{
			data: "INQD_TC_BASE",
			className: "hiddenx",
		},
		{
			data: "INQD_TC_COST",
			className: "hiddenx",
		},
		{
			data: "INQD_UNIT_PRICE",
			className: "hiddenx",
		},
	];
	return opt;
}
