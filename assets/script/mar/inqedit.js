/*
Funtion contents
001 - On load form
002 - Add table detail rows
003 - Show Elmes table
004 - Unable to reply checkbox
005 - Import data from file
006 - Save Draft
007 - Save and send to design
008 - Save and send to AS400
*/
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/datatable.min.css";

import { createTable, destroyTable } from "@public/_dataTable.js";
import { validateDrawingNo } from "../drawing.js";
import * as inqservice from "../service/inquiry.js";
import * as utils from "../utils.js";
import * as inqs from "../inquiry/detail.js";
import * as tb from "../inquiry/table.js";

//001: On load form
var table;
var tableElmes;
var tableAttach;
let selectedFilesMap = new Map();
$(document).ready(async () => {
  try {
    await utils.showLoader();
    $(".mainmenu").find("details").attr("open", false);
    $(".mainmenu.navmenu-newinq").find("details").attr("open", true);
    const inquiry = await inqservice.getInquiryID($("#inquiry-id").val());
    if (inquiry.length == 0) throw new Error("Inquiry do not found");

    if (inquiry.INQ_STATUS < 10)
      inquiry.INQ_REV = utils.revision_code(inquiry.INQ_REV);
    const btn = await setupButton();
    const reason = await inqs.createReasonModal();
    const elmes = await inqs.elmesComponent();

    const cards = await inqs.setupCard(inquiry);
    const tableContainer = await tb.setupTableDetail(inquiry.details);
    table = await createTable(tableContainer);

    const logs = await inqservice.getInquiryHistory(inquiry.INQ_NO);
    const history = await tb.setupTableHistory(logs);
    await createTable(history, { id: "#history" });

    const file = await inqservice.getInquiryFile({ INQ_NO: inquiry.INQ_NO });
    const attachment = await tb.setupTableAttachment(file);
    tableAttach = await createTable(attachment, { id: "#attachment" });
  } catch (error) {
    console.log(error);

    //await utils.foundError(error);
  } finally {
    utils.showLoader(false);
  }
});

async function setupButton() {
  const sendDE = await utils.creatBtn({
    id: "send-de",
    title: "Send to Design",
    className: "btn-primary text-white",
  });

  const sendIS = await utils.creatBtn({
    id: "send-bm",
    title: "Send to Pre-BM",
    icon: "icofont-console text-2xl",
    className: "btn-neutral text-white",
  });

  const draft = await utils.creatBtn({
    id: "draft",
    title: "Send draft",
    icon: "icofont-attachment text-2xl",
    className: "btn-neutral text-white",
  });

  const back = await utils.creatBtn({
    id: "goback",
    title: "Back",
    type: "link",
    href: `${process.env.APP_ENV}/mar/inquiry`,
    icon: "icofont-arrow-left text-2xl",
    className: "btn-outline btn-neutral text-neutral hover:text-white",
  });
  $("#btn-container").append(sendDE, sendIS, back);
}

//002: Add table detail rows
$(document).on("click", "#addRowBtn", async function (e) {
  e.preventDefault();
  const lastRow = table.row(":not(.d-none):last").data();
  let id = lastRow === undefined ? 1 : parseInt(lastRow.INQD_RUNNO) + 1;
  await tb.addRow(id, table);
});

$(document).on("click", ".add-sub-line", async function (e) {
  e.preventDefault();
  const data = table.row($(this).parents("tr")).data();
  const id = utils.digits(utils.intVal(data.INQD_SEQ) + 0.01, 2);
  await tb.addRow(id, table);
});

$(document).on("change", ".edit-input", async function () {
  await tb.changeCell(table, this);
});

$(document).on("change", ".carno", async function (e) {
  await tb.changeCar(table, this);
});

//003: Show Elmes table
$(document).on("change", ".elmes-input", async function (e) {
  e.preventDefault();
  const row = table.row($(this).closest("tr"));
  tableElmes = await inqs.elmesSetup(row);
});

$(document).on("click", "#elmes-confirm", async function () {
  const increse = 1;
  const elmesData = tableElmes.rows().data();
  await inqs.elmesConform(elmesData, increse, table);
});

$(document).on("click", "#elmes-cancel", async function () {
  await inqs.elmesCancel(table);
});

//004: Unable to reply checkbox
$(document).on("click", ".unreply", async function () {
  await inqs.clickUnreply(table.row($(this).parents("tr")));
});

$(document).on("click", "#cancel-reason", async function () {
  await inqs.resetUnreply(table);
});

$(document).on("click", "#save-reason", async function () {
  await inqs.saveUnreply(table);
});

$(document).on("click", ".text-comment", async function () {
  $("#reason-99").prop("checked", true);
});

$(document).on("keyup", ".text-comment", async function () {
  await inqs.countReason(this);
});
// END: Unable to reply checkbox

//007: Save and send to design
$(document).on("click", "#send-de", async function (e) {
  e.preventDefault();
  if ($("#remark").val() == "") {
    await utils.showMessage(`Please enter remark.`);
    $("#remark").focus().select();
    return;
  }
  const chkheader = await inqs.verifyHeader(".req-2");
  if (!chkheader) return;
  const header = await inqs.getFormHeader();
  const details = table.rows().data().toArray();
  try {
    const checkdetail = await inqs.verifyDetail(table, details, 1);
    header.INQ_STATUS = 2;
    header.INQ_MAR_SENT = new Date();
    const fomdata = { header, details };
    const inquiry = await inqservice.createInquiry(fomdata);
    if (selectedFilesMap.size > 0) {
      const attachment_form = new FormData();
      attachment_form.append("INQ_NO", inquiry.INQ_NO);
      selectedFilesMap.forEach((file, fileName) => {
        attachment_form.append("files", file, fileName);
      });
      await inqservice.createInquiryFile(attachment_form);
    }
    window.location.href = `${process.env.APP_ENV}/mar/inquiry/view/${inquiry.INQ_ID}`;
  } catch (error) {
    utils.errorMessage(error);
    return;
  }
});

$(document).on("click", "#send-bm", async function (e) {
  e.preventDefault();
  if ($("#remark").val() == "") {
    await utils.showMessage(`Please enter remark.`);
    $("#remark").focus().select();
    return;
  }
  const chkheader = await inqs.verifyHeader(".req-2");
  if (!chkheader) return;
  const header = await inqs.getFormHeader();
  const details = table.rows().data().toArray();
  try {
    const checkdetail = await inqs.verifyDetail(table, details, 1);
    header.INQ_STATUS = 2;
    header.INQ_MAR_SENT = new Date();
    const fomdata = { header, details };
    const inquiry = await inqservice.createInquiry(fomdata);
    if (selectedFilesMap.size > 0) {
      const attachment_form = new FormData();
      attachment_form.append("INQ_NO", inquiry.INQ_NO);
      selectedFilesMap.forEach((file, fileName) => {
        attachment_form.append("files", file, fileName);
      });
      await inqservice.createInquiryFile(attachment_form);
    }
    window.location.href = `${process.env.APP_ENV}/mar/inquiry/view/${inquiry.INQ_ID}`;
  } catch (error) {
    utils.errorMessage(error);
    return;
  }
});
