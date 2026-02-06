import { showDigits, intVal } from "@amec/webasset/utils";
import { tableOpt } from "../utils";
import { calPrice } from "./data";

export async function tablePartOption(data = []) {
	const opt = { ...tableOpt };
	opt.data = data;
	opt.lengthChange = false;
	opt.searching = false;
	opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-auto"t><"flex mt-5"<"table-info flex flex-col flex-1 gap-5"i><"table-page flex-none">>`;
	opt.orderFixed = [0, "asc"];
	opt.columns = [
		{
			data: "INQD_RUNNO",
			className: "hidden",
		},
		{
			data: "INQD_SEQ",
			title: "No",
			className: "sticky-column w-[50px] min-w-[50px]",
		},
		{
			data: "INQD_CAR",
			title: "CAR",
			className: "sticky-column w-[50px] min-w-[50px]",
		},
		{
			data: "INQD_MFGORDER",
			title: "MFG NO.",
			className:
				"!px-[3px] w-[100px] min-w-[100px] max-w-[100px] sticky-column",
			sortable: false,
			render: function (data, type, row, meta) {
				if (type === "display") {
					data = data == null ? "" : data;
					return `<div class="px-2">${data}</div>`;
				}
				return data;
			},
		},
		{
			data: "INQD_ITEM",
			title: "Item",
			className:
				"!px-[3px] w-[75px] min-w-[75px] max-w-[75px] item-no sticky-column",
			sortable: false,
			render: function (data, type, row, meta) {
				if (type === "display") {
					data = data == null ? "" : data;
					return `<div class="px-2">${data}</div>`;
				}
				return data;
			},
		},
		{
			data: "INQD_PARTNAME",
			title: "Part Name",
			className: "sticky-column",
			render: function (data, type) {
				if (type === "display") {
					data = data == null ? "" : data;
					return `<div class="px-2 min-w-50 max-w-50 break-all">${data}</div>`;
				}
				return data;
			},
		},
		{
			data: "INQD_DRAWING",
			title: "Drawing No.",
			render: function (data, type) {
				if (type === "display") {
					data = data == null ? "" : data;
					return `<div class="px-2 min-w-50 max-w-50 break-all">${data}</div>`;
				}
				return data;
			},
		},
		{
			data: "INQD_VARIABLE",
			title: "Variable",
			render: function (data, type) {
				if (type === "display") {
					data = data == null ? "" : data;
					return `<div class="px-2 min-w-50 max-w-50 break-all">${data}</div>`;
				}
				return data;
			},
		},
		{
			data: "INQD_SUPPLIER",
			title: "Supplier",
			render: function (data, type) {
				if (type === "display") {
					data = data == null ? "" : data;
					return `<div class="px-2">${data}</div>`;
				}
				return data;
			},
		},
		{
			data: "INQD_SENDPART",
			title: "2nd",
			className: "text-center!",
			render: function (data, type) {
				if (type === "display") {
					data = data == null ? "" : data;
					return `<div class="px-2">${data}</div>`;
				}
				return data;
			},
		},
		{
			data: "INQD_UNREPLY",
			title: "U/N",
			className: "text-center!",
			render: function (data, type) {
				if (type === "display") {
					data =
						data == null
							? ""
							: `<i class="fi fi-sr-circle-xmark text-xl text-error"></i>`;
					return `<div class="px-2">${data}</div>`;
				}
				return data;
			},
		},
		{
			data: "INQD_QTY",
			title: "Qty.",
			className:
				"px-[3px]! text-right bg-primary/20 min-w-[75px] INQD_QTY",
			footer: "Total",
			render: function (data, type) {
				if (type === "display") {
					const str = `<input type="text" class="w-full! text-end text-md! fccost cell-input inqty" value="${data == null ? "" : showDigits(data, 0)}" onfocus="this.select();"/>`;
					return str;
				}
				return data;
			},
		},
		{
			data: "INQD_UM",
			title: "U/M",
			render: function (data, type) {
				if (type === "display") {
					data = data == null ? "" : data;
					return `<div class="px-2">${data}</div>`;
				}
				return data;
			},
		},
		{
			data: "INQD_FC_COST",
			title: "FC Cost",
			className: `hidden`,
			render: function (data, type) {
				if (type === "display") {
					data = data == null ? "" : data;
					return `<div class="px-2">${data}</div>`;
				}
				return data;
			},
		},
		{
			data: "INQD_FC_BASE",
			title: "%FC",
			className: `hidden`,
			render: function (data, type) {
				if (type === "display") {
					data = data == null ? "" : data;
					return `<div class="px-2">${data}</div>`;
				}
				return data;
			},
		},
		{
			data: "INQD_TC_COST",
			title: "TC Cost",
			className: `min-w-[100px] INQD_TC_COST`,
			render: function (data, type, row) {
				if (type === "display") {
					data = data == null ? "" : data;
					if (row.INQD_SUPPLIER == "MELINA") {
						return `<div class="px-2"><input type="text" class="w-full min-w-13.75 outline-0 text-right input-number inqprice" value="${data}"/></div>`;
					}
					return `<div class="px-2 text-right!">${showDigits(data, 0)}</div>`;
				}
				return data;
			},
		},
		{
			data: "INQD_TC_BASE",
			title: "% TC",
			className: `min-w-[70px]`,
			render: function (data, type) {
				if (type === "display") {
					data = data == null ? "" : data;
					return `<div class="px-2 text-right!">${showDigits(data, 3)}</div>`;
				}
				return data;
			},
		},
		{
			data: "INQD_UNIT_PRICE",
			title: "Unit Price",
			className: `min-w-[100px]`,
			render: function (data, type) {
				if (type === "display") {
					data = data == null ? "" : Math.ceil(data);
					return `<div class="px-2 text-right!">${showDigits(data, 0)}</div>`;
				}
				return data;
			},
		},
		{
			data: "INQD_UNIT_PRICE",
			title: "Total Price",
			className: `min-w-[100px]`,
			render: function (data, type, row) {
				const totalPrice =
					Math.ceil(row.INQD_UNIT_PRICE) * row.INQD_QTY;
				if (type === "display") {
					return `<div class="px-2 text-right!">${showDigits(
						totalPrice,
						0,
					)}</div>`;
				}
				return data;
			},
		},
		{
			data: "INQD_MAR_REMARK",
			title: "MAR Remark",
			className: `min-w-50`,
			render: function (data, type) {
				if (type === "display") {
					if (data == null) return "";
					return `<div class="flex">
            <div class="px-2 min-w-50 max-w-50 break-all text-xs line-clamp-1">${data}</div>
            <div class="tooltip tooltip-left" data-tip="${data}"><i class="fi fi-rr-info text-lg"></i></div>
          </div>`;
				}
				return data;
			},
		},
		{
			data: "INQD_DES_REMARK",
			title: "D/E Remark",
			className: `min-w-50`,
			render: function (data, type) {
				if (type === "display") {
					if (data == null) return "";
					return `<div class="flex">
            <div class="px-2 min-w-50 max-w-50 break-all text-xs line-clamp-1">${data}</div>
            <div class="tooltip tooltip-left" data-tip="${data}"><i class="fi fi-rr-info text-lg"></i></div>
          </div>`;
				}
				return data;
			},
		},
		{
			data: "INQD_FIN_REMARK",
			title: "FIN Remark",
			className: `min-w-50`,
			render: function (data, type) {
				if (type === "display") {
					if (data == null) return "";
					return `<div class="flex">
            <div class="px-2 min-w-50 max-w-50 break-all text-xs line-clamp-1">${data}</div>
            <div class="tooltip tooltip-left" data-tip="${data}"><i class="fi fi-rr-info text-lg"></i></div>
          </div>`;
				}
				return data;
			},
		},
	];

	opt.createdRow = function (row, data, dataIndex) {
		if (data.INQD_SUPPLIER === "MELINA")
			$(row).find(".INQD_TC_COST").addClass("bg-yellow-100!");
		return;
	};

	opt.footerCallback = function () {
		const api = this.api();
		const data = api.rows().data();
		let totalqty = 0;
		let totalfccost = 0;
		let totaltccost = 0;
		let totalunit = 0;
		let total = 0;
		data.map((el) => {
			const type = el.INQD_SUPPLIER === "MELINA" ? 1 : 0;
			const price = calPrice(el, type);
			totalqty += intVal(el.INQD_QTY);
			totalfccost += intVal(el.INQD_FC_COST);
			totaltccost += intVal(price.tccost);
			totalunit += intVal(price.unitprice);
			total += intVal(price.amount);
		});

		api.column(11).footer().innerHTML = "";
		api.column(13).footer().innerHTML = showDigits(totalfccost, 0);
		api.column(15).footer().innerHTML = showDigits(totaltccost, 0);
		api.column(17).footer().innerHTML = showDigits(totalunit, 0);
		api.column(18).footer().innerHTML = showDigits(total, 0);
		// api.column(19).footer().innerHTML = currency;
	};
	return opt;
}
