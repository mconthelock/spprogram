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
      render: function (data, type) {
        if (type === "display") {
          return `
          <button class="btn btn-sm btn-circle btn-ghost delete-sub-line text-red-500"><i class="fi fi-bs-cross"></i></button>`;
        }
        return data;
      },
    },
    {
      data: "INQD_SEQ",
      title: "No",
      className: "max-w-[50px]",
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
      render: function (data, type) {
        if (type === "display") {
          data = data == null ? "" : data;
          return `<div class="px-2">${data}</div>`;
        }
        return data;
      },
    },
    {
      data: "INQD_DRAWING",
      title: "Drawing No.",
      render: function (data, type) {
        if (type === "display") {
          data = data == null ? "" : data;
          return `<div class="px-2">${data}</div>`;
        }
        return data;
      },
    },
    {
      data: "INQD_VARIABLE",
      title: "Variable",
      render: function (data, type) {
        if (type === "display") {
          data = data == null ? "" : data;
          return `<div class="px-2 max-w-[250px] break-all">${data}</div>`;
        }
        return data;
      },
    },
    {
      data: "INQD_QTY",
      title: "Qty.",
      className: "!px-[3px] max-w-[75px] item-no",
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
      render: function (data, type) {
        if (type === "display") {
          data = data == null ? "" : data;
          return `<div class="px-2">${data}</div>`;
        }
        return data;
      },
    },
    {
      data: "INQD_SUPPLIER",
      title: "Supplier",
      render: function (data, type) {
        if (type === "display") {
          data = data == null ? "" : data;
          return `<div class="px-2">${data}</div>`;
        }
        return data;
      },
    },
    {
      data: "INQD_FC_COST",
      title: "FC Cost",
      render: function (data, type) {
        if (type === "display") {
          data = data == null ? "" : data;
          return `<div class="px-2 text-right!">${utils.digits(data, 2)}</div>`;
        }
        return data;
      },
    },
    {
      data: "INQD_FC_BASE",
      title: "FC Base",
      render: function (data, type) {
        if (type === "display") {
          data = data == null ? "" : data;
          return `<div class="px-2 text-right!">${utils.digits(data, 2)}</div>`;
        }
        return data;
      },
    },
    {
      data: "INQD_TC_COST",
      title: "TC Cost",
      render: function (data, type) {
        if (type === "display") {
          data = data == null ? "" : data;
          return `<div class="px-2 text-right!">${utils.digits(data, 2)}</div>`;
        }
        return data;
      },
    },
    {
      data: "INQD_TC_BASE",
      title: "TC Base",
      render: function (data, type) {
        if (type === "display") {
          data = data == null ? "" : data;
          return `<div class="px-2 text-right!">${utils.digits(data, 3)}</div>`;
        }
        return data;
      },
    },
    {
      data: "INQD_UNIT_PRICE",
      title: "Unit Price",
      render: function (data, type) {
        if (type === "display") {
          data = data == null ? "" : data;
          return `<div class="px-2 text-right!">${utils.digits(data, 3)}</div>`;
        }
        return data;
      },
    },
  ];
  opt.initComplete = function (settings, json) {};
  return opt;
}

export async function setupTablePriceList(data) {
  const opt = { ...utils.tableOpt };
  opt.data = data;
  opt.lengthChange = false;
  opt.responsive = false;
  opt.pageLength = 10;
  opt.orderFixed = [0, "asc"];
  opt.dom = `<"flex "<"table-search flex flex-1 gap-5 "l><"flex items-center table-option mb-3"f>><"bg-white border border-slate-300 rounded-2xl"t><"flex mt-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
  opt.columns = [
    { data: "itemdesc.ITEM_NO", title: "Item No" },
    {
      data: "itemdesc.ITEM_NAME",
      title: "Part Name",
      render: function (data, type) {
        if (type === "display") {
          data = data == null ? "" : data;
          return `<div class="px-2 max-w-[250px] break-all">${data}</div>`;
        }
        return data;
      },
    },
    {
      data: "itemdesc.ITEM_DWG",
      title: "Drawing No",
      render: function (data, type) {
        if (type === "display") {
          data = data == null ? "" : data;
          return `<div class="px-2 max-w-[250px] break-all">${data}</div>`;
        }
        return data;
      },
    },
    {
      data: "itemdesc.ITEM_VARIABLE",
      title: "Variable",
      render: function (data, type) {
        if (type === "display") {
          data = data == null ? "" : data;
          return `<div class="px-2 max-w-[250px] break-all">${data}</div>`;
        }
        return data;
      },
    },
    {
      data: "itemdesc.ITEM_UNIT",
      title: "Unit",
      render: function (data, type) {
        if (type === "display") {
          data = data == null ? "" : data;
          return `<div class="px-2 max-w-[250px] break-all">${data}</div>`;
        }
        return data;
      },
    },
    {
      data: "itemdesc.ITEM_SUPPLIER",
      title: "Supplier",
      render: function (data, type) {
        if (type === "display") {
          data = data == null ? "" : data;
          return `<div class="px-2 max-w-[250px] break-all">${data}</div>`;
        }
        return data;
      },
    },
    {
      data: "itemdesc.prices",
      title: "FC Cost",
      className: "text-right!",
      render: function (data, type) {
        if (type === "display") {
          data = data == null ? "" : data;
          return `<div class="px-2 text-right!">${utils.digits(
            data[0].FCBASE,
            2
          )}</div>`;
        }
        return data;
      },
    },
    {
      data: "itemdesc.prices",
      title: "FC Rate",
      className: "text-right!",
      render: function (data, type) {
        if (type === "display") {
          data = data == null ? "" : data;
          return `<div class="px-2 text-right!">${utils.digits(
            data[0].FCBASE,
            2
          )}</div>`;
        }
        return data;
      },
    },
    {
      data: "itemdesc.prices",
      title: "TC Cost",
      className: "text-right!",
      render: function (data, type) {
        if (type === "display") {
          data = data == null ? "" : data;
          return `<div class="px-2 text-right!">${utils.digits(
            data[0].FCBASE,
            2
          )}</div>`;
        }
        return data;
      },
    },
    {
      data: "customer.rate",
      title: "TC Rate",
      className: "text-right!",
      render: function (data, type) {
        if (type === "display") {
          data = data == null ? "" : data;
          return `<div class="px-2 text-right!">${utils.digits(
            data.FORMULA,
            3
          )}</div>`;
        }
        return data;
      },
    },
    {
      data: "customer.rate",
      title: "Unit Price",
      className: "text-right!",
      render: (data, type, row) => {
        const formula = data.FORMULA;
        const cost = row.itemdesc.prices[0].TCCOST;
        const price = formula * cost;
        if (type === "display") {
          data = data == null ? "" : data;
          return `<div class="px-2 text-right!">${utils.digits(
            price,
            3
          )}</div>`;
        }
        return price;
      },
    },
  ];
  return opt;
}
