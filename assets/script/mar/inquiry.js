import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/datatable.min.css";
import moment from "moment";

import { createTable } from "@public/_dataTable.js";
import { statusColors } from "../inquiry/detail.js";
import * as service from "../service/inquiry.js";
import * as utils from "../utils.js";
var table;
$(document).ready(async () => {
  try {
    utils.showLoader();
    $(".mainmenu").find("details").attr("open", false);
    $(".mainmenu.navmenu-newinq").find("details").attr("open", true);
    const data = await service.getInquiry({});
    const opt = await tableOpt(data);
    table = await createTable(opt);
  } catch (error) {
    await utils.foundError();
  } finally {
    utils.showLoader(false);
  }
});

async function tableOpt(data) {
  const colors = await statusColors();
  const opt = {};
  opt.data = data;
  opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden"t><"flex mt-5"<"table-info flex flex-col flex-1 gap-5"i><"table-page flex-none"p>>`;
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
        // const colors = [
        //   { id: 1, color: "bg-gray-500 text-white" }, //Draft
        //   { id: 19, color: "bg-indigo-500" }, //MAR Pre process
        //   { id: 29, color: "bg-sky-500" }, //SE
        //   { id: 39, color: "bg-amber-500" }, //DE
        //   { id: 49, color: "bg-slate-500" }, //IS
        //   { id: 59, color: "bg-pink-500" }, //FIN
        //   { id: 98, color: "bg-red-900" }, //MAR Post process
        //   { id: 99, color: "bg-emerald-500" }, //Fihish
        // ];
        const statusColor = colors.find((item) => item.id >= data.STATUS_ID);
        console.log(statusColor);
        return `<span class="badge text-xs ${statusColor.color}">${data.STATUS_DESC}</span>`;
      },
    },
    {
      data: "INQ_MAR_PIC",
      title: "MAR. In-Charge",
    },
    {
      data: "inqgroup",
      title: "EME",
      className: "text-center",
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
        return `<i class="icofont-check-circled text-xl ${color}"></i>`;
      },
    },
    {
      data: "inqgroup",
      title: "EEL",
      className: "text-center",
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
        return `<i class="icofont-check-circled text-xl ${color}"></i>`;
      },
    },
    {
      data: "inqgroup",
      title: "EAP",
      className: "text-center",
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
        return `<i class="icofont-check-circled text-xl ${color}"></i>`;
      },
    },
    {
      data: "inqgroup",
      title: "ESO",
      className: "text-center",
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
        return `<i class="icofont-check-circled text-xl ${color}"></i>`;
      },
    },
    {
      data: "INQ_ID",
      className: "text-center w-fit max-w-[100px]",
      sortable: false,
      title: `<i class='icofont-settings text-lg text-white'></i>`,
      render: (data, type, row, meta) => {
        const view = `<a class="btn btn-xs btn-neutral btn-outline" href="${process.env.APP_ENV}/mar/inquiry/view/${data}">View</a>`;
        const edit = `<a class="btn btn-xs btn-neutral " href="${process.env.APP_ENV}/mar/inquiry/edit/${data}">Edit</a>`;
        const deleteBtn = `<button class="btn btn-xs btn-ghost btn-circle text-red-500 delete-row hover:text-red-800" data-id="${data}" data-type="inquiry"><i class="icofont-trash text-xl"></i></button>`;
        return `<div class="flex gap-1 justify-center w-fit">${view}${edit}${deleteBtn}</div>`;
      },
    },
  ];
  opt.initComplete = function (settings, json) {
    $(".table-option").append(`<div class="flex gap-2">
        <a class="btn btn-primary btn-circle" href="${process.env.APP_ENV}/mar/inquiry/create/"><i class="icofont-plus text-xl text-white"></i></a>
        </div>`);
    $(".table-info").append(`<div class="flex gap-2">
        <button class="btn btn-accent rounded-3xl text-white transition delay-100 duration-300 ease-in-out hover:scale-110 items-center"
            type="button">
            <span class="loading loading-spinner hidden"></span>
            <span class=""><i class="icofont-spreadsheet text-lg me-2"></i>Export Detail</span>
        </button>

         <button class="btn btn-neutral rounded-3xl text-white transition delay-100 duration-300 ease-in-out hover:scale-110 items-center"
            type="button">
            <span class="loading loading-spinner hidden"></span>
            <span class=""><i class="icofont-spreadsheet text-lg me-2"></i>Export list</span>
        </button>
    </div>`);
  };
  return opt;
}
