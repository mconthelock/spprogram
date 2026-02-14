import "select2/dist/css/select2.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";

import dayjs from "dayjs";
import { showLoader } from "@amec/webasset/preloader";
import { displayname } from "@amec/webasset/api/amec";
import { showMessage } from "@amec/webasset/utils";
import { createTable } from "@amec/webasset/dataTable";
import { createBtn, activatedBtn } from "@amec/webasset/components/buttons";
import { getTemplate, exportExcel, cloneRows } from "../service/excel";
import { statusColors } from "../inquiry/detail.js";
import { getInquiry, dataExports, dataDetails } from "../service/inquiry.js";
import { initApp, tableOpt } from "../utils.js";
import * as exportquo from "../quotation/export_excel.js";

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
		await showMessage(`Something went wrong.`);
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
	} else if ($("#pageid").val() == "2") {
		q = {
			INQ_STATUS: ">= 46 && < 50",
			IS_TIMELINE: true,
			INQ_PKC_REQ: "1",
			timeline: { PKC_CONFIRM: "IS NULL" },
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
	opt.order = [[0, "desc"]];
	opt.columns = [
		{ data: "UPDATE_AT", className: "hidden" },
		{
			data: "INQ_DATE",
			className: "sticky-column text-center! text-nowrap ",
			title: "Inq. Date",
			render: function (data, type, row, meta) {
				return dayjs(data).format("YYYY-MM-DD");
			},
		},
		{
			data: "INQ_NO",
			className: "sticky-column text-nowrap",
			title: "No.",
		},
		{
			data: "INQ_REV",
			className: "sticky-column text-center!",
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
				return displayname(data.SNAME).sname;
			},
		},
		//Issuse Quotation
		{
			data: "timeline",
			title: "Fin. Confirmed",
			className: `text-center ${pageid == "3" ? "hidden" : ""}`,
			render: (data, type, row) => {
				if (data == undefined) return "";
				return data.FMN_CONFIRM == null
					? ""
					: dayjs(data.FMN_CONFIRM).format("YYYY-MM-DD hh:mm");
			},
		},
		{
			data: "timeline",
			title: "Weight Req.",
			className: `${pageid == "3" ? "hidden" : ""}`,
			sortable: false,
			render: (data, type, row) => {
				if (data == undefined) return "";
				if (row.INQ_PKC_REQ == "0") return "";
				const process =
					data.PKC_CONFIRM != null ? "text-primary" : "text-gray-400";
				return `<i class="fi fi-ss-check-circle text-xl justify-center ${process}"></i>`;
			},
		},
		{
			data: "INQ_ID",
			className: `w-fit text-center! ${pageid == "3" ? "hidden" : ""}`,
			sortable: false,
			title: `<div class="flex justify-center"><i class="fi fi-rr-settings-sliders text-lg"></i></div>`,
			render: (data, type, row) => {
				if (row.timeline == undefined) return "";
				let timelines = false;
				if (
					row.timeline.PKC_CONFIRM == null &&
					row.INQ_PKC_REQ == "1" &&
					row.INQ_STATUS < 50
				)
					timelines = true;
				const edit = createBtn({
					id: `edit-${data}`,
					title: "Process",
					type: "link",
					icon: "fi fi-rr-edit text-lg",
					className: `btn-xs btn-accent text-white hover:shadow-lg w-[80px]`,
					href: `${process.env.APP_ENV}/mar/quotation/detail/${data}/1/`,
				});
				const view = createBtn({
					id: `view-${data}`,
					title: "View",
					type: "link",
					icon: "fi fi-rr-arrow-up-right-from-square text-lg",
					className: `btn-xs btn-outline btn-accent text-accent hover:shadow-lg hover:text-white w-[80px]`,
					href: `${process.env.APP_ENV}/mar/quotation/detail/${data}`,
				});
				return `<div class="flex justify-end gap-2">${timelines ? view : edit}</div>`;
			},
		},
		//Released Quotation
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
			data: "INQ_ID",
			className: `w-fit !justify-end ${pageid == "3" ? "" : "hidden"}`,
			sortable: false,
			title: `<div class="flex justify-center"><i class="fi fi-rr-settings-sliders text-lg"></i></div>`,
			render: (data, type, row) => {
				const edit = createBtn({
					id: `edit-${data}`,
					title: "Edit",
					type: "link",
					icon: "fi fi-rr-edit text-lg",
					className: `btn-xs btn-accent text-white hover:shadow-lg ${row.INQ_TYPE == "SP" ? "" : "hidden!"}`,
					href: `${process.env.APP_ENV}/mar/quotation/detail/${data}/2/`,
				});
				const view = createBtn({
					id: `view-${data}`,
					title: "View",
					type: "link",
					icon: "fi fi fi-rs-search text-lg",
					className: `btn-xs btn-outline btn-accent text-accent hover:shadow-lg hover:text-white ${row.INQ_TYPE == "SP" ? "hidden!" : ""}`,
					href: `${process.env.APP_ENV}/mar/quotation/detail/${data}/3/`,
				});
				const excel = createBtn({
					id: `export-${data}`,
					title: `Export`,
					icon: "fi fi-tr-file-excel text-lg",
					className: `btn-xs btn-neutral text-white hover:shadow-lg export-excel-quotation`,
					other: `data-id="${data}"`,
				});
				const sparq = `<a class="export-sparq"><i class="fi fi-tr-file-excel text-lg"></i>File import to Sparq</a>`;
				const order = `<a class="export-order"><i class="fi fi-tr-rectangle-list text-lg"></i>File import new order</a>`;
				const revise = `<a class="${process.env.APP_ENV}/mar/inquiry/detail/${data}"><i class="fi fi-rs-interactive text-lg"></i>Revise Inquiry</a>`;
				const dropdown = `<div class="dropdown dropdown-end">
                    <div tabindex="0" role="button" class="btn btn-xs btn-circle btn-ghost"><i class="fi fi-bs-menu-dots-vertical text-lg"></i></div>
                    <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm border border-base-300">
                        <li>${sparq}</li>
                        <li>${order}</li>
                        <li>${revise}</li>
                    </ul>
                </div>`;
				return `<div class="flex justify-end gap-2">${edit}${view}${excel}${dropdown}</div>`;
			},
		},
	];

	opt.drawCallback = function (settings) {
		var api = this.api();
		var count = api.rows({ page: "current" }).count();
		let i = 0;
		api.rows({ page: "current" }).every(function (rowIdx) {
			if (i >= count - 3) {
				$(this.node()).find(".dropdown").addClass("dropdown-top");
			}
			i++;
		});
	};

	opt.initComplete = async function () {
		const export1 = await createBtn({
			id: "export1",
			title: "Export Excel",
			icon: "fi fi-tr-file-excel text-xl",
			className: `btn-accent text-white hover:shadow-lg`,
		});
		const export2 = await createBtn({
			id: "export2",
			title: "Export (Detail)",
			icon: `fi fi fi-rr-layers text-xl`,
			className: `btn-outline btn-accent text-accent hover:shadow-lg hover:text-white!`,
		});
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
		const q = await tableCondition();
		const query = {
			...q,
			// INQ_NO: "T-MET-25-A1212",
			IS_DETAILS: true,
			IS_ORDERS: true,
			IS_TIMELINE: true,
			IS_FIN: true,
		};
		const template = await getTemplate("export_inquiry_list.xlsx");
		const data = await getInquiry(query);
		const sortData = data.sort((a, b) => a.INQ_ID - b.INQ_ID);
		let result = await dataExports(sortData);

		await exportExcel(result, template, {
			filename: "Quotation List.xlsx",
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
		const q = await tableCondition();
		const query = {
			...q,
			// INQ_NO: "T-MET-25-A1212",
			IS_DETAILS: true,
			IS_ORDERS: true,
		};
		const data = await getInquiry(query);
		const result = await dataDetails(data);
		console.log(result);
		const template = await getTemplate("export_inquiry_list_detail.xlsx");
		await exportExcel(result, template, {
			filename: "Quotation Detail List.xlsx",
			rowstart: 3,
		});
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await activatedBtn($(this), false);
	}
});

$(document).on("click", ".export-sparq", async function (e) {
	e.preventDefault();
	try {
		await showLoader();
		const row = table.row($(this).closest("tr")).data();
		const id = row.INQ_ID;
		const data = await getInquiry({
			INQ_ID: id,
			IS_DETAILS: true,
			IS_QUOTATION: true,
		});
		const rows = [];
		console.log(data);

		const details = data[0].details.sort((a, b) => a.INQD_SEQ - b.INQD_SEQ);
		details.forEach((item, i) => {
			let remark = item.INQD_DES_REMARK,
				unreply = 0,
				unreplycode = "",
				unreplyremark = "",
				Pattern2Flg = "";

			if (item.INQD_SUPPLIER == "MELINA") {
				remark = "Original dwg no. is MELINA dwg no.";
				unreply = 1;
				unreplycode = 10;
				unreplyremark = "Original dwg no. is MELINA dwg no.";
				Pattern2Flg = 0;
			} else if (item.INQD_UNREPLY != null) {
				remark = item.INQD_DES_REMARK;
				unreply = 1;
				unreplycode = item.INQD_UNREPLY;
				unreplyremark = item.INQD_DES_REMARK;
			}
			const row = [
				data[0].INQ_NO,
				item.INQD_RUNNO,
				item.INQD_DRAWING,
				item.INQD_PARTNAME,
				item.INQD_QTY,
				item.INQD_UM,
				item.INQD_VARIABLE,
				item.INQD_UNIT_PRICE,
				remark,
				data[0].shipment.SHIPMENT_VALUE,
				dayjs(data[0].quotation.QUO_VALIDITY).format("YYYY/MM/DD"),
				1,
				item.INQD_MFGORDER,
				item.INQD_CAR,
				item.INQD_ITEM,
				data[0].INQ_SERIES,
				unreply,
				unreplycode,
				unreplyremark,
				Pattern2Flg,
				"", //Pattern2Sup
				data[0].INQ_REV,
				item.INQD_SEQ,
			];
			rows.push(row);
		});
		const tsvContent = rows.map((e) => e.join("\t")).join("\n");
		// 3. สร้าง Blob object
		const blob = new Blob([tsvContent], {
			type: "text/tab-separated-values",
		});
		const url = URL.createObjectURL(blob);

		// 4. สร้าง Link หลอกขึ้นมาเพื่อสั่ง Download
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", `${data[0].INQ_NO}.txt`);
		document.body.appendChild(link);

		link.click();
		document.body.removeChild(link);
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await showLoader({ show: false });
	}
});

$(document).on("click", ".export-order", async function (e) {
	e.preventDefault();
	try {
		await showLoader();
		const row = table.row($(this).closest("tr")).data();
		const id = row.INQ_ID;
		const template = await getTemplate("export_quotation_addorders.xlsx");
		const data = await getInquiry({
			INQ_ID: id,
			IS_DETAILS: true,
			IS_QUOTATION: true,
		});
		const result = await dataDetails(data);
		await exportExcel(result, template, {
			filename: `${data[0].INQ_NO}.xlsx`,
		});
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await showLoader({ show: false });
	}
});
