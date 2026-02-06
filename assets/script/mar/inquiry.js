import "@amec/webasset/css/dataTable.min.css";

import dayjs from "dayjs";
import { showLoader } from "@amec/webasset/preloader";
import { showMessage } from "@amec/webasset/utils";
import { createTable } from "@amec/webasset/dataTable";
import { displayname } from "@amec/webasset/api/amec";
import { createBtn, activatedBtn } from "@amec/webasset/components/buttons";
import { getTemplate, exportExcel, cloneRows } from "../service/excel";
import { statusColors } from "../inquiry/ui.js";
import { tableInquiry, confirmDeleteInquiry } from "../inquiry/table.js";
import { getInquiry, dataExports, dataDetails } from "../service/inquiry.js";
import { initApp, tableOpt } from "../utils.js";

var table;
$(async function () {
	try {
		await initApp({ submenu: ".navmenu-newinq" });
		let data;
		if ($("#pageid").val() == "2") {
			data = await getInquiry({
				INQ_STATUS: "< 80",
				IS_GROUP: 1,
				IS_DETAILS: 1,
				IS_TIMELINE: 1,
			});
			data = await prebmdata(data);
		} else {
			data = await getInquiry({
				INQ_STATUS: "< 80",
				IS_GROUP: 1,
			});
		}
		data = data.map((el) => {
			el.priority = [4, 27].includes(el.INQ_STATUS) ? 100 : 0;
			return el;
		});
		const opt = await tableInquiryOption(data);
		table = await createTable(opt);
	} catch (error) {
		console.log(error);
		await showMessage(error);
	} finally {
		await showLoader({ show: false });
	}
});

async function prebmdata(data) {
	data = data.filter((d) => {
		const isAmec = d.details.some((dt) => {
			if (dt.INQD_SUPPLIER == null) return false;
			return dt.INQD_SUPPLIER.toUpperCase().includes("AMEC");
		});
		return isAmec && d.INQ_STATUS >= 28 && d.timeline.BM_CONFIRM == null;
	});
	return data;
}

async function tableInquiryOption(data) {
	const colors = await statusColors();
	const opt = { ...tableOpt };
	opt.data = data;
	opt.orderFixed = [0, "desc"];
	opt.order = [[1, "desc"]];
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

		$(".table-option").append(`${newinq}`);
		$(".table-info").append(
			`<div class="flex gap-2">${export1}${export2}</div>`,
		);
	};
	return opt;
}

$(document).on("click", "#export1", async function (e) {
	e.preventDefault();
	try {
		await activatedBtn($(this));
		const q = {};
		const query = {
			...q,
			INQ_STATUS: "< 80",
			IS_DETAILS: true,
			IS_ORDERS: true,
			IS_TIMELINE: true,
			IS_FIN: true,
		};
		const template = await getTemplate("export_inquiry_list.xlsx");
		let data = await getInquiry(query);
		if ($("#pageid").val() == "2") data = await prebmdata(data);
		const sortData = data.sort((a, b) => a.INQ_ID - b.INQ_ID);
		let result = await dataExports(sortData);

		await exportExcel(result, template, {
			filename: "Inquiry List.xlsx",
			rowstart: 3,
		});
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await activatedBtn($(this), false);
	}
});

$(document).on("click", "#export2", async function (e) {
	e.preventDefault();
	try {
		await activatedBtn($(this));
		const q = {};
		const query = {
			...q,
			INQ_STATUS: "< 80",
			IS_DETAILS: true,
			IS_ORDERS: true,
			IS_TIMELINE: true,
		};
		let data = await getInquiry(query);
		if ($("#pageid").val() == "2") data = await prebmdata(data);
		const result = await dataDetails(data);
		const template = await getTemplate("export_inquiry_list_detail.xlsx");
		await exportExcel(result, template, {
			filename: "Inquiry Detail List.xlsx",
			rowstart: 3,
		});
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await activatedBtn($(this), false);
	}
});
