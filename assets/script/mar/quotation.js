import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";

import dayjs from "dayjs";
import { showLoader } from "@amec/webasset/preloader";
import { displayname } from "@amec/webasset/api/amec";
import { showErrorMessage } from "@amec/webasset/utils";
import { createTable } from "@amec/webasset/dataTable";
import { creatBtn, activatedBtn } from "@amec/webasset/components/buttons";
import { getTemplate, exportExcel } from "../service/excel";
import { statusColors } from "../inquiry/ui.js";
import { getInquiry, dataExports, dataDetails } from "../service/inquiry.js";
import { initApp, tableOpt } from "../utils.js";

var table;
$(document).ready(async () => {
	try {
		await showLoader({ show: true });
		await initApp({ submenu: ".navmenu-quotation" });
		const q = await tableCondition();
		const data = await getInquiry(q);
		const opt = await tableInquiryOption(data);
		table = await createTable(opt);
	} catch (error) {
		console.log(error);
		await showErrorMessage(`Something went wrong.`, "2036");
		return;
	} finally {
		await showLoader({ show: false });
	}
});

async function tableCondition() {
	let q = {};
	if ($("#pageid").val() == "3") {
		q = {
			INQ_STATUS: "> 50",
			IS_QUOTATION: true,
			quotation: {
				QUO_VALIDITY: `>= ${dayjs().format("YYYY-MM-DD")}`,
			},
		};
	} else {
		q = {
			INQ_STATUS: ">= 46 && < 80",
			IS_TIMELINE: true,
		};
	}
	return q;
}

async function tableInquiryOption(data) {
	const pageid = $("#pageid").val();
	const colors = await statusColors();
	const opt = { ...tableOpt };
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
				return displayname(data.SNAME).sname;
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
				let process = "";
				// prettier-ignore
				if(row.timeline !== undefined && row.timeline.PKC_CONFIRM != null) process = 'text-primary';
				return `<i class="fi fi-ss-check-circle text-xl justify-center ${process}"></i>`;
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
				let timelines = false;
				// prettier-ignore
				if(row.timeline !== undefined && row.timeline.PKC_CONFIRM != null && row.INQ_PKC_REQ == "1") timelines = true;
				if (timelines)
					return `<a class="btn btn-sm btn-neutral/50 text-white min-w-25" href="${process.env.APP_ENV}/mar/quotation/detail/${data}"><i class="fi fi-rr-arrow-up-right-from-square text-lg"></i>View</a>`;
				return `<a class="btn btn-sm btn-accent text-white min-w-25" href="${process.env.APP_ENV}/mar/quotation/detail/${data}"><i class="fi fi-sr-arrow-circle-right text-xl"></i>Process</a>`;
			},
		},
		{
			data: "INQ_ID",
			className: `w-fit !justify-end ${pageid == "3" ? "" : "hidden"}`,
			sortable: false,
			title: `<div class="flex justify-center"><i class="fi fi-rr-settings-sliders text-lg"></i></div>`,
			render: (data, type, row) => {
				const edit = creatBtn({
					id: `edit-${data}`,
					title: "Edit",
					type: "link",
					icon: "fi fi-tr-file-edit text-lg",
					className: `btn-sm btn-accent text-white hover:shadow-lg`,
					href: `${process.env.APP_ENV}/mar/quotation/detail/${data}`,
				});
				const excel = creatBtn({
					id: `export-${data}`,
					title: `Export`,
					type: "link",
					icon: "fi fi-tr-file-excel text-lg",
					className: `btn-sm btn-neutral ${row.status.STATUS_ID == "98" ? "btn-disabled text-gray-400" : "text-white export-excel"} hover:shadow-lg`,
				});
				const sparq = `<a class=""><i class="fi fi-tr-file-excel text-lg"></i>File import to Sparq</a>`;
				const order = `<a class=""><i class="fi fi-tr-rectangle-list text-lg"></i>File import new order</a>`;
				const revise = `<a class=""><i class="fi fi-rs-interactive text-lg"></i>Revise Inquiry</a>`;
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

	opt.initComplete = async function () {
		const export1 = await creatBtn({
			id: "export1",
			title: "Export to Excel",
			icon: "fi fi-tr-file-excel text-xl",
			className: `btn-neutral text-white hover:shadow-lg`,
		});
		const export2 = await creatBtn({
			id: "export2",
			title: "Export (Detail)",
			icon: `fi fi fi-rr-layers text-xl`,
			className: `btn-outline btn-neutral text-neutral hover:shadow-lg hover:text-white!`,
		});
		$(".table-info").append(
			`<div class="flex gap-2">${export1}${export2}</div>`,
		);
	};
	return opt;
}

$(document).on("click", ".export-excel", async function (e) {
	e.preventDefault();
	try {
		const id = $(this).attr("id").split("-")[1];
		await activatedBtn($(this));
		const template = await getTemplate("export_quotation_detail.xlsx");
		const data = await getInquiry({ INQ_ID: id });
		await exportDocument(template, data);
	} catch (error) {
		console.log(error);
		await showErrorMessage(`Something went wrong.`, "2036");
	} finally {
		await activatedBtn($(this), false);
	}
});

async function exportDocument(template, data) {
	const file = template.buffer;
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.load(file).then(async (workbook) => {
		//Process sheets

		//Save to file
		await workbook.xlsx.writeBuffer().then(function (buffer) {
			const blob = new Blob([buffer], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = "Cover Sheet Orders.xlsx";
			link.click();
		});
	});
}

$(document).on("click", "#export1", async function (e) {
	e.preventDefault();
	try {
		await activatedBtn($(this));
		const q = await tableCondition();
		const query = {
			...q,
			// INQ_NO: "T-IEE-25-A0504",
			IS_DETAILS: true,
			IS_ORDERS: true,
			IS_TIMELINE: true,
			IS_FIN: true,
		};
		const data = await getInquiry(query);
		const result = await dataExports(data);
		const template = await getTemplate("export_inquiry_list_template.xlsx");
		await exportExcel(result, template, {
			filename: "Quotation List.xlsx",
			rowstart: 3,
		});
	} catch (error) {
		console.log(error);
		await showErrorMessage(`Something went wrong.`, "2036");
	} finally {
		await activatedBtn($(this), false);
	}
});

$(document).on("click", "#export2", async function (e) {
	e.preventDefault();
	try {
		await activatedBtn($(this));
		const q = await tableCondition();
		const query = {
			...q,
			// INQ_NO: "T-IEE-25-A0504",
			IS_DETAILS: true,
			IS_ORDERS: true,
		};
		const data = await getInquiry(query);
		const result = await dataDetails(data);
		const template = await getTemplate(
			"export_inquiry_list_template_detail.xlsx",
		);
		await exportExcel(result, template, {
			filename: "Quotation Detail.xlsx",
			rowstart: 3,
		});
	} catch (error) {
		console.log(error);
		await showErrorMessage(`Something went wrong.`, "2036");
	} finally {
		await activatedBtn($(this), false);
	}
});
