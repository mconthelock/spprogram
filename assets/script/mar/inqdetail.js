import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/datatable.min.css";
import "datatables.net-select";

import { createTable, destroyTable } from "@public/_dataTable.js";
import { validateDrawingNo } from "../drawing.js";
import { getElmesItem } from "../service/elmes.js";
import { getMainProject } from "../service/mkt.js";
import {
  createInquiry,
  createInquiryGroup,
  createInquiryDetail,
  getInquiryGroup,
} from "../service/inquiry.js";
import * as utils from "../utils.js";
import * as inqs from "../inquiry/detail.js";

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
  const tableContainer = await setupTable();
  table = await createTable(tableContainer);

  const history = await setupTableHistory();
  await createTable(history, { id: "#history" });

  const attachment = await setupTableAttachment();
  tableAttach = await createTable(attachment, { id: "#attachment" });
});

async function setupTable(data = []) {
  const opt = {};
  opt.data = data;
  opt.paging = false;
  opt.searching = false;
  opt.info = false;
  opt.orderFixed = [0, "asc"];
  opt.dom = `<"flex"<"table-search flex flex-1 gap-5 "f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden overflow-x-scroll"t><"flex mt-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
  opt.columns = [
    {
      data: "id",
      title: "",
      className: "hidden",
    },
    {
      data: "INQD_ID",
      title: "<i class='icofont-settings text-lg'></i>", //`<div class="text-center"><i class='icofont-settings text-lg text-white'></i></div>`,
      className: "text-center text-nowrap sticky-column px-1",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<div class="btn btn-sm btn-circle btn-ghost add-sub-line" type="button"><i class="icofont-plus"></i></div>
          <button class="btn btn-sm btn-circle btn-ghost"><i class="icofont-error text-error text-lg"></i></button>`;
        }
        return data;
      },
    },
    {
      data: "INQD_SEQ",
      title: "No", //`<div class="text-center text-white">No</div>`,
      className: "sticky-column !px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[50px] cell-input edit-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_CAR",
      //title: `<div class="text-center text-white">CAR</div>`,
      title: "CAR",
      className: "sticky-column !px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[55px] cell-input carno" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_MFGORDER",
      //   title: `<div class="text-center text-white">MFG No.</div>`,
      title: "MFG No.",
      className: "sticky-column !px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[150px] cell-input mfgno elmes-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_ITEM",
      //   title: `<div class="text-center text-white">Item</div>`,
      title: "Item",
      className: "!px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[75px] cell-input itemno elmes-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_PARTNAME",
      //   title: `<div class="text-center text-white">Part Name</div>`,
      title: "Part Name",
      className: "!px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[200px] cell-input edit-input partname" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_DRAWING",
      //   title: `<div class="text-center text-white">Drawing No.</div>`,
      title: "Drawing No.",
      className: "!px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[225px] cell-input edit-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_VARIABLE",
      //   title: `<div class="text-center text-white">Variable</div>`,
      title: "Variable",
      className: "!px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[200px] cell-input edit-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_QTY",
      //   title: `<div class="text-center text-white">Qty</div>`,
      title: "Qty.",
      className: "!px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="number" min="1" class="!w-[50px] cell-input edit-input" value="${
            data == "" ? 1 : data
          }">`;
        }
        return data;
      },
    },
    {
      data: "INQD_UM",
      //   title: `<div class="text-center text-white">U/M</div>`,
      title: "U/M",
      className: "!px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="type" class="!w-[75px] cell-input edit-input" value="${
            data == "" ? "PC" : data
          }">`;
        }
        return data;
      },
    },
    {
      data: "INQD_SUPPLIER",
      //   title: `<div class="text-center text-white">Supplier</div>`,
      title: "Supplier",
      className: "!px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<select class="!w-[100px] select select-sm supplier edit-input">
            <option value=""></option>
            <option value="AMEC" ${
              data == "AMEC" ? "selected" : ""
            }>AMEC</option>
            <option value="MELINA" ${
              data == "MELINA" ? "selected" : ""
            }>MELINA</option>
            <option value="LOCAL" ${
              data == "LOCAL" ? "selected" : ""
            }>LOCAL</option>
          </select>`;
        }
        return data;
      },
    },
    {
      data: "INQD_SENDPART",
      //   title: `<div class="text-center text-white">2<sup>nd</sup></div>`,
      title: `2<sup>nd</sup>`,
      className: "text-center",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="checkbox" class="checkbox checkbox-sm checkbox-primary text-black" />`;
        }
        return data;
      },
    },
    {
      data: "INQD_UNREPLY",
      //   title: `<div class="text-center text-white">U/N</div>`,
      title: "U/N",
      className: "text-center",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="checkbox" class="checkbox checkbox-sm checkbox-error text-black unreply"
           ${data != "" ? "checked" : ""}/>`;
        }
        return data;
      },
    },
    {
      data: "INQD_MAR_REMARK",
      //   title: `<div class="text-center text-white">Remark</div>`,
      title: "Remark",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[250px] cell-input remark edit-input" value="${data}">`;
        }
        return data;
      },
    },
  ];
  opt.initComplete = function (settings, json) {
    const btn = `<div class="flex gap-2">
      <div class="tooltip" data-tip="Add line">
        <button id="addRowBtn" class="btn btn-primary btn-sm btn-square" type="button"><i class="icofont-plus text-xl text-white"></i></button>
      </div>
      <div class="tooltip" data-tip="Upload inquiry">
        <button id="uploadRowBtn" class="btn btn-neutral btn-sm btn-square"><i class="icofont-upload-alt text-xl text-white"></i></button>
        <input type="file" id="import-tsv" class="hidden" />
      </div>
      <div class="tooltip" data-tip="Download template">
        <button id="downloadTemplateBtn" class="btn btn-neutral btn-sm btn-square"><i class="icofont-download text-xl text-white"></i></button>
      </div>
    </div>`;
    $("#table").closest(".dt-container").find(".table-page").append(btn);
    $("#table")
      .closest(".dt-container")
      .find(".table-search")
      .append(
        `<h1 class="bg-primary font-semibold text-white w-full px-5 mb-3 rounded-2xl">Detail</h1>`
      );
  };
  return opt;
}

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
  const data = row.data();
  const mfgno = $(row.node()).find(".mfgno").val();
  const item = $(row.node()).find(".itemno").val();
  const elmes = await getElmesItem(mfgno, item);
  if (elmes.length > 0) {
    const setting = await inqs.elmesTable(elmes);
    tableElmes = await createTable(setting, {
      id: "#tableElmes",
      columnSelect: { status: true },
    });
    $("#elmes-target").val(row.index());
    $("#showElmes").click();
  } else {
    const newData = {
      ...data,
      INQD_MFGORDER: mfgno,
      INQD_ITEM: item,
    };
    row.data(newData);
    row.draw(false);
  }
});

$(document).on("click", "#elmes-confirm", async function () {
  const increse = 1;
  const elmesData = tableElmes.rows().data();
  const rowid = $("#elmes-target").val();
  const data = table.row(rowid).data();
  //Delete current row first
  table.rows(rowid).remove().draw();
  //Insert rows
  let i = 0;
  let id = utils.intVal(data.INQD_SEQ);
  elmesData.map((val) => {
    const newRow = {
      ...data,
      id: id + i,
      INQD_SEQ: id + i,
      INQD_CAR: val.carno,
      INQD_MFGORDER: val.orderno,
      INQD_ITEM: val.itemno,
      INQD_PARTNAME: val.partname,
      INQD_DRAWING: val.drawing,
      INQD_VARIABLE: val.variable,
      INQD_QTY: val.qty,
      INQD_SUPPLIER: val.supply,
      INQD_SENDPART: val.scndpart,
    };
    table.row.add(newRow).draw(false);
    i++;
  });

  await destroyTable("#tableElmes");
  $("#tableElmes").html("");
  $("#elmes-target").val("");
  $("#showElmes").click();
});

$(document).on("click", "#elmes-cancel", async function () {
  await destroyTable("#tableElmes");
  const inx = $("#elmes-target").val();
  $("#tableElmes").html("");
  $("#elmes-target").val("");
  $("#showElmes").click();
  const row = $(table.row(inx).node()).find(".partname").focus();
});

//Unable to reply checkbox
$(document).on("click", ".unreply", async function () {
  const row = table.rows($(this).parents("tr"));
  const data = row.data();
  if (data.INQD_UNREPLY != "") {
    $(`#reason-${data.INQD_UNREPLY}`).prop("checked", true);
    if (data.INQD_UNREPLY == 99)
      $("#text-comment-other").val(data.INQD_MAR_REMARK);
  } else {
    $(`.reason-code:first`).prop("checked", true);
  }
  $("#reason-target").val(row.index());
  $("#modal-reason").click();
});

$(document).on("click", "#cancel-reason", async function () {
  const target = $("#reason-target").val();
  $(table.row(target).node()).find(".unreply").prop("checked", false);
  $(table.row(target).node()).find(".remark").val("");
  $("#text-comment-other").val(``);
  $("#text-count").html("0");
  $("#modal-reason").prop("checked", false);
});

$(document).on("click", "#save-reason", async function () {
  const target = $("#reason-target").val();
  const row = table.row(target);
  const selected = $(".reason-code:checked");
  const remark = selected.closest("li").find(".text-comment").val();
  if (remark == "" || selected.val() == undefined) {
    $(".text-comment").addClass("border-red-500");
    $(".text-comment-err").html(
      `Please explain reason, Why you can't reply this line.`
    );
    return;
  }

  $(table.row(target).node()).find(".unreply").prop("checked", true);
  $(table.row(target).node()).find(".unreply").val(selected.val());
  $(table.row(target).node()).find(".remark").val(remark);
  $("#reason-target").val(selected.val());

  const data = row.data();
  const newData = {
    ...data,
    INQD_UNREPLY: selected.val(),
    INQD_MAR_REMARK: remark,
  };

  table.row(target).data(newData);
  $("#text-comment-other").val(``);
  $("#text-count").html("0");
  $("#modal-reason").prop("checked", false);
});

$(document).on("keyup", ".text-comment", async function () {
  $(this).removeClass("border-red-500");
  $(this).closest("li").find(".text-comment-err").html("");
  $("#text-count").removeClass("text-red-500");
  const txt = $(this).val();
  let cnt = $(this).val().length;
  if (cnt > 100) {
    $("#text-count").addClass("text-red-500");
    $(this).val(txt.substring(0, 100));
    $(this).addClass("border-red-500");
    $(this)
      .closest("li")
      .find(".text-comment-err")
      .html(`Maximun is 100 charactors.`);
    return;
  }
  $("#text-count").html(cnt);
});

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
  const inquiry = await createInquiry(header);
  const details = table.rows().data().toArray();
  const items = details.map((el) => Math.floor(el.INQD_ITEM / 100));
  const groups = [...new Set(items)];
  groups.map(async (group) => {
    const grp = {
      INQ_ID: inquiry.INQ_ID,
      INQG_GROUP: group,
    };
    const res = await createInquiryGroup(grp);
  });

  const inquiry_group = await getInquiryGroup({ INQ_ID: inquiry.INQ_ID });
  details.map(async (el, i) => {
    const grp = Math.floor(el.INQD_ITEM / 100);
    const grpid = inquiry_group.find((g) => g.INQG_GROUP === grp);
    const data = { ...el, INQG_GROUP: grpid.INQG_ID, INQD_RUNNO: i + 1 };
    const response = await createInquiryDetail(data);
  });
});

$(document).on("click", "#send-bm", async function (e) {
  e.preventDefault();
});

$(document).on("click", "#draft", async function (e) {
  e.preventDefault();
});

async function setupTableHistory(data = []) {
  const opt = {};
  opt.data = data;
  opt.dom = `<"flex"<"table-search flex flex-1 gap-5 "><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden"t><"flex mt-5"<"table-page flex-1"p><"table-info flex flex-none gap-5"i>>`;
  opt.info = false;
  opt.lengthChange = false;
  opt.columns = [
    { data: "INQH_DATE", title: "Date" },
    { data: "INQH_NAME", title: "User" },
    { data: "INQ_STATUS", title: "Action" },
  ];
  opt.initComplete = function (settings, json) {
    $("#history")
      .closest(".dt-container")
      .find(".table-search")
      .append(
        `<h1 class="bg-primary font-semibold text-white w-full px-5 mb-3 rounded-2xl">History</h1>`
      );
  };
  return opt;
}

async function setupTableAttachment(data = []) {
  const opt = {};
  opt.data = data;
  opt.dom = `<"flex gap-3"<"table-search flex flex-1 gap-5 "><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden"t><"flex mt-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
  opt.info = false;
  opt.columns = [
    { data: "FILE_ORIGINAL_NAME", title: "File Name" },
    { data: "FILE_SIZE", title: "Owner" },
    {
      data: "FILE_DATE",
      title: "File Date",
      render: (data) => {
        return new Date(data).toLocaleDateString("en-US", {});
      },
    },
  ];
  opt.initComplete = function (settings, json) {
    $("#attachment")
      .closest(".dt-container")
      .find(".table-search")
      .append(
        `<h1 class="bg-primary font-semibold text-white w-full px-5 mb-3 rounded-2xl">Attachment</h1>`
      );

    $("#attachment").closest(".dt-container").find(".table-option")
      .append(`<button class="btn btn-outline btn-neutral btn-sm btn-circle text-neutral hover:!text-white" id="add-attachment">
            <span class="loading loading-spinner hidden"></span>
            <span class="icofont-ui-clip text-xl"></span>
        </button>
        <input type="file" id="attachment-file" class="hidden" accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx,.txt" />`);

    $("#attachment")
      .closest(".dt-container")
      .find(".dt-length")
      .addClass("hidden");
  };
  return opt;
}

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
