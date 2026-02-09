import dayjs from "dayjs";

import { displayname } from "@amec/webasset/api/amec";
import { createBtn, activatedBtn } from "@amec/webasset/components/buttons";
import { statusColors } from "../inquiry/ui.js";
import { tableOpt } from "../utils.js";

export async function tableInquiryOption(data, extopt = {}) {
	const colors = await statusColors();
	const opt = { ...tableOpt };
	opt.data = data;
	opt.orderFixed = [0, "desc"];
	opt.order = [[1, "desc"]];
	opt.columns = [
		// { data: "priority", className: "hidden" },
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
			className: "w-fit !max-w-[110px] !justify-center",
			sortable: false,
			title: `<div class="flex justify-center"><i class="fi fi-rr-settings-sliders text-lg"></i></div>`,
			render: (data, type, row) => {
				const viewurl =
					row.INQ_TYPE == "SP"
						? `${process.env.APP_ENV}/mar/inquiry/view/${data}`
						: `${process.env.APP_ENV}/mar/quotation/viewinq/${data}`;
				const view = `<a class="btn btn-xs btn-neutral btn-outline" href="${viewurl}">View</a>`;

				const edit = `<a class="btn btn-xs btn-neutral ${
					row.INQ_TYPE == "SP" ? "" : "btn-disabled"
				}" href="${
					process.env.APP_ENV
				}/mar/inquiry/edit/${data}">Edit</a>`;
				const deleteBtn = `<button class="btn btn-xs btn-ghost btn-circle text-red-500 hover:text-red-800 delete-inquiry" data-id="${data}" data-type="inquiry" onclick="confirm_box.showModal()"><i class="fi fi-br-trash text-2xl"></i></button>`;
				return `<div class="flex gap-1 justify-center items-center w-fit">${view}${edit}${deleteBtn}</div>`;
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
			id: "back-report",
			title: "Back",
			icon: "fi fi fi-rr-undo text-xl",
			className: `btn-accent btn-outline text-accent hover:shadow-lg hover:text-white`,
		});

		$(".table-option").append(`${extopt.new === true ? newinq : ""}`);
		$(".table-info").append(
			`<div class="flex gap-2">${export1}${export2}${extopt.back === true ? back : ""}</div>`,
		);
	};
	return opt;
}
