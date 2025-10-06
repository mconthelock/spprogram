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
009 - Add attachment
010 - Download attached file
011 - Delete attached file
*/
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/datatable.min.css";

import { createTable } from "@public/_dataTable.js";
import { setDatePicker } from "@public/_flatpickr.js";
import * as inqservice from "../service/inquiry.js";
import * as utils from "../utils.js";
import * as inqs from "../inquiry/detail.js";
import * as tb from "../inquiry/table.js";
import * as tbmar from "../inquiry/table_mar.js";

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
    let mode = "create";
    const currentUrl = window.location.href;
    if (currentUrl.includes("edit") && $("#inquiry-id").val() != "") {
      inquiry = await inqservice.getInquiryID($("#inquiry-id").val());
      if (inquiry.length == 0) throw new Error("Inquiry do not found");

      mode = "edit";
      if (inquiry.INQ_STATUS >= 10) {
        inquiry.INQ_REV = utils.revision_code(inquiry.INQ_REV);
        inquiry.INQ_MAR_PIC = $("#user-login").attr("empno");
        mode = "revise";
      }

      details = inquiry.details.filter((dt) => dt.INQD_LATEST == "1");
      logs = await inqservice.getInquiryHistory(inquiry.INQ_NO);
      file = await inqservice.getInquiryFile({ INQ_NO: inquiry.INQ_NO });
    }
    const cards = await inqs.setupCard(inquiry);
    const tableContainer = await tbmar.setupTableDetail(details);
    table = await createTable(tableContainer);

    const history = await tb.setupTableHistory(logs);
    await createTable(history, { id: "#history" });

    const attachment = await tb.setupTableAttachment(file);
    tableAttach = await createTable(attachment, { id: "#attachment" });

    const btn = await setupButton(mode);
    const reason = await inqs.createReasonModal();
    const elmes = await inqs.elmesComponent();
    const date = await setDatePicker();
  } catch (error) {
    console.log(error);
    await utils.errorMessage(error);
  } finally {
    await utils.showLoader({ show: false });
  }
});

async function setupButton(mode) {
  const sendDE = await utils.creatBtn({
    id: "send-de",
    title: "Send to Design",
    icon: "fi fi-tr-envelope-open-text text-xl",
    className: `btn-primary text-white hover:shadow-lg ${mode}`,
  });

  const updateDE = await utils.creatBtn({
    id: "update-de",
    title: "Send to Design",
    icon: "fi fi-tr-envelope-open-text text-xl",
    className: `btn-primary text-white hover:shadow-lg ${mode}`,
  });

  const sendIS = await utils.creatBtn({
    id: "send-bm",
    title: "Send to Pre-BM",
    icon: "fi fi-ts-coins text-xl",
    className: `btn-neutral text-white hover:shadow-lg hover:bg-neutral/70 ${mode}`,
  });

  const updateIS = await utils.creatBtn({
    id: "update-bm",
    title: "Send to Pre-BM",
    icon: "fi fi-ts-coins text-xl",
    className: `btn-neutral text-white hover:shadow-lg hover:bg-neutral/70 ${mode}`,
  });

  const draft = await utils.creatBtn({
    id: "draft",
    title: "Send Draft",
    icon: "fi fi-ts-clipboard-list text-xl",
    className: `btn-outline btn-neutral text-neutral hover:text-white hover:shadow-lg`,
  });

  const back = await utils.creatBtn({
    id: "goback",
    title: "Back",
    type: "link",
    href: `#`,
    icon: "fi fi-rr-arrow-circle-left text-xl",
    className:
      "btn-outline btn-neutral text-neutral hover:text-white hover:bg-neutral/70",
  });

  if (mode == "create") $("#btn-container").append(sendDE, sendIS, draft, back);
  else $("#btn-container").append(updateDE, updateIS, back);
}

//002: Add table detail rows
$(document).on("click", "#addRowBtn", async function (e) {
  e.preventDefault();
  const lastRow = table.row(":not(.d-none):last").data();
  let id = lastRow === undefined ? 1 : parseInt(lastRow.INQD_RUNNO) + 1;
  let seq = lastRow === undefined ? 1 : parseInt(lastRow.INQD_SEQ) + 1;
  await tb.addRow({ id, seq }, table);
});

$(document).on("click", ".add-sub-line", async function (e) {
  e.preventDefault();
  const data = table.row($(this).parents("tr")).data();
  const seq = utils.digits(utils.intVal(data.INQD_SEQ) + 0.01, 2);
  const id = parseInt(data.INQD_RUNNO) + 0.1;
  await tb.addRow({ id, seq }, table);
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

$(document).on("change", ".carno", async function (e) {
  await tb.changeCar(table, this);
});

$(document).on("change", ".edit-input", async function () {
  await tb.changeCell(table, this);
});

//003: Show Elmes table
$(document).on("change", ".elmes-input", async function (e) {
  const row = table.row($(this).closest("tr"));
  const node = table.row($(this).closest("tr")).node();
  const item = $(node).find(".itemno").val();
  const mfg = $(node).find(".mfgno").val();
  let data = row.data();
  row.data({ ...data, INQD_ITEM: item, INQD_MFGORDER: mfg }).draw();
  if (item != "" && mfg != "") {
    tableElmes = await inqs.elmesSetup(row);
  }
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
  await inqs.clickUnreply($(this), table.row($(this).parents("tr")));
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
//006: Save Draft
$(document).on("click", "#draft", async function (e) {
  e.preventDefault();
  await createPath({ level: 0, status: 1 });
});

//007: Save and send to design
$(document).on("click", "#send-de", async function (e) {
  e.preventDefault();
  await createPath({ level: 1, status: 2 });
});

//008: Save and send to AS400
$(document).on("click", "#send-bm", async function (e) {
  e.preventDefault();
  await createPath({ level: 2, status: 30 });
});

async function createPath(opt) {
  const chkheader = await inqs.verifyHeader(
    opt.level == 0 ? ".req-1" : ".req-2"
  );
  if (!chkheader) return;
  const header = await inqs.getFormHeader();
  const check_inq = await inqservice.getInquiry({ INQ_NO: header.INQ_NO });
  if (check_inq.length > 0) {
    await utils.showMessage(`Inquiry ${header.INQ_NO} is already exist!`);
    $("#inquiry-no").focus().select();
    return;
  }

  header.INQ_STATUS = opt.status;
  header.INQ_TYPE = "SP";
  const details = table.rows().data().toArray();
  try {
    await inqs.verifyDetail(table, details, opt.level);
    await utils.showLoader({
      show: true,
      title: "Saving data",
      clsbox: `!bg-transparent`,
    });
    const timelinedata = await setTimelineData(opt.status);
    const history = await setLogsData(opt.status);
    const fomdata = { header, details, timelinedata, history };
    const inquiry = await inqservice.createInquiry(fomdata);
    if (selectedFilesMap.size > 0) {
      const attachment_form = new FormData();
      attachment_form.append("INQ_NO", inquiry.INQ_NO);
      selectedFilesMap.forEach((file, fileName) => {
        attachment_form.append("files", file, fileName);
      });
      await inqservice.createInquiryFile(attachment_form);
    }

    if (opt.status == 1)
      window.location.replace(
        `${process.env.APP_ENV}/mar/inquiry/edit/${inquiry.INQ_ID}`
      );
    else
      window.location.replace(
        `${process.env.APP_ENV}/mar/inquiry/view/${inquiry.INQ_ID}`
      );
  } catch (error) {
    await utils.errorMessage(error);
    return;
  }
}

//012: Update and send to design
$(document).on("click", "#update-de", async function (e) {
  e.preventDefault();
  if ($(this).hasClass("revise") && $("#remark").val() == "") {
    await utils.showMessage("Please enter remark for revise inquiry.");
    $("#remark").focus();
    return;
  }

  if ($("#status").val() >= 10) {
    await updatePath({ level: 1, status: 3 });
  } else {
    await updatePath({ level: 1, status: 2 });
  }
});

//013: Update and send to AS400
$(document).on("click", "#update-bm", async function (e) {
  e.preventDefault();
  if ($(this).hasClass("revise") && $("#remark").val() == "") {
    await utils.showMessage("Please enter remark for revise inquiry.");
    $("#remark").focus();
    return;
  }
  await updatePath({ level: 2, status: 30 });
});

async function updatePath(opt) {
  const chkheader = await inqs.verifyHeader(".req-2");
  if (!chkheader) return;
  const header = await inqs.getFormHeader();
  const check_inq = await inqservice.getInquiry({ INQ_NO: header.INQ_NO });
  if (check_inq.length == 0) {
    await utils.showMessage(`Inquiry ${header.INQ_NO} is not found on System!`);
    $("#inquiry-no").focus().select();
    return;
  }

  header.INQ_STATUS = opt.status;
  header.UPDATE_BY = $("#user-login").attr("empname");
  header.UPDATE_AT = new Date();

  const details = table.rows().data().toArray();
  try {
    await inqs.verifyDetail(table, details, opt.level);
    await utils.showLoader({
      show: true,
      title: "Saving data",
      clsbox: `!bg-transparent`,
    });

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

    const timelinedata = await setTimelineData();
    const history = await setLogsData(opt.status);
    const fomdata = {
      header,
      details,
      deleteLine,
      deleteFile,
      timelinedata,
      history,
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
      `${process.env.APP_ENV}/mar/inquiry/view/${inquiry.INQ_ID}`
    );
  } catch (error) {
    await utils.errorMessage(error);
    return;
  }
}

async function setTimelineData() {
  return {
    INQ_NO: $("#inquiry-no").val(),
    INQ_REV: $("#revision").val(),
    MAR_USER: $("#user-login").attr("empno"),
    MAR_SEND: new Date(),
  };
}

async function setLogsData(action) {
  return {
    INQ_NO: $("#inquiry-no").val(),
    INQ_REV: $("#revision").val(),
    INQH_DATE: new Date(),
    INQH_USER: $("#user-login").attr("empno"),
    INQH_ACTION: action,
    INQH_REMARK: $("#remark").val(),
  };
}
