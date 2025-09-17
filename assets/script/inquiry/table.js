import moment from "moment";
import { getMainProject } from "../service/mkt.js";
import * as source from "./source.js";
import * as utils from "../utils.js";

//Start Table detail
export function initRow(id) {
  return {
    INQD_ID: "",
    INQD_SEQ: id,
    INQD_RUNNO: id,
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
    INQD_LATEST: 1,
    INQD_OWNER: $("#user-login").attr("groupcode"),
    CREATE_BY: $("#user-login").attr("empname"),
    UPDATE_BY: $("#user-login").attr("empname"),
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
  if ($(el).attr("type") === "checkbox" && !$(el).is(":checked"))
    newValue = null;
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
  const orders = await source.projectConclude({ prjno, carno });
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
    $(row.node()).find(".mfgno").focus();
  }
}
//End Table detail

export async function setupTableDetailView(data = []) {
  const opt = { ...utils.tableOpt };
  opt.data = data;
  opt.searching = false;
  opt.responsive = false;
  opt.pageLength = 20;
  opt.dom = `<"flex"<"table-search flex flex-1 gap-5"f><"flex items-center table-option">><"bg-white border border-slate-300 rounded-2xl overflow-hidden overflow-x-scroll"t><"flex mt-3"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
  opt.columns = [
    {
      data: "INQD_SEQ",
      title: "No",
      className: "sticky-column",
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
      className: "text-nowrap min-w-[200px] !text-left",
    },
    {
      data: "INQD_DRAWING",
      title: "Drawing No.",
      className: "text-nowrap min-w-[200px] !text-left",
    },
    {
      data: "INQD_VARIABLE",
      title: "Variable",
      className: "min-w-[250px] !text-left",
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
      className: "min-w-[250px] !text-left",
    },
    {
      data: "INQD_DES_REMARK",
      title: "DE Remark",
      className: "min-w-[250px] !text-left",
    },
  ];
  return opt;
}

export async function setupTableHistory(data = []) {
  const opt = { ...utils.tableOpt };
  opt.data = data;
  opt.pageLength = 5;
  opt.paging = true;
  opt.dom = `<"flex gap-3"<"table-search flex flex-1 gap-5 "><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden"t><"flex mt-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
  opt.info = false;
  opt.lengthChange = false;
  opt.order = [1, "desc"];
  opt.columns = [
    {
      data: "INQ_REV",
      className: "text-center text-xs py-[8px] px-[5px]",
      title: "Rev.",
    },
    {
      data: "INQH_DATE",
      className: "text-xs py-[8px] w-[155px] max-w-[155px]",
      title: "Date",
      render: (data) => {
        return moment(data).format("YYYY-MM-DD HH:mm");
      },
    },
    {
      data: "users",
      title: "User",
      className: "text-xs py-[8px]",
      render: (data) => {
        if (data == null) return "";
        const dsp = utils.displayname(data.SNAME);
        return `${dsp.fname} ${dsp.lname.substring(0, 1)}. (${data.SEMPNO})`;
      },
    },
    {
      data: "status",
      title: "Action",
      className: "text-xs py-[8px]",
      render: (data) => (data == null ? "" : data.STATUS_ACTION),
    },
    { data: "INQH_REMARK", title: "Remark", className: "text-xs py-[8px]" },
  ];
  return opt;
}

export async function setupTableAttachment(data = [], view = false) {
  const icons = await utils.fileIcons();
  const opt = { ...utils.tableOpt };
  opt.data = data;
  opt.pageLength = 5;
  opt.paging = true;
  opt.dom = `<"flex gap-3"<"table-search flex flex-1 gap-5 "><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden"t><"flex mt-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
  opt.info = false;
  opt.lengthChange = false;
  opt.order = [2, "desc"];
  opt.columns = [
    {
      data: "FILE_ORIGINAL_NAME",
      title: "File Name",
      className: "text-xs py-[5px] max-w-[220px]",
      render: (data, type, row) => {
        const ext = utils.fileExtension(data);
        const icon = icons.find((x) => x.ext == ext);
        const img = icon
          ? icon.icon
          : `${process.env.APP_IMG}/fileicon/photo-gallery.png`;

        const link =
          row.FILE_ID == undefined
            ? "#"
            : `${process.env.APP_API}/sp/attachments/download/${row.FILE_ID}`;
        return `<a href="${link}" class="flex items-center gap-1 download-att-${
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
      className: "text-xs py-[8px]",
      render: (data) => {
        return `<div class="line-clamp-1">${data}</div>`;
      },
    },
    {
      data: "FILE_CREATE_AT",
      title: "File Date",
      className: "text-xs py-[8px]",
      render: (data) => {
        return `<div class="line-clamp-1">${moment(data).format(
          "YYYY-MM-DD HH:mm:ss"
        )}</div>`;
      },
    },
    {
      data: "FILE_ORIGINAL_NAME",
      title: `<i class="icofont-ui-delete text-lg"></i>`,
      className: `text-center px-1 py-[8px] ${view ? "hidden" : ""}`,
      render: (data, type, row) => {
        return `<a href="#" class="btn btn-ghost btn-sm btn-circle delete-att">
            <i class="icofont-ui-delete text-sm text-red-500"></i>
        </a>`;
      },
    },
  ];
  opt.initComplete = function (settings, json) {
    $("#attachment")
      .closest(".dt-container")
      .find(".table-option")
      .append(
        `<input type="file" id="attachment-file" multiple class="hidden" accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx,.txt, .csv" />`
      );
  };
  //   opt.drawCallback = function (settings) {
  //     var api = this.api();
  //     var totalRecords = api.rows().count();
  //     var displayLength = settings._iDisplayLength;
  //     if (totalRecords <= displayLength)
  //       $("#attachment_wrapper").find(".table-page").addClass("hidden");
  //   };
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
