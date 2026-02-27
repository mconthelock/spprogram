import "select2/dist/css/select2.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";

import { showLoader } from "@amec/webasset/preloader";
import { showMessage, intVal } from "@amec/webasset/utils";
import { createTable } from "@amec/webasset/dataTable";
import { createBtn, activatedBtn } from "@amec/webasset/components/buttons";
import {
	getTemplate,
	exportExcel,
	getItems,
	updateItems,
} from "../service/index";
import { initApp, tableOpt } from "../utils.js";

var table;
$(async function () {
	try {
		await showLoader({ show: true });
		await initApp({ submenu: ".navmenu-price" });
		let data = await getItems();
		data = data.filter((item) => item.CATEGORY == 99);
		const opt = await tableOption(data);
		table = await createTable(opt);
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await showLoader({ show: false });
	}
});

async function tableOption(data) {
	const opt = { ...tableOpt };
	opt.data = data;
	opt.pageLength = 15;
	opt.order = [[0, "asc"]];
	opt.columns = [
		{
			data: "ITEM_NO",
			title: "Item",
			className: `w-12 min-w-12 text-center!`,
		},
		{
			data: "ITEM_NAME",
			title: "Part Name",
			className: `w-52 min-w-52 break-all`,
		},
		{
			data: "ITEM_DWG",
			title: "Drawing",
			className: `w-52 min-w-52 break-all`,
		},
		{
			data: "ITEM_VARIABLE",
			title: "Variable",
			className: `w-52 min-w-52 break-all`,
		},
		{ data: "ITEM_CLASS", title: "Class" },
		{ data: "ITEM_UNIT", title: "Unit" },
		{ data: "ITEM_SUPPLIER", title: "Supplier", className: "hidden" },
		{
			data: "ITEM_REMARK",
			title: "Remark",
			className: `w-52 min-w-52 break-all`,
		},
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
			className: `w-16 min-w-16 text-center!`,
			sortable: false,
			render: (data, type, row) => {
				const edit = createBtn({
					id: `view-${data}`,
					title: "",
					icon: "fi fi-tr-pen-circle text-2xl",
					className: `btn-xs btn-ghost btn-circle hover:shadow-lg hover:text-accent`,
					type: "link",
					href: `${process.env.APP_ENV}/fin/items/detail/${data}/`,
				});

				const deleting = createBtn({
					id: `delete-${data}`,
					title: "",
					icon: "fi fi-sr-trash text-2xl ",
					className: `btn-xs btn-ghost btn-circle toggle-status text-error hover:text-accent`,
					other: `data-value="0"`,
				});

				const activate = createBtn({
					id: `activate-${data}`,
					title: "",
					icon: "fi fi-br-refresh text-xl",
					className: `btn-xs btn-ghost btn-circle text-primary toggle-status hover:text-accent `,
					other: `data-value="1"`,
				});

				return `<div class="flex items-center justify-center gap-1">
                    ${edit}
                    ${row.ITEM_STATUS === 0 ? activate : deleting}
                </div>`;
			},
		},
	];

	opt.initComplete = async function () {
		const newBtn = await createBtn({
			id: "new-btn",
			title: "New Item",
			icon: "fi fi-tr-file-excel text-xl",
			type: "link",
			href: `${process.env.APP_ENV}/fin/items/detail/`,
			className: `btn-outline btn-primary text-primary hover:shadow-lg hover:text-white`,
		});

		const export1 = await createBtn({
			id: "export-btn",
			title: "Export",
			icon: "fi fi-tr-file-excel text-xl",
			className: `btn-accent text-white hover:shadow-lg`,
		});
		$(".table-option").append(newBtn);
		$(".table-info").append(export1);
		$("#datatable_loading").addClass("hidden");
	};
	return opt;
}

$(document).on("click", "#export-btn", async function (e) {
	e.preventDefault();
	try {
		const template = await getTemplate("export_item_directsale.xlsx");
		const data = table.rows().data().toArray();
		await exportExcel(data, template, {
			filename: "Items master.xlsx",
		});
	} catch (error) {
		console.log(error);
		await showErrorMessage(`Something went wrong.`, "2036");
	}
});

$(document).on("click", ".toggle-status", async function (e) {
	e.preventDefault();
	try {
		await activatedBtn($(this));
		const value = intVal($(this).attr("data-value"));
		let data = table.row($(this).closest("tr")).data();
		data = {
			...data,
			ITEM_STATUS: value,
			CREATE_AT: data.CREATE_AT == null ? new Date() : data.CREATE_AT,
			CREATE_BY:
				data.CREATE_BY == null
					? $("#user-login").attr("empname")
					: data.CREATE_BY,
			UPDATE_AT: new Date(),
			UPDATE_BY: $("#user-login").attr("empname"),
		};
		await updateItems(data);
		table.row($(this).closest("tr")).data(data).draw(false);
	} catch (error) {
		console.log(error);
		await showMessage(error);
	} finally {
		await activatedBtn($(this), false);
	}
});
