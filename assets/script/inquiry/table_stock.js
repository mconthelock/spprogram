import * as utils from "../utils.js";
export async function setupTableDetail(data = []) {
  const renderText = (str, logs, key) => {
    if (logs == undefined) return str;
    let li = ``;
    const log = logs.sort(
      (a, b) => new Date(b.LOG_DATE) - new Date(a.LOG_DATE)
    );
    log.map((el) => {
      li += `<li class="flex gap-4 p-1 border-b">
        <div>${el[key] == null ? "" : el[key]}</div>
        <div class="text-xs">${moment(el.UPDATE_AT).format(
          "yyyy-MM-DD h:mm a"
        )}</div>
        <div class="text-xs">${utils.displayname(el.UPDATE_BY).fname}</div>
      </li>`;
    });
    const element = `<ul class="hidden">${li}</ul>${str}`;
    return element;
  };

  const renderLog = (data, logs, key) => {
    let update = false;
    if (logs == undefined) return update;
    if (logs.length > 0) {
      logs.map((log) => {
        if (log[key] != data) update = true;
      });
    }
    return update;
  };

  const mode = data.length > 0 ? 1 : 0;
  const opt = { ...utils.tableOpt };
  opt.data = data;
  opt.paging = false;
  opt.searching = false;
  opt.responsive = false;
  opt.info = false;
  opt.orderFixed = [0, "asc"];
  opt.dom = `<"flex "<"table-search flex flex-1 gap-5 "f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl"t><"flex mt-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
  opt.columns = [
    {
      data: "INQD_RUNNO",
      title: "",
      className: "hidden",
    },
    {
      data: "INQD_ID",
      title: "<i class='icofont-settings text-lg'></i>",
      className:
        "text-center text-nowrap px-1 w-[50px] min-w-[50px] max-w-[50px]",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `
          <button class="btn btn-sm btn-circle btn-ghost ${
            row.INQD_OWNER == "MAR"
              ? "delete-sub-line text-red-500"
              : "btn-disabled"
          }"><i class="fi fi-bs-cross"></i></button>`;
        }
        return data;
      },
    },
    {
      data: "INQD_SEQ",
      title: "No",
      className: "!px-[3px] w-[50px] min-w-[50px] max-w-[50px]",
      sortable: false,
    },
    {
      data: "INQD_ITEM",
      title: "Item",
      className: "!px-[3px] w-[75px] min-w-[75px] max-w-[75px] item-no",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          return `<input type="text" maxlength="3" minlength="3" class="!w-[75px] cell-input edit-input itemno " value="${data}"/>`;
        }
        return data;
      },
    },
    {
      data: "INQD_PARTNAME",
      title: "Part Name",
      className: "!px-[3px]",
      sortable: false,
      //   render: function (data, type, row, meta) {
      //     if (type === "display") {
      //       return `<textarea class="!w-[250px] cell-input edit-input partname" maxlength="50">${
      //         data == null ? "" : data
      //       }</textarea>`;
      //     }
      //     return data;
      //   },
    },
    {
      data: "INQD_DRAWING",
      title: "Drawing No.",
      className: "!px-[3px] drawing-line",
      sortable: false,
      //   render: function (data, type, row, meta) {
      //     if (type === "display") {
      //       return `<textarea class="!w-[225px] uppercase cell-input edit-input drawing-line" maxlength="150">${
      //         data == null ? "" : data
      //       }</textarea>`;
      //     }
      //     return data;
      //   },
    },
    {
      data: "INQD_VARIABLE",
      title: "Variable",
      className: "!px-[3px]",
      sortable: false,
      //   render: function (data, type) {
      //     if (type === "display") {
      //       return `<textarea class="!w-[200px] uppercase cell-input edit-input variable-line" maxlength="250">${
      //         data == null ? "" : data
      //       }</textarea>`;
      //     }
      //     return data;
      //   },
    },
    {
      data: "INQD_QTY",
      title: "Qty.",
      className: "!px-[3px] w-[75px] min-w-[75px] max-w-[75px] item-no",
      sortable: false,
      render: function (data, type, row) {
        if (type === "display") {
          return `<input type="number" min="1" class="!w-[50px] cell-input edit-input" value="${data}">`;
        }
        return data;
      },
    },
    {
      data: "INQD_UM",
      title: "U/M",
      className: "!px-[3px]",
      sortable: false,
      //   render: function (data, type, row, meta) {
      //     data = data == "" ? "PC" : data;
      //     if (type === "display") {
      //       return `<input type="type" class="!w-[75px] uppercase cell-input edit-input" value="${data}">`;
      //     }
      //     return data;
      //   },
    },
    {
      data: "INQD_SUPPLIER",
      title: "Supplier",
      className: "!px-[3px] supplier-line",
      sortable: false,
      //   render: function (data, type, row) {
      //     if (type === "display") {
      //       return `<select class="!w-[100px] select select-sm supplier edit-input" ${
      //         row.INQD_UNREPLY == "" || row.INQD_UNREPLY == null ? "" : "disabled"
      //       }>
      //         <option value=""></option>
      //         <option value="AMEC" ${
      //           data == "AMEC" ? "selected" : ""
      //         }>AMEC</option>
      //         <option value="MELINA" ${
      //           data == "MELINA" ? "selected" : ""
      //         }>MELINA</option>
      //         <option value="LOCAL" ${
      //           data == "LOCAL" ? "selected" : ""
      //         }>LOCAL</option>
      //       </select>`;
      //     }
      //     return data;
      //   },
    },
    // {
    //   data: "INQD_MAR_REMARK",
    //   className: "remark-line",
    //   title: "Remark",
    //   sortable: false,
    //   render: function (data, type, row, meta) {
    //     if (type === "display") {
    //       return `<textarea class="!w-[250px] cell-input edit-input remark" maxlength="250">${
    //         data == null ? "" : data
    //       }</textarea>`;
    //     }
    //     return data;
    //   },
    // },
    { data: "INQD_FC_COST", title: "FC Cost" },
    { data: "INQD_FC_BASE", title: "FC Base" },
    { data: "INQD_TC_COST", title: "TC Cost" },
    { data: "INQD_TC_BASE", title: "TC Base" },
    { data: "INQD_UNIT_PRICE", title: "Unit Price" },
  ];
  opt.initComplete = function (settings, json) {};
  return opt;
}

export async function setupTablePriceList() {}
