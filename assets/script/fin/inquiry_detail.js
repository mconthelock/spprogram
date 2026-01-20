import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";
import { showLoader } from "@amec/webasset/preloader";
import { createTable } from "@amec/webasset/dataTable";
import * as utils from "../utils.js";
import * as service from "../service/inquiry.js";
import * as inqs from "../inquiry/detail.js";
import * as tb from "../inquiry/table.js";

var table;
var tableAttach;
$(async function () {
	try {
		await utils.initApp();
		const inquiry = await service.getInquiryID($("#inquiry-id").val());
		if (inquiry.length == 0) throw new Error("Inquiry do not found");

		$("#inquiry-title").html(inquiry.INQ_NO);
		const cards = await inqs.setupCard(inquiry);

		const details = inquiry.details.filter((dt) => dt.INQD_LATEST == 1);
		const detail = await tableDetailOptions(details);
		table = await createTable(detail);

		const logs = await service.getInquiryHistory(inquiry.INQ_NO);
		const history = await tb.setupTableHistory(logs);
		await createTable(history, { id: "#history" });

		const file = await service.getInquiryFile({ INQ_NO: inquiry.INQ_NO });
		const attachment = await tb.setupTableAttachment(file, true);
		tableAttach = await createTable(attachment, { id: "#attachment" });
	} catch (error) {
		console.log(error);
		await showErrorMessage(`Something went wrong.`, "2036");
	} finally {
		await showLoader({ show: false });
	}
});

async function tableDetailOptions(data) {
	const opt = { ...utils.tableOpt };
	opt.data = data;
	opt.searching = false;
	opt.paging = false;
	opt.dom = `<"flex "<"table-search flex flex-1 gap-5 "f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-auto max-h-[92vh]"t><"flex mt-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5">>`;
	opt.columns = [
		{
			data: "INQD_SEQ",
			title: "No",
			className: "sticky-column",
			render: (data) => {
				if (data % 1 !== 0) return utils.digits(data, 2);
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
			className: "sticky-column text-center",
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
			className: "min-w-[200px] !text-left",
		},
		{
			data: "INQD_QTY",
			title: "Qty.",
		},
		{
			data: "INQD_UM",
			title: "U/M",
		},
		{
			data: "INQD_SUPPLIER",
			title: "Supplier",
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
			data: "INQD_QTY",
			title: "FC Cost",
			className: "!px-[3px]",
			sortable: false,
			render: function (data, type, row) {
				if (type === "display") {
					return `<input type="text" class="flex !w-full !min-w-[100px] !h-[2.5rem] cell-input edit-input bg-primary/30 text-end" value="${data}">`;
				}
				return data;
			},
		},
		{
			data: "INQD_QTY",
			title: "%",
			className: "!px-[3px]",
			sortable: false,
			render: function (data, type, row) {
				if (type === "display") {
					return `<input type="text" class="flex !w-full !min-w-[55px] !h-[2.5rem] cell-input edit-input bg-primary/30 text-end" value="${data}">`;
				}
				return data;
			},
		},
		{
			data: "INQD_QTY",
			title: "TC Cost",
			className: "!px-[3px]",
			sortable: false,
			render: function (data, type, row) {
				if (type === "display") {
					return `<input type="text" class="flex !w-full !min-w-[100px] !h-[2.5rem] cell-input edit-input text-end" value="${data}" readonly>`;
				}
				return data;
			},
		},
		{
			data: "INQD_MAR_REMARK",
			className: "remark-line",
			title: "Remark",
			sortable: false,
			render: function (data, type) {
				if (type === "display") {
					return `<textarea class="bg-primary/30 !w-[250px] cell-input edit-input remark" maxlength="250" >${
						data == null ? "" : data
					}</textarea>`;
				}
				return data;
			},
		},
	];
	opt.initComplete = function () {};
	return opt;
}

async function setupButton() {}
