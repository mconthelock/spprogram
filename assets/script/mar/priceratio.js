import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";
import "select2";
import { showLoader } from "@amec/webasset/preloader";
import { createTable } from "@amec/webasset/dataTable";
import { exportExcel } from "../service/excel.js";
import * as utils from "../utils.js";
import {
	getPriceRatio,
	findPriceRatio,
	createPriceRatio,
	statusPriceRatio,
	getQuotationType,
	createQuotationType,
} from "../service/master.js";
var table;
$(document).ready(async () => {
	try {
		await utils.initApp({ submenu: ".navmenu-admin" });
		const data = await getPriceRatio();
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
	const types = await getQuotationType();
	const supplier = data.map((val) => val.SUPPLIER);
	const trader = data.map((val) => val.TRADER);
	const currency = data.map((val) => val.CURRENCY);

	const opt = { ...utils.tableOpt };
	opt.data = data;
	opt.order = [[0, "asc"]];
	opt.columns = [
		{ data: "ID", className: "hidden" },
		{
			data: "quoText",
			className: "text-nowrap",
			title: `Quotation Type`,
			render: function (data, type, row) {
				if (type === "display" && row.isNew !== undefined) {
					const activeTypes = types.filter(
						(val) => val.QUOTYPE_STATUS == 1,
					);
					let options = `<option value=""></option>`;
					activeTypes.map((val) => {
						options += `<option value="${val.QUOTYPE_ID}" ${
							val.QUOTYPE_ID == data ? "selected" : ""
						}>${val.QUOTYPE_DESC}</option>`;
					});
					return `<select class="select2 w-full input-dt" data-key="quotype">${options}</select>`;
				}
				return row.isNew !== undefined ? "" : data.QUOTYPE_DESC;
			},
		},
		{
			data: "TRADER",
			className: "text-nowrap",
			title: `Trader`,
			render: function (data, type, row) {
				if (type === "display" && row.isNew !== undefined) {
					const uniqueTrader = [...new Set(trader)];
					let options = `<option value=""></option>`;
					uniqueTrader.map((val) => {
						options += `<option value="${val}" ${
							val == data ? "selected" : ""
						}>${val}</option>`;
					});
					return `<select class="select2 w-full input-dt" data-key="trader">${options}</select>`;
				}
				return data;
			},
		},
		{
			data: "SUPPLIER",
			className: "text-nowrap",
			title: `Supplier`,
			render: function (data, type, row) {
				if (type === "display" && row.isNew !== undefined) {
					const uniqueSuppler = [...new Set(supplier)];
					let options = `<option value=""></option>`;
					uniqueSuppler.map((val) => {
						options += `<option value="${val}" ${
							val == data ? "selected" : ""
						}>${val}</option>`;
					});
					return `<select class="select2 w-full input-dt" data-key="supplier">${options}</select>`;
				}
				return data;
			},
		},

		{
			data: "CURRENCY",
			className: "text-center text-nowrap",
			title: `Currency`,
			render: function (data, type, row) {
				if (type === "display" && row.isNew !== undefined) {
					const uniqueCurrency = [
						...new Set(currency.filter((val) => val !== null)),
					];
					let options = `<option value=""></option>`;
					uniqueCurrency.map((val) => {
						options += `<option value="${val}" ${
							val == data ? "selected" : ""
						}>${val}</option>`;
					});
					return `<select class="select2 w-full input-dt" data-key="currency">${options}</select>`;
				}
				return data;
			},
		},
		{
			data: "FORMULA",
			className: "text-nowrap !text-right",
			title: `Rate`,
			render: function (data, type, row) {
				if (type === "display" && row.isNew !== undefined) {
					return `<input type="number" class="input cell-input w-full input-dt" data-key="formula" value="${data}" min="0.001" step="0.01">`;
				}
				return utils.digits(data, 3);
			},
		},
		{
			data: "STATUS",
			className: "text-center text-nowrap",
			title: `Status`,
			render: function (data, type) {
				if (type === "display") {
					let result =
						data == 1
							? `<div class="badge badge-primary text-white text-xs">Active</div>`
							: `<div class="badge badge-error  text-xs">In-Active</div>`;
					result += `<input type="hidden" value="${data}" class="input-dt" data-key="status"/>`;
					return result;
				}
				return data == 1 ? "Active" : "Inactive";
			},
		},
		{
			data: "ID",
			className: "text-nowrap w-[120px]! max-w-[120px]!",
			sortable: false,
			title: `<div class="flex justify-center"><i class="fi fi-br-tools text-xl"></i></div>`,
			render: function (data, type, row) {
				return `<input type="hidden" value="${data}" class="input-dt" data-key="id"/>
        <div class="flex items-center justify-center gap-2">
            <button class="btn btn-sm btn-ghost btn-circle save-row ${
				row.isNew === undefined ? "hidden" : ""
			}" data-id="${data}"><i class="fi fi-sr-disk text-2xl"></i></button>

            <a class="btn btn-sm btn-ghost btn-circle ignore-row ${
				row.isNew === undefined ? "hidden" : ""
			}" data-id="${data}" href="#"><i class="fi fi-rs-circle-xmark text-red-500 text-2xl"></i></a>

            <button class="btn btn-sm btn-ghost btn-circle edit-row ${
				row.isNew !== undefined ? "hidden" : ""
			}" data-id="${data}"><i class="fi fi-tr-pen-circle text-2xl"></i></button>

            <button class="btn btn-sm btn-ghost btn-circle toggle-status
                ${row.STATUS === 0 ? "hidden" : ""}
                ${row.isNew !== undefined ? "hidden" : ""}"
                data-id="${data}" data-value="0">
                <i class="fi fi-sr-trash text-2xl text-red-500"></i>
            </button>

            <button class="btn btn-sm btn-ghost btn-circle toggle-status ${
				row.STATUS === 1 ? "hidden" : ""
			}" data-id="${data}" data-value="1"><i class="fi fi-br-refresh text-xl"></i></button>
        </div>`;
			},
		},
	];

	opt.initComplete = function (settings, json) {
		const addnew = `<button class="btn btn-primary rounded-none text-white items-center hover:bg-primary/70" id="add-new-rate" type="button">
            <span class="loading loading-spinner hidden"></span>
            <span class="flex items-center"><i class="fi fi-tr-floor-layer text-lg me-2"></i>New Item</span>
        </button>`;
		const export2 = `<button class="btn btn-neutral rounded-none text-white items-center hover:bg-neutral/70" id="export-list" type="button">
            <span class="loading loading-spinner hidden"></span>
            <span class="flex items-center"><i class="fi fi-tr-file-excel text-lg me-2"></i>Export list</span>
        </button>`;
		const back = `<a href="#" class="btn btn-outline btn-neutral rounded-none text-neutral hover:text-white hover:bg-neutral/70 flex gap-3"><i class="fi fi-rr-arrow-circle-left text-xl"></i>Back</a>`;

		$(".table-info").append(`<div class="flex gap-2">
        ${addnew}
        ${export2}
     </div>`);
	};
	return opt;
}

$(document).on("click", "#add-new-rate", async function (e) {
	e.preventDefault();
	const data = table.data();
	const lastRow = data.toArray().reduce(
		(prev, current) => {
			return prev.ID > current.ID ? prev : current;
		},
		{ ID: 0 },
	);
	let id = lastRow.ID + 1;
	const newRow = {
		ID: id,
		quoText: "",
		TRADER: "",
		SUPPLIER: "",
		STATUS: 1,
		CURRENCY: "",
		FORMULA: 0.0,
		isNew: true,
	};
	const row = table.row.add(newRow).draw(false);
	table.page("last").draw("page");

	const jQueryElement = $(row.node()).find(".select2");
	jQueryElement.select2({
		tags: true,
		createTag: function (params) {
			const term = $.trim(params.term);
			if (term === "") {
				return null;
			}
			return {
				id: term,
				text: term,
				newTag: true,
			};
		},
	});
});

$(document).on("click", ".edit-row", async function (e) {
	e.preventDefault();
	const id = $(this).attr("data-id");
	const data = table.row($(this).parents("tr")).data();
	const row = table.row($(this).parents("tr"));
	const newData = {
		ID: id,
		quoText: data.quoText.QUOTYPE_ID,
		TRADER: data.TRADER,
		SUPPLIER: data.SUPPLIER,
		STATUS: data.STATUS,
		CURRENCY: data.CURRENCY,
		FORMULA: data.FORMULA,
		isNew: false,
	};
	row.data(newData);
	row.draw(false);

	const jQueryElement = $(row.node()).find(".select2");
	jQueryElement.select2({
		tags: true,
		createTag: function (params) {
			const term = $.trim(params.term);
			if (term === "") {
				return null;
			}
			return {
				id: term,
				text: term,
				newTag: true,
			};
		},
	});
});

$(document).on("click", ".save-row", async function (e) {
	e.preventDefault();
	const row = table.row($(this).parents("tr"));
	const data = {};
	let isBlank = false;
	$(row.node())
		.find(".input-dt")
		.map((index, element) => {
			const key = $(element).attr("data-key");
			const val = $(element).val();
			data[key] = val;
			if (val == "" || val == null || val == 0) isBlank = true;
		});
	if (isBlank) {
		await showMessage(`Please fill all required field.`, {
			type: "warning",
		});
		return;
	}
	//Save Quotation Type
	const quoTyoe = await getQuotationType();
	const isType = quoTyoe.find((val) => val.QUOTYPE_ID == data.quotype);
	if (isType == undefined) {
		const quoTypeVal = {
			QUOTYPE_DESC: data.quotype,
			QUOTYPE_STATUS: 1,
			QUOTYPE_CUR: data.currency,
		};

		try {
			const res = await createQuotationType(quoTypeVal);
			data.quotype = res.QUOTYPE_ID;
		} catch (error) {
			console.log(error);
			await showErrorMessage(`Something went wrong.`, "2036");
		}
	}

	//Save Price Ratio
	const empname = $("#user-login").attr("empname");
	const ratio = {
		ID: data.id,
		TRADER: data.trader,
		SUPPLIER: data.supplier,
		QUOTATION: data.quotype,
		FORMULA: data.formula,
		CURRENCY: data.currency,
		UPDATE_BY: empname,
		UPDATE_AT: new Date(),
		STATUS: data.status,
	};
	try {
		const result = await createPriceRatio(ratio);
		row.data(result[0]);
		row.draw(false);
	} catch (error) {
		console.log(error);
		await showErrorMessage(`Something went wrong.`, "2036");
	}
});

$(document).on("click", ".toggle-status", async function (e) {
	e.preventDefault();
	const id = $(this).attr("data-id");
	const status = $(this).attr("data-value");
	const data = table.row($(this).parents("tr")).data();
	const row = table.row($(this).parents("tr"));
	const res = await statusPriceRatio({ id, status });
	row.data(res[0]);
	row.draw(false);
});

$(document).on("click", ".ignore-row", async function (e) {
	e.preventDefault();
	const row = table.row($(this).parents("tr"));
	const data = row.data();
	if (data.isNew) {
		row.remove().draw(false);
		return;
	}

	const res = await findPriceRatio({
		TRADER: data.TRADER,
		SUPPLIER: data.SUPPLIER,
		QUOTATION: data.quoText,
	});
	row.data(res[0]);
	row.draw(false);
});

$(document).on("click", "#export-list", async function (e) {
	e.preventDefault();
	const data = table.rows().data().toArray();
	data.forEach((val) => {
		val.statusText = val.STATUS == 1 ? "Active" : "Inactive";
	});
	const template = await getTemplate("export_priceratio.xlsx");
	await exportExcel(mergedData, template, {
		filename: "priceratio.xlsx",
	});
});
