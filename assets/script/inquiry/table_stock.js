import { showDigits } from "@amec/webasset/utils";
import { createBtn } from "@amec/webasset/components/buttons";
import { tableOpt } from "../utils.js";
export async function setupStockTableDetail(data = []) {
	const opt = { ...tableOpt };
	opt.data = data;
	opt.paging = false;
	opt.searching = false;
	opt.responsive = false;
	opt.info = false;
	opt.orderFixed = [2, "asc"];
	opt.dom = `<"flex gap-3"<"table-search flex flex-1 gap-5 "><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden"t><"flex mt-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
	opt.columns = [
		{
			data: "INQD_RUNNO",
			className: "hidden",
		},
		{
			data: "INQD_ID",
			title: "<i class='icofont-settings text-lg'></i>",
			sortable: false,
			className:
				"sticky-column text-center text-nowrap w-[40px] max-w-[40px] cell-display border-r!",
			render: function (data, type) {
				if (type === "display") {
					return `<button class="btn btn-xs btn-circle btn-ghost delete-sub-line text-red-500"><i class="fi fi-bs-cross"></i></button>`;
				}
				return data;
			},
		},
		{
			data: "INQD_SEQ",
			title: "No",
			className: `sticky-column w-[50px] max-w-[50px] cell-display border-r!`,
		},
		{
			data: "INQD_ITEM",
			title: "Item",
			className: `sticky-column w-[60px] max-w-[60px] text-center! bg-primary/20!`,
			render: function (data, type) {
				if (type === "display") {
					return `<input type="text" maxlength="3" minlength="3" class="w-full cell-input itemno" value="${data}"/>`;
				}
				return data;
			},
		},
		{
			data: "INQD_PARTNAME",
			title: "Part Name",
			className: ` sticky-column w-[225px] max-w-[225px] cell-display border-r!`,
			render: function (data) {
				return data == null ? "" : data;
			},
		},
		{
			data: "INQD_DRAWING",
			title: "Drawing No.",
			className: "w-[225px] max-w-[225px] cell-display border-r!",
			render: function (data) {
				return data == null ? "" : data;
			},
		},
		{
			data: "INQD_VARIABLE",
			title: "Variable",
			className: "w-[225px] max-w-[225px] cell-display border-r!",
			render: function (data) {
				return data == null ? "" : data;
			},
		},
		{
			data: "INQD_QTY",
			title: "Qty.",
			className: "w-[55px] max-w-[55px] bg-primary/20!",
			render: function (data, type) {
				if (type === "display") {
					return `<input type="text" class="w-full! cell-input input-number qty-input" value="${data}">`;
				}
				return data;
			},
		},
		{
			data: "INQD_UM",
			title: "U/M",
			className: `cell-display border-r!`,
			render: function (data) {
				return data;
			},
		},
		{
			data: "INQD_SUPPLIER",
			title: "Supplier",
			className: `cell-display border-r!`,
			render: function (data) {
				return data;
			},
		},
		{
			data: "INQD_TC_COST",
			title: "TC Cost",
			className: `cell-display border-r!`,
			render: function (data) {
				return showDigits(data, 0);
			},
		},
		{
			data: "INQD_TC_BASE",
			title: "TC Base",
			className: `cell-display border-r!`,
			render: function (data) {
				return showDigits(data, 3);
			},
		},
		{
			data: "INQD_UNIT_PRICE",
			title: "Unit Price",
			className: `cell-display border-r!`,
			render: function (data) {
				return showDigits(data, 0);
			},
		},
	];
	return opt;
}

export async function setupStockPriceList(data) {
	console.log(data);

	const opt = { ...tableOpt };
	opt.data = data;
	opt.lengthChange = false;
	opt.pageLength = 10;
	opt.order = [[1, "asc"]];
	opt.dom = `<"flex gap-3 mb-3"<"table-search flex flex-1 items-center gap-5"><"flex table-option"f>><"bg-white border border-slate-300 rounded-2xl overflow-hidden"t><"flex mt-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
	opt.columns = [
		{
			data: "itemdesc.ITEM_NO",
			title: "Item No",
			className: `text-center`,
		},
		{
			data: "itemdesc.ITEM_NAME",
			title: "Part Name",
			className: `max-w-62`,
		},
		{
			data: "itemdesc.ITEM_DWG",
			title: "Drawing No",
			className: `max-w-62`,
		},
		{
			data: "itemdesc.ITEM_VARIABLE",
			title: "Variable",
			className: `max-w-62`,
		},
		{
			data: "itemdesc.ITEM_UNIT",
			title: "Unit",
			className: `max-w-62`,
		},
		{
			data: "itemdesc.ITEM_SUPPLIER",
			title: "Supplier",
			className: `max-w-62`,
		},
		{
			data: "itemdesc.prices",
			title: "FC Cost",
			className: "text-right!",
			render: function (data, type) {
				if (type === "display") {
					return showDigits(data[0].FCCOST, 0);
				}
				return data;
			},
		},
		{
			data: "itemdesc.prices",
			title: "FC Rate",
			className: "text-right!",
			render: function (data, type) {
				if (type === "display") {
					return showDigits(data[0].FCBASE, 2);
				}
				return data;
			},
		},
		{
			data: "itemdesc.prices",
			title: "TC Cost",
			className: "text-right!",
			render: function (data, type) {
				if (type === "display") {
					return showDigits(data[0].TCCOST, 0);
				}
				return data;
			},
		},
		{
			data: "customer.rate",
			title: "TC Rate",
			className: "text-right!",
			render: function (data, type) {
				if (type === "display") {
					return showDigits(data.FORMULA, 3);
				}
				return data;
			},
		},
		{
			data: "customer.rate",
			title: "Unit Price",
			className: "text-right!",
			render: (data, type, row) => {
				const formula = data.FORMULA;
				const cost = row.itemdesc.prices[0].TCCOST;
				const price = Math.ceil(formula * cost);
				if (type === "display") {
					if (type === "display") {
						return showDigits(price, 0);
					}
				}
				return price;
			},
		},
	];

	opt.initComplete = async function (settings, json) {
		$(`#table-price-list`)
			.closest(".dt-container")
			.find(".table-search")
			.html(`<h3 class="text-lg font-bold">Price List item!</h3>`);

		const insertline = await createBtn({
			id: "price-list-confirm",
			title: "Add to inquiry",
			icon: "fi fi-rr-insert text-xl ",
			className: `btn-outline btn-primary text-primary hover:shadow-lg  hover:text-white`,
		});
		const cancelinsertline = await createBtn({
			id: "price-list-cancel",
			title: "Cancel",
			icon: "fi fi-bs-cross text-xl",
			className: `btn-error hover:shadow-lg`,
		});

		$(`#table-price-list`)
			.closest(".dt-container")
			.find(".table-page")
			.append(
				`<div class="flex gap-3 mt-3">${insertline}${cancelinsertline}</div>`,
			);
		$("#datatable_loading").addClass("hidden");
	};
	return opt;
}
