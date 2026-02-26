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
import { getCustomer } from "../service/customers.js";
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
	const customers = await getCustomer();
	const period = await currentPeriod();
	const customer = customers.find(
		(cus) => cus.CUS_ID == $("#selected-customer").val(),
	);
	const selected = $("#selected-customer").val();
	const ratio = await findPriceRatio({
		SUPPLIER: "AMEC",
		TRADER: "Direct",
		QUOTATION: customer.CUS_QUOTATION,
	});
	const data = items
		.filter((item) => {
			return item.itemscustomer.some(
				(cus) => cus.CUSTOMER_ID == selected,
			);
		})
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
				customer: customer,
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
	opt.pageLength = 15;
	opt.columns = [
		{ data: "ITEM_NO", className: "sticky-column" },
		{
			data: "ITEM_NAME",
			className: "w-[175px] min-w-[175px] sticky-column",
		},
		{
			data: "ITEM_DWG",
			className: "w-[225px] min-w-[225px] sticky-column",
		},
		{
			data: "ITEM_VARIABLE",
			className: "min-w-[225px] max-w-[225px] break-all",
		},
		{ data: "ITEM_CLASS", className: "text-nowrap" },
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
		{
			data: "ITEM_ID",
			className: "border-l bg-primary/10",
			render: (data, type, row) => {
				if (row.currentprice === undefined) return "-";
				return row.ratio !== null
					? showDigits(row.ratio.FORMULA, 2)
					: "-";
			},
		},

		{
			data: "ITEM_ID",
			className: "border-l bg-primary/10 relative price-move",
			render: (data, type, row) => {
				if (row.currentprice === undefined) return "-";
				const ratio = row.ratio !== null ? row.ratio.FORMULA : 1;
				const tccost = Math.ceil(row.currentprice.TCCOST * ratio);
				return showDigits(tccost);
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
		{
			data: "ITEM_ID",
			className: "border-l bg-accent/10",
			render: (data, type, row) => {
				if (row.lastprice === undefined) return "-";
				return row.ratio !== null
					? showDigits(row.ratio.FORMULA, 2)
					: "-";
			},
		},
		{
			data: "ITEM_ID",
			className: "border-l bg-accent/10",
			render: (data, type, row) => {
				if (row.lastprice === undefined) return "-";
				const ratio = row.ratio !== null ? row.ratio.FORMULA : 1;
				const tccost = Math.ceil(row.lastprice.TCCOST * ratio);
				return showDigits(tccost);
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
				$(row).find("td").eq(11).addClass("price-down");
			}

			if (data.currentprice.TCCOST > data.lastprice.TCCOST) {
				$(row).find("td").eq(11).addClass("price-up");
			}
		}
	};

	opt.initComplete = async function () {
		//Table Right Options
		const customers = await getCustomer();
		const selected = $("#selected-customer").val();
		let cusSelect = ``;
		customers.map((cus) => {
			return (cusSelect += `<option value="${cus.CUS_ID}" ${
				cus.CUS_ID == selected ? "selected" : ""
			}>${cus.CUS_DISPLAY}</option>`);
		});
		$(".table-option").html(`
      <div class="flex items-center gap-3">
        <label for="selected-customer" class="whitespace-nowrap font-semibold">Customer:</label>
        <select id="customer-option" class="s2 select select2-sm">${cusSelect}</select>
      </div>
    `);
		await setSelect2({ width: "200px", allowClear: false });
		// Table Footer Buttons
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
	};
	return opt;
}

$(document).on("change", "#customer-option", function () {
	const cus = $(this).val();
	window.location.href = `${process.env.APP_ENV}/mar/price/index/${cus}`;
});

$(document).on("click", "#export-btn", async function (e) {
	e.preventDefault();
	try {
		const template = await getTemplate("export_price_for_mar.xlsx");
		const data = table.rows().data().toArray();
		await exportExcel(data, template, {
			filename: "Price List.xlsx",
			rowstart: 3,
			static: [
				{ cols: "K1", text: $("#current-period").text() },
				{ cols: "P1", text: $("#last-period").text() },
			],
		});
	} catch (error) {
		console.log(error);
		await showMessage(error);
	}
});
