import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/dataTable.min.css";
import "select2";
import dayjs from "dayjs";
import * as utils from "../utils.js";
import { createTable } from "@public/dataTable";
import { getCurrency, updateCurrency } from "../service/master.js";

var table;
const curricon = [
	{ code: "GBP", icon: `<i class="text-xl fi fi-bs-sterling-sign"></i>` },
	{ code: "JPY", icon: `<i class="text-xl fi fi-br-yen"></i>` },
	{ code: "THB", icon: `<i class="text-xl fi fi-br-baht-sign"></i>` },
	{ code: "EUR", icon: `<i class="text-xl fi fi-br-euro"></i>` },
	{ code: "USD", icon: `<i class="text-xl fi fi-ss-dollar"></i>` },
	{ code: "OTH", icon: `<i class="text-xl fi fi-ss-dollar"></i>` },
];
$(document).ready(async () => {
	try {
		await utils.initApp({ submenu: ".navmenu-admin" });
		const data = await getCurrency();
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
	opt.order = [
		[0, "desc"],
		[1, "desc"],
	];
	opt.data = data;
	opt.columns = [
		{
			data: "CURR_YEAR",
			title: "FYEAR",
		},
		{
			data: "CURR_PERIOD",
			className: "text-nowrap",
			title: "Period",
			render: function (data, type, row) {
				if (type === "display") {
					return `0${data}-H`;
				}
				return data;
			},
		},
		{
			data: "CURR_CODE",
			className: "text-center",
			title: "Code",
			render: function (data, type, row) {
				const curr = curricon.find((item) => item.code == data);
				if (type === "display") {
					return `<div class="flex items-center justify-center gap-2">${
						curr ? curr.icon : ""
					}${data}</div>`;
				}
				return data;
			},
		},
		{
			data: "CURR_RATE",
			className: "!text-end",
			title: "Rate",
			render: function (data, type, row) {
				if (type === "display" && row.isNew !== undefined) {
					return `<input type="number" class="input cell-input w-full input-dt" value="${utils.digits(
						data,
						2
					)}" min="0.01" step="0.01">`;
				}
				return utils.digits(data, 2);
			},
		},
		{
			data: "CURR_UPDATE_DATE",
			className: "text-center",
			title: "Last Update",
			render: function (data, type, row) {
				return data == null
					? ""
					: dayjs(data).format("YYYY-MM-DD HH:mm");
			},
		},
		{
			data: "CURR_UPDATE_BY",
			className: "text-start",
			title: "Update By",
			render: (data) =>
				data == null ? "" : utils.displayname(data).sname,
		},
		{
			data: "CURR_CODE",
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

	opt.initComplete = function (settings, json) {
		// $(".table-option").append(`<div class="flex gap-2">
		//     <button class="btn btn-primary rounded-3xl text-white transition delay-100 duration-100 ease-in-out hover:scale-105 items-center"
		//         type="button" id="add-new-rate">
		//         <span class="loading loading-spinner hidden"></span>
		//         <span class=""><i class="icofont-plus text-lg me-2"></i>New Item</span>
		//     </button>
		//      <button class="btn btn-neutral rounded-3xl text-white transition delay-100 duration-100 ease-in-out hover:scale-105 items-center"
		//         type="button">
		//         <span class="loading loading-spinner hidden"></span>
		//         <span class=""><i class="icofont-spreadsheet text-lg me-2"></i>Export</span>
		//     </button>
		// </div>`);
	};
	return opt;
}

$(document).on("click", ".edit-row", async function (e) {
	e.preventDefault();
	const data = table.row($(this).parents("tr")).data();
	const row = table.row($(this).parents("tr"));
	const newData = { ...data, isNew: true };
	row.data(newData);
	row.draw(false);
	$(row.node()).find("td:eq(3) input").focus().select();
});

$(document).on("click", ".save-row", async function (e) {
	e.preventDefault();
	const row = table.row($(this).parents("tr"));
	const data = row.data();
	const rate = row.node().querySelector(".input-dt").value;
	const res = await updateCurrency({
		CURR_YEAR: data.CURR_YEAR,
		CURR_PERIOD: data.CURR_PERIOD,
		CURR_CODE: data.CURR_CODE,
		CURR_RATE: rate,
		CURR_UPDATE_DATE: new Date(),
		CURR_UPDATE_BY: "Chalormsak Sewanam",
	});
	row.data(res[0]);
	row.draw(false);
});
