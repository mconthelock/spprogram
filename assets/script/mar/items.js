import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/datatable.min.css";
import moment from "moment";
import ExcelJS from "exceljs";

import { createTable } from "@public/_dataTable.js";
import { showbgLoader } from "@public/preloader";
import { statusColors } from "../inquiry/detail.js";
import * as service from "../service/items.js";
import * as utils from "../utils.js";
var table;

$(async function () {
  try {
    await utils.initApp({ submenu: ".navmenu-price" });
    const data = await service.getItems();
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
  const opt = utils.tableOpt;
  opt.data = data;
  opt.columns = [
    { data: "ITEM_NO", title: "Item" },
    { data: "ITEM_NAME", title: "Part Name", className: "max-w-[175px]" },
    { data: "ITEM_DWG", title: "Drawing", className: "max-w-[175px]" },
    {
      data: "ITEM_VARIABLE",
      title: "Variable",
      className: "max-w-[175px] break-all",
    },
    // { data: "ITEM_TYPE", title: "Part Name" },
    { data: "ITEM_CLASS", title: "Class" },
    { data: "ITEM_UNIT", title: "Unit" },
    { data: "ITEM_SUPPLIER", title: "Supplier" },
    // { data: "CATEGORY", title: "Part Name" },
    { data: "ITEM_REMARK", title: "Remark" },
    {
      data: "ITEM_STATUS",
      title: "Status",
      className: "text-center",
      render: (data) => {
        return `<div class="badge ${
          data == 1 ? "badge-primary text-white" : "badge-error"
        }">${data == 1 ? "Enable" : "Disable"}</div>`;
      },
    },
    {
      data: "ITEM_ID",
      title: `<div class="text-2xl w-full flex justify-center"><i class="fi fi-tr-pen-field"></i></div>`,
      className: "text-center",
      render: (data, type, row) => {
        const edit = `<a class="btn btn-circle btn-sm btn-ghost text-xl" href="#"><i class="fi fi-tr-pen-square"></i></a>`;
        const deleted = `<a class="btn btn-circle btn-sm btn-ghost text-xl ${
          row.ITEM_STATUS == 0 ? "btn-disabled" : "text-red-500"
        }" href="#" ><i class="fi fi-bs-trash-xmark"></i></a>`;
        return `<div class="w-full flex justify-center">${edit}${deleted}</div>`;
      },
    },
  ];
  opt.initComplete = function (settings, json) {
    $(".table-option").append(
      `<button class="btn btn-outline btn-primary hover:text-white">New Item</button>`
    );
    $(".table-paging").append(`<div class="flex gap-2">
        <button class="btn btn-accent rounded-3xl text-white items-center" id="export-detail" type="button">
            <span class="loading loading-spinner hidden"></span>
            <span class="flex items-center"><i class="fi fi-tr-file-excel text-lg me-2"></i>Export Data</span>
        </button>
    </div>`);
    $(".table-paging").addClass("flex-col gap-3");
  };
  return opt;
}
