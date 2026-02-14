import { showDigits } from "@amec/webasset/utils";
import { tableOpt } from "../utils.js";
export async function setupPartViewDetail(data = []) {
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

	const opt = { ...tableOpt };
	opt.data = data;
	// opt.paging = false;
	// opt.info = false;
	opt.lengthChange = false;
	opt.searching = false;
	opt.orderFixed = [0, "asc"];
	opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-auto"t><"flex mt-3"<"table-info flex flex-col flex-1 gap-5"i><"table-page flex-none"p>>`;
	opt.columns = [
		{
			data: "INQD_RUNNO",
			className: "hidden",
		},
		{
			data: "INQD_SEQ",
			title: "No",
			className: "sticky-column w-12.5! seqno",
			sortable: false,
			render: function (data, type, row) {
				if (type === "display") {
					if (data % 1 !== 0) data = showDigits(data, 2);
					return data;
				}
				return data;
			},
		},
		{
			data: "INQD_CAR",
			title: "CAR",
			className: "sticky-column w-12.5! text-center!",
			sortable: false,
			render: function (data, type, row, meta) {
				if (type === "display") {
					return data == null ? "" : data;
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
				return data;
			},
		},
		{
			data: "INQD_ITEM",
			title: "Item",
			className: "sticky-column item-no",
			sortable: false,
			render: function (data, type) {
				return data;
			},
		},
		{
			data: "INQD_PARTNAME",
			title: "Part Name",
			className: "sticky-column min-w-62!",
			sortable: false,
			render: function (data, type, row, meta) {
				return data;
			},
		},
		{
			data: "INQD_DRAWING",
			title: "Drawing No.",
			className: "min-w-62!",
			sortable: false,
			render: function (data, type, row, meta) {
				return data;
			},
		},
		{
			data: "INQD_VARIABLE",
			title: "Variable",
			className: "min-w-50!",
			sortable: false,
			render: function (data, type) {
				return data;
			},
		},
		{
			data: "INQD_QTY",
			title: "Qty.",
			sortable: false,
			render: function (data, type, row) {
				return data;
			},
		},
		{
			data: "INQD_UM",
			title: "U/M",
			sortable: false,
			render: function (data, type, row, meta) {
				return data;
			},
		},
		{
			data: "INQD_SUPPLIER",
			title: "Supplier",
			render: function (data, type, row) {
				return data;
			},
		},
		{
			data: "INQD_SENDPART",
			title: `2<sup>nd</sup>`,
			className: "text-center",
			render: function (data, type, row, meta) {
				return data;
			},
		},
		{
			data: "INQD_UNREPLY",
			title: "U/N",
			className: "text-center",
			render: function (data, type, row, meta) {
				return data;
			},
		},
		{
			data: "INQD_MAR_REMARK",
			title: "Remark",
			className: "min-w-62!",
			render: function (data, type) {
				return data;
			},
		},
		{
			data: "INQD_DES_REMARK",
			title: "D/E Remark",
			className: "min-w-62!",
			render: function (data) {
				return data;
			},
		},
	];
	return opt;
}
