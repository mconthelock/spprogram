import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";

import { createTable } from "@amec/webasset/dataTable";
import * as utils from "../utils.js";
import { getItems, currentPeriod } from "../service/items.js";
import { exportExcel, getTemplate } from "../service/excel.js";

var table;
$(async function () {
	try {
		await utils.initApp({ submenu: ".navmenu-price" });
		const data = await getItems({ CATEGORY: 99 });
		const opt = await tableOpt(data);
		table = await createTable(opt);
	} catch (error) {
		console.log(error);
		await showErrorMessage(`Something went wrong.`, "2036");
	} finally {
		await showLoader({ show: false });
	}
});

async function tableOpt(data) {
	const period = await currentPeriod();
	$("#current-period").text(
		`${period.current.year}-${period.current.period}H`,
	);
	$("#last-period").text(`${period.last.year}-${period.last.period}H`);

	const opt = { ...utils.tableOpt };
	opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden"t><"flex mt-5 mb-3"<"table-info flex flex-col flex-1 gap-5"i><"table-page flex-none"p>>`;
	opt.data = data;
	opt.order = [[0, "asc"]];
	opt.pageLength = 25;
	opt.columns = [
		{ data: "ITEM_NO" },
		{ data: "ITEM_NAME", className: "max-w-[175px]" },
		{ data: "ITEM_DWG", className: "max-w-[175px]" },
		{
			data: "ITEM_VARIABLE",
			className: "max-w-[175px] break-all",
		},
		{ data: "ITEM_CLASS" },
		{ data: "ITEM_UNIT" },
		//Current pepiod
		{
			data: "ITEM_ID",
			className: "border-l bg-primary/10",
			render: (data, type, row) => {
				const current = period.current;
				const price = row.prices.find(
					(p) =>
						p.FYYEAR == current.year &&
						parseInt(p.PERIOD) == current.period,
				);
				let pricePeriod = "-";
				if (price !== undefined) {
					pricePeriod = utils.digits(price.FCCOST);
				}
				return pricePeriod;
			},
		},
		{
			data: "ITEM_ID",
			className: "border-l bg-primary/10",
			render: (data, type, row) => {
				const current = period.current;
				const price = row.prices.find(
					(p) =>
						p.FYYEAR == current.year &&
						parseInt(p.PERIOD) == current.period,
				);
				let pricePeriod = "-";
				if (price !== undefined) {
					pricePeriod = utils.digits(price.FCBASE, 2);
				}
				return pricePeriod;
			},
		},
		{
			data: "ITEM_ID",
			className: "border-l bg-primary/10",
			render: (data, type, row) => {
				const current = period.current;
				const price = row.prices.find(
					(p) =>
						p.FYYEAR == current.year &&
						parseInt(p.PERIOD) == current.period,
				);
				let pricePeriod = "-";
				if (price !== undefined) {
					pricePeriod = utils.digits(price.TCCOST);
				}
				return pricePeriod;
			},
		},
		//Last pepiod
		{
			data: "ITEM_ID",
			className: "border-l bg-accent/10",
			render: (data, type, row) => {
				const current = period.last;
				const price = row.prices.find(
					(p) =>
						p.FYYEAR == current.year &&
						parseInt(p.PERIOD) == current.period,
				);
				let pricePeriod = "-";
				if (price !== undefined) {
					pricePeriod = utils.digits(price.FCCOST);
				}
				return pricePeriod;
			},
		},
		{
			data: "ITEM_ID",
			className: "border-l bg-accent/10",
			render: (data, type, row) => {
				const current = period.last;
				const price = row.prices.find(
					(p) =>
						p.FYYEAR == current.year &&
						parseInt(p.PERIOD) == current.period,
				);
				let pricePeriod = "-";
				if (price !== undefined) {
					pricePeriod = utils.digits(price.FCBASE, 2);
				}
				return pricePeriod;
			},
		},
		{
			data: "ITEM_ID",
			className: "border-l bg-accent/10",
			render: (data, type, row) => {
				const current = period.last;
				const price = row.prices.find(
					(p) =>
						p.FYYEAR == current.year &&
						parseInt(p.PERIOD) == current.period,
				);
				let pricePeriod = "-";
				if (price !== undefined) {
					pricePeriod = utils.digits(price.TCCOST);
				}
				return pricePeriod;
			},
		},
	];

	opt.initComplete = async function () {
		const export1 = await utils.creatBtn({
			id: "export1",
			title: "Export",
			icon: "fi fi-tr-file-excel text-xl",
			className: `bg-accent text-white hover:shadow-lg`,
		});
		const importprice = await utils.creatBtn({
			id: "importprice",
			title: "Import Price",
			icon: "fi fi-rr-add text-xl",
			className: `bg-primary text-white hover:shadow-lg`,
		});

		$(".table-info").append(`<div class="flex gap-2">
        ${importprice}
        ${export1}
     </div>`);
	};
	return opt;
}

$(document).on("click", "#export1:not(.btn-disabled)", async function (e) {
	e.preventDefault();
	const period = await currentPeriod();
	try {
		await utils.activatedBtn($(this));
		const data = table.data().toArray();
		const dataWithPrices = data.map((row) => {
			const currentPrice = row.prices.find(
				(p) =>
					p.FYYEAR == period.current.year &&
					parseInt(p.PERIOD) == period.current.period,
			);
			const lastPrice = row.prices.find(
				(p) =>
					p.FYYEAR == period.last.year &&
					parseInt(p.PERIOD) == period.last.period,
			);

			return {
				...row,
				current_FCCOST: currentPrice?.FCCOST || "-",
				current_FCBASE: currentPrice?.FCBASE || "-",
				current_TCCOST: currentPrice?.TCCOST || "-",
				last_FCCOST: lastPrice?.FCCOST || "-",
				last_FCBASE: lastPrice?.FCBASE || "-",
				last_TCCOST: lastPrice?.TCCOST || "-",
			};
		});

		const template = await getTemplate({
			name: `export_price_for_fin.xlsx`,
		});
		await exportExcel(dataWithPrices, template, {
			filename: "Price List.xlsx",
			rowstart: 3,
			execute: async (workbook, sheet) => {
				sheet.getCell("H1").value =
					`${period.current.year} - ${period.current.period}H`;
				sheet.getCell("K1").value =
					`${period.last.year} - ${period.last.period}H`;
			},
		});
	} catch (error) {
		console.log(error);
		await showErrorMessage(`Something went wrong.`, "2036");
	} finally {
		await utils.activatedBtn($(this), false);
	}
});
