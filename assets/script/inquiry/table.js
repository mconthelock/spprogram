import moment from "moment";
import ExcelJS from "exceljs";
import { displayEmpInfo, fillImages } from "@public/setIndexDB";
import { statusColors } from "../inquiry/detail.js";
import * as service from "../service/inquiry.js";
import * as source from "./source.js";
import * as utils from "../utils.js";

//Start Table detail
export async function tableInquiry(data, options = {}) {
  const colors = await statusColors();
  const opt = utils.tableOpt;
  opt.data = data;
  opt.pageLength = 25;
  opt.order = [
    [0, "desc"],
    [1, "desc"],
  ];
  opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden"t><"flex mt-5 mb-3"<"table-info flex flex-col flex-1 gap-5"i><"table-page flex-none"p>>`;
  opt.columns = [
    { data: "timeline.MAR_SEND", className: "hidden" },
    {
      data: "INQ_DATE",
      className: "text-center text-nowrap sticky-column",
      title: "Inq. Date",
      render: function (data, type, row, meta) {
        return moment(data).format("YYYY-MM-DD");
      },
    },
    {
      data: "INQ_NO",
      className: "text-nowrap sticky-column",
      title: "No.",
    },
    {
      data: "INQ_REV",
      className: "text-nowrap text-center sticky-column",
      title: "Rev.",
    },
    {
      data: "INQ_TRADER",
      className: "text-nowrap",
      title: "Trader",
    },
    { data: "INQ_AGENT", title: "Agent" },
    { data: "INQ_COUNTRY", title: "Country" },
    {
      data: "status",
      title: "Status",
      render: (data) => {
        if (data == null) return "";
        const statusColor = colors.find((item) => item.id >= data.STATUS_ID);
        return `<span class="badge text-xs ${statusColor.color}">${data.STATUS_DESC}</span>`;
      },
    },
    {
      data: "maruser",
      title: "MAR. In-Charge",
      render: (data) => {
        if (data == null) return "";
        const dsp = utils.displayname(data.SNAME);
        return `${dsp.fname} ${dsp.lname.substring(0, 1)}. (${data.SEMPNO})`;
      },
    },
    {
      data: "inqgroup",
      title: "EME",
      className: "text-center px-[5px] w-[45px] max-w-[45px]",
      sortable: false,
      render: (data) => {
        const des = data.filter(
          (item) => item.INQG_GROUP === 1 && item.INQG_LATEST === 1
        );
        if (des.length == 0) return "";

        const color =
          des[0].INQG_STATUS == null
            ? "text-gray-500"
            : des[0].INQG_STATUS >= 9
            ? "text-primary"
            : "text-secondary";
        return `<i class="fi fi-rr-check-circle text-xl justify-center ${color}"></i>`;
      },
    },
    {
      data: "inqgroup",
      title: "EEL",
      className: "text-center px-[5px] w-[45px] max-w-[45px]",
      sortable: false,
      render: (data) => {
        const des = data.filter(
          (item) => item.INQG_GROUP === 2 && item.INQG_LATEST === 1
        );
        if (des.length == 0) return "";

        const color =
          des[0].INQG_STATUS == null
            ? "text-gray-500"
            : des[0].INQG_STATUS >= 9
            ? "text-primary"
            : "text-secondary";
        return `<i class="fi fi-rr-check-circle text-xl justify-center ${color}"></i>`;
      },
    },
    {
      data: "inqgroup",
      title: "EAP",
      className: "text-center px-[5px] w-[45px] max-w-[45px]",
      sortable: false,
      render: (data) => {
        const des = data.filter(
          (item) => item.INQG_GROUP === 3 && item.INQG_LATEST === 1
        );
        if (des.length == 0) return "";

        const color =
          des[0].INQG_STATUS == null
            ? "text-gray-500"
            : des[0].INQG_STATUS >= 9
            ? "text-primary"
            : "text-secondary";
        return `<i class="fi fi-rr-check-circle text-xl justify-center ${color}"></i>`;
      },
    },
    {
      data: "inqgroup",
      title: "ESO",
      className: "text-center px-[5px] w-[45px] max-w-[45px]",
      sortable: false,
      render: (data) => {
        const des = data.filter(
          (item) => item.INQG_GROUP === 6 && item.INQG_LATEST === 1
        );
        if (des.length == 0) return "";

        const color =
          des[0].INQG_STATUS == null
            ? "text-gray-500"
            : des[0].INQG_STATUS >= 9
            ? "text-primary"
            : "text-secondary";
        return `<i class="fi fi-rr-check-circle text-xl justify-center ${color}"></i>`;
      },
    },
    {
      data: "INQ_ID",
      className: "text-center w-fit max-w-[118px]",
      sortable: false,
      title: `<div class="flex justify-center"><i class="fi fi-rr-settings-sliders text-lg"></i></div>`,
      render: (data, type, row) => {
        const viewurl =
          row.INQ_TYPE == "SP"
            ? `${process.env.APP_ENV}/mar/inquiry/view/${data}`
            : `${process.env.APP_ENV}/mar/quotation/viewinq/${data}`;
        const view = `<a class="btn btn-xs btn-neutral btn-outline" href="${viewurl}">View</a>`;

        const edit = `<a class="btn btn-xs btn-neutral ${
          row.INQ_TYPE == "SP" ? "" : "btn-disabled"
        }" href="${process.env.APP_ENV}/mar/inquiry/edit/${data}">Edit</a>`;
        const deleteBtn = `<button class="btn btn-xs btn-ghost btn-circle text-red-500 hover:text-red-800 delete-inquiry" data-id="${data}" data-type="inquiry" onclick="confirm_box.showModal()"><i class="fi fi-br-trash text-2xl"></i></button>`;
        return `<div class="flex gap-1 justify-center items-center w-fit">${view}${edit}${deleteBtn}</div>`;
      },
    },
  ];

  opt.initComplete = function () {
    $(".table-option")
      .append(`<div class="dropdown dropdown-end dropdown-hover">
        <div tabindex="0" role="button" class="btn btn-outline btn-neutral m-1">New Inquiry</div>
        <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li><a href="${process.env.APP_ENV}/mar/inquiry/create/">SP Inquiry</a></li>
            <li><a href="${process.env.APP_ENV}/mar/stockpart/create">Stock Part</a></li>
        </ul>
        </div>`);

    const export1 = `<button class="btn btn-accent rounded-none text-white items-center hover:bg-accent/70" id="export-detail" type="button">
            <span class="loading loading-spinner hidden"></span>
            <span class="flex items-center"><i class="fi fi-tr-file-excel text-lg me-2"></i>Export Detail</span>
        </button>`;
    const export2 = `<button class="btn btn-neutral rounded-none text-white items-center hover:bg-neutral/70" id="export-list" type="button">
            <span class="loading loading-spinner hidden"></span>
            <span class="flex items-center"><i class="fi fi-tr-floor-layer text-lg me-2"></i>Export list</span>
        </button>`;
    const back = `<a href="#" class="btn btn-outline btn-neutral rounded-none text-neutral hover:text-white hover:bg-neutral/70 flex gap-3" id="back-report"><i class="fi fi-rr-arrow-circle-left text-xl"></i>Back</a>`;

    $(".table-info").append(`<div class="flex gap-2">
        ${export1}
        ${export2}
        ${options.backReportBtn !== undefined ? back : ""}
     </div>`);
  };
  return opt;
}

export function initRow(id, seq) {
  return {
    INQD_ID: "",
    INQD_SEQ: seq,
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
    INQD_OWNER_GROUP: $("#user-login").attr("groupcode"),
    CREATE_BY: $("#user-login").attr("empname"),
    UPDATE_BY: $("#user-login").attr("empname"),
  };
}

export async function addRow({ id, seq }, table, data = {}) {
  const newRow = await initRow(id, seq);
  data = { ...newRow, ...data };
  const row = table.row.add(data).draw();
  if ($(row.node()).find("td:eq(3) input").length > 0)
    $(row.node()).find("td:eq(3) input").focus();
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
  return table;
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
      render: (data) => {
        if (data % 1 !== 0) return utils.digits(data, 2);
        return data;
      },
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
      className: "text-center text-xs w-[30px] max-w-[30px] !p-0",
      title: "Rev.",
      render: (data, type) => {
        if (type === "display") {
          return `<a href="#" class="btn btn-xs btn-circle btn-ghost view-last-revision" data-value="${data}">${data}</a>`;
        }
        return data;
      },
    },
    {
      data: "INQH_DATE",
      className: "text-xs py-[8px] px-[5px] w-[200px] max-w-[225px]",
      title: "Date",
      render: (data, type, row) => {
        if (type === "display") {
          const emp = row.users;
          const dsp = utils.displayname(emp.SNAME);
          const name = `${dsp.fname} ${dsp.lname.substring(0, 1)}. (${
            emp.SEMPNO
          })`;
          return `
          <div class="flex gap-2">
            <div class="avatar">
                <div class="w-8 h-8 rounded-full">
                    <img src="" id="image-${emp.SEMPNO}" class="hidden" />
                </div>
            </div>
            <div class="flex flex-col">
                <a href="http://webflow/form/usrInfo.asp?uid=${
                  emp.SEMPNO
                }" target="_blank" class="text-nowrap font-bold">${name}</a>
                <div class="text-nowrap text-gray-500">${moment(data).format(
                  "YYYY-MM-DD HH:mm"
                )}</div>
            </div>
        </div>`;
        }
        return moment(data).format("YYYY-MM-DD HH:mm");
      },
    },
    {
      data: "status",
      title: "Action",
      className: "text-xs py-[8px] px-[5px] w-[130px] max-w-[130px]",
      render: (data) => (data == null ? "" : data.STATUS_ACTION),
    },
    {
      data: "INQH_REMARK",
      title: "Remark",
      className: "text-xs py-[8px] px-[5px]",
      render: function (data, type) {
        if (type === "display") {
          if (data == null) return "";
          return `<div class="flex">
            <div class="line-clamp-1">${data}</div>
            <div class="tooltip tooltip-left" data-tip="${data}"><i class="fi fi-rr-info text-lg"></i></div>
          </div>`;
        }
        return data;
      },
    },
  ];
  opt.createdRow = async function (row, data) {
    const emp = await displayEmpInfo(data.users.SEMPNO);
    const element = $(row).find(`#image-${data.users.SEMPNO}`);
    await fillImages(element, data.users.SEMPNO);
  };
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

export async function confirmDeleteInquiry(table) {
  const modal = $("#confirm_box");
  modal.find("button").prop("disabled", true);
  $(this).find(".loading").removeClass("hidden");

  if ($("#confirm_reason").val() == "") {
    $("#confirm_error").text(`Please enter reason.`);
    setTimeout(() => {
      $("#confirm_error").text(``);
    }, 3000);
    modal.find("button").prop("disabled", false);
    $(this).find(".loading").addClass("hidden");
    return;
  }

  // confirm_key;
  const res = await service.deleteInquiry({
    INQ_ID: $("#confirm_key").val(),
    INQ_MAR_PIC: $("#user-login").attr("empno"),
    INQ_MAR_REMARK: $("#confirm_reason").val(),
  });

  if (!res.status) {
    utils.foundError(res);
  } else {
    //   remove row from table
    table
      .row($(`button[data-id='${$("#confirm_key").val()}']`).parents("tr"))
      .remove()
      .draw();
  }

  $(this).find(".loading").addClass("hidden");
  $("#confirm_accept").removeClass("deleteinqs");
  $("#confirm_reason").val("");
  modal.find("button").prop("disabled", false);
  modal.find("#confirm_close").click();
}

//Universal Event
$(document).on("click", ".delete-inquiry", async function (e) {
  e.preventDefault();
  await utils.showConfirm(
    "deleteinqs",
    `<span class="text-red-500">Delete Inquiry</span>`,
    "Are you sure you want to delete this inquiry?",
    `<i class="icofont-exclamation-circle text-4xl text-red-500"></i>`,
    $(this).attr("data-id"),
    true
  );
});

$(document).on("click", "#export-detail", async function (e) {
  e.preventDefault();
  const data = [];
  const template = await service.getExportTemplate({
    name: `export_inquiry_list_template.xlsx`,
  });
  const file = template.buffer;
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(file).then(async (workbook) => {
    const sheet = workbook.worksheets[0];
    let row1 = 0;
    for (let i = 3; i <= 10; i++) {
      if (i > 4) {
        await utils.cloneRows(sheet, row1, i);
        row1 = i % 2 == 0 ? 4 : 3;
      }
      sheet.getCell(i, 2).value = `4542221`;
      sheet.getCell(i, 3).value = `xxxxxxxxx cccc`;
    }
    await workbook.xlsx.writeBuffer().then(function (buffer) {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `SP Inquiry List ${moment().format("YYYY-MM-DD")}.xlsx`;
      link.click();
    });
  });
});
