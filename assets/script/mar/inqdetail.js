import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/datatable.min.css";
import "datatables.net-select";

import { createTable, destroyTable } from "@public/_dataTable.js";
import { readInput } from "@public/_excel.js";
import formData from "../../files/formData.json";
import { validateDrawingNo } from "../drawing.js";
import { getMainProject } from "../service/mkt.js";
import { getElmesItem } from "../service/elmes.js";
import {
  createInquiry,
  createInquiryGroup,
  createInquiryDetail,
  getInquiryGroup,
} from "../service/inquiry.js";
import {
  showMessage,
  errorMessage,
  showLoader,
  intVal,
  digits,
  creatBtn,
} from "../utils.js";
import {
  createFormCard,
  createReasonModal,
  elmesComponent,
  elmesTable,
} from "../inquiry/detail.js";

var table;
var tableElmes;
$(document).ready(async () => {
  $(".mainmenu").find("details").attr("open", false);
  $(".mainmenu.navmenu-newinq").find("details").attr("open", true);

  const reason = await createReasonModal();
  const btn = await setupButton();
  const elmes = await elmesComponent();
  const cards = await setupCard();
  const tableContainer = await setupTable();
  table = await createTable(tableContainer);

  const history = await setupTableHistory();
  await createTable(history, { id: "#history" });

  const attachment = await setupTableAttachment();
  await createTable(attachment, { id: "#attachment" });
});

async function setupCard() {
  const form = $("#form-container");
  const carddata = form.attr("data");
  const cardIds = carddata.split("|");

  // Create an array to hold promises for card creation
  const cardPromises = cardIds.map(async (cardId) => {
    return new Promise(async (resolve) => {
      const cardData = formData.find((item) => item.id === cardId);
      if (cardData) {
        const cardElement = await createFormCard(cardData);
        resolve(cardElement);
      } else {
        console.error(`Card data for ID ${cardId} not found.`);
        resolve(null);
      }
    });
  });

  const cardElements = await Promise.all(cardPromises);
  cardElements.forEach((element) => {
    if (element) {
      form.append(element);
      if ($(element).find("#currency").length > 0) {
        $(element).find("#currency").closest(".grid").addClass("hidden");
      }
    }
  });
}

async function setupTable(data = []) {
  const opt = {};
  opt.data = data;
  opt.paging = false;
  opt.info = false;
  opt.orderFixed = [0, "asc"];
  opt.dom = `<"flex"<"table-search flex flex-1 gap-5 hidden "f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden overflow-x-scroll"t><"flex mt-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
  opt.columns = [
    {
      data: "id",
      title: "",
      className: "hidden",
    },
    {
      data: "INQD_ID",
      title: `<div class="text-center"><i class='icofont-settings text-lg text-white'></i></div>`,
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
      title: `<div class="text-center text-white">No</div>`,
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
      title: `<div class="text-center text-white">CAR</div>`,
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
      title: `<div class="text-center text-white">MFG No.</div>`,
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
      title: `<div class="text-center text-white">Item</div>`,
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
      title: `<div class="text-center text-white">Part Name</div>`,
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
      title: `<div class="text-center text-white">Drawing No.</div>`,
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
      title: `<div class="text-center text-white">Variable</div>`,
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
      title: `<div class="text-center text-white">Qty</div>`,
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
      title: `<div class="text-center text-white">U/M</div>`,
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
      title: `<div class="text-center text-white">Supplier</div>`,
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
      title: `<div class="text-center text-white">2<sup>nd</sup></div>`,
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
      title: `<div class="text-center text-white">U/N</div>`,
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
      title: `<div class="text-center text-white">Remark</div>`,
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
    $(".table-page").append(btn);
  };
  return opt;
}

async function initRow(id) {
  return {
    id: id,
    INQD_ID: "",
    INQD_SEQ: id,
    INQD_RUNNO: "",
    INQD_MFGORDER: "",
    INQD_ITEM: "",
    INQD_CAR: "",
    INQD_PARTNAME: "",
    INQD_DRAWING: "",
    INQD_VARIABLE: "",
    INQD_QTY: 1,
    INQD_UM: "PC",
    INQD_SUPPLIER: "",
    INQD_SENDPART: "",
    INQD_UNREPLY: "",
    INQD_FC_COST: "",
    INQD_TC_COST: "",
    INQD_UNIT_PRICE: "",
    INQD_FC_BASE: "",
    INQD_TC_BASE: "",
    INQD_MAR_REMARK: "",
    INQD_DES_REMARK: "",
    INQD_FIN_REMARK: "",
    INQD_LATEST: "",
    INQD_OWNER: "",
  };
}

async function setupButton() {
  const sendDE = await creatBtn({
    id: "send-de",
    title: "Send to Design",
    className: "btn-primary text-white",
  });

  const sendIS = await creatBtn({
    id: "send-bm",
    title: "Send to Pre-BM",
    icon: "icofont-console text-2xl",
    className: "btn-neutral text-white",
  });

  const draft = await creatBtn({
    id: "draft",
    title: "Send draft",
    icon: "icofont-attachment text-2xl",
    className: "btn-neutral text-white",
  });

  const back = await creatBtn({
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
  let id = lastRow === undefined ? 1 : intVal(lastRow.id) + 1;
  const newRow = await initRow(digits(id, 0));
  const row = table.row.add(newRow).draw();
  $(row.node()).find("td:eq(3) input").focus();
});

$(document).on("click", ".add-sub-line", async function (e) {
  e.preventDefault();
  const data = table.row($(this).parents("tr")).data();
  const id = digits(intVal(data.INQD_SEQ) + 0.01, 2);
  const newRow = await initRow(id);
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
    const setting = await elmesTable(elmes);
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
  let id = intVal(data.INQD_SEQ);
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
  const excelData = await readInput(file, {
    startRow: 2,
    endCol: 10,
    headerName: [
      "Inquiry No",
      "Seq. no",
      "Drawing No",
      "Part Name",
      "Qty",
      "Unit",
      "Variable",
      "Original MFG No",
      "Original Car No",
      "Item",
    ],
  });

  if (excelData.length > 0) {
    const prj = await getMainProject({ MFGNO: excelData[1][7] });
    if (prj.length > 0) {
      const projectNo = document.querySelector("#project-no");
      projectNo.value = prj[0].PRJ_NO;
      projectNo.dispatchEvent(new Event("change"));
    }

    const inqno = document.querySelector("#inquiry-no");
    inqno.value = excelData[1][0];
    inqno.dispatchEvent(new Event("change"));

    excelData.map(async (el) => {
      const init = await initRow(el[1]);
      const newRow = {
        ...init,
        INQD_CAR: el[8],
        INQD_MFGORDER: el[7],
        INQD_ITEM: el[9],
        INQD_PARTNAME: el[3],
        INQD_DRAWING: el[2],
        INQD_VARIABLE: el[6],
        INQD_QTY: el[4],
        INQD_UM: el[5],
        INQD_SUPPLIER: "AMEC",
        INQD_OWNER: "MAR",
      };
      const row = table.row.add(newRow).draw();
    });
  } else {
    await showMessage(`Can't read data content, Please try again.`);
    $(this).val(null);
  }
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
  opt.dom = '<"history-title"lfrtip>';
  opt.data = data;
  opt.info = false;
  opt.searching = false;
  opt.lengthChange = false;
  opt.columns = [
    { data: "INQH_DATE", title: "Date" },
    { data: "INQH_NAME", title: "User" },
    { data: "INQ_STATUS", title: "Action" },
  ];
  opt.initComplete = function (settings, json) {
    $(".history-title").append(`dddd`);
  };
  return opt;
}

async function setupTableAttachment(data = []) {
  const opt = {};
  opt.data = data;
  opt.info = false;
  opt.searching = false;
  opt.lengthChange = false;
  opt.columns = [
    { data: "INQH_DATE", title: "File Name" },
    { data: "INQH_NAME", title: "Owner" },
    { data: "INQ_STATUS", title: "File Date" },
  ];
  return opt;
}
