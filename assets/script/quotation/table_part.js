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
			className: `sticky-column w-12 min-w-12 cell-display border-r! `,
		},
		{
			data: "INQD_CAR",
			title: "CAR",
			className: `sticky-column w-12 min-w-12 cell-display border-r! `,
		},
		{
			data: "INQD_MFGORDER",
			title: "MFG NO.",
			className: `sticky-column w-24 min-w-24 cell-display border-r! `,
		},
		{
			data: "INQD_ITEM",
			title: "Item",
			className: `sticky-column w-12 min-w-12 cell-display border-r! text-center!`,
		},
		{
			data: "INQD_PARTNAME",
			title: "Part Name",
			className: `sticky-column w-62 min-w-62 cell-display border-r! `,
		},
		{
			data: "INQD_DRAWING",
			title: "Drawing No.",
			className: `w-62 min-w-62 cell-display border-r! `,
		},
		{
			data: "INQD_VARIABLE",
			title: "Variable",
			className: `w-62 min-w-62 cell-display border-r! `,
		},
		{
			data: "INQD_SUPPLIER",
			title: "Supplier",
			className: `w-24 min-w-24 cell-display border-r! `,
		},
		{
			data: "INQD_SENDPART",
			title: "2nd",
			className: `w-12 min-w-12 cell-display border-r! text-center!`,
		},
		{
			data: "INQD_UNREPLY",
			title: "U/N",
			className: `w-12 min-w-12 cell-display border-r! text-center!`,
			render: function (data, type) {
				if (type === "display") {
					return data == null
						? ""
						: `<i class="fi fi-sr-circle-xmark text-xl text-error justify-center"></i>`;
				}
				return data;
			},
		},
		{
			data: "INQD_QTY",
			title: "Qty.",
			className: `w-24 min-w-24 bg-primary/20`,
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
			className: `w-12 min-w-12 cell-display border-r!`,
		},
		{
			data: "INQD_TC_COST",
			title: "TC Cost",
			className: `w-24 min-w-24 border-r! INQD_TC_COST`,
			render: function (data, type, row) {
				if (type === "display") {
					data = data == null ? "" : data;
					if (row.INQD_SUPPLIER == "MELINA") {
						return `<input type="text" class="w-full outline-0 text-right input-number inqprice" value="${data}"/></div>`;
					}
					return showDigits(data, 0);
				}
				return data;
			},
		},
		{
			data: "INQD_TC_BASE",
			title: "%TC",
			className: `w-12 min-w-12 cell-display border-r!`,
			render: function (data, type) {
				if (type === "display") {
					return showDigits(data, 3);
				}
				return data;
			},
		},
		{
			data: "INQD_UNIT_PRICE",
			title: "Unit Price",
			className: `w-32 min-w-32 cell-display border-r!`,
			render: function (data, type) {
				if (type === "display") {
					return showDigits(data, 0);
				}
				return data;
			},
		},
		{
			data: "INQD_UNIT_PRICE",
			title: "Total Price",
			className: `w-32 min-w-32 cell-display border-r!`,
			render: function (data, type, row) {
				const price = intVal(data) * intVal(row.INQD_QTY);
				if (type === "display") {
					return showDigits(price, 0);
				}
				return price;
			},
		},
		{
			data: "INQD_MAR_REMARK",
			title: "MAR Remark",
			className: `w-62 min-w-62 cell-display border-r!`,
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
			className: `w-62 min-w-62 cell-display border-r!`,
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
			className: `w-62 min-w-62 cell-display border-r!`,
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
		if (data.INQD_SUPPLIER != "MELINA")
			$(row).find(".INQD_TC_COST").addClass("cell-display");
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
		api.column(13).footer().innerHTML = showDigits(totaltccost, 0);
		api.column(15).footer().innerHTML = showDigits(totalunit, 0);
		api.column(16).footer().innerHTML = showDigits(total, 0);
	};
	return opt;
}
