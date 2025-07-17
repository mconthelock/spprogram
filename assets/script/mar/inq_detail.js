// import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
// import "@styles/dataTable.min.css";
import "@styles/select2.min.css";

import { showMessage, showLoader, intVal, digits } from "@root/utils.js";
import { createTable } from "@public/_dataTable.js";
import formData from "../../files/formData.json";
import { createFormCard } from "../inquiry/detail.js";
import { validateDrawingNo } from "../drawing.js";

var table;
$(document).ready(async () => {
  const cards = await setupCard();
  const tableContainer = await setupTable();
  table = await createTable(tableContainer);
});

async function setupCard() {
  const form = $("#form-container");
  const carddata = form.attr("data");
  const cardIds = carddata.split("|");

  // Create an array to hold promises for card creation
  const cardPromises = cardIds.map(async (cardId) => {
    return new Promise(async (resolve) => {
      const cardData = formData.find((item) => item.id === cardId);
      if (cardData) {
        const cardElement = await createFormCard(cardData);
        resolve(cardElement);
      } else {
        console.error(`Card data for ID ${cardId} not found.`);
        resolve(null);
      }
    });
  });

  const cardElements = await Promise.all(cardPromises);
  cardElements.forEach((element) => {
    if (element) {
      form.append(element);
    }
  });
}

async function setupTable() {
  const mockupData = [];
  const opt = {};
  opt.data = mockupData;
  opt.paging = false;
  opt.info = false;
  //   opt.ordering = false;
  opt.orderFixed = [0, "asc"];
  opt.dom = `<"flex"<"table-search flex flex-1 gap-5 hidden "f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden overflow-x-scroll"t><"flex mt-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
  opt.columns = [
    {
      data: "id",
      title: "",
      className: "hidden",
    },
    {
      data: "INQD_ID",
      title: `<div class="text-center"><i class='icofont-settings text-lg text-white'></i></div>`,
      className: "text-center text-nowrap sticky-column px-1",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<div class="btn btn-sm btn-circle btn-ghost add-sub-line" type="button"><i class="icofont-plus"></i></div>
          <button class="btn btn-sm btn-circle btn-ghost"><i class="icofont-error text-error text-lg"></i></button>`;
        }
        return data;
      },
    },
    {
      data: "INQD_SEQ",
      title: `<div class="text-center text-white">No</div>`,
      className: "sticky-column !px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[50px] cell-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_CAR",
      title: `<div class="text-center text-white">CAR</div>`,
      className: "sticky-column !px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[55px] cell-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_MFGORDER",
      title: `<div class="text-center text-white">MFG No.</div>`,
      className: "sticky-column !px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[150px] cell-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_ITEM",
      title: `<div class="text-center text-white">Item</div>`,
      className: "!px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[75px] cell-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_PARTNAME",
      title: `<div class="text-center text-white">Part Name</div>`,
      className: "!px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[200px] cell-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_DRAWING",
      title: `<div class="text-center text-white">Drawing No.</div>`,
      className: "!px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[225px] cell-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_VARIABLE",
      title: `<div class="text-center text-white">Variable</div>`,
      className: "!px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[200px] cell-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_QTY",
      title: `<div class="text-center text-white">Qty</div>`,
      className: "!px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="number" min="1" class="!w-[50px] cell-input" value="${
            data == "" ? 1 : data
          }">`;
        }
        return data;
      },
    },
    {
      data: "INQD_UM",
      title: `<div class="text-center text-white">U/M</div>`,
      className: "!px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="type" class="!w-[75px] cell-input" value="${
            data == "" ? "PC" : data
          }">`;
        }
        return data;
      },
    },
    {
      data: "INQD_SUPPLIER",
      title: `<div class="text-center text-white">Supplier</div>`,
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<select class="!w-[100px] select select-sm">
            <option value=""></option>
            <option value="AMEC">AMEC</option>
            <option value="MELINA">MELINA</option>
            <option value="LOCAL">LOCAL</option>
          </select>`;
        }
        return data;
      },
    },
    {
      data: "INQD_SENDPART",
      title: `<div class="text-center text-white">2<sup>nd</sup></div>`,
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="checkbox" class="checkbox checkbox-sm checkbox-primary text-black" />`;
        }
        return data;
      },
    },
    {
      data: "INQD_UNREPLY",
      title: `<div class="text-center text-white">U/N</div>`,
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="checkbox" class="checkbox checkbox-sm checkbox-error text-black" />`;
        }
        return data;
      },
    },
    {
      data: "INQD_MAR_REMARK",
      title: `<div class="text-center text-white">Remark</div>`,
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[250px] cell-input" value="${data}">`;
        }
        return data;
      },
    },
  ];
  opt.initComplete = function (settings, json) {
    $(".table-page").append(`<div class="flex gap-2">
      <div class="tooltip" data-tip="Add line">
        <button id="addRowBtn" class="btn btn-primary btn-sm btn-square" type="button"><i class="icofont-plus text-xl text-white"></i></button>
      </div>

      <div class="tooltip" data-tip="Upload inquiry">
        <button id="addRowBtn" class="btn btn-neutral btn-sm btn-square"><i class="icofont-upload-alt text-xl text-white"></i></button>
      </div>

      <div class="tooltip" data-tip="Download template">
        <button id="showRowBtn" class="btn btn-neutral btn-sm btn-square"><i class="icofont-download text-xl text-white"></i></button>
      </div>
    </div>`);
  };
  return opt;
}

async function initRow(id) {
  return {
    id: id,
    INQD_ID: "",
    INQD_SEQ: id,
    INQD_RUNNO: "",
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
    INQD_LATEST: "",
    INQD_OWNER: "",
  };
}

$(document).on("click", "#addRowBtn", async function (e) {
  e.preventDefault();
  const lastRow = table.row(":not(.d-none):last").data();
  let id = lastRow === undefined ? 1 : lastRow.id + 1;
  const newRow = await initRow(digits(id, 0));
  const row = table.row.add(newRow).draw();
  $(row.node()).find("td:eq(3) input").focus();
});

$(document).on("click", ".add-sub-line", async function (e) {
  e.preventDefault();
  const data = table.row($(this).parents("tr")).data();
  const id = digits(intVal(data.INQD_SEQ) + 0.01, 2);
  const newRow = await initRow(id);
  const row = table.row.add(newRow).draw();
  $(row.node()).find("td:eq(3) input").focus();
});

$(document).on("change", "#table tbody input", function () {
  const cell = table.cell($(this).closest("td"));
  let newValue = $(this).val();
  if ($(this).attr("type") === "date") {
    newValue = newValue.replace(/-/g, "/");
  }
  cell.data(newValue);
  console.log("Cell updated:", cell.data());
});

$(document).on("click", "#showRowBtn", function () {
  const data = table.rows().data();
  console.log("Current Table Data:", data.toArray());
});

async function tset() {
  const test = "LHC-1220AG01";
  //   const test = "YA129C137  G01";
  console.log("DWG: ", validateDrawingNo(test));
}
