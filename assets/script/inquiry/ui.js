import moment from "moment";
import ExcelJS from "exceljs";
import { getExportTemplate, getInquiryID } from "../service/inquiry.js";
import { cloneRows } from "../service/excel.js";

$(document).on("mouseenter", ".detail-log", function () {
  const data = $(this).closest("td").find("ul");
  const content = $("#tip1");
  content.find(".tooltip-content").html("");
  content.find(".tooltip-content").append(`<ul>${data.html()}</ul>`);
  const rect = $(this)[0].getBoundingClientRect();
  content.css("top", rect.bottom + window.scrollY + "px");
  content.css("left", rect.left + window.scrollX + "px");
  content.removeClass("hidden");
});

$(document).on("mouseleave", ".detail-log", function () {
  $("#tip1").addClass("hidden");
});

$(document).on("click", "#add-attachment", async function (e) {
  e.preventDefault();
  console.log("Add attachment");
  $("#attachment-file").click();
});

$(document).on("click", ".view-last-revision", function (e) {
  e.preventDefault();
  $("#inquiry-last-revision").prop("checked", true);
});

$(document).on("click", "#export-detail", async function (e) {
  e.preventDefault();
  const setdata = async (sheet, el, r, num) => {
    sheet.getCell(r, 1).value = el.INQD_SEQ;
    sheet.getCell(r, 2).value = el.INQD_CAR;
    sheet.getCell(r, 3).value = el.INQD_MFGORDER;
    sheet.getCell(r, 5).value = el.INQD_ITEM;
    sheet.getCell(r, 6).value = el.INQD_PARTNAME;
    sheet.getCell(r, 10).value = el.INQD_DRAWING;
    sheet.getCell(r, 14).value = el.INQD_VARIABLE;
    sheet.getCell(r, 18).value = num;
    sheet.getCell(r, 19).value = el.INQD_SUPPLIER;
    sheet.getCell(r, 21).value = el.INQD_QTY;
    sheet.getCell(r, 22).value = el.INQD_UM;
    sheet.getCell(r, 23).value = el.INQD_SENDPART !== null ? "P" : "";
    sheet.getCell(r, 24).value = el.INQD_UNREPLY !== null ? "P" : "";
    sheet.getCell(r, 25).value = el.INQD_MAR_REMARK;
  };

  const template = await getExportTemplate({
    name: `exportinquirydetail.xlsx`,
  });

  const info = await getInquiryID($("#inquiry-id").val());
  const file = template.buffer;
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(file).then(async (workbook) => {
    const sheet = workbook.worksheets[0];
    sheet.getCell(2, 22).value = info.INQ_NO;
    sheet.getCell(4, 22).value = info.INQ_TRADER;
    sheet.getCell(5, 1).value = `Email: ${info.maruser.SRECMAIL}`;
    sheet.getCell(
      6,
      1
    ).value = `Tel: +66 (038) 93 6600 Ext.${info.maruser.NTELNO}`;

    sheet.getCell(9, 5).value = info.maruser.SNAME;
    sheet.getCell(10, 5).value = moment(info.INQ_DATE).format("DD/MM/YYYY");
    sheet.getCell(11, 5).value = info.INQ_AGENT;
    sheet.getCell(12, 5).value = info.INQ_COUNTRY;

    sheet.getCell(9, 19).value = moment(info.INQ_MAR_SENT).format("DD/MM/YYYY");
    sheet.getCell(10, 19).value = info.INQ_REV;
    sheet.getCell(11, 19).value = info.INQ_PRJNO;
    sheet.getCell(12, 19).value = info.INQ_PRJNAME;

    let s = 16;
    const details = info.details
      .filter((dt) => dt.INQD_LATEST == 1)
      .sort((a, b) => a.INQD_RUNNO - b.INQD_RUNNO);
    for (const i in details) {
      const rowdata = details[i];
      if (s > 36) await cloneRows(sheet, 20, s);
      await setdata(sheet, rowdata, s, info.shipment.SHIPMENT_VALUE);
      s++;
    }
    await workbook.xlsx.writeBuffer().then(function (buffer) {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${info.INQ_NO}.xlsx`;
      link.click();
    });
  });
});
