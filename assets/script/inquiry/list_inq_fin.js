import dayjs from "dayjs";

import { intVal } from "@amec/webasset/utils";
import { displayname } from "@amec/webasset/api/amec";
import { displayEmpInfo } from "@amec/webasset/indexDB";
import { createBtn } from "@amec/webasset/components/buttons";
import { statusColors } from "./index.js";
import { tableOpt } from "../utils.js";

export async function tableInquiryFinOption(data, extopt = {}) {
	const pageid = intVal($("#pageid").val()) || "1";
	const colors = await statusColors();
	const opt = { ...tableOpt };
	opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-auto"t><"flex mt-5 mb-3"<"table-info flex flex-col flex-1 gap-5"i><"table-page flex-none"p>>`;
	opt.data = data;
	opt.pageLength = pageid == 1 ? 15 : 25;
	opt.order = [
		[0, "desc"],
		[1, "desc"],
	];
	opt.columns = [
		{ data: "UPDATE_AT", className: "hidden" },
		{
			data: "INQ_DATE",
			className: "text-center! text-nowrap sticky-column",
			title: "Inq. Date",
			render: function (data) {
				return dayjs(data).format("YYYY-MM-DD");
			},
		},
		{
			data: "INQ_NO",
			className: "text-nowrap sticky-column INQ_NO",
			title: "No.",
			render: (data) => {
				return `<span>${data}</span><span class="spark absolute ms-1"></span>`;
			},
		},
		{
			data: "INQ_REV",
			className: "text-nowrap text-center sticky-column",
			title: "Rev.",
		},
		{
			data: "INQ_TRADER",
			className: `text-nowrap ${pageid > 1 ? "hidden" : ""}`,
			title: "Trader",
		},
		{
			data: "INQ_AGENT",
			title: "Agent",
			className: `text-nowrap ${pageid > 1 ? "hidden" : ""}`,
		},
		{
			data: "INQ_COUNTRY",
			title: "Country",
			className: `text-nowrap ${pageid > 1 ? "hidden" : ""}`,
		},
		{
			data: "status",
			title: "Status",
			render: (data) => {
				if (data == null) return "";
				const statusColor = colors.find(
					(item) => item.id >= data.STATUS_ID,
				);
				return `<span class="badge text-xs text-nowrap ${statusColor.color}">${data.STATUS_DESC}</span>`;
			},
		},
		{
			data: "maruser",
			title: "MAR. In-Charge",
			className: "text-nowrap",
			render: (data) => {
				if (data == null) return "";
				const dsp = displayname(data.SNAME).fname;
				return `${dsp} (${data.SEMPNO})`;
			},
		},
		{
			data: "timeline",
			title: "B/M Date",
			className: "text-nowrap text-left!",
			render: (data) => {
				if (data.BM_CONFIRM == null) return "";
				return dayjs(data.BM_CONFIRM).format("YYYY-MM-DD HH:mm");
			},
		},
		{
			data: "timeline",
			title: "FIN In-Charge",
			className: `text-nowrap ${pageid == 1 ? "hidden" : ""}`,
			render: (data, type, row) => {
				return `<div id="fin-${row.INQ_ID}"></div>`;
			},
		},
		{
			data: "timeline",
			title: "FIN Confirm",
			className: `text-nowrap text-left! ${pageid == 1 ? "hidden" : ""}`,
			render: (data) => {
				if (data.FIN_CONFIRM == null) return "";
				return dayjs(data.FIN_CONFIRM).format("YYYY-MM-DD HH:mm");
			},
		},
		{
			data: "timeline",
			title: "Checker",
			className: `text-nowrap text-left! ${pageid < 3 ? "hidden" : ""}`,
			render: (data, type, row) => {
				return `<div id="checker-${row.INQ_ID}"></div>`;
			},
		},
		{
			data: "timeline",
			title: "Check Date",
			className: `text-nowrap text-left! ${pageid < 3 ? "hidden" : ""}`,
			render: (data) => {
				if (data.FCK_CONFIRM == null) return "";
				return dayjs(data.FCK_CONFIRM).format("YYYY-MM-DD HH:mm");
			},
		},
		{
			data: "INQ_FIN_REMARK",
			title: "Remark",
			className: `w-50 min-w-50 bg-primary/10 ${pageid != 1 ? "hidden" : ""}`,
			render: (data, type) => {
				if (type === "display") {
					return `<div class="relative">
                        <textarea class="form-textarea h-12 w-full p-2 resize-none outline-0 hover:bg-primary/25 quick-remark">${data || ""}</textarea>
                        <span class="loading loading-spinner text-primary absolute bottom-2 right-0 hidden quick-remark-load"></span>
                    </div>`;
				}
				return data;
			},
		},
		{
			data: "INQ_ID",
			className: "sticky-column text-center w-[120px]",
			sortable: false,
			title: `<div class="flex justify-center"><i class="fi fi-rr-settings-sliders text-lg"></i></div>`,
			render: (data) => {
				const edit = createBtn({
					id: `edit-${data}`,
					title: "Process",
					icon: "fi fi-tr-arrow-circle-right text-lg",
					className: `btn-xs btn-accent text-white hover:shadow-lg process-btn`,
					//href: `${process.env.APP_ENV}/pkc/inquiry/detail/${data}/`,
				});

				const view = createBtn({
					id: `view-${data}`,
					title: "View",
					icon: "fi fi-tr-audit text-lg",
					className: `btn-xs btn-outline btn-accent text-accent hover:shadow-lg hover:text-white`,
					type: "link",
					href: `${process.env.APP_ENV}/fin/inquiry/show/${data}/${pageid}/`,
				});
				return `<div class="flex gap-1 justify-center items-center w-fit">${pageid > 3 ? view : edit}</div>`;
			},
		},
	];

	opt.createdRow = async function (row, data) {
		if (data.timeline && data.timeline.FIN_USER != null) {
			const user = await displayEmpInfo(data.timeline.FIN_USER);
			$(row)
				.find(`#fin-${data.INQ_ID}`)
				.text(user ? displayname(user.SNAME).fname : "");
		}

		if (data.timeline && data.timeline.FCK_USER != null) {
			const checker = await displayEmpInfo(data.timeline.FCK_USER);
			$(row)
				.find(`#checker-${data.INQ_ID}`)
				.text(checker ? displayname(checker.SNAME).fname : "");
		}
	};

	opt.initComplete = async function () {
		const export1 = await createBtn({
			id: "export1",
			title: "Export Inquiry",
			icon: "fi fi-tr-file-excel text-xl",
			className: `btn-accent text-white hover:shadow-lg`,
		});

		const back = await createBtn({
			id: "goback",
			title: "Back",
			icon: "fi fi fi-rr-undo text-xl",
			className: `btn-accent btn-outline text-accent hover:shadow-lg hover:text-white`,
		});
		$(".table-info").append(
			`<div class="flex gap-2" id="btn-container">${export1}${extopt.back === true ? back : ""}</div>`,
		);
		$("#datatable_loading").addClass("hidden");
		await this.api().columns.adjust();
	};
	return opt;
}
