import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";

import { createTable } from "@amec/webasset/dataTable";
import * as utils from "../utils.js";
import { exportExcel, getTemplate } from "../service/excel.js";
import { getItems } from "../service/items.js";

var table;
$(async function () {
	try {
		await utils.initApp({ submenu: ".navmenu-price" });
		const data = await getItems({ CATEGORY: 99 });
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
	const opt = { ...utils.tableOpt };
	opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden"t><"flex mt-5 mb-3"<"table-info flex flex-col flex-1 gap-5"i><"table-page flex-none"p>>`;
	opt.data = data;
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
		// { data: "CATEGORY", title: "Part Name" },
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
			}/fin/items/detail/${data}" class="btn btn-sm btn-ghost btn-circle edit-row ${
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
	opt.initComplete = async function (settings, json) {
		$(".table-option").append(
			`<a href="${process.env.APP_ENV}/fin/items/detail" class="btn btn-outline btn-primary hover:text-white">New Item</a>`
		);
		const export1 = await utils.creatBtn({
			id: "export1",
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

$(document).on("click", "#export1:not(.btn-disabled)", async function (e) {
	e.preventDefault();
	try {
		await utils.activatedBtn($(this));
		const data = table.data().toArray();
		const template = await getTemplate({
			name: `export_item_directsale.xlsx`,
		});
		await exportExcel(data, template, {
			filename: "Item Master.xlsx",
			rowstart: 2,
		});
	} catch (error) {
		console.log(error);
		await utils.errorMessage(error);
	} finally {
		await utils.activatedBtn($(this), false);
	}
});
