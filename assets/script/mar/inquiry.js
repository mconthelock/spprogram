import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/datatable.min.css";
import moment from "moment";
import ExcelJS from "exceljs";

import { createTable } from "@public/_dataTable.js";
import { statusColors } from "../inquiry/detail.js";
import * as service from "../service/inquiry.js";
import * as utils from "../utils.js";
var table;
$(async function () {
  try {
    await utils.initApp({ submenu: ".navmenu-newinq" });
    let data = await service.getInquiry({ LE_INQ_STATUS: 90 });
    if ($("#prebm").val() == "1") {
      data = data.filter((item) => item.timeline.BM_COFIRM == null);
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
  const colors = await statusColors();
  const opt = utils.tableOpt;
  opt.data = data;
  opt.order = [
    [0, "desc"],
    [1, "desc"],
  ];
  opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden"t><"flex mt-5 mb-3"<"table-info flex flex-col flex-1 gap-5"i><"table-page flex-none"p>>`;
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
      render: (data, type, row, meta) => {
        const view = `<a class="btn btn-sm btn-neutral btn-outline" href="${process.env.APP_ENV}/mar/inquiry/view/${data}">View</a>`;
        const edit = `<a class="btn btn-sm btn-neutral " href="${process.env.APP_ENV}/mar/inquiry/edit/${data}">Edit</a>`;
        const deleteBtn = `<button class="btn btn-xs btn-ghost btn-circle text-red-500 hover:text-red-800 delete-inquiry" data-id="${data}" data-type="inquiry" onclick="confirm_box.showModal()"><i class="fi fi-br-trash text-2xl"></i></button>`;
        return `<div class="flex gap-1 justify-center items-center w-fit">${view}${edit}${deleteBtn}</div>`;
      },
    },
  ];

  opt.initComplete = function (settings, json) {
    $(".table-option")
      .append(`<div class="dropdown dropdown-end dropdown-hover">
        <div tabindex="0" role="button" class="btn btn-outline btn-neutral m-1">New Inquiry</div>
        <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li><a href="${process.env.APP_ENV}/mar/inquiry/create/">SP Inquiry</a></li>
            <li><a href="${process.env.APP_ENV}/mar/inquiry/createstock/">Stock Part</a></li>
        </ul>
        </div>`);
    $(".table-info").append(`<div class="flex gap-2">
        <button class="btn btn-accent rounded-3xl text-white items-center" id="export-detail" type="button">
            <span class="loading loading-spinner hidden"></span>
            <span class="flex items-center"><i class="fi fi-tr-file-excel text-lg me-2"></i>Export Detail</span>
        </button>

         <button class="btn btn-neutral rounded-3xl text-white items-center" id="export-list" type="button">
            <span class="loading loading-spinner hidden"></span>
            <span class="flex items-center"><i class="fi fi-tr-floor-layer text-lg me-2"></i>Export list</span>
        </button>
    </div>`);
  };
  return opt;
}

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

$(document).on(
  "click",
  "#confirm_accept.deleteinqs:not(disabled)",
  async function (e) {
    e.preventDefault();
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
);

$(document).on("click", "#export-detail", async function (e) {
  e.preventDefault();
  // const setdata = async (sheet, el, r, num) => {};

  const data = []; //Get data report
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

$(document).on("click", "#export-list", async function (e) {
  e.preventDefault();
});
