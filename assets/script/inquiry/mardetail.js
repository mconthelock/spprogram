import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";

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
  opt.columns = [
    {
      data: "id",
      title: "<i class='icofont-settings'></i>",
      className: "text-center text-nowrap",
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<button class="btn btn-sm btn-circle btn-ghost"><i class="icofont-plus"></i></button>
          <button class="btn btn-sm btn-circle btn-ghost"><i class="icofont-bin"></i></button>`;
        }
        return data;
      },
    },
    {
      data: "id",
      title: "No",
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="cell-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "id",
      title: "Car.",
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="cell-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "id",
      title: "MFG No.",
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="number" class="cell-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "id",
      title: "Item",
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="cell-input          " value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "id",
      title: "Part Name",
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="number" class="cell-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "id",
      title: "Drawing No.",
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="number" class="cell-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "id",
      title: "Variable",
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="number" class="cell-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "id",
      title: "Qty",
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="number" class="cell-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "id",
      title: "UM",
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="number" class="cell-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "id",
      title: "Supplier",
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="number" class="cell-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "id",
      title: "2<sup>nd</sup>",
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="number" class="cell-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "id",
      title: "U/N",
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="number" class="cell-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "id",
      title: "Remark",
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="number" class="cell-input" value="${data}">`;
        }
        return data;
      },
    },
  ];
  opt.initComplete = function (settings, json) {
    $(".table-info").append(
      `<button id="addRowBtn" class="btn btn-primary">Add Row</button>
      <button id="showRowBtn" class="btn btn-primary">Add Row</button>`
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
  const newRow = {
    id: "",
    name: "",
  };
  table.row.add(newRow).draw();
});
$(document).on("click", "#showRowBtn", function () {
  const data = table.rows().data();
  console.log("Current Table Data:", data.toArray());
});
