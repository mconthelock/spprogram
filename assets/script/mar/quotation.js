import "select2/dist/css/select2.min.css";
import "@amec/webasset/css/select2.min.css";
import "@amec/webasset/css/dataTable.min.css";
import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { showLoader } from "@amec/webasset/preloader";
import { displayname } from "@amec/webasset/api/amec";
import { showMessage } from "@amec/webasset/utils";
import { createTable } from "@amec/webasset/dataTable";
import { createBtn, activatedBtn } from "@amec/webasset/components/buttons";
import { getTemplate, exportExcel, cloneRows } from "../service/excel";
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
			className: `w-fit !max-w-[110px] !text-center ${
				pageid == "3" ? "hidden" : ""
			}`,
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
					className: `btn-sm btn-accent text-white hover:shadow-lg w-[100px]`,
					href: `${process.env.APP_ENV}/mar/quotation/detail/${data}/1/`,
				});
				const view = createBtn({
					id: `view-${data}`,
					title: "View",
					type: "link",
					icon: "fi fi-rr-arrow-up-right-from-square text-lg",
					className: `btn-sm btn-outline btn-accent text-accent hover:shadow-lg hover:text-white w-[100px]`,
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
					className: `btn-sm btn-accent text-white hover:shadow-lg ${row.INQ_TYPE == "SP" ? "" : "hidden!"}`,
					href: `${process.env.APP_ENV}/mar/quotation/detail/${data}/2/`,
				});
				const view = createBtn({
					id: `view-${data}`,
					title: "View",
					type: "link",
					icon: "fi fi fi-rs-search text-lg",
					className: `btn-sm btn-outline btn-accent text-accent hover:shadow-lg hover:text-white ${row.INQ_TYPE == "SP" ? "hidden!" : ""}`,
					href: `${process.env.APP_ENV}/mar/quotation/detail/${data}/3/`,
				});
				const excel = createBtn({
					id: `export-${data}`,
					title: `Export`,
					type: "link",
					icon: "fi fi-tr-file-excel text-lg",
					className: `btn-sm btn-neutral text-white export-excel hover:shadow-lg`,
				});
				const sparq = `<a class="export-sparq"><i class="fi fi-tr-file-excel text-lg"></i>File import to Sparq</a>`;
				const order = `<a class="export-order"><i class="fi fi-tr-rectangle-list text-lg"></i>File import new order</a>`;
				const revise = `<a class="${process.env.APP_ENV}/mar/inquiry/detail/${data}"><i class="fi fi-rs-interactive text-lg"></i>Revise Inquiry</a>`;
				const dropdown = `<div class="dropdown dropdown-end">
                    <div tabindex="0" role="button" class="btn btn-sm btn-circle btn-ghost"><i class="fi fi-bs-menu-dots-vertical text-lg"></i></div>
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

$(document).on("click", ".export-excel", async function (e) {
	e.preventDefault();
	try {
		const row = table.row($(this).closest("tr")).data();
		const id = row.INQ_ID;
		await activatedBtn($(this));
		const template = await getTemplate("export_quotation_detail.xlsx");
		const data = await getInquiry({
			INQ_ID: id,
			IS_DETAILS: true,
			IS_QUOTATION: true,
			IS_WEIGHT: true,
		});
		await exportDocument(template, data[0]);
	} catch (error) {
		console.log(error);
		await showMessage(`Something went wrong.`);
	} finally {
		await activatedBtn($(this), false);
	}
});

async function exportDocument(template, data) {
	const file = template.buffer;
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.load(file).then(async (wk) => {
		//Weight Sheet
		const sheet2 = wk.worksheets[1];
		sheet2.getCell("T2").value = data.INQ_NO;
		sheet2.getCell("T3").value = "Part Supply";
		sheet2.getCell("T4").value = data.INQ_TRADER;
		sheet2.getCell("B5").value = data.maruser.SRECMAIL;

		const weights = data.weight.sort((a, b) => a.SEQ_WEIGHT - b.SEQ_WEIGHT);
		weights.forEach((wg, w) => {
			sheet2.getCell(`A${w}`).value = wg.NO_WEIGHT;
			sheet2.getCell(`D${w}`).value = wg.PACKAGE_TYPE;
			sheet2.getCell(`J${w}`).value = wg.NET_WEIGHT;
			sheet2.getCell(`L${w}`).value = wg.GROSS_WEIGHT;
			sheet2.getCell(`O${w}`).value = wg.WIDTH_WEIGHT;
			sheet2.getCell(`Q${w}`).value = wg.LENGTH_WEIGHT;
			sheet2.getCell(`S${w}`).value = wg.HEIGHT_WEIGHT;
			sheet2.getCell(`U${w}`).value = wg.VOLUMN_WEIGHT;
			sheet2.getCell(`W${w}`).value = wg.ROUND_WEIGHT;
		});

		//Data Sheet
		const sheet1 = wk.worksheets[0];
		//Header Section
		sheet1.getCell("K2").value = data.INQ_NO;
		sheet1.getCell("K3").value = "Part Supply";
		sheet1.getCell("K4").value = data.INQ_TRADER;
		sheet1.getCell("B5").value = data.maruser.SRECMAIL;

		sheet1.getCell("C11").value = displayname(data.maruser.SNAME).sname;
		sheet1.getCell("C12").value = dayjs(data.INQ_DATE).format("YYYY-MM-DD");
		sheet1.getCell("C13").value = data.INQ_AGENT;
		sheet1.getCell("C14").value = data.INQ_COUNTRY;
		sheet1.getCell("C15").value = data.INQ_PRJNO;
		sheet1.getCell("C16").value = data.details[0].INQD_CAR;

		sheet1.getCell("H11").value = dayjs(data.quotation.QUO_DATE).format(
			"YYYY-MM-DD",
		);
		sheet1.getCell("H12").value = data.term.TERM_DESC;
		sheet1.getCell("H13").value = data.method.METHOD_DESC;
		sheet1.getCell("H14").value = data.shipment.SHIPMENT_DESC;
		sheet1.getCell("H15").value = dayjs(data.quotation.QUO_VALIDITY).format(
			"YYYY-MM-DD",
		);
		sheet1.getCell("H16").value = data.INQ_CUR;

		//Details Section
		const details = data.details.sort((a, b) => a.INQD_SEQ - b.INQD_SEQ);
		const rowStart = 20;
		let rowEnd = 0;
		const lt = data.shipment.SHIPMENT_VALUE;
		details.forEach((item, i) => {
			if (i > 24) {
				cloneRows(sheet1, 22, rowStart + i);
			}
			sheet1.getCell(rowStart + i, 1).value = item.INQD_SEQ;
			sheet1.getCell(rowStart + i, 2).value = item.INQD_CAR;
			sheet1.getCell(rowStart + i, 3).value = item.INQD_MFGORDER;
			sheet1.getCell(rowStart + i, 4).value = item.INQD_ITEM;
			sheet1.getCell(rowStart + i, 5).value = item.INQD_PARTNAME;
			sheet1.getCell(rowStart + i, 6).value = item.INQD_DRAWING;
			sheet1.getCell(rowStart + i, 7).value = item.INQD_VARIABLE;
			sheet1.getCell(rowStart + i, 8).value = lt; //L/T
			sheet1.getCell(rowStart + i, 9).value = item.INQD_SUPPLIER;
			sheet1.getCell(rowStart + i, 10).value =
				item.INQD_SENDPART == null ? "" : "P";
			sheet1.getCell(rowStart + i, 11).value = item.INQD_QTY;
			sheet1.getCell(rowStart + i, 12).value = item.INQD_UM;
			sheet1.getCell(rowStart + i, 13).value = item.INQD_UNIT_PRICE;
			sheet1.getCell(rowStart + i, 14).value = {
				formula: `M${rowStart + i}*K${rowStart + i}`,
			}; //Amount
			sheet1.getCell(rowStart + i, 15).value = item.INQD_MAR_REMARK;
			sheet1.getCell(rowStart + i, 16).value = item.INQD_DES_REMARK;
			sheet1.getCell(rowStart + i, 17).value = item.INQD_FIN_REMARK;
			i++;
			rowEnd = rowStart + i;
		});

		if (rowEnd > 45) {
			sheet1.mergeCells(`H${rowEnd + 2}:K${rowEnd + 2}`);
			sheet1.mergeCells(`L${rowEnd + 2}:N${rowEnd + 2}`);

			sheet1.mergeCells(`A${rowEnd + 4}:G${rowEnd + 6}`);
			sheet1.mergeCells(`H${rowEnd + 4}:I${rowEnd + 6}`);

			sheet1.mergeCells(`J${rowEnd + 4}:K${rowEnd + 4}`);
			sheet1.mergeCells(`J${rowEnd + 5}:K${rowEnd + 5}`);
			sheet1.mergeCells(`J${rowEnd + 6}:K${rowEnd + 6}`);
		}
		sheet1.getCell(`A${rowEnd + 4}`).value = data.quotation.QUO_NOTE;
		sheet1.getCell(`L${rowEnd + 4}`).value = data.quotation.QUO_SEA_TOTAL;
		sheet1.getCell(`L${rowEnd + 5}`).value = data.quotation.QUO_AIR_TOTAL;
		sheet1.getCell(`L${rowEnd + 6}`).value =
			data.quotation.QUO_COURIER_TOTAL;

		//Save to file
		await sheet1.protect($("#user-login").attr("empno"));
		await wk.xlsx.writeBuffer().then(function (buffer) {
			const blob = new Blob([buffer], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = `${data.INQ_NO}.xlsx`;
			link.click();
		});
	});
}

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
