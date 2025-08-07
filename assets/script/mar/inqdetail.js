import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/datatable.min.css";

import { createTable, destroyTable } from "@public/_dataTable.js";
import { validateDrawingNo } from "../drawing.js";
import * as inqservice from "../service/inquiry.js";
import * as utils from "../utils.js";
import * as inqs from "../inquiry/detail.js";
import * as tb from "../inquiry/table.js";

var table;
var tableElmes;
var tableAttach;
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
    window.location.href = `${process.env.APP_ENV}/authen/error/`;
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

//Elmes Table
$(document).on("change", ".elmes-input", async function (e) {
  e.preventDefault();
  const row = table.row($(this).closest("tr"));
  tableElmes = await inqs.elmesSetup(row);
  await tb.changeCell(table, this);
});

$(document).on("click", "#elmes-confirm", async function () {
  const increse = 1;
  const elmesData = tableElmes.rows().data();
  await inqs.elmesConform(elmesData, increse, table);
});

$(document).on("click", "#elmes-cancel", async function () {
  await inqs.elmesCancel(table);
});

// START: Unable to reply checkbox
$(document).on("click", ".unreply", async function () {
  await inqs.clickUnreply(table.row($(this).parents("tr")));
});

$(document).on("click", "#cancel-reason", async function () {
  await inqs.resetUnreply(table.rows().nodes());
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

//Start :Import date from File
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
    const checkdetail = await inqs.verifyDetail(table, details, true);
    header.INQ_STATUS = 1;
    const fomdata = { header, details };
    const inquiry = await inqservice.createInquiry(fomdata);
    window.location.href = `${process.env.APP_ENV}/mar/inquiry/view/${inquiry.INQ_ID}`;
  } catch (error) {
    utils.errorMessage(error);
    return;
  }
});

$(document).on("click", "#send-bm", async function (e) {
  e.preventDefault();
  //Get header data
  const header = await inqs.getFormHeader(); //Get header data
  console.log(header);

  //Get detail data
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
  const file = e.target.files[0];
  if (!file) {
    utils.showMessage("Please select a file to upload.");
    return;
  }

  const fileName = file.name;
  let fileExtension = "";
  const dotIndex = fileName.lastIndexOf(".");
  if (dotIndex !== -1 && dotIndex < fileName.length - 1) {
    fileExtension = fileName.substring(dotIndex + 1);
  } else {
    utils.showMessage("File has no extension or the name is invalid.");
    return;
  }

  const fs = {
    FILE_ORIGINAL_NAME: file.name,
    FILE_SIZE: file.size,
    FILE_OWNER: file.type,
    FILE_DATE: new Date().toISOString(),
    file: e.target.files[0],
  };
  tableAttach.row.add(fs).draw();
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
