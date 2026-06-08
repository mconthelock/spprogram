import dayjs from "dayjs";
import { displayname } from "@amec/webasset/api/amec";
import { createBtn } from "@amec/webasset/components/buttons";
import { statusColors } from "./index.js";
import { tableOpt } from "../utils.js";

export async function tableInquiryAdminOption(data, extopt = {}) {
	// const renderMark = (data) => {
	// 	const color =
	// 		data == 29
	// 			? "text-gray-400"
	// 			: data >= 26
	// 				? "text-primary"
	// 				: "text-secondary";
	// 	return `<i class="fi fi-rr-check-circle text-xl justify-center ${color}"></i>`;
	// };
	const renderMark = (data) => {
		if (status >= 30)
			return `<i class="fi fi-rr-check-circle text-xl justify-center text-green-400"></i>`;
		let color = data >= 26 ? "text-green-400" : "text-secondary";
		return `<i class="fi fi-rr-check-circle text-xl justify-center ${color}"></i>`;
	};

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
		{ data: "priority", className: "hidden" },
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
				return `<span class="badge text-xs text-nowrap ${statusColor.color}">${data.STATUS_DESC}</span>`;
			},
		},
		{
			data: "maruser",
			title: "MAR. In-Charge",
			render: (data) => {
				if (data == null) return "";
				const dsp = displayname(data.SNAME).fname;
				return `<div class="text-nowrap">${dsp} (${data.SEMPNO})</div>`;
			},
		},
		{
			data: "inqgroup",
			title: "EME",
			className: "text-center px-[5px] w-[45px] max-w-[45px]",
			sortable: false,
			render: (data, e, row) => {
				const des = data.filter(
					(item) => item.INQG_GROUP === 1 && item.INQG_LATEST === 1,
				);
				if (des.length == 0) return "";
				return renderMark(row.INQ_STATUS, des[0].INQG_STATUS);
			},
		},
		{
			data: "inqgroup",
			title: "EEL",
			className: "text-center px-[5px] w-[45px] max-w-[45px]",
			sortable: false,
			render: (data, e, row) => {
				const des = data.filter(
					(item) => item.INQG_GROUP === 2 && item.INQG_LATEST === 1,
				);
				if (des.length == 0) return "";
				return renderMark(row.INQ_STATUS, des[0].INQG_STATUS);
			},
		},
		{
			data: "inqgroup",
			title: "EAP",
			className: "text-center px-[5px] w-[45px] max-w-[45px]",
			sortable: false,
			render: (data, e, row) => {
				const des = data.filter(
					(item) => item.INQG_GROUP === 3 && item.INQG_LATEST === 1,
				);
				if (des.length == 0) return "";
				return renderMark(row.INQ_STATUS, des[0].INQG_STATUS);
			},
		},
		{
			data: "inqgroup",
			title: "ESO",
			className: "text-center px-[5px] w-[45px] max-w-[45px]",
			sortable: false,
			render: (data, e, row) => {
				const des = data.filter(
					(item) => item.INQG_GROUP === 6 && item.INQG_LATEST === 1,
				);
				if (des.length == 0) return "";
				return renderMark(row.INQ_STATUS, des[0].INQG_STATUS);
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
					title: "View",
					type: "link",
					icon: "fi fi-rr-search text-lg",
					className: `btn-xs btn-outline btn-accent text-accent hover:shadow-lg hover:text-white`,
					href: `${process.env.APP_ENV}/admin/inquiry/show/${data}/`,
				});

				const edit = createBtn({
					id: `edit-${data}`,
					title: "Send Pre B/M",
					type: "link",
					icon: "fi fi-sr-location-arrow text-lg",
					className: `btn-xs btn-accent text-white text-nowrap ms-1 hover:shadow-lg process-btn`,
				});
				return `<div class="flex gap-1 justify-center items-center w-fit">${view}${edit}</div>`;
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
		const newinq = await createBtn({
			id: "add-new-inquiry",
			type: "link",
			href: `${process.env.APP_ENV}/mar/inquiry/create`,
			title: "New Inquiry",
			icon: "fi fi-tr-file-excel text-xl ",
			className: `btn-outline btn-primary text-primary hover:shadow-lg  hover:text-white`,
		});
		const export1 = await createBtn({
			id: "export1",
			title: "Export Inquiry",
			icon: "fi fi-tr-file-excel text-xl",
			className: `btn-accent text-white hover:shadow-lg`,
		});
		const export2 = await createBtn({
			id: "export2",
			title: "Export (With Detail)",
			icon: "fi fi-rr-layers text-xl",
			className: `btn-accent btn-outline text-accent hover:shadow-lg hover:text-white`,
		});

		const back = await createBtn({
			id: "goback",
			title: "Back",
			icon: "fi fi-rr-arrow-circle-left text-xl",
			className: `btn-accent btn-outline text-accent hover:shadow-lg hover:text-white`,
		});

		$(".table-option").append(`${extopt.new === true ? newinq : ""}`);
		$(".table-info").append(
			`<div class="btn-container flex gap-2">${export1}${export2}${extopt.back === true ? back : ""}</div>`,
		);
		$("#datatable_loading").addClass("hidden");
		await this.api().columns.adjust();
	};
	return opt;
}
