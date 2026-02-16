import { showDigits, intVal } from "@amec/webasset/utils";
import { createBtn } from "@amec/webasset/components/buttons";
import { calPrice } from "./data.js";
import { tableOpt } from "../utils.js";
export async function tableOutOption(data = []) {
	const opt = { ...tableOpt };
	opt.data = data;
	opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-auto"t><"flex mt-5"<"table-info flex flex-col flex-1 gap-5"i><"table-page flex-none"i>>`;
	opt.searching = false;
	opt.lengthChange = false;
	opt.columns = [
		{
			data: "INQD_CAR",
			title: "Ele No.",
			className: "sticky-column text-center! cell-display border-r!",
		},
		{
			data: "INQD_ITEM",
			title: "Item",
			className: "sticky-column cell-display text-center! border-r!",
		},
		{
			data: "INQD_DRAWING",
			title: "Drawing No.",
			className: "sticky-column min-w-[225px] cell-display border-r!",
		},
		{
			data: "INQD_PARTNAME",
			title: "Part Name",
			className: "min-w-[225px] cell-display border-r!",
		},
		{
			data: "INQD_VARIABLE",
			title: "Specification",
			className: "text-start! min-w-[225px] cell-display border-r!",
		},
		{
			data: "INQD_SUPPLIER",
			title: "Supplier",
			className: "cell-display border-r!",
		},
		{
			data: "INQD_QTY",
			title: "Qty",
			footer: "Total",
			className: "cell-display border-r!",
		},
		{
			data: "INQD_UM",
			title: "UM",
			className: "cell-display border-r!",
		},
		{
			data: "INQD_FC_COST",
			title: `<div>SPU Price</div><div>[1]</div>`,
			className: "text-right bg-primary/20",
			render: function (data, type) {
				if (type === "display") {
					const str = `<input type="text" class="w-full! text-end text-md! fccost cell-input" value="${data == null ? "" : showDigits(data, 0)}" onfocus="this.select();"/>`;
					return str;
				}
				return data;
			},
		},
		{
			data: "INQD_FC_BASE",
			title: `<div>Exchange</div><div>[2]</div>`,
			className: "cell-display border-r!",
			render: function (data, type) {
				if (type === "display") {
					return showDigits(data, 2);
				}
				return data;
			},
		},
		{
			data: "INQD_TC_COST",
			title: `<div>SPU Price (THB)</div><div>[1*2]</div>`,
			className: "cell-display border-r!",
			render: function (data, type) {
				if (type === "display") {
					return showDigits(data, 0);
				}
				return data;
			},
		},
		{
			data: "INQD_TC_BASE",
			title: `<div>Profit</div><div>[3]</div>`,
			className: "cell-display border-r!",
			render: function (data, type) {
				if (type === "display") {
					return showDigits(data, 3);
				}
				return data;
			},
		},
		{
			data: "INQD_EXRATE",
			title: `<div>Exchange</div><div>[4]</div>`,
			className: "cell-display border-r!",
			render: function (data, type) {
				if (type === "display") {
					return showDigits(data, 2);
				}
				return data;
			},
		},
		{
			data: "INQD_UNIT_PRICE",
			title: `<div>Unit Price</div><div>[(1*2*3)/4]</div>`,
			className: "cell-display border-r!",
			render: function (data, type) {
				if (type === "display") {
					return showDigits(data, 0);
				}
				return data;
			},
		},
		{
			data: "INQD_UNIT_PRICE",
			title: "Amount",
			className: "cell-display",
			render: function (data, type, row) {
				if (type === "display") {
					const amount = intVal(data) * intVal(row.INQD_QTY);
					return showDigits(amount, 0);
				}
				return data;
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
		api.column(6).footer().innerHTML = showDigits(totalqty, 0);
		api.column(8).footer().innerHTML = showDigits(totalfccost, 0);
		api.column(10).footer().innerHTML = showDigits(totaltccost, 0);
		api.column(13).footer().innerHTML = showDigits(totalunit, 0);
		api.column(14).footer().innerHTML = showDigits(total, 0);
		api.column(12).footer().innerHTML = currency;
	};
	opt.initComplete = async function () {
		const btn1 = await createBtn({
			id: "import-data-btn",
			title: "Import data",
			icon: `fi fi-rs-progress-upload text-xl`,
			className: `btn-outline btn-accent text-accent hover:shadow-lg hover:text-white!`,
		});
		// $(".table-info").append(`<div class="flex gap-2">${btn1}</div>`);
	};
	return opt;
}
