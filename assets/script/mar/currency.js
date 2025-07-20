import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "select2";
import moment from "moment";
import {
  showMessage,
  errorMessage,
  showLoader,
  intVal,
  digits,
} from "../utils.js";
import { createTable } from "@public/_dataTable.js";
import { getCurrency, updateCurrency } from "../service/currency.js";
var table;
$(document).ready(async () => {
  const data = await getCurrency();
  const opt = await tableOpt(data);
  table = await createTable(opt);
});

async function tableOpt(data) {
  const opt = {};
  opt.order = [
    [0, "desc"],
    [1, "desc"],
  ];
  opt.data = data;
  opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option">><"bg-white border border-slate-300 rounded-2xl overflow-hidden overflow-x-auto"t><"flex my-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
  opt.columns = [
    {
      data: "CURR_YEAR",
      title: `<div class="text-center text-white">FYEAR</div>`,
    },
    {
      data: "CURR_PERIOD",
      className: "text-nowrap",
      title: `<div class="text-center text-white">Period</div>`,
      render: function (data, type, row) {
        if (type === "display") {
          //   return `<input type="number" class="cell-input w-full input-dt" data-key="formula" value="${data}" min="0.001" step="0.01">`;
          // }
          return `0${data}-H`;
        }
        return data;
      },
    },
    {
      data: "CURR_CODE",
      className: "text-center",
      title: `<div class="text-center text-white">Code</div>`,
    },
    {
      data: "CURR_RATE",
      className: "!text-end",
      title: `<div class="text-center text-white">Rate</div>`,
      render: function (data, type, row) {
        if (type === "display" && row.isNew !== undefined) {
          return `<input type="number" class="cell-input w-full input-dt" value="${digits(
            data,
            2
          )}" min="0.01" step="0.01">`;
        }
        return digits(data, 2);
      },
    },
    {
      data: "CURR_UPDATE_DATE",
      className: "text-center",
      title: `<div class="text-center text-white">Last Update</div>`,
      render: function (data, type, row) {
        return data == null ? "" : moment(data).format("YYYY-MM-DD HH:mm");
      },
    },
    {
      data: "CURR_UPDATE_BY",
      className: "text-start",
      title: `<div class="text-center text-white">Update By</div>`,
    },
    {
      data: "CURR_CODE",
      className: "text-nowrap",
      sortable: false,
      title: `<div class="text-center"><i class='icofont-settings text-lg text-white'></i></div>`,
      render: function (data, type, row) {
        return `
        <div class="flex items-center justify-center gap-2">
            <button class="btn btn-sm btn-ghost btn-circle save-row ${
              row.isNew === undefined ? "hidden" : ""
            }"><i class="icofont-save text-lg"></i></button>

            <button class="btn btn-sm btn-ghost btn-circle edit-row ${
              row.isNew !== undefined || row.CURR_LATEST == 0 ? "hidden" : ""
            }"><i class="icofont-pencil-alt-5 text-lg"></i></button>
        </div>`;
      },
    },
  ];

  opt.initComplete = function (settings, json) {
    // $(".table-option").append(`<div class="flex gap-2">
    //     <button class="btn btn-primary rounded-3xl text-white transition delay-100 duration-100 ease-in-out hover:scale-105 items-center"
    //         type="button" id="add-new-rate">
    //         <span class="loading loading-spinner hidden"></span>
    //         <span class=""><i class="icofont-plus text-lg me-2"></i>New Item</span>
    //     </button>
    //      <button class="btn btn-neutral rounded-3xl text-white transition delay-100 duration-100 ease-in-out hover:scale-105 items-center"
    //         type="button">
    //         <span class="loading loading-spinner hidden"></span>
    //         <span class=""><i class="icofont-spreadsheet text-lg me-2"></i>Export</span>
    //     </button>
    // </div>`);
  };
  return opt;
}

$(document).on("click", ".edit-row", async function (e) {
  e.preventDefault();
  const data = table.row($(this).parents("tr")).data();
  const row = table.row($(this).parents("tr"));
  const newData = { ...data, isNew: true };
  row.data(newData);
  row.draw(false);
  $(row.node()).find("td:eq(3) input").focus().select();
});

$(document).on("click", ".save-row", async function (e) {
  e.preventDefault();
  const row = table.row($(this).parents("tr"));
  const data = row.data();
  const rate = row.node().querySelector(".input-dt").value;
  const res = await updateCurrency({
    CURR_YEAR: data.CURR_YEAR,
    CURR_PERIOD: data.CURR_PERIOD,
    CURR_CODE: data.CURR_CODE,
    CURR_RATE: rate,
    CURR_UPDATE_DATE: new Date(),
    CURR_UPDATE_BY: "Chalormsak Sewanam",
  });
  row.data(res[0]);
  row.draw(false);
});
