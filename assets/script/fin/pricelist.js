import "select2/dist/css/select2.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";

import select2 from "select2";
import { showLoader } from "@amec/webasset/preloader";
import { showMessage, showDigits } from "@amec/webasset/utils";
import { createTable } from "@amec/webasset/dataTable";
import { createBtn, activatedBtn } from "@amec/webasset/components/buttons";
import { setSelect2 } from "@amec/webasset/select2";

import { getTemplate, exportExcel } from "../service/excel";
import { getItems, currentPeriod } from "../service/items.js";
import { findPriceRatio } from "../service/master.js";
import { tableOpt, initApp } from "../utils.js";
select2();

var table;
$(async function () {
	try {
		await showLoader({ show: true });
		await initApp({ submenu: ".navmenu-price" });
		const data = await setData();
		const opt = await tableOption(data);
		table = await createTable(opt);
	} catch (error) {
		console.log(error);
		await showMessage(error);
	} finally {
		await showLoader({ show: false });
	}
});

async function setData() {
	const items = await getItems();
	const period = await currentPeriod();
	// const customer = customers.find(
	// 	(cus) => cus.CUS_ID == $("#selected-customer").val(),
	// );
	// const selected = $("#selected-customer").val();
	const ratio = await findPriceRatio({
		SUPPLIER: "AMEC",
		TRADER: "Direct",
		QUOTATION: 4,
	});
	const data = items
		.filter((item) => item.CATEGORY == 99)
		.map((item) => {
			const current = period.current;
			const currentprices = item.prices.filter(
				(p) =>
					p.FYYEAR == current.year &&
					parseInt(p.PERIOD) == current.period,
			);
			const currentprice =
				currentprices.length > 0
					? currentprices.reduce((max, p) =>
							p.STARTIN > max.STARTIN ? p : max,
						)
					: undefined;

			const last = period.last;
			const lastprice = item.prices.find(
				(p) =>
					p.FYYEAR == last.year && parseInt(p.PERIOD) == last.period,
			);
			return {
				...item,
				// customer: customer,
				currentprice: currentprice,
				lastprice: lastprice,
				ratio: ratio[0] || null,
			};
		});
	return data;
}

async function tableOption(data) {
	const period = await currentPeriod();
	$("#current-period").text(
		`${period.current.year}-${period.current.period}H`,
	);
	$("#last-period").text(`${period.last.year}-${period.last.period}H`);
	const opt = { ...tableOpt };
	opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-auto"t><"flex mt-5 mb-3"<"table-info flex flex-col flex-1 gap-5"i><"table-page flex-none"p>>`;
	opt.data = data;
	opt.order = [[0, "asc"]];
	opt.pageLength = 25;
	opt.columns = [
		// { data: "ITEM_ID", className: "sticky-column text-center!" },
		{ data: "ITEM_NO", className: "sticky-column text-center!" },
		{
			data: "ITEM_NAME",
			className: "w-[225px] min-w-[225px] sticky-column",
		},
		{
			data: "ITEM_DWG",
			className: "w-[225px] min-w-[225px] sticky-column",
		},
		{
			data: "ITEM_VARIABLE",
			className: "min-w-[225px] max-w-[225px] break-all",
		},
		// { data: "ITEM_CLASS", className: "text-nowrap" },
		{ data: "ITEM_UNIT" },
		{
			data: "ITEM_ID",
			render: (data, type, row) => {
				return row.ratio !== null ? row.ratio.CURRENCY : "-";
			},
		},
		//Current pepiod
		{
			data: "ITEM_ID",
			className: "border-l bg-primary/10",
			render: (data, type, row) => {
				if (row.currentprice === undefined) return "-";
				return showDigits(row.currentprice.FCCOST);
			},
		},
		{
			data: "ITEM_ID",
			className: "border-l bg-primary/10",
			render: (data, type, row) => {
				if (row.currentprice === undefined) return "-";
				return showDigits(row.currentprice.FCBASE, 2);
			},
		},
		{
			data: "ITEM_ID",
			className: "border-l bg-primary/10",
			render: (data, type, row) => {
				if (row.currentprice === undefined) return "-";
				return showDigits(row.currentprice.TCCOST);
			},
		},
		//Last pepiod
		{
			data: "ITEM_ID",
			className: "border-l bg-accent/10",
			render: (data, type, row) => {
				if (row.lastprice === undefined) return "-";
				return showDigits(row.lastprice.FCCOST);
			},
		},
		{
			data: "ITEM_ID",
			className: "border-l bg-accent/10",
			render: (data, type, row) => {
				if (row.lastprice === undefined) return "-";
				return showDigits(row.lastprice.FCBASE, 2);
			},
		},
		{
			data: "ITEM_ID",
			className: "border-l bg-accent/10",
			render: (data, type, row) => {
				if (row.lastprice === undefined) return "-";
				return showDigits(row.lastprice.TCCOST);
			},
		},
	];

	opt.createdRow = function (row, data, dataIndex) {
		if (data.currentprice == undefined && data.lastprice == undefined) {
			$(row).remove();
		}

		if (data.ITEM_STATUS == 0) {
			$(row).addClass("bg-red-100!");
		}

		if (data.currentprice != undefined && data.lastprice != undefined) {
			if (data.currentprice.TCCOST < data.lastprice.TCCOST) {
				$(row).find("td").eq(8).addClass("price-down");
			}

			if (data.currentprice.TCCOST > data.lastprice.TCCOST) {
				$(row).find("td").eq(8).addClass("price-up");
			}
		}
	};

	opt.initComplete = async function () {
		const export1 = await createBtn({
			id: "export-btn",
			title: "Export",
			icon: "fi fi-tr-file-excel text-xl",
			className: `bg-accent text-white hover:shadow-lg`,
		});
		const importprice = await createBtn({
			id: "importprice",
			title: "Import Price",
			icon: "fi fi-rr-add text-xl",
			className: `bg-primary text-white hover:shadow-lg`,
		});

		$(".table-info").append(`<div class="flex gap-2">${export1}</div>`);
		$("#datatable_loading").addClass("hidden");
	};
	return opt;
}

$(document).on("click", "#export-btn", async function (e) {
	e.preventDefault();
	try {
		const template = await getTemplate("export_price_for_fin.xlsx");
		let data = table.rows().data().toArray();
		data = data.map((d) => {
			return {
				...d,
				current_FCCOST: d.currentprice ? d.currentprice.FCCOST : 0,
				current_FCBASE: d.currentprice ? d.currentprice.FCBASE : 0,
				current_TCCOST: d.currentprice ? d.currentprice.TCCOST : 0,
				last_FCCOST: d.lastprice ? d.lastprice.FCCOST : 0,
				last_FCBASE: d.lastprice ? d.lastprice.FCBASE : 0,
				last_TCCOST: d.lastprice ? d.lastprice.TCCOST : 0,
			};
		});
		await exportExcel(data, template, {
			filename: "Price List.xlsx",
			rowstart: 3,
			static: [
				{ cols: "H1", text: $("#current-period").text() },
				{ cols: "K1", text: $("#last-period").text() },
			],
		});
	} catch (error) {
		console.log(error);
		await showMessage(error);
	}
});
