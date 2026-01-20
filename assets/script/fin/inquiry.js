import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";
import { createTable } from "@amec/webasset/dataTable";
import { statusColors } from "../inquiry/detail.js";
import { tableInquiry, confirmDeleteInquiry } from "../inquiry/table.js";
import * as utils from "../utils.js";
import { getInquiry } from "../service/inquiry.js";
import dayjs from "dayjs";
var table;
$(async function () {
	try {
		await utils.initApp();
		const pageId = $("#pageid").val() || 1;
		let data;
		if (pageId == 1) {
			data = await getInquiry({ INQ_STATUS: ">= 30 && < 43" });
		} else {
			data = await getInquiry({ INQ_STATUS: ">= 43 && < 50" });
		}

		const opt = await tableOptions(data);
		table = await createTable(opt);
	} catch (error) {
		console.log(error);
		await showErrorMessage(`Something went wrong.`, "2036");
	} finally {
		await showLoader({ show: false });
	}
});

async function tableOptions(data) {
	const pageId = $("#pageid").val() || 1;
	const colors = await statusColors();
	const opt = await tableInquiry(data);
	opt.pageLength = 15;
	opt.order = [[0, "desc"]];
	opt.columns = [
		{ data: "timeline.MAR_SEND", className: "hidden" },
		{
			data: "INQ_DATE",
			className: "text-center text-nowrap sticky-column",
			title: "Inq. Date",
			render: function (data, type, row, meta) {
				return dayjs(data).format("YYYY-MM-DD");
			},
		},
		{
			data: "INQ_NO",
			className: "text-nowrap sticky-column",
			title: "No.",
		},
		{
			data: "INQ_REV",
			className: "text-nowrap text-center sticky-column",
			title: "Rev.",
		},
		{
			data: "status",
			title: "Status",
			render: (data) => {
				if (data == null) return "";
				const statusColor = colors.find(
					(item) => item.id >= data.STATUS_ID,
				);
				return `<span class="badge text-xs ${statusColor.color}">${data.STATUS_DESC}</span>`;
			},
		},
		{
			data: "maruser",
			title: "MAR. In-Charge",
			render: (data) => {
				if (data == null) return "";
				const dsp = utils.displayname(data.SNAME);
				return `${dsp.fname} ${dsp.lname.substring(0, 1)}. (${
					data.SEMPNO
				})`;
			},
		},
		{
			data: "timeline.MAR_SEND",
			className: "text-center text-nowrap",
			title: "MAR. Sent Date",
			render: (data) => {
				return dayjs(data).format("YYYY-MM-DD HH:mm");
			},
		},
		{
			data: "timeline.DE_CONFIRM",
			className: "text-center text-nowrap",
			title: "Design Finish",
			render: (data) => {
				if (data == null) return "";
				return dayjs(data).format("YYYY-MM-DD HH:mm");
			},
		},
		{
			data: "timeline.BM_CONFIRM",
			className: "text-center text-nowrap",
			title: "B/M Date",
			render: (data) => {
				if (data == null) return "";
				return dayjs(data).format("YYYY-MM-DD HH:mm");
			},
		},
		{
			data: "timeline.FIN_CONFIRM",
			className: `text-center text-nowrap ${pageId == 1 ? "hidden" : ""}`,
			title: "Fin Confirmed",
			render: (data) => {
				if (data == null) return "";
				return dayjs(data).format("YYYY-MM-DD HH:mm");
			},
		},
		{
			data: "timeline.FMN_CONFIRM",
			className: `text-center text-nowrap ${pageId == 1 ? "hidden" : ""}`,
			title: "Fin Finish",
			render: (data) => {
				if (data == null) return "";
				return dayjs(data).format("YYYY-MM-DD HH:mm");
			},
		},
		{
			data: "INQ_FIN_REMARK",
			sortable: false,
			className: `${pageId == 2 ? "hidden" : ""}`,
			title: "Note",
			render: (data) => {
				return `<textarea class="w-full min-w-[200px] !h-[52px] border border-slate-300 rounded-sm p-2" rows="1">${
					data == null ? "" : data
				}</textarea>`;
			},
		},
		{
			data: "INQ_ID",
			sortable: false,
			className: "text-center",
			title: `<div class="text-xl flex justify-center"><i class="fi fi-rr-settings-sliders"></i></div>`,
			render: (data) => {
				if (pageId == 2)
					return `<a class="btn btn-sm btn-neutral text-white" href="${process.env.APP_ENV}/fin/inquiry/view/${data}"><i class="fi fi-ts-assessment text-xl"></i>View</a>`;
				return `<a class="btn btn-sm btn-accent text-white" href="${process.env.APP_ENV}/fin/inquiry/detail/${data}"><i class="fi fi-sr-arrow-small-right text-xl"></i>Process</a>`;
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
		$(".table-info").append(`<div class="flex gap-2">
          ${export1}
       </div>`);
	};
	return opt;
}
