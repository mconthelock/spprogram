import moment from "moment";

export async function setupTableDetail(data = []) {
  const opt = {};
  opt.data = data;
  opt.paging = false;
  opt.searching = false;
  opt.info = false;
  opt.orderFixed = [0, "asc"];
  opt.dom = `<"flex"<"table-search flex flex-1 gap-5 "f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden overflow-x-scroll"t><"flex mt-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
  opt.columns = [
    {
      data: "id",
      title: "",
      className: "hidden",
    },
    {
      data: "INQD_ID",
      title: "<i class='icofont-settings text-lg'></i>",
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
      title: "No",
      className: "sticky-column !px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[50px] cell-input edit-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_CAR",
      title: "CAR",
      className: "sticky-column !px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[55px] cell-input carno" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_MFGORDER",
      title: "MFG No.",
      className: "sticky-column !px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[150px] cell-input mfgno elmes-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_ITEM",
      title: "Item",
      className: "!px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[75px] cell-input itemno elmes-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_PARTNAME",

      title: "Part Name",
      className: "!px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[200px] cell-input edit-input partname" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_DRAWING",

      title: "Drawing No.",
      className: "!px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[225px] cell-input edit-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_VARIABLE",

      title: "Variable",
      className: "!px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[200px] cell-input edit-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_QTY",

      title: "Qty.",
      className: "!px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="number" min="1" class="!w-[50px] cell-input edit-input" value="${
            data == "" ? 1 : data
          }">`;
        }
        return data;
      },
    },
    {
      data: "INQD_UM",

      title: "U/M",
      className: "!px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="type" class="!w-[75px] cell-input edit-input" value="${
            data == "" ? "PC" : data
          }">`;
        }
        return data;
      },
    },
    {
      data: "INQD_SUPPLIER",

      title: "Supplier",
      className: "!px-[3px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<select class="!w-[100px] select select-sm supplier edit-input">
            <option value=""></option>
            <option value="AMEC" ${
              data == "AMEC" ? "selected" : ""
            }>AMEC</option>
            <option value="MELINA" ${
              data == "MELINA" ? "selected" : ""
            }>MELINA</option>
            <option value="LOCAL" ${
              data == "LOCAL" ? "selected" : ""
            }>LOCAL</option>
          </select>`;
        }
        return data;
      },
    },
    {
      data: "INQD_SENDPART",
      title: `2<sup>nd</sup>`,
      className: "text-center",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="checkbox" class="checkbox checkbox-sm checkbox-primary text-black" value="1" ${
            data == 1 ? "checked" : ""
          } />`;
        }
        return data;
      },
    },
    {
      data: "INQD_UNREPLY",
      //   title: `<div class="text-center text-white">U/N</div>`,
      title: "U/N",
      className: "text-center",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="checkbox" class="checkbox checkbox-sm checkbox-error text-black unreply"
           ${data != "" ? "checked" : ""}/>`;
        }
        return data;
      },
    },
    {
      data: "INQD_MAR_REMARK",
      //   title: `<div class="text-center text-white">Remark</div>`,
      title: "Remark",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" class="!w-[250px] cell-input remark edit-input" value="${data}">`;
        }
        return data;
      },
    },
  ];
  opt.initComplete = function (settings, json) {
    const btn = `<div class="flex gap-2">
      <div class="tooltip" data-tip="Add line">
        <button id="addRowBtn" class="btn btn-primary btn-sm btn-square" type="button"><i class="icofont-plus text-xl text-white"></i></button>
      </div>
      <div class="tooltip" data-tip="Upload inquiry">
        <button id="uploadRowBtn" class="btn btn-neutral btn-sm btn-square"><i class="icofont-upload-alt text-xl text-white"></i></button>
        <input type="file" id="import-tsv" class="hidden" />
      </div>
      <div class="tooltip" data-tip="Download template">
        <button id="downloadTemplateBtn" class="btn btn-neutral btn-sm btn-square"><i class="icofont-download text-xl text-white"></i></button>
      </div>
    </div>`;
    $("#table").closest(".dt-container").find(".table-page").append(btn);
    $("#table")
      .closest(".dt-container")
      .find(".table-search")
      .append(
        `<h1 class="bg-primary font-semibold text-white w-full px-5 mb-3 rounded-2xl">Detail</h1>`
      );
  };
  return opt;
}

export async function setupTableDetailView(data = []) {
  const opt = {};
  opt.data = data;
  opt.searching = false;
  opt.responsive = false;
  opt.pageLength = 20;
  opt.dom = `<"flex"<"table-search flex flex-1 gap-5"f><"flex items-center table-option">><"bg-white border border-slate-300 rounded-2xl overflow-hidden overflow-x-scroll"t><"flex mt-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
  opt.columns = [
    {
      data: "INQD_SEQ",
      title: "No",
      className: "sticky-column text-right",
    },
    {
      data: "INQD_CAR",
      title: "CAR",
      className: "sticky-column text-center",
    },
    {
      data: "INQD_MFGORDER",
      title: "MFG No.",
      className: "sticky-column",
    },
    {
      data: "INQD_ITEM",
      title: "Item",
      className: "sticky-column",
    },
    {
      data: "INQD_PARTNAME",
      title: "Part Name",
      className: "text-nowrap",
    },
    {
      data: "INQD_DRAWING",
      title: "Drawing No.",
      className: "text-nowrap min-w-[200px]",
    },
    {
      data: "INQD_VARIABLE",
      title: "Variable",
      className: "min-w-[250px]",
    },
    {
      data: "INQD_QTY",
      title: "Qty.",
      //   className: "!px-[3px]",
    },
    {
      data: "INQD_UM",
      title: "U/M",
      //   className: "!px-[3px]",
    },
    {
      data: "INQD_SUPPLIER",
      title: "Supplier",
      //   className: "!px-[3px]",
    },
    {
      data: "INQD_SENDPART",
      title: `2<sup>nd</sup>`,
      className: "text-center",
      sortable: false,
      render: function (data, type, row, meta) {
        return data == null
          ? ""
          : `<i class="icofont-check-circled text-2xl"></i>`;
      },
    },
    {
      data: "INQD_UNREPLY",
      title: "U/N",
      className: "text-center",
      sortable: false,
      render: function (data, type, row, meta) {
        return data == null
          ? ""
          : `<i class="icofont-check-circled text-2xl"></i>`;
      },
    },
    {
      data: "INQD_MAR_REMARK",
      title: "MAR Remark",
      className: "min-w-[250px]",
    },
    {
      data: "INQD_DES_REMARK",
      title: "DE Remark",
      className: "min-w-[250px]",
    },
  ];
  opt.initComplete = function (settings, json) {
    $("#table")
      .closest(".dt-container")
      .find(".table-search")
      .append(
        `<h1 class="bg-primary font-semibold text-white w-full px-5 mb-3 rounded-2xl">Detail</h1>`
      );
  };
  return opt;
}

export async function setupTableHistory(data = []) {
  const opt = {};
  opt.data = data;
  opt.dom = `<"flex"<"table-search flex flex-1 gap-5 "><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden"t><"flex mt-5"<"table-page flex-1"p><"table-info flex flex-none gap-5"i>>`;
  opt.info = false;
  opt.lengthChange = false;
  opt.columns = [
    {
      data: "INQH_DATE",
      title: "Date",
      render: (data) => {
        return moment(data).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    { data: "users", title: "User", render: (data) => data.SNAME },
    { data: "status", title: "Action", render: (data) => data.STATUS_ACTION },
    { data: "INQH_REMARK", title: "Remark" },
  ];
  opt.initComplete = function (settings, json) {
    $("#history")
      .closest(".dt-container")
      .find(".table-search")
      .append(
        `<h1 class="bg-primary font-semibold text-white w-full px-5 mb-3 rounded-2xl">History</h1>`
      );
  };
  return opt;
}

export async function setupTableAttachment(data = []) {
  const opt = {};
  opt.data = data;
  opt.dom = `<"flex gap-3"<"table-search flex flex-1 gap-5 "><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-hidden"t><"flex mt-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
  opt.info = false;
  opt.columns = [
    { data: "FILE_ORIGINAL_NAME", title: "File Name" },
    { data: "FILE_SIZE", title: "Owner" },
    {
      data: "FILE_DATE",
      title: "File Date",
      render: (data) => {
        return new Date(data).toLocaleDateString("en-US", {});
      },
    },
  ];
  opt.initComplete = function (settings, json) {
    $("#attachment")
      .closest(".dt-container")
      .find(".table-search")
      .append(
        `<h1 class="bg-primary font-semibold text-white w-full px-5 mb-3 rounded-2xl">Attachment</h1>`
      );

    $("#attachment").closest(".dt-container").find(".table-option")
      .append(`<button class="btn btn-outline btn-neutral btn-sm btn-circle text-neutral hover:!text-white" id="add-attachment">
            <span class="loading loading-spinner hidden"></span>
            <span class="icofont-ui-clip text-xl"></span>
        </button>
        <input type="file" id="attachment-file" class="hidden" accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx,.txt" />`);

    $("#attachment")
      .closest(".dt-container")
      .find(".dt-length")
      .addClass("hidden");
  };
  return opt;
}

export async function elmesTable(data) {
  const opt = {};
  opt.dom = `<"flex mb-3"<"table-search flex flex-1 gap-5"><"flex items-center table-option"f>><"bg-white border border-slate-300 rounded-2xl"t><"flex mt-5"<"table-page flex-1"><"table-info flex  flex-none gap-5"p>>`;
  opt.data = data;
  opt.ordering = false;
  opt.columns = [
    { data: "orderno", title: "MFG No." },
    { data: "carno", title: "Car" },
    { data: "itemno", title: "Item" },
    { data: "partname", title: "Part Name" },
    { data: "drawing", title: "Drawing No." },
    { data: "variable", title: "Variable" },
    { data: "qty", title: "Qty" },
    {
      data: "supply",
      title: "Supply",
      render: (data) => {
        if (data == "R") return `LOCAL`;
        if (data == "J") return `MELINA`;
        if (data == "U") return ``;
        return `AMEC`;
      },
    },
    { data: "scndpart", title: `2<sup>nd</sup>` },
  ];
  opt.initComplete = function () {
    $("#tableElmes")
      .closest(".dt-container")
      .find(".table-search")
      .append(
        `<h1 class="font-semibold text-xl flex items-center">Part List</h1>`
      );
  };
  return opt;
}
