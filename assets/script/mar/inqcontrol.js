import { showLoader } from "@amec/webasset/preloader";
import { createTable } from "@amec/webasset/dataTable";
import { getTemplate, exportExcel } from "../service/excel";
import * as utils from "../utils.js";
import {
	getControl,
	getShipments,
	getQuotationType,
	getDeliveryTerm,
	updateController,
} from "../service/master.js";

var table;
$(document).ready(async () => {
	try {
		await utils.initApp({ submenu: ".navmenu-admin" });
		const data = await getControl();
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
	const quotype = await getQuotationType();
	const shipments = await getShipments();
	const terms = await getDeliveryTerm();
	const opt = { ...utils.tableOpt };
	opt.order = [
		[1, "asc"],
		[0, "desc"],
	];
	opt.data = data;
	opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option">><"bg-white border border-slate-300 rounded-2xl overflow-hidden overflow-x-auto"t><"flex my-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
	opt.columns = [
		{
			data: "CNT_PREFIX",
			title: "Inquiry Prefix",
		},
		{
			data: "CNT_AGENT",
			title: "Agent",
		},
		{ data: "CNT_TRADER", title: "Trader" },
		{
			data: "CNT_QUOTATION",
			title: "Quotation Type",
			render: (data, type, row) => {
				if (row.isNew !== undefined) {
					let str = `<option value="" disabled selected>Select Quotation Type</option>`;
					quotype.forEach((item) => {
						str += `<option value="${item.QUOTYPE_ID}" ${
							item.QUOTYPE_ID == data ? "selected" : ""
						}>${item.QUOTYPE_DESC}</option>`;
					});
					return `<select class="select select-bordered w-full text-xs edit-val" name="CNT_QUOTATION">${str}
          </select>
          `;
				}
				const quotation = quotype.find(
					(item) => item.QUOTYPE_ID == data,
				);
				return quotation.QUOTYPE_DESC;
			},
		},
		{
			data: "CNT_TERM",
			title: "Delivery Term",
			render: (data, type, row) => {
				if (row.isNew !== undefined) {
					let str = `<option value="" disabled selected>Select Delivery Term</option>`;
					terms.forEach((item) => {
						str += `<option value="${item.TERM_ID}" ${
							item.TERM_ID == data ? "selected" : ""
						}>${item.TERM_DESC}</option>`;
					});
					return `<select class="select select-bordered w-full text-xs edit-val" name="CNT_TERM">${str}
            </select>
            `;
				}
				const term = terms.find((item) => item.TERM_ID == data);
				return term.TERM_DESC;
			},
		},
		{
			data: "CNT_METHOD",
			title: "Delivery Method",
			render: (data, type, row) => {
				if (row.isNew !== undefined) {
					let str = `<option value="" disabled selected>Select Delivery Term</option>`;
					shipments.forEach((item) => {
						str += `<option value="${item.SHIPMENT_ID}" ${
							item.SHIPMENT_ID == data ? "selected" : ""
						}>${item.SHIPMENT_DESC}</option>`;
					});
					return `<select class="select select-bordered w-full max-w-xs text-xs edit-val" name="CNT_METHOD">${str}
            </select>
            `;
				}
				const shipment = shipments.find(
					(item) => item.SHIPMENT_ID == data,
				);
				return shipment.SHIPMENT_DESC;
			},
		},
		{
			data: "CNT_WEIGHT",
			title: "Weight",
			sortable: false,
			render: (data, type, row) => {
				if (row.isNew !== undefined) {
					return `<div class="flex justify-center"><input type="checkbox" class="checkbox checkbox-primary text-white edit-val" name="CNT_WEIGHT" ${
						data == 1 ? "checked" : ""
					} /></div>`;
				}
				return data == 1
					? `<i class="fi fi-rr-check-circle text-xl text-success justify-center"></i>`
					: "";
			},
		},
		{
			data: "CNT_PREFIX",
			className: "",
			sortable: false,
			title: `<div class="flex justify-center"><i class='fi fi-br-settings-sliders text-lg'></i></div>`,
			render: function (data, type, row) {
				return `
        <div class="flex items-center justify-center gap-2">
            <button class="btn btn-sm btn-ghost btn-circle save-row ${
				row.isNew === undefined ? "hidden" : ""
			}"><i class="fi fi-sr-disk text-lg"></i></button>

            <button class="btn btn-sm btn-ghost btn-circle edit-row ${
				row.isNew !== undefined || row.CURR_LATEST == 0 ? "hidden" : ""
			}"><i class="fi fi-rr-customize text-lg"></i></button>
        </div>`;
			},
		},
	];
	opt.initComplete = async function () {
		const export1 = await utils.creatBtn({
			id: "export-btn",
			title: "Export",
			icon: "fi fi-tr-file-excel text-xl",
			className: `from-accent/90 to-accent text-white hover:shadow-lg`,
		});
		$(".table-page").append(`<div class="mt-5 gap-3">${export1}</div>`);
	};
	return opt;
}

$(document).on("click", ".edit-row", async function () {
	try {
		await showLoader({ show: true });
		const row = table.row($(this).closest("tr"));
		const rowData = row.data();
		rowData.isNew = true;
		table.row(row).data(rowData).draw();
	} catch (error) {
		console.log(error);
		await showErrorMessage(`Something went wrong.`, "2036");
	} finally {
		await showLoader({ show: false });
	}
});

$(document).on("click", ".save-row", async function (e) {
	e.preventDefault();
	try {
		const row = table.row($(this).closest("tr"));
		const rowData = row.data();
		const $tr = $(this).closest("tr");
		const formdata = $tr.find(".edit-val").serializeArray();
		let isWeight = false;
		formdata.forEach((item) => {
			if (item.name === "CNT_WEIGHT") {
				rowData[item.name] = 1;
				isWeight = true;
			} else {
				rowData[item.name] = item.value;
			}
		});

		if (!isWeight) {
			rowData["CNT_WEIGHT"] = 0;
		}
		const saveData = await updateController(rowData);
		table.row(row).data(saveData).draw();
	} catch (error) {
		console.log(error);
		await showErrorMessage(`Something went wrong.`, "2036");
	} finally {
		await showLoader({ show: false });
	}
});

$(document).on("click", "#export-btn", async function (e) {
	e.preventDefault();
	try {
		const data = table.data().toArray();
		const quotype = await getQuotationType();
		const shipments = await getShipments();
		const terms = await getDeliveryTerm();

		// Merge quotation type, shipments, and delivery terms descriptions into data
		const mergedData = data.map((item) => {
			const quotation = quotype.find(
				(q) => q.QUOTYPE_ID == item.CNT_QUOTATION,
			);
			const shipment = shipments.find(
				(s) => s.SHIPMENT_ID == item.CNT_METHOD,
			);
			const term = terms.find((t) => t.TERM_ID == item.CNT_TERM);
			return {
				...item,
				QUOTATION_DESC: quotation?.QUOTYPE_DESC || "",
				SHIPMENT_DESC: shipment?.SHIPMENT_DESC || "",
				TERM_DESC: term?.TERM_DESC || "",
				CNT_WEIGHT: item.CNT_WEIGHT == 1 ? "Yes" : "No",
			};
		});

		const template = await getTemplate("export_inquiry_controller.xlsx");
		await exportExcel(mergedData, template, {
			filename: "Inquiry_Controller.xlsx",
		});
	} catch (error) {
		console.log(error);
		await showErrorMessage(`Something went wrong.`, "2036");
	} finally {
		await showLoader({ show: false });
	}
});
