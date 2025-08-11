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

    const btn = await setupButton();
    const reason = await inqs.createReasonModal();
    const elmes = await inqs.elmesComponent();
    const cards = await inqs.setupCard();
    const tableContainer = await tb.setupTableDetail();
    table = await createTable(tableContainer);

    const history = await tb.setupTableHistory();
    await createTable(history, { id: "#history" });

    const attachment = await tb.setupTableAttachment();
    tableAttach = await createTable(attachment, { id: "#attachment" });
  } catch (error) {
    await utils.foundError();
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
  $("#btn-container").append(sendDE, sendIS, draft, back);
}

//002: Add table detail rows
$(document).on("click", "#addRowBtn", async function (e) {
  e.preventDefault();
  const lastRow = table.row(":not(.d-none):last").data();
  let id = lastRow === undefined ? 1 : parseInt(lastRow.id) + 1;
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
  //   await tb.changeCell(table, this);
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

//Submit Form
//006: Save Draft
$(document).on("click", "#draft", async function (e) {
  e.preventDefault();
  const chkheader = await inqs.verifyHeader(".req-1");
  if (!chkheader) return;

  const header = await inqs.getFormHeader(); //Get header data
  const check_inq = await inqservice.getInquiry({ INQ_NO: header.INQ_NO }); //Check inq no is not dupplicate
  if (check_inq.length > 0) {
    await utils.showMessage(`Inquiry ${header.INQ_NO} is already exist!`);
    $("#inquiry-no").focus().select();
    return;
  }

  const details = table.rows().data().toArray();
  try {
    const checkdetail = await inqs.verifyDetail(table, details, false);
    header.INQ_STATUS = 1;
    const fomdata = { header, details };
    const inquiry = await inqservice.createInquiry(fomdata);
    window.location.href = `${process.env.APP_ENV}/mar/inquiry/edit/${inquiry.INQ_ID}`;
  } catch (error) {
    utils.errorMessage(error);
    return;
  }
});

//007: Save and send to design
$(document).on("click", "#send-de", async function (e) {
  e.preventDefault();
  const chkheader = await inqs.verifyHeader(".req-2");
  if (!chkheader) return;
  const header = await inqs.getFormHeader(); //Get header data
  const check_inq = await inqservice.getInquiry({ INQ_NO: header.INQ_NO }); //Check inq no is not dupplicate
  if (check_inq.length > 0) {
    await utils.showMessage(`Inquiry ${header.INQ_NO} is already exist!`);
    $("#inquiry-no").focus().select();
    return;
  }
  const details = table.rows().data().toArray();
  try {
    const checkdetail = await inqs.verifyDetail(table, details, 1);
    header.INQ_STATUS = 2;
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

//008: Save and send to AS400
$(document).on("click", "#send-bm", async function (e) {
  e.preventDefault();

  //Get header data
  //const header = await inqs.getFormHeader(); //Get header data
  //console.log(header);

  //   const details = table.rows().data().toArray(); //Get detail data
  //   const attachment = tableAttach.rows().data().toArray(); //Get attachment data
  //   const attachment_form = new FormData();
  //   attachment_form.append("INQ_NO", "TEST-10110"); // append field ก่อน
  //   const files = $("#attachment-file").prop("files"); // ดึง FileList
  //   for (let i = 0; i < files.length; i++) {
  //     attachment_form.append("files", files[i]); // append ทีละไฟล์
  //   }
  console.log(selectedFilesMap.size);
  //   selectedFilesMap.forEach((file, fileName) => {
  //     attachment_form.append("files", file, fileName);
  //   });
  //   await inqservice.createInquiryFile(attachment_form);
  //Check inq no is not blank and not dupplicate
  //Check table detail is not blank
  //Check seq no is not dupplicate
  //Check supplier is not blank
  //Check drawing format
  //Check variable format
});

$(document).on("click", "#add-attachment", async function (e) {
  e.preventDefault();
  $("#attachment-file").click();
});

$(document).on("change", "#attachment-file", async function (e) {
  const file = e.target.files;
  if (!file) {
    utils.showMessage("Please select a file to upload.");
    return;
  }

  for (let i = 0; i < file.length; i++) {
    const ext = utils.fileExtension(file[i].name);
    const allow = ["pdf", "jpg", "png", "docx", "xlsx", "txt"];
    if (allow.includes(ext)) {
      selectedFilesMap.set(file[i].name, file[i]);
      const fs = {
        FILE_ORIGINAL_NAME: file[i].name,
        FILE_SIZE: file[i].size,
        FILE_OWNER: file[i].type,
        FILE_DATE: new Date().toISOString(),
        FILE_CREATE_BY: "Chalormsak Sewanam",
      };
      tableAttach.row.add(fs).draw();
    } else {
      utils.showMessage(`${file[i].name} not allowed to upload.(${ext})`);
    }
  }
});

$(document).on("click", ".download-att-client", function (e) {
  e.preventDefault();
  const row = tableAttach.row($(this).closest("tr"));
  const data = row.data();
  const fileName = data.FILE_ORIGINAL_NAME;
  tb.downloadClientFile(selectedFilesMap, fileName);
});

$(document).on("click", ".delete-att-client", function (e) {
  e.preventDefault();
  const row = tableAttach.row($(this).closest("tr"));
  const data = row.data();
  const fileName = data.FILE_ORIGINAL_NAME;
  //   tb.deleteClientFile(selectedFilesMap, fileName);
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
