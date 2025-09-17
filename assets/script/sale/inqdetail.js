/*
Funtion contents
001 - On load form
002 - Add table detail rows
003 - Show Elmes table
004 - Unable to reply checkbox
005 - Import data from file
006 - Assign Engineer
007 - Bypass to DE
008 - Save and send to AS400
009 - Add attachment
010 - Download attached file
011 - Delete attached file
012 - Update and send to design
013 - Update and send to AS400
014 - Export inquiry list
015 - Update and send to AS400
*/
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/datatable.min.css";

import { showbgLoader } from "@public/preloader";
import { createTable, destroyTable } from "@public/_dataTable.js";
import { displayEmpInfo } from "@public/setIndexDB.js";
import { validateDrawingNo } from "../drawing.js";
import * as inqservice from "../service/inquiry.js";
import * as elmesservice from "../service/elmes.js";
import * as utils from "../utils.js";
import * as inqs from "../inquiry/detail.js";
import * as tb from "../inquiry/table.js";
import * as tbsale from "../inquiry/table_sale.js";

//001: On load form
var table;
var tableElmes;
var tableAttach;
let selectedFilesMap = new Map();
let deletedFilesMap = new Map();
let deletedLineMap = new Map();

$(document).ready(async () => {
  try {
    await utils.initApp({ submenu: ".navmenu-newinq" });
    let logs, inquiry, details, file;
    const currentUrl = window.location.href;
    if (currentUrl.includes("edit") && $("#inquiry-id").val() != "") {
      inquiry = await inqservice.getInquiryID($("#inquiry-id").val());
      if (inquiry.length == 0) throw new Error("Inquiry do not found");
    }

    if (inquiry.INQ_STATUS >= 20)
      inquiry.INQ_REV = utils.revision_code(inquiry.INQ_REV);

    const user = $("#user-login").attr("empno");
    const times = inquiry.timeline;
    inquiry.SG_USER = times.SG_USER == null ? user : times.SG_USER;
    inquiry.SG_CONFIIRM = times.SG_CONFIIRM;
    inquiry.SE_USER = times.SE_USER;
    inquiry.SALE_CLASS = times.SALE_CLASS;

    details = inquiry.details.filter((dt) => dt.INQD_LATEST == "1");
    logs = await inqservice.getInquiryHistory(inquiry.INQ_NO);
    file = await inqservice.getInquiryFile({ INQ_NO: inquiry.INQ_NO });

    const cards = await inqs.setupCard(inquiry);
    const tableContainer = await tbsale.setupTableDetail(details);
    table = await createTable(tableContainer);

    const history = await tb.setupTableHistory(logs);
    await createTable(history, { id: "#history" });

    const attachment = await tb.setupTableAttachment(file);
    tableAttach = await createTable(attachment, { id: "#attachment" });

    const btn = await setupButton();
    const reason = await inqs.createReasonModal();
    const elmes = await inqs.elmesComponent();
  } catch (error) {
    console.log(error);
    await utils.errorMessage(error);
  } finally {
    await utils.showLoader({ show: false });
  }
});

async function setupButton() {
  const usergroup = $("#user-login").attr("groupcode");
  const assign = await utils.creatBtn({
    id: "assign-pic",
    title: "Assign PIC",
    icon: "fi fi-rs-user-check text-xl",
    className: "btn-primary text-white hover:shadow-lg",
  });

  const forwardde = await utils.creatBtn({
    id: "forward-de",
    title: "Forward to DE",
    icon: "fi fi-tr-share-square text-xl",
    className: "btn-neutral text-white hover:shadow-lg hover:bg-neutral/70",
  });

  const sendIS = await utils.creatBtn({
    id: "send-bm",
    title: "Send to Pre-BM",
    icon: "fi fi-ts-coins text-xl",
    className: "btn-neutral text-white hover:shadow-lg hover:bg-neutral/70",
  });

  const updateIS = await utils.creatBtn({
    id: "update-bm",
    title: "Send to Pre-BM",
    icon: "fi fi-ts-coins text-xl",
    className: "btn-neutral text-white hover:shadow-lg hover:bg-neutral/70",
  });

  const confirm = await utils.creatBtn({
    id: "send-confirm",
    title: "Confirm",
    icon: "fi fi-tr-badge-check text-xl",
    className: "btn-primary text-white hover:shadow-lg",
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

  if (usergroup == "SEG")
    $("#btn-container").append(assign, forwardde, sendIS, back);
  else $("#btn-container").append(confirm, back);
}

//002: Add table detail rows
$(document).on("click", "#addRowBtn", async function (e) {
  e.preventDefault();
  const lastRow = table.row(":not(.d-none):last").data();
  let id = lastRow === undefined ? 1 : parseInt(lastRow.INQD_SEQ) + 1;
  await tb.addRow(id, table);
});

$(document).on("click", ".add-sub-line", async function (e) {
  e.preventDefault();
  const data = table.row($(this).parents("tr")).data();
  const id = utils.digits(utils.intVal(data.INQD_SEQ) + 0.01, 2);
  await tb.addRow(id, table);
});

$(document).on("click", ".delete-sub-line", async function (e) {
  e.preventDefault();
  const row = table.row($(this).closest("tr"));
  const data = row.data();
  if (data.INQD_ID != "") {
    deletedLineMap.set(data.INQD_ID, data);
  }
  row.remove().draw(false);
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
  //await tb.changeCell(table, this);
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

//005: Import data from file
$(document).on("click", "#uploadRowBtn", async function (e) {
  $("#import-tsv").click();
});

$(document).on("change", "#import-tsv", async function (e) {
  const file = e.target.files[0];
  const ext = utils.fileExtension(file.name);
  const allow = ["xlsx", "tsv", "txt"];
  if (!allow.includes(ext)) {
    const msg = `Invalid file type. Please upload one of the following types: ${allow.join(
      ", "
    )}`;
    utils.showMessage(msg);
    return;
  }

  var newdata = null;
  if (ext === "xlsx") {
    newdata = await inqs.importExcel(file);
  } else {
    newdata = await inqs.importText(file);
  }

  if (newdata == null) {
    utils.showMessage("No data found in the file.");
    return;
  }

  newdata.forEach(async function (row) {
    table.row.add(row).draw();
  });
});
//End :Import date from File

//009: Add attachment
$(document).on("change", "#attachment-file", async function (e) {
  const datafile = await inqs.addAttached(e, selectedFilesMap);
  if (datafile.files.length > 0) {
    selectedFilesMap = datafile.selectedFilesMap;
    datafile.files.map((fs) => {
      tableAttach.row.add(fs).draw();
    });
  }
});

//010: Download attached file
$(document).on("click", ".download-att-client", function (e) {
  e.preventDefault();
  const row = tableAttach.row($(this).closest("tr"));
  const data = row.data();
  const fileName = data.FILE_ORIGINAL_NAME;
  tb.downloadClientFile(selectedFilesMap, fileName);
});

//011: Delete attached file
$(document).on("click", ".delete-att", function (e) {
  e.preventDefault();
  const row = tableAttach.row($(this).closest("tr"));
  const data = row.data();
  if (data.FILE_ID !== undefined) {
    deletedFilesMap.set(data);
  }
  const fileName = data.FILE_ORIGINAL_NAME;
  selectedFilesMap.delete(fileName);
  row.remove().draw(false);
});

//Download template
$(document).on("click", "#downloadTemplateBtn", async function (e) {
  e.preventDefault();
  const link = document.createElement("a");
  link.href = `${process.env.APP_ENV}/assets/files/export/Import_inquiry_template.xlsx`;
  link.download = "Import_inquiry_template.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

//Submit Form
//006: Assign Engineer
$(document).on("click", "#assign-pic", async function (e) {
  e.preventDefault();
  const chkheader = await inqs.verifyHeader(".req-1");
  if (!chkheader) return;
  try {
    const inquiry = await updatePath(10);
    window.location.replace(
      `${process.env.APP_ENV}/se/inquiry/view/${inquiry.INQ_ID}`
    );
  } catch (error) {
    await utils.errorMessage(error);
    return;
  }
});

//007: Bypass to DE
$(document).on("click", "#forward-de", async function (e) {
  e.preventDefault();
  e.preventDefault();
  const chkheader = await inqs.verifyHeader(".req-1");
  if (!chkheader) return;
  try {
    const inquiry = await updatePath(12);
    window.location.replace(
      `${process.env.APP_ENV}/se/inquiry/view/${inquiry.INQ_ID}`
    );
  } catch (error) {
    await utils.errorMessage(error);
    return;
  }
});

//008: Save and send to AS400
$(document).on("click", "#send-bm", async function (e) {
  e.preventDefault();
  const chkheader = await inqs.verifyHeader(".req-2");
  if (!chkheader) return;
  const header = await inqs.getFormHeader();
  const check_inq = await inqservice.getInquiry({ INQ_NO: header.INQ_NO });
  if (check_inq.length > 0) {
    await utils.showMessage(`Inquiry ${header.INQ_NO} is already exist!`);
    $("#inquiry-no").focus().select();
    return;
  }
  const details = table.rows().data().toArray();
  try {
    const checkdetail = await inqs.verifyDetail(table, details, 1);
    await utils.showLoader({
      show: true,
      title: "Saving data",
      clsbox: `!bg-transparent`,
    });
    header.INQ_STATUS = 30;
    header.INQ_TYPE = "SP";
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
    window.location.replace(
      `${process.env.APP_ENV}/se/inquiry/view/${inquiry.INQ_ID}`
    );
  } catch (error) {
    await utils.errorMessage(error);
    return;
  }
});

//012: Update and send to design
$(document).on("click", "#update-de", async function (e) {
  e.preventDefault();
  const chkheader = await inqs.verifyHeader(".req-2");
  if (!chkheader) return;
  const header = await inqs.getFormHeader();
  const check_inq = await inqservice.getInquiry({ INQ_NO: header.INQ_NO });
  if (check_inq.length == 0) {
    await utils.showMessage(`Inquiry ${header.INQ_NO} is not found on System!`);
    $("#inquiry-no").focus().select();
    return;
  }

  try {
    const details = table.rows().data().toArray();
    const checkdetail = await inqs.verifyDetail(table, details, 1);
    await utils.showLoader({
      show: true,
      title: "Saving data",
      clsbox: `!bg-transparent`,
    });
    // header.INQ_MAR_SENT = new Date();
    header.INQ_STATUS = 2;
    header.UPDATE_BY = $("#user-login").attr("empname");
    header.UPDATE_AT = new Date();

    let deleteLine = [];
    if (deletedLineMap.size > 0) {
      deletedLineMap.forEach((value, key) => {
        deleteLine.push(key);
      });
    }

    let deleteFile = [];
    if (deletedFilesMap.size > 0) {
      deletedFilesMap.forEach((value, key) => {
        deleteFile.push(key);
      });
    }
    const fomdata = {
      header,
      details,
      deleteLine,
      deleteFile,
    };
    const inquiry = await inqservice.updateInquiry(fomdata);
    if (selectedFilesMap.size > 0) {
      const attachment_form = new FormData();
      attachment_form.append("INQ_NO", inquiry.INQ_NO);
      selectedFilesMap.forEach((file, fileName) => {
        attachment_form.append("files", file, fileName);
      });
      await inqservice.createInquiryFile(attachment_form);
    }
    window.location.replace(
      `${process.env.APP_ENV}/se/inquiry/view/${inquiry.INQ_ID}`
    );
  } catch (error) {
    await utils.errorMessage(error);
    return;
  }
});

//013: Update and send to AS400
$(document).on("click", "#update-bm", async function (e) {
  e.preventDefault();
  const chkheader = await inqs.verifyHeader(".req-2");
  if (!chkheader) return;
  const header = await inqs.getFormHeader();
  const check_inq = await inqservice.getInquiry({ INQ_NO: header.INQ_NO });
  if (check_inq.length > 0) {
    await utils.showMessage(`Inquiry ${header.INQ_NO} is already exist!`);
    $("#inquiry-no").focus().select();
    return;
  }
  const details = table.rows().data().toArray();
  try {
    const checkdetail = await inqs.verifyDetail(table, details, 1);
    await utils.showLoader({
      show: true,
      title: "Saving data",
      clsbox: `!bg-transparent`,
    });
    header.INQ_STATUS = 30;
    header.INQ_TYPE = "SP";
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
    window.location.href = `${process.env.APP_ENV}/se/inquiry/view/${inquiry.INQ_ID}`;
  } catch (error) {
    await utils.errorMessage(error);
    return;
  }
});

// 015: Update and send to AS400

async function updatePath(status) {
  const header = await inqs.getFormHeader(); //Get header data
  const details = table.rows().data().toArray();
  const checkdetail = await inqs.verifyDetail(table, details, 1);
  await utils.showLoader({
    show: true,
    title: "Saving data",
    clsbox: `!bg-transparent`,
  });

  const timelinedata = {
    SG_USER: header.SG_USER,
    SE_USER: header.SE_USER,
    SALE_CLASS: header.SALE_CLASS,
    SG_CONFIIRM: header.SG_CONFIIRM == "" ? new Date() : header.SG_CONFIIRM,
  };
  delete header.SG_USER;
  delete header.SE_USER;
  delete header.SALE_CLASS;
  delete header.SG_CONFIIRM;
  header.INQ_STATUS = status;
  header.UPDATE_BY = $("#user-login").attr("empname");
  header.UPDATE_AT = new Date();

  let deleteLine = [];
  if (deletedLineMap.size > 0) {
    deletedLineMap.forEach((value, key) => {
      deleteLine.push(key);
    });
  }

  let deleteFile = [];
  if (deletedFilesMap.size > 0) {
    deletedFilesMap.forEach((value, key) => {
      deleteFile.push(key);
    });
  }
  const fomdata = {
    header,
    details,
    deleteLine,
    deleteFile,
    timelinedata,
  };
  const inquiry = await inqservice.updateInquiry(fomdata);
  if (selectedFilesMap.size > 0) {
    const attachment_form = new FormData();
    attachment_form.append("INQ_NO", inquiry.INQ_NO);
    selectedFilesMap.forEach((file, fileName) => {
      attachment_form.append("files", file, fileName);
    });
    await inqservice.createInquiryFile(attachment_form);
  }
  return inquiry;
}
