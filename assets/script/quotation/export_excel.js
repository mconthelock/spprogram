import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { showMessage } from "@amec/webasset/utils";
import { displayname } from "@amec/webasset/api/amec";
import { activatedBtn } from "@amec/webasset/components/buttons";
import { getTemplate, cloneRows } from "../service/excel";
import { getInquiry } from "../service/inquiry.js";

$(document).on("click", ".export-excel-quotation", async function (e) {
	e.preventDefault();
	try {
		//const row = table.row($(this).closest("tr")).data();
		const id = $(this).attr("data-id");
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
