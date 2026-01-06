import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";

import { createTable } from "@amec/webasset/dataTable";
import { getTemplate, exportExcel } from "../service/excel";
import * as items from "../service/items.js";
import * as utils from "../utils.js";
var table;

$(async function () {
	try {
		await utils.initApp({ submenu: ".navmenu-price" });
		const data = await items.getItems();
		const opt = await tableOpt(data);
		table = await createTable(opt);
	} catch (error) {
		console.log(error);
		await utils.errorMessage(error);
	} finally {
		await utils.showLoader({ show: false });
	}
});

async function tableOpt(data) {
	const result = data.filter((item) => item.category !== null);
	const opt = utils.tableOpt;
	opt.data = result;
	opt.pageLength = 15;
	opt.order = [[0, "asc"]];
	opt.columns = [
		{ data: "ITEM_NO", title: "Item" },
		{ data: "ITEM_NAME", title: "Part Name", className: "max-w-[175px]" },
		{ data: "ITEM_DWG", title: "Drawing", className: "max-w-[175px]" },
		{
			data: "ITEM_VARIABLE",
			title: "Variable",
			className: "max-w-[175px] break-all",
		},
		{ data: "ITEM_CLASS", title: "Class" },
		{ data: "ITEM_UNIT", title: "Unit" },
		{ data: "ITEM_SUPPLIER", title: "Supplier" },
		{ data: "ITEM_REMARK", title: "Remark" },
		{
			data: "ITEM_STATUS",
			title: "Status",
			className: "text-center",
			render: (data) => {
				return `<div class="badge ${
					data == 1 ? "badge-primary text-white" : "badge-error"
				}">${data == 1 ? "Enable" : "Disable"}</div>`;
			},
		},
		{
			data: "ITEM_ID",
			title: `<div class="text-2xl w-full flex justify-center"><i class="fi fi-tr-pen-field"></i></div>`,
			className: "text-center",
			sortable: false,
			render: (data, type, row) => {
				return `<input type="hidden" value="${data}" class="input-dt" data-key="id"/>
        <div class="flex items-center justify-center gap-2">
            <button class="btn btn-sm btn-ghost btn-circle save-row ${
				row.isNew === undefined ? "hidden" : ""
			}" data-id="${data}"><i class="fi fi-sr-disk text-2xl"></i></button>

            <a class="btn btn-sm btn-ghost btn-circle ignore-row ${
				row.isNew === undefined ? "hidden" : ""
			}" data-id="${data}" href="#"><i class="fi fi-rs-circle-xmark text-red-500 text-2xl"></i></a>

            <a href="${
				process.env.APP_ENV
			}/mar/items/detail/${data}" class="btn btn-sm btn-ghost btn-circle edit-row ${
					row.isNew !== undefined ? "hidden" : ""
				}" data-id="${data}"><i class="fi fi-tr-pen-circle text-2xl"></i></a>

            <button class="btn btn-sm btn-ghost btn-circle toggle-status
                ${row.ITEM_STATUS === 0 ? "hidden" : ""}
                ${row.isNew !== undefined ? "hidden" : ""}"
                data-id="${data}" data-value="0">
                <i class="fi fi-sr-trash text-2xl text-red-500"></i>
            </button>

            <button class="btn btn-sm btn-ghost btn-circle toggle-status ${
				row.ITEM_STATUS === 1 ? "hidden" : ""
			}" data-id="${data}" data-value="1"><i class="fi fi-br-refresh text-xl"></i></button>
        </div>`;
			},
		},
	];

	opt.initComplete = async function () {
		$(".table-option").append(
			`<a href="${process.env.APP_ENV}/mar/items/detail" class="btn btn-outline btn-primary hover:text-white">New Item</a>`
		);
		$(".table-paging").append(`<div class="flex gap-2">
        <button class="btn btn-accent rounded-3xl text-white items-center" id="export-detail" type="button">
            <span class="loading loading-spinner hidden"></span>
            <span class="flex items-center"><i class="fi fi-tr-file-excel text-lg me-2"></i>Export Data</span>
        </button>
    </div>`);
		// $(".table-paging").addClass("flex-col gap-3");
		const export1 = await utils.creatBtn({
			id: "export-btn",
			title: "Export",
			icon: "fi fi-tr-file-excel text-xl",
			className: `bg-accent text-white hover:shadow-lg`,
		});
		$(".table-info").append(`<div class="flex gap-2">
        ${export1}
     </div>`);
	};
	return opt;
}

$(document).on("click", "#export-btn", async function (e) {
	e.preventDefault();
	try {
		const template = await getTemplate("export_item_directsale.xlsx");
		const data = table.rows().data().toArray();
		await exportExcel(data, template, {
			filename: "Price List Items master.xlsx",
		});
	} catch (error) {
		console.log(error);
		await utils.errorMessage(error);
	}
});
