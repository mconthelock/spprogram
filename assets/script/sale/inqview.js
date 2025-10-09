import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/datatable.min.css";
import moment from "moment";
import ExcelJS from "exceljs";
import { createTable, destroyTable } from "@public/_dataTable.js";
import * as utils from "../utils.js";
import * as inqs from "../inquiry/detail.js";
import * as tb from "../inquiry/table.js";
import * as service from "../service/inquiry.js";
var table;
var tableAttach;
$(document).ready(async () => {
  try {
    await utils.initApp({ submenu: ".navmenu-newinq" });
    const inquiry = await service.getInquiryID($("#inquiry-id").val());
    if (inquiry.length == 0) throw new Error("Inquiry do not found");

    $("#inquiry-title").html(inquiry.INQ_NO);
    const times = inquiry.timeline;
    inquiry.SG_USER =
      times.SG_USER == null ? $("#user-login").attr("empno") : times.SG_USER;
    inquiry.SE_USER = times.SE_USER;
    inquiry.SALE_CLASS = times.SALE_CLASS;
    inquiry.SG_CONFIRM = times.SG_CONFIRM;

    const cards = await inqs.setupCard(inquiry);
    const details = inquiry.details.filter((dt) => dt.INQD_LATEST == 1);
    const detail = await tb.setupTableDetailView(details);
    table = await createTable(detail);

    const logs = await service.getInquiryHistory(inquiry.INQ_NO);
    const history = await tb.setupTableHistory(logs);
    await createTable(history, { id: "#history" });

    const file = await service.getInquiryFile({ INQ_NO: inquiry.INQ_NO });
    const attachment = await tb.setupTableAttachment(file, true);
    tableAttach = await createTable(attachment, { id: "#attachment" });
    const btn = await setupButton();
  } catch (error) {
    utils.errorMessage(error);
    return;
  } finally {
    await utils.showLoader({ show: false });
  }
});

async function setupButton() {
  const exportfile = await utils.creatBtn({
    id: "export-detail",
    title: "Export",
    icon: "fi fi-tr-file-excel text-xl",
    className: "btn-neutral text-white hover:shadow-lg hover:bg-neutral/70",
  });

  const back = await utils.creatBtn({
    id: "goback",
    title: "Back",
    type: "link",
    href: `${process.env.APP_ENV}/se/inquiry`,
    icon: "fi fi-rr-arrow-circle-left text-xl",
    className:
      "btn-outline btn-neutral text-neutral hover:text-white hover:bg-neutral/70",
  });
  $("#btn-container").append(exportfile, back);
}

$(document).on("click", "#export-detail", async function (e) {
  e.preventDefault();
  const clonerow = async (worksheet, sourceRowNum, targetRowNum) => {
    const sourceRow = worksheet.getRow(sourceRowNum);
    const newRow = worksheet.insertRow(targetRowNum);
    sourceRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const newCell = newRow.getCell(colNumber);
      if (cell.style) {
        newCell.style = { ...cell.style };
      }
    });
    newRow.height = sourceRow.height;
  };

  const setdata = async (sheet, el, r, num) => {
    sheet.getCell(r, 1).value = el.INQD_SEQ;
    sheet.getCell(r, 2).value = el.INQD_CAR;
    sheet.getCell(r, 3).value = el.INQD_MFGORDER;
    sheet.getCell(r, 6).value = el.INQD_ITEM;
    sheet.getCell(r, 7).value = el.INQD_PARTNAME;
    sheet.getCell(r, 11).value = el.INQD_DRAWING;
    sheet.getCell(r, 15).value = el.INQD_VARIABLE;
    sheet.getCell(r, 19).value = num;
    sheet.getCell(r, 20).value = el.INQD_SUPPLIER;
    sheet.getCell(r, 22).value = el.INQD_QTY;
    sheet.getCell(r, 23).value = el.INQD_UM;
    sheet.getCell(r, 24).value = el.INQD_SENDPART;
    sheet.getCell(r, 25).value = el.INQD_UNREPLY;
    sheet.getCell(r, 26).value = el.INQD_MAR_REMARK;
  };

  const template = await service.getExportTemplate({
    name: `exportinquirydetail.xlsx`,
  });

  const info = await service.getInquiryID($("#inquiry-id").val());
  const file = template.buffer;
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(file).then(async (workbook) => {
    const sheet = workbook.worksheets[0];
    sheet.getCell(2, 23).value = info.INQ_NO;
    sheet.getCell(4, 23).value = info.INQ_TRADER;

    sheet.getCell(9, 5).value = info.INQ_DATE;
    sheet.getCell(10, 5).value = moment(info.INQ_DATE).format("DD/MM/YYYY");
    sheet.getCell(11, 5).value = info.INQ_AGENT;
    sheet.getCell(12, 5).value = info.INQ_COUNTRY;

    sheet.getCell(9, 20).value = moment(info.INQ_MAR_SENT).format("DD/MM/YYYY");
    sheet.getCell(10, 20).value = info.INQ_REV;
    sheet.getCell(11, 20).value = info.INQ_PRJNO;
    sheet.getCell(12, 20).value = info.INQ_PRJNAME;

    let s = 16;
    const details = info.details
      .filter((dt) => dt.INQD_LATEST == 1)
      .sort((a, b) => a.INQD_RUNNO - b.INQD_RUNNO);
    for (const i in details) {
      const rowdata = details[i];
      if (s > 36) await clonerow(sheet, 20, s);
      await setdata(sheet, rowdata, s, info.shipment.SHIPMENT_VALUE);
      s++;
    }
    await workbook.xlsx.writeBuffer().then(function (buffer) {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${info.INQ_NO}-(${info.INQ_REV}).xlsx`;
      link.click();
    });
  });
});
