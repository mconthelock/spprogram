import "@styles/select2.min.css";
import "@styles/datatable.min.css";
import moment from "moment";
import { statusColors } from "../inquiry/detail.js";
import { exportExcel } from "../service/excel.js";
import * as utils from "../utils.js";
import * as service from "../service/inquiry.js";

export async function tableOpt(data, options = {}) {
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
      render: function (data) {
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
      className: "text-center w-fit max-w-[120px]",
      sortable: false,
      title: `<i class='icofont-settings text-lg text-white'></i>`,
      render: (data) => {
        const assign = `<a class="btn btn-xs btn-neutral btn-process ${
          usergroup == "SEG" ? "" : "hidden"
        }" href="${process.env.APP_ENV}/se/inquiry/edit/${data}">Process</a>`;
        const declare = `<a class="btn btn-xs btn-neutral btn-process ${
          usergroup == "SEG" ? "hidden" : ""
        }" href="${process.env.APP_ENV}/se/inquiry/detail/${data}">Process</a>`;
        const view = `<a class="btn btn-xs btn-neutral" href="${process.env.APP_ENV}/se/inquiry/view/${data}">View</a>`;
        return `<div class="flex gap-1 justify-center items-center w-fit">${assign}${declare}${view}</div>`;
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
    const back = `<a href="#" class="btn btn-outline btn-neutral rounded-none text-neutral hover:text-white hover:bg-neutral/70 flex gap-3" id="back-report"><i class="fi fi-rr-arrow-circle-left text-xl"></i>Back</a>`;

    $(".table-info").append(`<div class="flex gap-2">
        ${export1}
        ${options.backReportBtn !== undefined ? back : ""}
     </div>`);
  };
  return opt;
}

//Export Excel
$(document).on("click", "#sale-export-detail", async function (e) {
  e.preventDefault();
  const spinquiryquery = localStorage.getItem("spinquiryquery");
  let data = await service.getInquiry(JSON.parse(spinquiryquery));
  const template = await service.getExportTemplate({
    name: `export_inquiry_list_template_for_sale.xlsx`,
  });
  await exportExcel(data, template);
});
