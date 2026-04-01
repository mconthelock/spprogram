import dayjs from "dayjs";
import { displayname } from "@amec/webasset/api/amec";
import { createBtn } from "@amec/webasset/components/buttons";
import { displayEmpInfo } from "@amec/webasset/indexDB";
import { statusColors } from "./index.js";
import { tableOpt } from "../utils.js";

export async function tableInquiryDEOption(data, extopt = {}) {
	const colors = await statusColors();
	const opt = { ...tableOpt };
	opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-auto"t><"flex mt-5 mb-3"<"table-info flex flex-col flex-1 gap-5"i><"table-page flex-none"p>>`;
	opt.data = data;
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
			render: function (data, type, row, meta) {
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
				const dsp = displayname(data.SNAME).sname;
				return `${dsp} (${data.SEMPNO})`;
			},
		},
		{
			data: "timeline.SE_USER",
			title: "Sale In-Charge",
			render: (data) => {
				if (data == null) return "";
				return `<span class="sale-information" id="sale-information-${data}" data-id="${data}"></span>`;
			},
		},
		{
			data: "inqgroup",
			title: "EME",
			className: "text-center px-[5px] w-[45px] max-w-[45px]",
			sortable: false,
			render: (data) => {
				const des = data.filter(
					(item) => item.INQG_GROUP === 1 && item.INQG_LATEST === 1,
				);
				if (des.length == 0) return "";

				const color =
					des[0].INQG_STATUS == null
						? "text-gray-500"
						: des[0].INQG_STATUS >= 9
							? "text-primary"
							: "text-secondary";
				return `<i class="fi fi-rr-check-circle text-xl justify-center ${color}"></i>`;
			},
		},
		{
			data: "inqgroup",
			title: "EEL",
			className: "text-center px-[5px] w-[45px] max-w-[45px]",
			sortable: false,
			render: (data) => {
				const des = data.filter(
					(item) => item.INQG_GROUP === 2 && item.INQG_LATEST === 1,
				);
				if (des.length == 0) return "";

				const color =
					des[0].INQG_STATUS == null
						? "text-gray-500"
						: des[0].INQG_STATUS >= 9
							? "text-primary"
							: "text-secondary";
				return `<i class="fi fi-rr-check-circle text-xl justify-center ${color}"></i>`;
			},
		},
		{
			data: "inqgroup",
			title: "EAP",
			className: "text-center px-[5px] w-[45px] max-w-[45px]",
			sortable: false,
			render: (data) => {
				const des = data.filter(
					(item) => item.INQG_GROUP === 3 && item.INQG_LATEST === 1,
				);
				if (des.length == 0) return "";

				const color =
					des[0].INQG_STATUS == null
						? "text-gray-500"
						: des[0].INQG_STATUS >= 9
							? "text-primary"
							: "text-secondary";
				return `<i class="fi fi-rr-check-circle text-xl justify-center ${color}"></i>`;
			},
		},
		{
			data: "inqgroup",
			title: "ESO",
			className: "text-center px-[5px] w-[45px] max-w-[45px]",
			sortable: false,
			render: (data) => {
				const des = data.filter(
					(item) => item.INQG_GROUP === 6 && item.INQG_LATEST === 1,
				);
				if (des.length == 0) return "";

				const color =
					des[0].INQG_STATUS == null
						? "text-gray-500"
						: des[0].INQG_STATUS >= 9
							? "text-primary"
							: "text-secondary";
				return `<i class="fi fi-rr-check-circle text-xl justify-center ${color}"></i>`;
			},
		},
		{
			data: "INQ_ID",
			className: "text-center w-[120px]",
			sortable: false,
			title: `<div class="flex justify-center"><i class="fi fi-rr-settings-sliders text-lg"></i></div>`,
			render: (data, type, row) => {
				const process = createBtn({
					id: `edit-${data}`,
					title: "Process",
					icon: "fi fi fi-ss-arrow-circle-right text-lg",
					className: `btn-xs btn-accent w-[80px] text-white hover:shadow-lg`,
				});

				return `<div class="flex gap-1 justify-center items-center w-fit">${process}</div>`;
			},
		},
	];

	opt.createdRow = async function (row, data) {
		if ($(row).find(".sale-information").length > 0) {
			$(row).find(".sale-information").text("Loading...");
			const user = await displayEmpInfo(data.timeline.SE_USER);
			const dsp = displayname(user.SNAME).sname;
			$(row).find(".sale-information").text(`${dsp} (${user.SEMPNO})`);
		}
	};

	opt.initComplete = async function () {
		const export1 = await createBtn({
			id: "export1",
			title: "Export Inquiry",
			icon: "fi fi-tr-file-excel text-xl",
			className: `btn-accent text-white hover:shadow-lg`,
		});

		$(".table-info").append(
			`<div class="btn-container flex gap-2">${export1}</div>`,
		);
		$("#datatable_loading").addClass("hidden");
		await this.api().columns.adjust();
	};
	return opt;
}
