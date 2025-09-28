import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/datatable.min.css";
import moment from "moment";
import { createTable } from "@public/_dataTable.js";
import { statusColors } from "../inquiry/detail.js";
import * as service from "../service/inquiry.js";
import * as utils from "../utils.js";
var table;
$(async function () {
  try {
    await utils.initApp();
    const pagetype = $("#pagetype").val();
    const data = await service.getInquiry({ INQ_STATUS: pagetype });
    const opt = await tableInquiry(data);
    table = await createTable(opt);
  } catch (error) {
    console.log(error);
  } finally {
    await utils.showLoader({ show: false });
  }
});

async function tableInquiry(data = []) {
  const colors = await statusColors();
  const opt = { ...utils.tableOpt };
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
    { data: "INQ_SERIES", title: "Series" },
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
      render: (data) => {
        return `<a class="btn btn-xs btn-neutral" href="${process.env.APP_ENV}/des/inquiry/detail/${data}">Process</a>`;
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
