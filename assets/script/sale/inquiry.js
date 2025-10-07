import "@styles/select2.min.css";
import "@styles/datatable.min.css";
import moment from "moment";
import ExcelJS from "exceljs";
import { createTable } from "@public/_dataTable.js";
import { showbgLoader } from "@public/preloader";
import { statusColors } from "../inquiry/detail.js";
import * as service from "../service/inquiry.js";
import * as utils from "../utils.js";
var table;

$(document).ready(async () => {
  try {
    await utils.initApp({ submenu: ".navmenu-newinq" });
    const usergroup = $("#user-login").attr("groupcode");
    let data = await service.getInquiry({
      GE_INQ_STATUS: 2,
      LE_INQ_STATUS: 10,
    });
    if (usergroup == "SEG") {
      data = data.filter((item) => item.INQ_STATUS < 10);
    } else {
      data = data.filter((item) => item.INQ_STATUS == 10);
    }
    const opt = await tableOpt(data);
    table = await createTable(opt);
  } catch (error) {
    console.log(error);
    await utils.errorMessage(error);
  } finally {
    await utils.showLoader({ show: false });
  }
});

async function tableOpt(data) {
  const usergroup = $("#user-login").attr("groupcode");
  const colors = await statusColors();
  const opt = utils.tableOpt;
  opt.data = data;
  opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden"t><"flex mt-5 mb-12"<"table-info flex flex-col flex-1 gap-5"i><"table-page flex-none"p>>`;
  opt.columns = [
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
        const des = data.filter((item) => item.INQG_GROUP === 1);
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
        const des = data.filter((item) => item.INQG_GROUP === 2);
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
        const des = data.filter((item) => item.INQG_GROUP === 3);
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
        const des = data.filter((item) => item.INQG_GROUP === 6);
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
      className: "text-center w-fit max-w-[80px]",
      sortable: false,
      title: `<i class='icofont-settings text-lg text-white'></i>`,
      render: (data, type, row, meta) => {
        if (usergroup == "SEG")
          return `<div class="flex gap-1 justify-center items-center w-fit"><a class="btn btn-sm btn-neutral btn-process" href="${process.env.APP_ENV}/se/inquiry/edit/${data}">Process</a></div>`;

        return `<div class="flex gap-1 justify-center items-center w-fit"><a class="btn btn-sm btn-neutral btn-detail" href="${process.env.APP_ENV}/se/inquiry/detail/${data}">Process</a></div>`;
      },
    },
  ];
  opt.initComplete = function () {
    const export1 = `<button class="btn btn-accent rounded-none text-white items-center hover:bg-accent/70" id="sale-export-detail" type="button">
            <span class="loading loading-spinner hidden"></span>
            <span class="flex items-center"><i class="fi fi-tr-file-excel text-lg me-2"></i>Export Detail</span>
        </button>`;
    const export2 = `<button class="btn btn-neutral rounded-none text-white items-center hover:bg-neutral/70" id="export-list" type="button">
            <span class="loading loading-spinner hidden"></span>
            <span class="flex items-center"><i class="fi fi-tr-floor-layer text-lg me-2"></i>Export list</span>
        </button>`;

    $(".table-info").append(`<div class="flex gap-2">
        ${export1}

     </div>`);
  };
  return opt;
}

$(document).on("click", ".btn-process", async function (e) {
  e.preventDefault();
  const row = table.row($(this).closest("tr")).data();
  const timeline = row.timeline;
  if (timeline.SG_READ == null) {
    const data = {
      INQ_NO: row.INQ_NO,
      INQ_REV: row.INQ_REV,
      //SG_USER: $("#user-login").attr("empno"),
      SG_READ: new Date(),
    };
    await service.updateInquiryTimeline(data);
  }
  const url = $(this).attr("href");
  await showbgLoader(true);
  window.location.href = url;
});

$(document).on("click", "#sale-export-detail", async function (e) {
  e.preventDefault();
  const usergroup = $("#user-login").attr("groupcode");
  let data = await service.getInquiryReport({
    GE_INQ_STATUS: 2,
    LE_INQ_STATUS: 10,
  });
  if (usergroup == "SEG") {
    data = data.filter((item) => item.INQ_STATUS < 10);
  }
  const template = await service.getExportTemplate({
    name: `export_inquiry_list_template.xlsx`,
  });
  const file = template.buffer;
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(file).then(async (workbook) => {
    const sheet_data = workbook.worksheets[1];
    const columns = await service.exportFormat(sheet_data);
    const sheet = workbook.worksheets[0];
    let row1 = 0;
    let str = 3;
    const colCount = sheet.columnCount;
    data.forEach(async (el, i) => {
      str = i + 3;
      if (str > 4) {
        utils.cloneRows(sheet, row1, str);
        row1 = str % 2 == 0 ? 4 : 3;
      }

      for (let j = 1; j <= colCount; j++) {
        const format = columns.find((item) => item[1] == j);
        let value;

        if (format[2] == "Func") {
          value = 0;
        } else {
          if (format[3].includes(".")) {
            const keys = format[3].split(".");
            value = el;
            for (const key of keys) {
              value = value && value[key] !== undefined ? value[key] : "";
            }
          } else {
            value = el[format[3]];
          }
        }

        if (format[2] === "Date" && value) {
          sheet.getCell(str, format[1]).value =
            moment(value).format("YYYY-MM-DD");
        } else if (format[2] === "Datetime" && value) {
          sheet.getCell(str, format[1]).value = moment(value).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        } else {
          sheet.getCell(str, format[1]).value = value;
        }
      }
      //   sheet.getCell(str, 1).value = el.INQ_NO;
      //   sheet.getCell(str, 2).value = moment(el.INQ_DATE).format("YYYY-MM-DD");
    });

    // Remove all sheets except the first one
    while (workbook.worksheets.length > 1) {
      workbook.removeWorksheet(workbook.worksheets[1].id);
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

// $(document).on("click", "#export-list", async function (e) {
//   e.preventDefault();
// });
