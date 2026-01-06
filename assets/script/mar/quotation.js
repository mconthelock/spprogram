import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";

import dayjs from "dayjs";
import { createTable } from "@amec/webasset/dataTable";
import { statusColors } from "../inquiry/ui.js";
import { getInquiry } from "../service/inquiry.js";
import * as utils from "../utils.js";

// import { tableQuotation } from "../quotation/table.js";
// import * as service from "../service/inquiry.js";
var table;
$(document).ready(async () => {
	try {
		await utils.initApp({ submenu: ".navmenu-quotation" });
		let data;
		if ($("#pageid").val() == "3") {
			const validate = dayjs().format("YYYY-MM-DD");
			data = await getInquiry({
				INQ_STATUS: "> 50",
				quotation: { QUO_VALIDITY: `>= ${validate}` },
			});
		} else {
			data = await getInquiry({ INQ_STATUS: ">= 46 && < 80" });
		}
		const opt = await tableInquiryOption(data);
		table = await createTable(opt);
	} catch (error) {
		utils.errorMessage(error);
		return;
	} finally {
		await utils.showLoader({ show: false });
	}
});

async function tableInquiryOption(data) {
	const pageid = $("#pageid").val();
	const colors = await statusColors();
	const opt = { ...utils.tableOpt };
	opt.data = data;
	opt.columns = [
		{ data: "UPDATE_AT", className: "hidden" },
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
			data: "INQ_TRADER",
			className: "text-nowrap",
			title: "Trader",
		},
		{ data: "INQ_AGENT", title: "Agent" },
		{ data: "INQ_COUNTRY", title: "Country" },
		{
			data: "status",
			title: "Status",
			render: (data) => {
				if (data == null) return "";
				const statusColor = colors.find(
					(item) => item.id >= data.STATUS_ID
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
			data: "quotation",
			title: "Quo. Date",
			className: `text-center ${pageid == "3" ? "" : "hidden"}`,
			render: (data) => {
				if (data == null) return "";
				return dayjs(data.QUO_DATE).format("YYYY-MM-DD");
			},
		},
		{
			data: "quotation",
			title: "Expired Date",
			className: `text-center ${pageid == "3" ? "" : "hidden"}`,
			render: (data) => {
				if (data == null) return "";
				return dayjs(data.QUO_VALIDITY).format("YYYY-MM-DD");
			},
		},
		{
			data: "INQ_PKC_REQ",
			title: "Weight Req.",
			className: `${pageid == "3" ? "hidden" : ""}`,
			render: (data, type, row) => {
				if (data == "0") return "";
				return `<i class="fi fi-ss-check-circle text-xl justify-center ${
					row.timeline.PKC_CONFIRM != null ? "text-primary" : ""
				}"></i>`;
			},
		},
		{
			data: "INQ_ID",
			className: `w-fit !max-w-[110px] !text-center ${
				pageid == "3" ? "hidden" : ""
			}`,
			sortable: false,
			title: `<div class="flex justify-center"><i class="fi fi-rr-settings-sliders text-lg"></i></div>`,
			render: (data, type, row) => {
				if (row.INQ_PKC_REQ == "1" && row.timeline.PKC_CONFIRM == null)
					return `<a class="btn btn-sm btn-neutral/50 text-white min-w-[100px]" href="${process.env.APP_ENV}/mar/quotation/detail/${data}"><i class="fi fi-rr-arrow-up-right-from-square text-lg"></i>View</a>`;
				return `<a class="btn btn-sm btn-accent text-white min-w-[100px]" href="${process.env.APP_ENV}/mar/quotation/detail/${data}"><i class="fi fi-sr-arrow-circle-right text-xl"></i>Process</a>`;
			},
		},
		{
			data: "INQ_ID",
			className: `w-fit !justify-end ${pageid == "3" ? "" : "hidden"}`,
			sortable: false,
			title: `<div class="flex justify-center"><i class="fi fi-rr-settings-sliders text-lg"></i></div>`,
			render: (data, type, row) => {
				const edit = `<a class="btn btn-sm btn-accent text-white" href="${process.env.APP_ENV}/mar/quotation/detail/${data}"><i class="fi fi-tr-file-edit text-lg"></i>Edit</a>`;
				const excel = `<a class="btn btn-sm btn-neutral text-white"><i class="fi fi-tr-file-excel text-lg"></i>Export</a>`;
				const order = `<a class=""><i class="fi fi-tr-rectangle-list text-lg"></i>File import new order</a>`;
				const sparq = `<a class=""><i class="fi fi-tr-file-excel text-lg"></i>File import to Sparq</a>`;
				const revise = `<a class=""><i class="fi fi-tr-file-excel text-lg"></i>Revise Inquiry</a>`;
				const dropdown = `<div class="dropdown  dropdown-end">
            <div tabindex="0" role="button" class="btn btn-sm btn-circle btn-ghost"><i class="fi fi-bs-menu-dots-vertical text-lg"></i></div>
            <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm border border-base-300">
                <li>${sparq}</li>
                <li>${order}</li>
                <li>${revise}</li>
            </ul>
        </div>`;

				return `<div class="flex justify-end gap-2">${edit}${excel}${dropdown}</div>`;
			},
		},
	];
	return opt;
}
