import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/select2.min.css";
import "@styles/datatable.min.css";

import "select2";
import {
  showMessage,
  errorMessage,
  showLoader,
  intVal,
  digits,
} from "../utils.js";
import { createTable } from "@public/_dataTable.js";
import {
  getPriceRatio,
  findPriceRatio,
  createPriceRatio,
  statusPriceRatio,
  getQuotationType,
  createQuotationType,
} from "../service/master.js";
var table;
$(document).ready(async () => {
  $(".mainmenu").find("details").attr("open", false);
  $(".mainmenu.navmenu-admin").find("details").attr("open", true);

  const data = await getPriceRatio();
  const opt = await tableOpt(data);
  table = await createTable(opt);
});

async function tableOpt(data) {
  const types = await getQuotationType();
  const supplier = data.map((val) => val.SUPPLIER);
  const trader = data.map((val) => val.TRADER);
  const currency = data.map((val) => val.CURRENCY);

  const opt = {};
  opt.data = data;
  opt.dom = `<"flex items-center mb-3"<"table-search flex flex-1 gap-5"f><"flex items-center table-option">><"bg-white border border-slate-300 rounded-2xl overflow-hidden overflow-x-auto"t><"flex my-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
  opt.columns = [
    { data: "ID", className: "hidden" },
    {
      data: "quoText",
      className: "text-nowrap",
      title: `<div class="text-center text-white">Quotation Type</div>`,
      render: function (data, type, row) {
        if (type === "display" && row.isNew !== undefined) {
          const activeTypes = types.filter((val) => val.QUOTYPE_STATUS == 1);
          let options = `<option value=""></option>`;
          activeTypes.map((val) => {
            options += `<option value="${val.QUOTYPE_ID}" ${
              val.QUOTYPE_ID == data ? "selected" : ""
            }>${val.QUOTYPE_DESC}</option>`;
          });
          return `<select class="select2 w-full input-dt" data-key="quotype">${options}</select>`;
        }
        return row.isNew !== undefined ? "" : data.QUOTYPE_DESC;
      },
    },

    {
      data: "TRADER",
      className: "text-nowrap",
      title: `<div class="text-center text-white">Trader</div>`,
      render: function (data, type, row) {
        if (type === "display" && row.isNew !== undefined) {
          const uniqueTrader = [...new Set(trader)];
          let options = `<option value=""></option>`;
          uniqueTrader.map((val) => {
            options += `<option value="${val}" ${
              val == data ? "selected" : ""
            }>${val}</option>`;
          });
          return `<select class="select2 w-full input-dt" data-key="trader">${options}</select>`;
        }
        return data;
      },
    },
    {
      data: "SUPPLIER",
      className: "text-nowrap",
      title: `<div class="text-center text-white">Supplier</div>`,
      render: function (data, type, row) {
        if (type === "display" && row.isNew !== undefined) {
          const uniqueSuppler = [...new Set(supplier)];
          let options = `<option value=""></option>`;
          uniqueSuppler.map((val) => {
            options += `<option value="${val}" ${
              val == data ? "selected" : ""
            }>${val}</option>`;
          });
          return `<select class="select2 w-full input-dt" data-key="supplier">${options}</select>`;
        }
        return data;
      },
    },

    {
      data: "CURRENCY",
      className: "text-center text-nowrap",
      title: `<div class="text-center text-white">Currency</div>`,
      render: function (data, type, row) {
        if (type === "display" && row.isNew !== undefined) {
          const uniqueCurrency = [
            ...new Set(currency.filter((val) => val !== null)),
          ];
          let options = `<option value=""></option>`;
          uniqueCurrency.map((val) => {
            options += `<option value="${val}" ${
              val == data ? "selected" : ""
            }>${val}</option>`;
          });
          return `<select class="select2 w-full input-dt" data-key="currency">${options}</select>`;
        }
        return data;
      },
    },
    {
      data: "FORMULA",
      className: "text-nowrap !text-right",
      title: `<div class="text-center text-white">Rate</div>`,
      render: function (data, type, row) {
        if (type === "display" && row.isNew !== undefined) {
          return `<input type="number" class="cell-input w-full input-dt" data-key="formula" value="${data}" min="0.001" step="0.01">`;
        }
        return digits(data, 3);
      },
    },
    {
      data: "STATUS",
      className: "text-center text-nowrap",
      title: `<div class="text-center text-white">Status</div>`,
      render: function (data, type) {
        if (type === "display") {
          let result =
            data == 1
              ? `<div class="badge badge-primary text-black">Active</div>`
              : `<div class="badge badge-error">In-Active</div>`;
          result += `<input type="hidden" value="${data}" class="input-dt" data-key="status"/>`;
          return result;
        }
        return data == 1 ? "Active" : "Inactive";
      },
    },
    {
      data: "ID",
      className: "text-nowrap",
      sortable: false,
      title: `<div class="text-center"><i class='icofont-settings text-lg text-white'></i></div>`,
      render: function (data, type, row) {
        return `<input type="hidden" value="${data}" class="input-dt" data-key="id"/>
        <div class="flex items-center justify-center gap-2">

            <button class="btn btn-sm btn-ghost btn-circle save-row ${
              row.isNew === undefined ? "hidden" : ""
            }" data-id="${data}"><i class="icofont-save text-lg"></i></button>

            <button class="btn btn-sm btn-ghost btn-circle ignore-row ${
              row.isNew === undefined ? "hidden" : ""
            }" data-id="${data}"><i class="icofont-close text-lg text-red-500"></i></button>

            <button class="btn btn-sm btn-ghost btn-circle edit-row ${
              row.isNew !== undefined ? "hidden" : ""
            }" data-id="${data}"><i class="icofont-pencil-alt-5 text-lg"></i></button>

            <button class="btn btn-sm btn-ghost btn-circle toggle-status
                ${row.STATUS === 0 ? "hidden" : ""}
                ${row.isNew !== undefined ? "hidden" : ""}"
                data-id="${data}" data-value="0">
                <i class="icofont-trash text-lg text-red-500"></i>
            </button>



            <button class="btn btn-sm btn-ghost btn-circle toggle-status ${
              row.STATUS === 1 ? "hidden" : ""
            }" data-id="${data}" data-value="1"><i class="icofont-refresh text-lg text-primary"></i></button>
        </div>`;
      },
    },
  ];

  opt.initComplete = function (settings, json) {
    $(".table-option").append(`<div class="flex gap-2">
        <button class="btn btn-primary rounded-3xl text-white transition delay-100 duration-100 ease-in-out hover:scale-105 items-center"
            type="button" id="add-new-rate">
            <span class="loading loading-spinner hidden"></span>
            <span class=""><i class="icofont-plus text-lg me-2"></i>New Item</span>
        </button>

         <button class="btn btn-neutral rounded-3xl text-white transition delay-100 duration-100 ease-in-out hover:scale-105 items-center"
            type="button">
            <span class="loading loading-spinner hidden"></span>
            <span class=""><i class="icofont-spreadsheet text-lg me-2"></i>Export</span>
        </button>
    </div>`);
  };
  return opt;
}

$(document).on("click", "#add-new-rate", async function (e) {
  e.preventDefault();
  const data = table.data();
  const lastRow = data.toArray().reduce(
    (prev, current) => {
      return prev.ID > current.ID ? prev : current;
    },
    { ID: 0 }
  );
  let id = lastRow.ID + 1;
  const newRow = {
    ID: id,
    quoText: "",
    TRADER: "",
    SUPPLIER: "",
    STATUS: 1,
    CURRENCY: "",
    FORMULA: 0.0,
    isNew: true,
  };
  const row = table.row.add(newRow).draw(false);
  table.page("last").draw("page");

  const jQueryElement = $(row.node()).find(".select2");
  jQueryElement.select2({
    tags: true,
    createTag: function (params) {
      const term = $.trim(params.term);
      if (term === "") {
        return null;
      }
      return {
        id: term,
        text: term,
        newTag: true,
      };
    },
  });
});

$(document).on("click", ".edit-row", async function (e) {
  e.preventDefault();
  const id = $(this).attr("data-id");
  const data = table.row($(this).parents("tr")).data();
  const row = table.row($(this).parents("tr"));
  const newData = {
    ID: id,
    quoText: data.quoText.QUOTYPE_ID,
    TRADER: data.TRADER,
    SUPPLIER: data.SUPPLIER,
    STATUS: data.STATUS,
    CURRENCY: data.CURRENCY,
    FORMULA: data.FORMULA,
    isNew: false,
  };
  row.data(newData);
  row.draw(false);

  const jQueryElement = $(row.node()).find(".select2");
  jQueryElement.select2({
    tags: true,
    createTag: function (params) {
      const term = $.trim(params.term);
      if (term === "") {
        return null;
      }
      return {
        id: term,
        text: term,
        newTag: true,
      };
    },
  });
});

$(document).on("click", ".save-row", async function (e) {
  e.preventDefault();
  const row = table.row($(this).parents("tr"));
  const data = {};
  let isBlank = false;
  $(row.node())
    .find(".input-dt")
    .map((index, element) => {
      const key = $(element).attr("data-key");
      const val = $(element).val();
      data[key] = val;
      if (val == "" || val == null || val == 0) isBlank = true;
    });
  if (isBlank) {
    showMessage(`Please fill all required field.`);
    return;
  }
  //Save Quotation Type
  const quoTyoe = await getQuotationType();
  const isType = quoTyoe.find((val) => val.QUOTYPE_ID == data.quotype);
  if (isType == undefined) {
    const quoTypeVal = {
      QUOTYPE_DESC: data.quotype,
      QUOTYPE_STATUS: 1,
      QUOTYPE_CUR: data.currency,
    };

    try {
      const res = await createQuotationType(quoTypeVal);
      data.quotype = res.QUOTYPE_ID;
    } catch (error) {
      await errorMessage(error);
    }
  }

  //Save Price Ratio
  const ratio = {
    ID: data.id,
    TRADER: data.trader,
    SUPPLIER: data.supplier,
    QUOTATION: data.quotype,
    FORMULA: data.formula,
    CURRENCY: data.currency,
    UPDATE_BY: "THEERAPATH  JITTAWATTANA",
    UPDATE_AT: new Date(),
    STATUS: data.status,
  };
  try {
    const result = await createPriceRatio(ratio);
    row.data(result[0]);
    row.draw(false);
  } catch (error) {
    await errorMessage(error);
  }
});

$(document).on("click", ".toggle-status", async function (e) {
  e.preventDefault();
  const id = $(this).attr("data-id");
  const status = $(this).attr("data-value");
  const data = table.row($(this).parents("tr")).data();
  const row = table.row($(this).parents("tr"));
  const res = await statusPriceRatio({ id, status });
  row.data(res[0]);
  row.draw(false);
});

$(document).on("click", ".ignore-row", async function (e) {
  e.preventDefault();
  const row = table.row($(this).parents("tr"));
  const data = row.data();
  const res = await findPriceRatio({
    TRADER: data.TRADER,
    SUPPLIER: data.SUPPLIER,
    QUOTATION: data.quoText,
  });
  row.data(res[0]);
  row.draw(false);
});
