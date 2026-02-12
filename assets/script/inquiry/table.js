import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { displayEmpInfo, fillImages } from "@amec/webasset/indexDB";
import { intVal, showConfirm, showMessage } from "@amec/webasset/utils";
import { statusColors } from "../inquiry/detail.js";
import * as service from "../service/inquiry.js";
import * as source from "./source.js";
import * as utils from "../utils.js";

//Start Table detail
export async function tableInquiry(data, options = {}) {
	const colors = await statusColors();
	const opt = utils.tableOpt;
	opt.data = data;
	opt.pageLength = 25;
	opt.order = [
		[0, "desc"],
		[1, "desc"],
	];
	opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden"t><"flex mt-5 mb-3"<"table-info flex flex-col flex-1 gap-5"i><"table-page flex-none"p>>`;
	//   opt.columns = [

	//];

	//   opt.initComplete = function () {
	//     $(".table-option")
	//       .append(`<div class="dropdown dropdown-end dropdown-hover">
	//         <div tabindex="0" role="button" class="btn btn-outline btn-neutral m-1">New Inquiry</div>
	//         <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
	//             <li><a href="${process.env.APP_ENV}/mar/inquiry/create/">SP Inquiry</a></li>
	//             <li><a href="${process.env.APP_ENV}/mar/stockpart/create">Stock Part</a></li>
	//         </ul>
	//         </div>`);

	//     const export1 = `<button class="btn btn-accent rounded-none text-white items-center hover:bg-accent/70" id="export-detail" type="button">
	//             <span class="loading loading-spinner hidden"></span>
	//             <span class="flex items-center"><i class="fi fi-tr-file-excel text-lg me-2"></i>Export Detail</span>
	//         </button>`;
	//     const export2 = `<button class="btn btn-neutral rounded-none text-white items-center hover:bg-neutral/70" id="export-list" type="button">
	//             <span class="loading loading-spinner hidden"></span>
	//             <span class="flex items-center"><i class="fi fi-tr-floor-layer text-lg me-2"></i>Export list</span>
	//         </button>`;
	//     const back = `<a href="#" class="btn btn-outline btn-neutral rounded-none text-neutral hover:text-white hover:bg-neutral/70 flex gap-3" id="back-report"><i class="fi fi-rr-arrow-circle-left text-xl"></i>Back</a>`;

	//     $(".table-info").append(`<div class="flex gap-2">
	//         ${export1}
	//         ${export2}
	//         ${options.backReportBtn !== undefined ? back : ""}
	//      </div>`);
	//   };
	return opt;
}

//End Table detail

export async function setupTableDetailView(data = []) {
	const opt = { ...utils.tableOpt };
	opt.data = data;
	opt.searching = false;
	opt.responsive = false;
	opt.pageLength = 20;
	opt.dom = `<"flex"<"table-search flex flex-1 gap-5"f><"flex items-center table-option">><"bg-white border border-slate-300 rounded-2xl overflow-hidden overflow-x-scroll"t><"flex mt-3"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
	opt.columns = [
		{
			data: "INQD_SEQ",
			title: "No",
			className: "sticky-column",
			render: (data) => {
				if (data % 1 !== 0) return digits(data, 2);
				return data;
			},
		},
		{
			data: "INQD_CAR",
			title: "CAR",
			className: "sticky-column text-center",
		},
		{
			data: "INQD_MFGORDER",
			title: "MFG No.",
			className: "sticky-column",
		},
		{
			data: "INQD_ITEM",
			title: "Item",
			className: "sticky-column",
		},
		{
			data: "INQD_PARTNAME",
			title: "Part Name",
			className: "sticky-column text-nowrap min-w-[200px] !text-left",
		},
		{
			data: "INQD_DRAWING",
			title: "Drawing No.",
			className: "text-nowrap min-w-[200px] !text-left",
		},
		{
			data: "INQD_VARIABLE",
			title: "Variable",
			className: "min-w-[250px] !text-left",
		},
		{
			data: "INQD_QTY",
			title: "Qty.",
			//   className: "!px-[3px]",
		},
		{
			data: "INQD_UM",
			title: "U/M",
			//   className: "!px-[3px]",
		},
		{
			data: "INQD_SUPPLIER",
			title: "Supplier",
			//   className: "!px-[3px]",
		},
		{
			data: "INQD_SENDPART",
			title: `2<sup>nd</sup>`,
			className: "text-center",
			sortable: false,
			render: function (data, type, row, meta) {
				return data == null
					? ""
					: `<i class="icofont-check-circled text-2xl"></i>`;
			},
		},
		{
			data: "INQD_UNREPLY",
			title: "U/N",
			className: "text-center",
			sortable: false,
			render: function (data, type, row, meta) {
				return data == null
					? ""
					: `<i class="icofont-check-circled text-2xl"></i>`;
			},
		},
		{
			data: "INQD_MAR_REMARK",
			title: "MAR Remark",
			className: "min-w-[250px] !text-left",
		},
		{
			data: "INQD_DES_REMARK",
			title: "DE Remark",
			className: "min-w-[250px] !text-left",
		},
	];
	return opt;
}

export async function confirmDeleteInquiry(table) {
	const modal = $("#confirm_box");
	modal.find("button").prop("disabled", true);
	$(this).find(".loading").removeClass("hidden");

	if ($("#confirm_reason").val() == "") {
		$("#confirm_error").text(`Please enter reason.`);
		setTimeout(() => {
			$("#confirm_error").text(``);
		}, 3000);
		modal.find("button").prop("disabled", false);
		$(this).find(".loading").addClass("hidden");
		return;
	}

	// confirm_key;
	const res = await service.deleteInquiry({
		INQ_ID: $("#confirm_key").val(),
		INQ_MAR_PIC: $("#user-login").attr("empno"),
		INQ_MAR_REMARK: $("#confirm_reason").val(),
	});

	if (!res.status) {
		await showMessage(res);
	} else {
		// remove row from table
		table
			.row(
				$(`button[data-id='${$("#confirm_key").val()}']`).parents("tr"),
			)
			.remove()
			.draw();
	}

	$(this).find(".loading").addClass("hidden");
	$("#confirm_accept").removeClass("deleteinqs");
	$("#confirm_reason").val("");
	modal.find("button").prop("disabled", false);
	modal.find("#confirm_close").click();
}
