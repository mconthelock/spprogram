import { showDigits, intVal } from "@amec/webasset/utils";
import { tableOpt } from "../utils";
import { calPrice } from "./data";

export async function tableViewFactOption(data = []) {
	const opt = { ...tableOpt };
	opt.data = data;
	opt.lengthChange = false;
	opt.searching = false;
	opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-auto"t><"flex mt-5"<"table-info flex flex-col flex-1 gap-5"i><"table-page flex-none">>`;
	opt.order = [[0, "asc"]];
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
			data: "INQD_ITEM",
			title: "Item",
			className: `sticky-column w-14 min-w-14 cell-display border-r! text-center!`,
		},
		{
			data: "INQD_PARTNAME",
			title: "Part Name",
			className: `sticky-column w-62 min-w-62 cell-display border-r!`,
		},
		{
			data: "INQD_DRAWING",
			title: "Drawing No.",
			className: `w-62 min-w-62 cell-display border-r!`,
		},
		{
			data: "INQD_VARIABLE",
			title: "Variable",
			className: `w-62 min-w-62 cell-display border-r!`,
		},
		{
			data: "INQD_SUPPLIER",
			title: "Supplier",
			className: `w-24 min-w-24 cell-display border-r!`,
		},
		{
			data: "INQD_QTY",
			title: "Qty.",
			footer: "Total",
			className: `w-16 min-w-16 cell-display border-r!`,
		},
		{
			data: "INQD_UM",
			title: "U/M",
			className: `w-16 min-w-16 cell-display border-r!`,
		},
		{
			data: "INQD_TC_COST",
			title: "TC Cost",
			className: `w-32 min-w-32 cell-display border-r!`,
			render: function (data, type) {
				if (type === "display") {
					return showDigits(data, 0);
				}
				return data;
			},
		},
		{
			data: "INQD_TC_BASE",
			title: "% TC",
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
					return showDigits(data, 3);
				}
				return data;
			},
		},
		{
			data: "INQD_UNIT_PRICE",
			title: "Total Price",
			className: `w-32 min-w-32 cell-display border-r!`,
			render: function (data, type, row) {
				const price = row.INQD_QTY * data;
				if (type === "display") {
					return showDigits(price, 3);
				}
				return price;
			},
		},
	];

	opt.footerCallback = function () {
		const api = this.api();
		const data = api.rows().data();
		let totalqty = 0;
		let totalfccost = 0;
		let totaltccost = 0;
		let totalunit = 0;
		let total = 0;
		let currency = "";
		data.map((el) => {
			const price = calPrice(el);
			totalqty += intVal(el.INQD_QTY);
			totalfccost += intVal(el.INQD_FC_COST);
			totaltccost += intVal(price.tccost);
			totalunit += intVal(price.unitprice);
			total += intVal(price.amount);
			currency = el.INQD_TCCUR == undefined ? "" : el.INQD_TCCUR;
		});

		api.column(7).footer().innerHTML = showDigits(totalqty, 0);
		api.column(9).footer().innerHTML = showDigits(totaltccost, 0);
		api.column(11).footer().innerHTML = showDigits(totalunit, 0);
		api.column(12).footer().innerHTML = showDigits(total, 0);
	};
	return opt;
}
