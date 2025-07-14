$(".nav-item").removeClass("active");
$(".navmenu-newinq").addClass("active");

$("#marremark").closest(".row").addClass("d-none");
$("#currency").closest(".row").removeClass("d-none");
$(".form-select-no-filter").select2({ minimumResultsForSearch: Infinity });
$(".form-select-filter").select2();
$(".form-date").each(function () {
  const opt = { ...datepickerOption };
  opt.maxViewMode = 0;
  opt.endDate = "+500d";
  opt.startDate = "-7d";
  $(this).datepicker(opt);
});

var priceModal = new bootstrap.Modal(
  document.getElementById("pricelist-model"),
  {
    keyboard: false,
    backdrop: "static",
  }
);

$(document).on("change", "#cusid", async function (e) {
  e.preventDefault();
  const customer = await getCutomer($(this).val());
  if (customer.length > 0) {
    const data = customer[0];
    //$("#cuscur").val(data.CUS_CURENCY);
    $("#prjname").val(data.CUS_NAME + " STOCK");

    $("#trader").val("Direct").change();
    var agent = data.CUS_AGENT + " (" + data.CUS_COUNTRY + ")";
    $("#agent").val(agent).change();
    $("#country").val(data.CUS_COUNTRY);

    $("#quotation").val(data.CUS_QUOTATION).change();
    $("#term").val(data.CUS_TERM).change();
    $("#method").val(2).change();
    $("#shipment").val(data.CUS_LT).change();
    $("#currency").val(data.CUS_CURENCY);

    $("#add-item").removeClass("disabled");
    $("#inqno").focus();
  }
});

$(document).on("keyup", "#inqno", function () {
  $("#prjno").val($(this).val().toUpperCase());
});

$(document).on("change", "#inqno", async function () {
  const no = $(this)
    .val()
    .trim()
    .replace(/(\r\n|\n|\r)/g, "")
    .replaceAll(" ", "")
    .toUpperCase();
  const inquiry = await getInquiry(no);
  if (inquiry.length > 0) {
    $(this).val("");
    $("#prjno").val("");
    $("#inqno").focus();
    var notify = $.notify(
      {
        title: "Process Fail!!!",
        icon: "icofont-exclamation-circle",
        message: "Duppliccate Inquiry No.",
      },
      alertOption
    );
    notify.update("type", "error");
  } else {
    $(this).val(no);
    await handleInquiryChange();
  }
});

$(document).on("click", "#add-item", function (e) {
  e.preventDefault();
  const lastRow = tabledetail.row(":last").data();
  let seq = lastRow === undefined ? 1 : parseInt(lastRow.INQD_SEQ) + 1;
  const row = tabledetail.row
    .add({
      INQD_RUNNO: seq,
      INQD_SEQ: seq,
      INQD_ITEM: "",
      INQD_PARTNAME: "",
      INQD_DRAWING: "",
      INQD_VARIABLE: "",
      INQD_SUPPLIER: "",
      INQD_QTY: 1,
      INQD_UM: "",
      INQD_UNIT_PRICE: "",
      INQD_ID: "",
    })
    .draw();
});

$(document).on("change", ".item", async function (e) {
  e.preventDefault();
  if ($("#cusid").val() === "") return false;
  const customer = $("#cusid").val();
  const item = $(this).val();
  const price = await getPrice(customer, item);
  if (price.length > 0) {
    const index = tabledetail.row($(this).parents("tr")).index();
    $("#return_price").val(index);
    tableprice = await createTablePrice(price);
    priceModal.show();
  }
});

$(document).on("click", ".select-all", function (e) {
  e.preventDefault();
  tableprice.rows().select();
});

$(document).on("click", ".unselect-all", function (e) {
  e.preventDefault();
  tableprice.rows().deselect();
});

$(document).on("click", ".add-price-item", function (e) {
  e.preventDefault();
  const select = tableprice.rows(".selected").data();
  if (select.length == 0) {
    showErrorNotify("Please select some record");
    return false;
  }

  const target = $("#return_price").val();
  const found = tabledetail.row(target).data();
  const foundIndex = found.INQD_SEQ;
  tabledetail.row(target).remove().draw();

  var j = foundIndex + select.length;
  tabledetail.rows().every(function (rw) {
    const dt = this.data();
    if (dt.INQD_RUNNO >= foundIndex && dt.INQD_RUNNO < 100) {
      this.cells(rw, 0).every(function () {
        this.data(j);
      });
      this.cells(rw, 1).every(function () {
        this.data(j);
      });
      j = j + 1;
    }
  });
  let series = "GPSXL";
  select.map((el, i) => {
    if (parseInt(el.ITEM_NO) >= 600) {
      series = "JSWZ";
    }
    const row = tabledetail.row
      .add({
        INQD_RUNNO: parseInt(foundIndex) + i,
        INQD_SEQ: parseInt(foundIndex) + i,
        INQD_ITEM: el.ITEM_NO,
        INQD_PARTNAME: el.ITEM_NAME,
        INQD_DRAWING: el.ITEM_DWG,
        INQD_VARIABLE: el.ITEM_VARIABLE,
        INQD_SUPPLIER: el.ITEM_SUPPLIER,
        INQD_QTY: 1,
        INQD_UM: el.ITEM_UNIT,
        INQD_FC_COST: el.FCCOST,
        INQD_FC_BASE: el.FCBASE,
        INQD_TC_COST: el.TCCOST,
        INQD_TC_BASE: el.FORMULA,
        INQD_UNIT_PRICE: el.TCCOST * el.FORMULA,
        INQD_ID: "",
      })
      .draw();
  });
  priceModal.hide();
  $("#series").val(series);
  $("#savedata").removeClass("disabled");
});

$(document).on("click", ".delete-row:not(.disabled)", function (e) {
  e.preventDefault();
  const selectedRow = $(this).closest("tr");
  const found = tabledetail.row(selectedRow).data();
  const foundIndex = found.INQD_RUNNO;
  tabledetail.row(selectedRow).remove().draw();
  var i = foundIndex;
  tabledetail.rows().every(function (rw) {
    const dt = this.data();
    if (dt.INQD_RUNNO >= foundIndex) {
      this.cells(rw, 0).every(function () {
        this.data(i);
      });
      this.cells(rw, 1).every(function () {
        this.data(i);
      });
      i++;
    }
  });
});

$(document).on("change", ".qty", function (e) {
  e.preventDefault();
  const qty = $(this).val();
  const selectedRow = $(this).closest("tr");
  const row = tabledetail.row(selectedRow).data();
  const item = row.INQD_ITEM;
  const partname = row.INQD_PARTNAME;
  if (
    (item == "101" && partname == "T/M" && qty > 1) ||
    (item == "125" && partname == "SAFETY GEAR(GSC-400)" && qty > 1)
  ) {
    tabledetail.rows().every(function (rw) {
      const dt = this.data();
      let j = parseInt(dt.INQD_RUNNO) + parseInt(qty) - 1;
      if (dt.INQD_RUNNO > row.INQD_RUNNO) {
        this.cells(rw, 0).every(function () {
          this.data(j);
        });
        this.cells(rw, 1).every(function () {
          this.data(j);
        });
        j++;
      }
    });

    row.INQD_QTY = 1;
    tabledetail.row(selectedRow).data(row).draw();

    for (let i = 1; i < qty; i++) {
      const newrow = { ...row };
      newrow.INQD_RUNNO = row.INQD_RUNNO + i;
      newrow.INQD_SEQ = row.INQD_SEQ + i;
      tabledetail.row.add(newrow).draw();
    }
  } else {
    row.INQD_QTY = qty;
    tabledetail.row(selectedRow).data(row).draw();
  }
});

$(document).on("click", "#savedata", async function (e) {
  e.preventDefault();
  const id = $("#inqid").val();
  if ((await checkReqired("#forms")) === false) return false;
  $.ajax({
    url: `${host}inquiry/create`,
    method: "post",
    dataType: "json",
    data: $("#forms").serialize("textarea, select, input"),
    async: false,
    success: async function (res) {
      const newid = res.id;
      if (id > 0) await revised(id, newid);
      await createQuotation(newid);
      window.location = host + "mar/quotation/released";
    },
  });
});
function createQuotation(id) {
  return new Promise((resolve) => {
    $("#inqid").val(id);
    $.ajax({
      url: `${host}mar/quotation/create`,
      type: "POST",
      dataType: "json",
      data: $("#forms").serialize("textarea, select, input"),
      async: false,
      success: async function (res) {
        resolve(res.status);
      },
    });
  });
}

function createTableDetail(dt) {
  const tableid = "#inqdetail";
  const opt = { ...tableOption };
  opt.dom =
    '<lf<"fixed-table edit-table"t><"tablefoot d-inline-flex pt-1 mt-3"i>p>';
  opt.searching = false;
  opt.paging = false;
  opt.orderFixed = [0, "asc"];
  opt.columnDefs = [
    {
      visible: false,
      searchable: false,
      orderable: false,
      targets: 0,
    },
  ];
  opt.data = dt;
  const inputArea = (name, data, w = "", readonly = true, toright = false) => {
    return `<textarea
        class="${name}
            ${readonly ? "" : "editable"}
            ${toright ? "text-end" : ""}"
        name="${name}[]"
        rows="1"
        style="width:${w == "" ? "100%" : w + "px"}; height: 55px;"
        ${readonly ? "readonly" : ""}
    >${data == null ? "" : data}</textarea>`;
  };

  const inputHidden = (name, data) => {
    return `<input type="hidden" class="${name}" name="${name}[]" value="${data}"/>`;
  };

  opt.columns = [
    { data: "INQD_RUNNO" },
    {
      data: "INQD_SEQ",
      render: (data) => {
        return inputArea("seqno", data);
      },
    },
    {
      data: "INQD_ITEM",
      render: (data) => {
        return inputArea("item", data, 55, false);
      },
    },
    {
      data: "INQD_PARTNAME",
      render: (data) => {
        return inputArea("partname", data);
      },
    },
    {
      data: "INQD_DRAWING",
      render: (data) => {
        return inputArea("drawing", data);
      },
    },
    {
      data: "INQD_VARIABLE",
      render: (data) => {
        return inputArea("variable", data);
      },
    },
    {
      data: "INQD_SUPPLIER",
      render: (data) => {
        return inputArea("supply", data, 30);
      },
    },
    {
      data: "INQD_QTY",
      render: (data) => {
        return inputArea("qty", data, 30, false);
      },
    },
    {
      data: "INQD_UM",
      render: (data) => {
        return inputArea("unit", data, 20);
      },
    },
    {
      data: "INQD_TC_COST",
      render: (data) => {
        return inputArea("tc_cost", digits(data, 2), 75, true, true);
      },
    },
    {
      data: "INQD_TC_BASE",
      render: (data) => {
        return inputArea("tc_base", digits(data, 4), 55, true, true);
      },
    },
    {
      data: "INQD_UNIT_PRICE",
      render: (data) => {
        return inputArea("unitprice", digits(data, 2), 75, true, true);
      },
    },
    {
      data: "INQD_UNIT_PRICE",
      render: (data, e, row) => {
        const val = data * row.INQD_QTY;
        return inputArea("", digits(val, 2), 75, true, true);
      },
    },
    {
      data: "INQD_ID",
      className: "action",
      render: (data) => {
        return `<a href="#" class="delete
            ${data == "" ? "delete-row" : "remove-row"}">
            <i class="icofont-close fs-5"></i>
          </a>`;
      },
    },
    { data: "INQD_FC_COST", render: (data) => inputHidden("fc_cost", data) },
    { data: "INQD_FC_BASE", render: (data) => inputHidden("fc_base", data) },
    { data: "INQD_RUNNO", render: (data) => inputHidden("runno", data) },
  ];
  opt.initComplete = function () {
    const footer = `
        <button type="button" id="add-item" class="btn btn-second me-2 ${
          $("#inqid").val() != "" ? "" : "disabled"
        }">Add Item</button>
        <button type="button" id="savedata" class="btn btn-main me-2 ${
          $("#inqid").val() != "" ? "" : "disabled"
        }">Save Data</button>
        <a href="#" onclick="location.reload();" class="btn btn-cancel me-2">Cancel</a>
    `;
    $(".tablefoot").html(footer);
  };
  return $(tableid).DataTable(opt);
}

function createTablePrice(dt) {
  const tableid = "#price-table";
  const opt = { ...tableOption };
  if ($.fn.DataTable.isDataTable(tableid)) {
    $(tableid).dataTable().api().destroy();
    $(tableid).find("tbody").empty();
  }

  opt.dom = '<lf<"price-data"t><"price-foot d-inline-flex pt-1 mt-3"i>p>';
  opt.data = dt;
  opt.pageLength = 10;
  opt.select = { style: "multi" };
  opt.columns = [
    { data: "ITEM_NO" },
    { data: "ITEM_NAME" },
    { data: "ITEM_DWG" },
    { data: "ITEM_VARIABLE" },
    { data: "ITEM_UNIT" },
    { data: "ITEM_SUPPLIER" },
    {
      data: "ITEM_QTY",
      render: (data) => {
        return 1;
      },
    },
    {
      data: "TCCOST",
      className: "text-end",
      render: (data) => {
        return digits(data, 2);
      },
    },
    {
      data: "FORMULA",
      className: "text-center",
      render: (data) => {
        return digits(data, 4);
      },
    },
    {
      data: "TCCOST",
      className: "text-end",
      render: (data) => {
        return digits(data, 2);
      },
    },
  ];
  opt.initComplete = () => {
    const str = `
        <a class="btn btn-second me-2 select-all" href="#">Select All</a>
        <a class="btn btn-second me-2 unselect-all" href="#">Select none</a>
        <a class="btn btn-main me-2 add-price-item" href="#">Add to inquiry</a>
        <a class="btn btn-delete me-2 dismiss" data-bs-dismiss="modal" href="#">Dismiss</a>
    `;
    $(".price-foot").append(str);
  };
  return $(tableid).DataTable(opt);
}

function createTableView(dt) {
  const tableid = "#inqdetail";
  const opt = { ...tableOption };
  opt.dom = '<lf<"fixed-table"t><"tablefoot d-inline-flex pt-1 mt-3"i>p>';
  opt.searching = false;
  opt.paging = false;
  opt.orderFixed = [0, "asc"];
  opt.data = dt;
  opt.columns = [
    { data: "INQD_SEQ" },
    { data: "INQD_ITEM" },
    { data: "INQD_PARTNAME", className: "text-nowrap" },
    { data: "INQD_DRAWING", className: "text-nowrap" },
    { data: "INQD_VARIABLE" },
    { data: "INQD_SUPPLIER" },
    { data: "INQD_QTY" },
    { data: "INQD_UM" },
    {
      data: "INQD_TC_COST",
      className: "text-end",
      render: (data) => digits(data, 2),
    },
    {
      data: "INQD_TC_BASE",
      className: "text-end",
      render: (data) => digits(data, 4),
    },
    {
      data: "INQD_UNIT_PRICE",
      className: "text-end",
      render: (data) => digits(data, 2),
    },
    {
      data: "INQD_UNIT_PRICE",
      className: "text-end",
      render: (data, e, row) => digits(data * row.INQD_QTY, 2),
    },
  ];
  opt.initComplete = function () {
    const id = $("#inqid").val();
    const footer = `
        <a class="btn btn-second me-2 export" href="${host}/inquiry/exportexcel/${id}">Export</a>
        <a href="#" onclick="history.back();" class="btn btn-cancel me-2">Back</a>`;
    $(".tablefoot").html(footer);
  };
  return $(tableid).DataTable(opt);
}

async function handleInquiryChange() {
  const prop = await getInquiryProperties();
  if (prop.length > 0) {
    const data = prop[0];
    $("#term").val(data.CNT_TERM).change();
    if ($("#trader").val() != "Direct") {
      $("#trader").val(data.CNT_TRADER).change();
      $("#quotation").val(data.CNT_QUOTATION).change();
    } else {
      $("#quotation").val(4).change();
    }

    if (data.CNT_WEIGHT == 1) {
      $("#pkcreq1").prop("checked", true);
    } else {
      $("#pkcreq0").prop("checked", true);
    }
  }
}
