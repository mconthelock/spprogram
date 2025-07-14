import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "@styles/dataTable.min.css";
import "@styles/select2.min.css";

import { createTable } from "@public/_dataTable.js";
import formData from "../../files/formData.json";
import { createFormCard } from "./detail.js";
import { dataSourceFunctions } from "./dataSourceFunctions.js";

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
        resolve(null); // Resolve with null if card data not found
      }
    });
  });
  // Wait for all cards to be created and append them in order
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
  opt.ordering = false;
  opt.orderFixed = [0, "asc"];
  opt.dom = `<"flex mb-3"<"table-search flex flex-1 gap-5 "f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden overflow-x-scroll my-5"t><"flex mt-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
  opt.columns = [
    {
      data: "no",
      title: "",
      className: "hidden",
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<button class="btn btn-sm btn-circle btn-ghost"><i class="icofont-plus"></i></button>
          <button class="btn btn-sm btn-circle btn-ghost"><i class="icofont-error text-error text-lg"></i></button>`;
        }
        return data;
      },
    },
    {
      data: "id",
      title: `<div class="text-center"><i class='icofont-settings text-lg text-white'></i></div>`,
      className: "text-center text-nowrap sticky-column px-1",
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<button class="btn btn-sm btn-circle btn-ghost"><i class="icofont-plus"></i></button>
          <button class="btn btn-sm btn-circle btn-ghost"><i class="icofont-error text-error text-lg"></i></button>`;
        }
        return data;
      },
    },
    {
      data: "id",
      title: `<div class="text-center text-white">No</div>`,
      className: "sticky-column !px-[3px]",
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[50px] cell-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "id",
      title: `<div class="text-center text-white">CAR</div>`,
      className: "sticky-column !px-[3px]",
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[55px] cell-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "id",
      title: `<div class="text-center text-white">MFG No.</div>`,
      className: "sticky-column !px-[3px]",
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[150px] cell-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "id",
      title: `<div class="text-center text-white">Item</div>`,
      className: "!px-[3px]",
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[75px] cell-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "id",
      title: `<div class="text-center text-white">Part Name</div>`,
      className: "!px-[3px]",
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[200px] cell-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "id",
      title: `<div class="text-center text-white">Drawing No.</div>`,
      className: "!px-[3px]",
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[225px] cell-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "id",
      title: `<div class="text-center text-white">Variable</div>`,
      className: "!px-[3px]",
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[200px] cell-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "id",
      title: `<div class="text-center text-white">Qty</div>`,
      className: "!px-[3px]",
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
      data: "id",
      title: `<div class="text-center text-white">U/M</div>`,
      className: "!px-[3px]",
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
      data: "id",
      title: `<div class="text-center text-white">Supplier</div>`,
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
      data: "id",
      title: `<div class="text-center text-white">2<sup>nd</sup></div>`,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="checkbox" class="checkbox checkbox-sm checkbox-primary text-black" />`;
        }
        return data;
      },
    },
    {
      data: "id",
      title: `<div class="text-center text-white">U/N</div>`,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="checkbox" class="checkbox checkbox-sm checkbox-error text-black" />`;
        }
        return data;
      },
    },
    {
      data: "id",
      title: `<div class="text-center text-white">Remark</div>`,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[250px] cell-input" value="${data}">`;
        }
        return data;
      },
    },
  ];
  opt.initComplete = function (settings, json) {
    $(".table-page").append(
      `<button id="addRowBtn" class="btn btn-primary btn-sm btn-square"><i class="icofont-plus text-2xl text-white"></i></button>
      <button id="showRowBtn" class="btn btn-neutral btn-sm btn-square"><i class="icofont-newspaper text-2xl text-white"></i></button>`
    );
  };
  return opt;
}

$(document).on("change", "#table tbody input", function () {
  const cell = table.cell($(this).closest("td"));
  let newValue = $(this).val();
  if ($(this).attr("type") === "date") {
    newValue = newValue.replace(/-/g, "/");
  }
  cell.data(newValue);
  console.log("Cell updated:", cell.data());
});

$(document).on("click", "#addRowBtn", function () {
  const lastRow = table.row(":not(.d-none):last").data();
  let id = lastRow === undefined ? 1 : lastRow.id + 1;
  const newRow = {
    no: id,
    id: id,
    name: "",
  };
  table.row.add(newRow).draw();
});

$(document).on("click", ".add-sub-line", async function (e) {
  e.preventDefault();
  // Find index value of row to insert after
  const createNewRow = (data, seq) => {
    const taval = {
      INQD_RUNNO: intVal(data.INQD_RUNNO) + 1,
      INQD_SEQ: seq,
      INQD_CAR: data.INQD_CAR,
      INQD_MFGORDER: data.INQD_MFGORDER,
      INQD_ITEM: "",
      INQD_PARTNAME: "",
      INQD_DRAWING: "",
      INQD_VARIABLE: "",
      INQD_QTY: "1",
      INQD_UM: "PC",
      INQD_SUPPLIER: "",
      INQD_SENDPART: "",
      INQD_UNREPLY: "",
      INQD_MAR_REMARK: "",
      INQD_ID: "",
      INQD_OWNER_GROUP: $("#logingroup").val(),
      TEST_MESSAGE: null,
      TEST_FLAG: null,
    };
    const newrow = tabledetail.row.add(taval).draw();
    const node = newrow.node();
    $(node).find(".item").focus();
    return seq;
  };

  const increaseIndex = (inx) => {
    tabledetail.rows().every(function (rw) {
      const data = this.data();
      const node = this.node();
      if (intVal(data.INQD_SEQ) >= inx) {
        this.data({ ...data, INQD_RUNNO: intVal(data.INQD_RUNNO) + 1 }).draw();
        $(node).attr("rowid", intVal(data.INQD_RUNNO) + 1);
        if ($(node).hasClass("child-row")) {
          const int = Math.floor(intVal(data.INQD_SEQ));
          if (int == Math.floor(intVal(inx))) {
            this.data({
              ...data,
              INQD_SEQ: digits(intVal(data.INQD_SEQ) + 0.01, 2),
            }).draw();
          }
        }
      }
    });
  };

  const row = tabledetail.row($(this).parents("tr"));
  const data = row.data();
  const seq = digits(intVal(data.INQD_SEQ) + 0.01, 2);
  await increaseIndex(seq);
  await createNewRow(data, seq);
});

$(document).on("click", "#showRowBtn", function () {
  const data = table.rows().data();
  console.log("Current Table Data:", data.toArray());
});
