import { showDigits, intVal } from "@amec/webasset/utils";
import { tableOpt } from "../utils";
import { calPrice } from "./data";

export async function tableCostOption(data = []) {
	const opt = { ...tableOpt };
	opt.data = data;
	// opt.paging = false;
	opt.searching = false;
	opt.lengthChange = false;
	opt.info = false;
	opt.orderFixed = [0, "asc"];
	opt.dom = `<"flex "<"table-search flex flex-1 gap-5 "f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-auto max-h-[92vh]"t><"flex mt-5"<"table-page flex-1"><"table-info flex  flex-none gap-5"i>>`;
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
			className: `w-18 min-w-18 cell-display border-r!`,
			footer: "Total",
			render: function (data, type) {
				if (type === "display") {
					return showDigits(data, 0);
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
			data: "INQD_FC_COST",
			title: "FC Cost",
			className: `w-24 min-w-24 border-r! bg-primary/10`,
			render: function (data, type, row) {
				if (type === "display") {
					data = data == null ? "" : data;
					if (row.INQD_SUPPLIER == "AMEC") {
						return `<input type="text" class="w-full outline-0 text-right px-2 input-number inqprice fccost" value="${data}"/></div>`;
					}
					return showDigits(data, 0);
				}
				return data;
			},
		},
		{
			data: "INQD_FC_BASE",
			title: "%",
			className: `w-12 min-w-12 border-r! bg-primary/10`,
			render: function (data, type) {
				if (type === "display") {
					return `<input type="text" class="w-full outline-0 text-right px-2 input-number inqprice fcbase" value="${showDigits(data, 2)}"/></div>`;
				}
				return data;
			},
		},
		{
			data: "INQD_TC_COST",
			title: "TC Cost",
			className: `w-24 min-w-24 cell-display border-r! INQD_TC_COST`,
			render: function (data, type, row) {
				if (type === "display") {
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
			data: "INQD_FIN_REMARK",
			className: "remark-line",
			title: "Remark",
			className: `w-62 min-w-62 bg-primary/10`,
			render: function (data, type) {
				if (type === "display") {
					return `<textarea class="w-62! cell-input edit-input remark" maxlength="250">${
						data == null ? "" : data
					}</textarea>`;
				}
				return data;
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
	];

	opt.initComplete = function () {
		$("#table").closest(".dt-container").find(".table-page")
			.append(`<div class="flex items-center gap-2 bg-primary/10 p-2 rounded-lg" >
                <div class="font-bold">Apply %FC at all line:</div>
                <div><input type="text" id="fcbase-all" class="input input-number w-full max-w-25" value="1.3"/></div>
            </div>`);
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
		api.column(15).footer().innerHTML = showDigits(totaltccost, 0);
		api.column(17).footer().innerHTML = showDigits(totalunit, 0);
		api.column(18).footer().innerHTML = showDigits(total, 0);
	};
	return opt;
}
