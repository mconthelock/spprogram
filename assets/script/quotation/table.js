import moment from "moment";
import ExcelJS from "exceljs";
import { statusColors } from "../inquiry/detail.js";
import * as service from "../service/inquiry.js";
import * as utils from "../utils.js";

//Start Table detail
export async function tableQuotation(data, options = {}) {
  const colors = await statusColors();
  const opt = utils.tableOpt;
  opt.data = data;
  opt.order = [[0, "desc"]];
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
      data: "timeline",
      title: "Pre-BM Date",
      render: (data) => {
        if (data.BM_CONFIRM == null) return "";
        return moment(data.BM_CONFIRM).format("YYYY-MM-DD HH:mm");
      },
    },
    {
      data: "timeline",
      title: "Fin Date",
      render: (data) => {
        if (data.FIN_CONFIRM == null) return "";
        return moment(data.FIN_CONFIRM).format("YYYY-MM-DD HH:mm");
      },
    },
    {
      data: "INQ_PKC_REQ",
      title: `Weight<br>Request`,
      className: `text-center max-w-[75px] `,
      render: (data, type, row) => {
        if (data == null || data == "0") return "";
        return `<div class="flex w-full justify-center"><i class="fi fi-ss-check-circle text-xl ${
          row.timeline.PKC_CONFIRM !== null ? "text-primary" : ""
        }"></i></div>`;
      },
    },
    {
      data: "INQ_ID",
      className: "text-center w-fit max-w-[118px]",
      sortable: false,
      title: `<div class="flex justify-center"><i class="fi fi-rr-settings-sliders text-lg"></i></div>`,
      render: (data, type, row) => {
        // const viewurl =
        //   row.INQ_TYPE == "SP"
        //     ? `${process.env.APP_ENV}/mar/inquiry/view/${data}`
        //     : `${process.env.APP_ENV}/mar/quotation/viewinq/${data}`;
        // const view = `<a class="btn btn-sm btn-neutral btn-outline" href="${viewurl}">View</a>`;

        // const edit = `<a class="btn btn-sm btn-neutral ${
        //   row.INQ_TYPE == "SP" ? "" : "btn-disabled"
        // }" href="${process.env.APP_ENV}/mar/inquiry/edit/${data}">Process</a>`;
        // const deleteBtn = `<button class="btn btn-xs btn-ghost btn-circle text-red-500 hover:text-red-800 delete-inquiry" data-id="${data}" data-type="inquiry" onclick="confirm_box.showModal()"><i class="fi fi-br-trash text-2xl"></i></button>`;
        if (row.INQ_PKC_REQ == "1" && row.timeline.PKC_CONFIRM == null) {
          return `<a href="#" class="btn btn-sm btn-soft">View</a>`;
        }
        return `<a href="${process.env.APP_ENV}/mar/quotation/create/${data}" class="btn btn-sm btn-neutral hover:bg-neutral/70">Process</a>`;
      },
    },
  ];

  opt.initComplete = function () {
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
