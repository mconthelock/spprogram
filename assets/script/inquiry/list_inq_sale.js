import dayjs from "dayjs";

import { displayname } from "@amec/webasset/api/amec";
import { createBtn } from "@amec/webasset/components/buttons";
import { statusColors } from "../inquiry/index.js";
import { tableOpt } from "../utils.js";

export async function tableInquirySaleOption(data, extopt = {}) {
	const colors = await statusColors();
	const opt = { ...tableOpt };
	opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-auto"t><"flex mt-5 mb-3"<"table-info flex flex-col flex-1 gap-5"i><"table-page flex-none"p>>`;
	opt.data = data;
	// opt.orderFixed = [0, "desc"];
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
				const view = createBtn({
					id: `view-${data}`,
					title: "Process",
					icon: "fi fi-rs-user-add text-lg",
					className: `btn-xs btn-accent text-white hover:shadow-lg hover:text-white process-btn`,
					href: `${process.env.APP_ENV}/mar/inquiry/show/${data}/`,
				});
				return `<div class="flex gap-1 justify-center items-center w-fit">${view}</div>`;
			},
		},
	];

	opt.createdRow = function (row, data) {
		if ([4, 27].includes(data.INQ_STATUS)) {
			$(row).addClass("bg-sky-200!");
			$(row).find(".spark").append(`<span class="relative flex size-3">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex size-3 rounded-full bg-red-400"></span>
                </span>`);
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
