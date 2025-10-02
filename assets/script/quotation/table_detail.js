import * as utils from "../utils.js";
export async function setupTableDetail(data = [], type = "SP") {
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
  opt.lengthChange = false;
  opt.searching = false;
  opt.responsive = false;
  opt.info = false;
  opt.orderFixed = [0, "asc"];
  opt.dom = `<"flex "<"table-search flex flex-1 gap-5 "f><"flex items-center table-option"l>><"bg-white border border-slate-300 rounded-2xl overflow-auto overflow-x-scroll max-h-[92vh]"t><"flex mt-5"<"table-page flex-1"p><"table-info flex  flex-none gap-5"i>>`;
  opt.columns = [
    {
      data: "INQD_RUNNO",
      className: "hidden",
    },
    {
      data: "INQD_SEQ",
      title: "No",
      className: "sticky-column w-[50px] min-w-[50px]",
    },
    {
      data: "INQD_CAR",
      title: "CAR",
      className: "sticky-column w-[50px] min-w-[50px]",
    },
    {
      data: "INQD_MFGORDER",
      title: "MFG NO.",
      className:
        "!px-[3px] w-[100px] min-w-[100px] max-w-[100px] sticky-column",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          data = data == null ? "" : data;
          return `<div class="px-2">${data}</div>`;
        }
        return data;
      },
    },
    {
      data: "INQD_ITEM",
      title: "Item",
      className:
        "!px-[3px] w-[75px] min-w-[75px] max-w-[75px] item-no sticky-column",
      sortable: false,
      render: function (data, type, row, meta) {
        if (type === "display") {
          data = data == null ? "" : data;
          return `<div class="px-2">${data}</div>`;
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
          return `<div class="px-2 min-w-[200px] max-w-[200px] break-all">${data}</div>`;
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
          return `<div class="px-2 min-w-[200px] max-w-[200px] break-all">${data}</div>`;
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
          return `<div class="px-2 min-w-[200px] max-w-[200px] break-all">${data}</div>`;
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
      data: "INQD_SENDPART",
      title: "2nd",
      render: function (data, type) {
        if (type === "display") {
          data = data == null ? "" : data;
          return `<div class="px-2">${data}</div>`;
        }
        return data;
      },
    },
    {
      data: "INQD_UNREPLY",
      title: "U/N",
      render: function (data, type) {
        if (type === "display") {
          data =
            data == null
              ? ""
              : `<i class="fi fi-sr-circle-xmark text-xl text-error"></i>`;
          return `<div class="px-2">${data}</div>`;
        }
        return data;
      },
    },
    {
      data: "INQD_QTY",
      title: "Qty.",
      className: "!px-[3px] INQD_QTY",
      render: function (data, type) {
        if (type === "display") {
          data = data == null ? "" : data;
          return `<div class="px-2"><input type="text" class="w-full min-w-[55px] outline-0 text-right input-number inqty" value="${data}"/></div>`;
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
      data: "INQD_TC_COST",
      title: "TC Cost",
      className: `min-w-[100px] INQD_TC_COST`,
      render: function (data, type, row) {
        if (type === "display") {
          data = data == null ? "" : data;
          if (row.INQD_SUPPLIER == "MELINA") {
            return `<div class="px-2"><input type="text" class="w-full min-w-[55px] outline-0 text-right input-number inqprice" value="${data}"/></div>`;
          }
          return `<div class="px-2 text-right!">${utils.digits(data, 0)}</div>`;
        }
        return data;
      },
    },
    {
      data: "INQD_TC_BASE",
      title: "% TC",
      className: `min-w-[70px]`,
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
      className: `min-w-[100px]`,
      render: function (data, type) {
        if (type === "display") {
          data = data == null ? "" : Math.ceil(data);
          return `<div class="px-2 text-right!">${utils.digits(data, 0)}</div>`;
        }
        return data;
      },
    },
    {
      data: "INQD_UNIT_PRICE",
      title: "Total Price",
      className: `min-w-[100px]`,
      render: function (data, type, row) {
        const totalPrice = Math.ceil(row.INQD_UNIT_PRICE) * row.INQD_QTY;
        if (type === "display") {
          return `<div class="px-2 text-right!">${utils.digits(
            totalPrice,
            0
          )}</div>`;
        }
        return data;
      },
    },
    {
      data: "INQD_MAR_REMARK",
      title: "MAR Remark",
      className: `min-w-[250px]`,
      render: function (data, type) {
        if (type === "display") {
          if (data == null) return "";
          return `<div class="flex">
            <div class="px-2 min-w-[250px] max-w-[250px] break-all text-xs line-clamp-1">${data}</div>
            <div class="tooltip tooltip-left" data-tip="${data}"><i class="fi fi-rr-info text-lg"></i></div>
          </div>`;
        }
        return data;
      },
    },
    {
      data: "INQD_DES_REMARK",
      title: "D/E Remark",
      className: `min-w-[250px]`,
      render: function (data, type) {
        if (type === "display") {
          if (data == null) return "";
          return `<div class="flex">
            <div class="px-2 min-w-[250px] max-w-[250px] break-all text-xs line-clamp-1">${data}</div>
            <div class="tooltip tooltip-left" data-tip="${data}"><i class="fi fi-rr-info text-lg"></i></div>
          </div>`;
        }
        return data;
      },
    },
  ];
  opt.createdRow = function (row, data, dataIndex) {
    $(row).find("td.INQD_QTY").addClass("bg-yellow-100");
    if (data.INQD_SUPPLIER == "MELINA") {
      $(row).find(".INQD_TC_COST").addClass("bg-yellow-100");
    }

    if (data.INQD_UNREPLY != null) {
      $(row).find("td").addClass("bg-gray-300!");
      $(row).find("td").find(".inqty").attr("readonly", true);
    }
  };
  opt.initComplete = function () {
    const api = this.api();
    let sumtcCost = 0;
    let sumUnit = 0;
    let sumTotal = 0;
    api
      .column(13, { page: "-1" })
      .data()
      .each(function (value) {
        sumtcCost += Math.ceil(value);
      });

    api
      .column(15, { page: "-1" })
      .data()
      .each(function (value) {
        sumUnit += Math.ceil(value);
      });

    api
      .column(16, { page: "-1" })
      .data()
      .each(function (value, index) {
        // Get the corresponding row data to access qty
        const rowData = api.row(index).data();
        const qty = rowData ? rowData.INQD_QTY : 0;
        const totalPrice = qty * Math.ceil(rowData.INQD_UNIT_PRICE);
        sumTotal += totalPrice;
      });

    const footer = `<tr class="bg-slate-200 font-semibold">
            <th class="text-right pr-5!" colspan="${
              type === "SP" ? 12 : 8
            }">Total</th>
            <th class="text-right total-tc">${utils.digits(sumtcCost, 0)}</th>
            <th class="text-right"></th>
            <th class="text-right total-unit">${utils.digits(sumUnit, 0)}</th>
            <th class="text-right grand-total">${utils.digits(sumTotal, 0)}</th>
            <th class="${type !== "SP" ? "hidden" : ""}"></th>
            <th class="${type !== "SP" ? "hidden" : ""}"></th>
          </tr>`;
    $("#table tfoot").append(footer);
    $("#table tfoot").addClass("sticky! bottom-0! bg-white! z-10! shadow-md!");
    if (type !== "SP") {
      this.api().column(2).visible(false);
      this.api().column(3).visible(false);
      this.api().column(9).visible(false);
      this.api().column(10).visible(false);
      this.api().column(19).visible(false);
      this.api().column(20).visible(false);
    }
  };
  return opt;
}
