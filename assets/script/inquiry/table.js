import moment from "moment";
import { getMainProject } from "../service/mkt.js";
import * as utils from "../utils.js";

//Start Table detail
export async function setupTableDetail(data = []) {
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
      title: "<i class='icofont-settings text-lg'></i>",
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
      title: "No",
      className: "sticky-column !px-[3px] seqno",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="number" min="1" class="!w-[50px] cell-input edit-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_CAR",
      title: "CAR",
      className: "sticky-column !px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          //return `<input type="text" maxlength="2" class="!w-[55px] uppercase cell-input carno" value="${data}">`;
          return `<textarea class="!w-[55px] uppercase cell-input carno" maxlength="2">${data}</textarea>`;
        }
        return data;
      },
    },
    {
      data: "INQD_MFGORDER",
      title: "MFG No.",
      className: "sticky-column !px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          //return `<input type="text" maxlength="9" class="!w-[150px] uppercase cell-input mfgno elmes-input" value="${data}">`;
          return `<textarea class="!w-[150px] uppercase cell-input elmes-input mfgno" maxlength="9">${data}</textarea>`;
        }
        return data;
      },
    },
    {
      data: "INQD_ITEM",
      title: "Item",
      className: "!px-[3px] item-no",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="number" min="100" max="999" class="!w-[75px] cell-input elmes-input itemno" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_PARTNAME",
      title: "Part Name",
      className: "!px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          //return `<input type="text" class="!w-[200px] cell-input edit-input partname" value="${data}">`;
          return `<textarea class="!w-[250px] cell-input edit-input partname" maxlength="50">${data}</textarea>`;
        }
        return data;
      },
    },
    {
      data: "INQD_DRAWING",
      title: "Drawing No.",
      className: "!px-[3px] drawing-line",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          //return `<input type="text" class="!w-[225px] cell-input edit-input" value="${data}">`;
          return `<textarea class="!w-[225px] uppercase cell-input edit-input" maxlength="150">${data}</textarea>`;
        }
        return data;
      },
    },
    {
      data: "INQD_VARIABLE",
      title: "Variable",
      className: "!px-[3px]",
      sortable: false,
      render: function (data, type) {
        if (type === "display") {
          //return `<input type="text" class="!w-[200px] cell-input edit-input" value="${data}">`;
          return `<textarea class="!w-[200px] uppercase cell-input edit-input" maxlength="250">${data}</textarea>`;
        }
        return data;
      },
    },
    {
      data: "INQD_QTY",
      title: "Qty.",
      className: "!px-[3px]",
      sortable: false,
      render: function (data, type) {
        if (type === "display") {
          return `<input type="number" min="1" class="!w-[50px] cell-input edit-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_UM",
      title: "U/M",
      className: "!px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        data = data == "" ? "PC" : data;
        if (type === "display") {
          return `<input type="type" class="!w-[75px] uppercase cell-input edit-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_SUPPLIER",
      title: "Supplier",
      className: "!px-[3px] supplier-line",
      sortable: false,
      render: function (data, type, row) {
        if (type === "display") {
          return `<select class="!w-[100px] select select-sm supplier edit-input" ${
            row.INQD_UNREPLY !== "" ? "disabled" : ""
          }>
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
      title: `2<sup>nd</sup>`,
      className: "text-center",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="checkbox" class="checkbox checkbox-sm checkbox-primary text-black edit-input" value="1" ${
            data == 1 ? "checked" : ""
          } />`;
        }
        return data;
      },
    },
    {
      data: "INQD_UNREPLY",
      title: "U/N",
      className: "text-center",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="checkbox" class="checkbox checkbox-sm checkbox-error text-black unreply edit-input"
           ${data != "" ? "checked" : ""}/>`;
        }
        return data;
      },
    },
    {
      data: "INQD_MAR_REMARK",
      className: "remark-line",
      title: "Remark",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          //return `<input type="text" class="!w-[250px] cell-input remark edit-input" value="${data}">`;
          return `<textarea class="!w-[250px] cell-input edit-input remark" maxlength="250">${data}</textarea>`;
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

export function initRow(id) {
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

export async function addRow(id, table) {
  const newRow = await initRow(id);
  const row = table.row.add(newRow).draw();
  $(row.node()).find("td:eq(3) textarea").focus();
}

export async function changeCell(table, el) {
  const cell = table.cell($(el).closest("td"));
  let newValue = $(el).val();
  if ($(el).attr("type") === "date") newValue = newValue.replace(/-/g, "/");
  if ($(el).attr("type") === "number") newValue = utils.intVal(newValue);
  if ($(el).hasClass("uppercase")) newValue = newValue.toUpperCase();
  cell.data(newValue);
}

export async function changeCar(table, el) {
  const row = table.row($(el).closest("tr"));
  const data = row.data();
  const prjno = $("#project-no").val();
  if (prjno == "") {
    const newData = {
      ...data,
      INQD_CAR: $(el).val(),
    };
    row.data(newData);
    row.draw(false);
    $(row.node()).find(".mfgno").focus();
    return;
  }

  const carno = $(el).val();
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
  } else {
    const newData = {
      ...data,
      INQD_CAR: carno,
    };
    row.data(newData);
    row.draw(false);
    $(row.node()).find(".mfgno").addClass("bg-red-500");
  }
}
//End Table detail

export async function setupTableDetailView(data = []) {
  const opt = {};
  opt.data = data;
  opt.searching = false;
  opt.responsive = false;
  opt.pageLength = 20;
  opt.dom = `<"flex"<"table-search flex flex-1 gap-5"f><"flex items-center table-option">><"bg-white border border-slate-300 rounded-2xl overflow-hidden overflow-x-scroll"t><"flex mt-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
  opt.columns = [
    {
      data: "INQD_SEQ",
      title: "No",
      className: "sticky-column text-right",
    },
    {
      data: "INQD_CAR",
      title: "CAR",
      className: "sticky-column text-center",
    },
    {
      data: "INQD_MFGORDER",
      title: "MFG No.",
      className: "sticky-column",
    },
    {
      data: "INQD_ITEM",
      title: "Item",
      className: "sticky-column",
    },
    {
      data: "INQD_PARTNAME",
      title: "Part Name",
      className: "text-nowrap",
    },
    {
      data: "INQD_DRAWING",
      title: "Drawing No.",
      className: "text-nowrap min-w-[200px]",
    },
    {
      data: "INQD_VARIABLE",
      title: "Variable",
      className: "min-w-[250px]",
    },
    {
      data: "INQD_QTY",
      title: "Qty.",
      //   className: "!px-[3px]",
    },
    {
      data: "INQD_UM",
      title: "U/M",
      //   className: "!px-[3px]",
    },
    {
      data: "INQD_SUPPLIER",
      title: "Supplier",
      //   className: "!px-[3px]",
    },
    {
      data: "INQD_SENDPART",
      title: `2<sup>nd</sup>`,
      className: "text-center",
      sortable: false,
      render: function (data, type, row, meta) {
        return data == null
          ? ""
          : `<i class="icofont-check-circled text-2xl"></i>`;
      },
    },
    {
      data: "INQD_UNREPLY",
      title: "U/N",
      className: "text-center",
      sortable: false,
      render: function (data, type, row, meta) {
        return data == null
          ? ""
          : `<i class="icofont-check-circled text-2xl"></i>`;
      },
    },
    {
      data: "INQD_MAR_REMARK",
      title: "MAR Remark",
      className: "min-w-[250px]",
    },
    {
      data: "INQD_DES_REMARK",
      title: "DE Remark",
      className: "min-w-[250px]",
    },
  ];
  opt.initComplete = function (settings, json) {
    $("#table")
      .closest(".dt-container")
      .find(".table-search")
      .append(
        `<h1 class="bg-primary font-semibold text-white w-full px-5 mb-3 rounded-2xl">Detail</h1>`
      );
  };
  return opt;
}

export async function setupTableHistory(data = []) {
  const opt = {};
  opt.data = data;
  opt.pageLength = 5;
  opt.dom = `<"flex"<"table-search flex flex-1 gap-5 "><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden"t><"flex mt-5"<"table-page flex-1"p><"table-info flex flex-none gap-5"i>>`;
  opt.info = false;
  opt.lengthChange = false;
  opt.order = [1, "desc"];
  opt.columns = [
    {
      data: "INQ_REV",
      className: "text-center",
      title: "Rev.",
    },
    {
      data: "INQH_DATE",
      title: "Date",
      render: (data) => {
        return moment(data).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    { data: "users", title: "User", render: (data) => data.SNAME },
    { data: "status", title: "Action", render: (data) => data.STATUS_ACTION },
    { data: "INQH_REMARK", title: "Remark" },
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

export async function setupTableAttachment(data = []) {
  const icons = await utils.fileIcons();
  const opt = {};
  opt.data = data;
  opt.pageLength = 5;
  opt.dom = `<"flex gap-3"<"table-search flex flex-1 gap-5 "><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden"t><"flex mt-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
  opt.info = false;
  opt.columns = [
    {
      data: "FILE_ORIGINAL_NAME",
      title: "File Name",
      className: "text-xs py-[5px]",
      render: (data, type, row) => {
        const ext = utils.fileExtension(data);
        const icon = icons.find((x) => x.ext == ext);
        const img = icon
          ? icon.icon
          : `${process.env.APP_IMG}/fileicon/photo-gallery.png`;
        return `<a href="#" class="flex items-center gap-1 download-att-${
          row.FILE_NAME ? "server" : "client"
        }">
            <img src="${img}" class="w-6 h-6"/>
            <div class="line-clamp-1">${data}</div>
        </a>`;
      },
    },
    {
      data: "FILE_CREATE_BY",
      title: "Owner",
      className: "text-xs py-[5px]",
      render: (data) => {
        return `<div class="line-clamp-1">${data}</div>`;
      },
    },
    {
      data: "FILE_DATE",
      title: "File Date",
      className: "text-xs py-[5px]",
      render: (data) => {
        return `<div class="line-clamp-1">${moment(data).format(
          "YYYY-MM-DD HH:mm:ss"
        )}</div>`;
      },
    },
    {
      data: "FILE_ORIGINAL_NAME",
      title: `<i class="icofont-ui-delete text-lg"></i>`,
      className: "text-center px-1 py-[5px]",
      render: (data, type, row) => {
        return `<a href="#" class="btn btn-ghost btn-sm btn-circle delete-att-${
          row.FILE_NAME ? "server" : "client"
        }"><i class="icofont-ui-delete text-sm text-red-500"></i></a>`;
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
        <input type="file" id="attachment-file" multiple class="hidden" accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx,.txt, .csv" />
       `);

    $("#attachment")
      .closest(".dt-container")
      .find(".dt-length")
      .addClass("hidden");
  };
  return opt;
}

export async function downloadClientFile(selectedFiles, fileName) {
  const fileToDownload = selectedFiles.get(fileName);
  if (fileToDownload) {
    const fileUrl = URL.createObjectURL(fileToDownload);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileToDownload.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(fileUrl);
  } else {
    utils.showMessage(`File "${fileName}" not found for download.`);
  }
}

export async function downloadServerFile() {}

export async function elmesTable(data) {
  const opt = {};
  opt.dom = `<"flex mb-3"<"table-search flex flex-1 gap-5"><"flex items-center table-option"f>><"bg-white border border-slate-300 rounded-2xl"t><"flex mt-5"<"table-page flex-1"><"table-info flex  flex-none gap-5"p>>`;
  opt.data = data;
  opt.ordering = false;
  opt.columns = [
    { data: "orderno", title: "MFG No." },
    { data: "carno", title: "Car" },
    { data: "itemno", title: "Item" },
    { data: "partname", title: "Part Name" },
    { data: "drawing", title: "Drawing No." },
    { data: "variable", title: "Variable" },
    { data: "qty", title: "Qty" },
    {
      data: "supply",
      title: "Supply",
      render: (data) => {
        if (data == "R") return `LOCAL`;
        if (data == "J") return `MELINA`;
        if (data == "U") return ``;
        return `AMEC`;
      },
    },
    { data: "scndpart", title: `2<sup>nd</sup>` },
  ];
  opt.initComplete = function () {
    $("#tableElmes")
      .closest(".dt-container")
      .find(".table-search")
      .append(
        `<h1 class="font-semibold text-xl flex items-center">Part List</h1>`
      );
  };
  return opt;
}
