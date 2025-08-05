import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/datatable.min.css";

import { createTable, destroyTable } from "@public/_dataTable.js";
import { validateDrawingNo } from "../drawing.js";
import { getMainProject } from "../service/mkt.js";
import { createInquiry } from "../service/inquiry.js";
import * as utils from "../utils.js";
import * as inqs from "../inquiry/detail.js";
import * as tb from "../inquiry/table.js";

var table;
var tableElmes;
var tableAttach;
$(document).ready(async () => {
  $(".mainmenu").find("details").attr("open", false);
  $(".mainmenu.navmenu-newinq").find("details").attr("open", true);

  const reason = await inqs.createReasonModal();
  const btn = await setupButton();
  const elmes = await inqs.elmesComponent();
  const cards = await inqs.setupCard();
  const tableContainer = await tb.setupTableDetail();
  table = await createTable(tableContainer);

  const history = await tb.setupTableHistory();
  await createTable(history, { id: "#history" });

  const attachment = await tb.setupTableAttachment();
  tableAttach = await createTable(attachment, { id: "#attachment" });
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
  let id = lastRow === undefined ? 1 : utils.intVal(lastRow.id) + 1;
  const newRow = await inqs.initRow(utils.digits(id, 0));
  const row = table.row.add(newRow).draw();
  $(row.node()).find("td:eq(3) input").focus();
});

$(document).on("click", ".add-sub-line", async function (e) {
  e.preventDefault();
  const data = table.row($(this).parents("tr")).data();
  const id = utils.digits(utils.intVal(data.INQD_SEQ) + 0.01, 2);
  const newRow = await inqs.initRow(id);
  const row = table.row.add(newRow).draw();
  $(row.node()).find("td:eq(3) input").focus();
});

$(document).on("change", ".edit-input", function () {
  const cell = table.cell($(this).closest("td"));
  let newValue = $(this).val();
  if ($(this).attr("type") === "date") {
    newValue = newValue.replace(/-/g, "/");
  }
  cell.data(newValue);
});

$(document).on("change", ".carno", async function (e) {
  e.preventDefault();
  const row = table.row($(this).closest("tr"));
  const data = row.data();
  const prjno = $("#project-no").val();
  if (prjno == "") return;

  const carno = $(this).val();
  const orders = await getMainProject({
    PRJ_NO: prjno,
    CAR_NO: carno,
  });

  if (orders.length > 0) {
    const newData = {
      ...data,
      INQD_CAR: carno,
      INQD_MFGORDER: orders[0].MFGNO,
    };
    row.data(newData);
    row.draw(false);
    $(row.node()).find(".itemno").focus();
  }
});

//Elmes Table
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
  await destroyTable("#tableElmes");
  const inx = $("#elmes-target").val();
  $("#tableElmes").html("");
  $("#elmes-target").val("");
  $("#showElmes").click();
  const row = $(table.row(inx).node()).find(".partname").focus();
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

//Import TSV File
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
$(document).on("click", "#send-de", async function (e) {
  e.preventDefault();
  const obj = $("#form-container").find("input, select, textarea");
  const header = {};
  obj.map((i, el) => {
    if ($(el).attr("name") === "INQ_PKC_REQ") {
      header.INQ_PKC_REQ = $('input[name="INQ_PKC_REQ"]:checked').val();
    } else if ($(el).attr("name") === "INQ_AGENT") {
      header.INQ_AGENT = $(el).val().split("(")[0].trim();
    } else {
      header[$(el).attr("name")] = $(el).val();
    }
  });

  const details = table.rows().data().toArray();
  const fomdata = { header, details };
  const inquiry = await createInquiry(fomdata);
});

$(document).on("click", "#send-bm", async function (e) {
  e.preventDefault();
});

$(document).on("click", "#draft", async function (e) {
  e.preventDefault();
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

  console.log(fileExtension);

  const fs = {
    FILE_ORIGINAL_NAME: file.name,
    FILE_SIZE: file.size,
    FILE_OWNER: file.type,
    FILE_DATE: new Date().toISOString(),
    file: e.target.files[0],
  };
  tableAttach.row.add(fs).draw();
});
