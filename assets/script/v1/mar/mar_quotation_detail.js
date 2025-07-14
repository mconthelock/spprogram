var formdata = new FormData();
var detailData = [];
var weightData = [];
var attachment = [];
var logs = [];
var quo = [];
var volumn = 0,
  gross = 0;
var tabledetail;
var tableattach;
var tableHistory;
var tableWeight;

$(document).ready(async () => {
  $(".nav-item").removeClass("active");
  $(".navmenu-quotation").addClass("active");

  $(".form-select-no-filter").select2({ minimumResultsForSearch: Infinity });
  $(".form-select-filter").select2();
  $(".form-date").each(function () {
    const opt = { ...datepickerOption };
    opt.maxViewMode = 0;
    opt.endDate = "+200d";
    opt.startDate = "0";
    $(this).datepicker(opt);
  });

  const id = $("#inqid").val();
  const no = $("#inqno").val();
  const needweight = $(".pkcreq:checked").val();

  //   $(".wrap-form-marinfo").find("input, select").prop("disabled", true);
  //   $(".wrap-form-inqinfo")
  //     .find('input[type="text"], select')
  //     .prop("disabled", true);
  //   $("#inqno").prop("disabled", false);
  //   $("#inqrev").prop("disabled", false);
  //   $("#trader").prop("disabled", false);
  //   $("#quotation").prop("disabled", false);
  $("#inqdate").prop("disabled", true);
  $("#inqno").prop("readonly", "readonly");
  $("#inqrev").prop("readonly", "readonly");

  detailData = await getInquiryDetail(id);
  attachment = await getAttachment(no);
  logs = await getHistory(no);
  quo = await getQuotation(id);
  weightData = await getWeight($("#inqid").val());

  tabledetail = createTableDetail(detailData);
  tableattach = craeteTableAttach(attachment);
  tableHistory = createTableHistory(logs);
  tableWeight = createTableWeight(weightData);

  if (quo.length > 0) {
    const quoData = quo[0];
    $("#quo-date").val(quoData.QUODATE);
    $("#quo-valdate").val(quoData.QUOVALIDITY);
    $("#note").val(quoData.QUO_NOTE);
  } else {
    $("#quo-date").val(moment().format("YYYY-MM-DD"));
    $("#quo-valdate").val(moment().add(180, "days").format("YYYY-MM-DD"));
  }

  //Hide Weight
  if (needweight == 1) {
    $(".nav-tabs").removeClass("d-none");
    $("#table-freight").removeClass("d-none");

    $(".sea").find(".volumn").val(digits(volumn, 0));
    $(".air").find(".volumn").val(digits(gross, 0));
    $(".courier").find(".volumn").val(digits(gross, 0));
    await setTotalFreight();
  }
});

$(document).on("change", ".price-ratio", async function (e) {
  e.preventDefault();
  const q = { trader: $("#trader").val(), quotation: $("#quotation").val() };
  const ratio = await getPriceRatio(q);
  tabledetail.rows().every(function (rw) {
    const selectedRow = $(this.node());
    const dt = this.data();
    const rate = ratio.find((el) => el.SUPPLIER == dt.INQD_SUPPLIER);
    dt.INQD_TC_BASE = rate != undefined ? rate.FORMULA : 0;
    tabledetail.row(selectedRow).data(dt).draw(false);
    selectedRow.find(".editable").inputmask("decimal", { rightAlign: true });
  });
});

$(document).on("change", ".editable", async function (e) {
  const selectedRow = $(this).closest("tr");
  const row = tabledetail.row(selectedRow).data();
  row.INQD_TC_COST = selectedRow.find(".tc_cost").val();
  row.INQD_QTY = selectedRow.find(".qty").val();
  tabledetail.row(selectedRow).data(row).draw(false);
  selectedRow.find(".editable").inputmask("decimal", { rightAlign: true });
});

$(document).on("change", ".freight", async function (e) {
  e.preventDefault();
  await setTotalFreight();
  $(this).val(digits($(this).val(), 0));
});

$(document).on("click", ".savedata", async function (e) {
  e.preventDefault();
  if ((await checkReqired("#inqform")) === false) return false;

  const action = $(this).attr("data-value");
  const totalprice = $("#total-price").html();
  if (totalprice == 0 && action == "99") {
    showErrorNotify("Cannot save data, total price is 0");
    return false;
  }

  $("#action").val(action);
  $.ajax({
    url: `${host}inquiry/quotation`,
    method: "post",
    dataType: "json",
    data: $("#inqform").serialize("textarea, select, input"),
    async: false,
    success: async function (res) {
      await createQuotation();
      if (action == "99") {
        await downloadQuotation();
      }
      window.location = host + "mar/quotation/released";
    },
  });
});

function downloadQuotation() {
  const id = $("#inqid").val();
  const url = `${host}mar/quotation/excel/${id}/`;
  window.open(url);
}

function createQuotation(id) {
  return new Promise((resolve) => {
    $.ajax({
      url: `${host}mar/quotation/create`,
      type: "POST",
      dataType: "json",
      data: $("#inqform").serialize("textarea, select, input"),
      async: false,
      success: async function (res) {
        resolve(res.status);
      },
    });
  });
}

function setTotalFreight() {
  $("#table-freight tbody tr").map((i, el) => {
    const freight = $(el).find(".freight").val();
    const volumn = $(el).find(".volumn").val();
    const total = intVal(freight) * intVal(volumn);
    $(el).find(".total").val(digits(total, 0));
  });
}

function createTableDetail(dt) {
  const tableid = "#inqdetail";
  const opt = { ...tableOption };
  opt.dom =
    '<lf<"fixed-table edit-table overlay-table"t><"tablefoot d-inline-flex pt-1 mt-3"i>p>';
  opt.searching = false;
  opt.paging = false;
  opt.data = dt;
  opt.order = [[0, "asc"]];

  const inputHidden = (name, data) => {
    return `<input type="hidden" class="${name}" name="${name}[]" value="${data}"/>`;
  };

  const inputArea = (
    name,
    data,
    w = "",
    readonly = true,
    toright = false,
    req = false
  ) => {
    return `<textarea
        class="${name} ${readonly ? "" : "editable editing"} ${
      toright ? "text-end" : ""
    } ${req ? "required" : ""}"
        name="${name}[]"
        style="width:${w == "" ? "100%" : w + "px"}; height: 55px;"
        ${readonly ? "readonly" : ""}
    >${data == null ? "" : data}</textarea>`;
  };

  opt.columns = [
    { data: "INQD_RUNNO", className: "d-none" },
    {
      data: "INQD_SEQ",
      className: "td-fixed",
      render: (data, e, row) => {
        return inputArea("seqno", data) + inputHidden("runno", row.INQD_RUNNO);
      },
    },
    {
      data: "INQD_CAR",
      className: "td-fixed",
      render: (data) => {
        if (!isNaN(parseInt(data))) {
          data = ("00" + data).substr(-2);
        }
        return inputArea("carno", data);
      },
    },
    {
      data: "INQD_MFGORDER",
      className: "td-fixed",
      render: (data) => {
        return inputArea("mfgno", data);
      },
    },
    {
      data: "INQD_ITEM",
      className: "td-fixed",
      render: (data) => {
        return inputArea("item", data);
      },
    },
    {
      data: "INQD_PARTNAME",
      render: (data) => {
        return inputArea("partname", data, 175);
      },
    },
    {
      data: "INQD_DRAWING",
      render: (data) => {
        const req = $(logingroup).val() == "MAR" ? false : true;
        return inputArea("drawing", data, 200);
      },
    },
    {
      data: "INQD_VARIABLE",
      render: (data) => {
        return inputArea("variable", data, 200);
      },
    },
    {
      data: "INQD_SUPPLIER",
      render: (data) => {
        //return inputSelect("supply", data);
        const str = data == null ? "" : data;
        return `<span style="padding: 5px 8px; color: var(--text_color)">${str}</span>`;
      },
    },
    {
      data: "INQD_SENDPART",
      className: "text-center",
      render: (data) => {
        let str = ""; //inputCheck("unreply", data);
        str += inputHidden("second_data", data);
        if (data !== null) str += "<i class='icofont-check-alt fs-4'></i>";
        return str;
      },
    },
    {
      data: "INQD_UNREPLY",
      className: "text-center",
      render: (data) => {
        let str = ""; //inputCheck("unreply", data);
        str += inputHidden("unreply_data", data);
        if (data !== null) str += "<i class='icofont-check-alt fs-4'></i>";
        return str;
      },
    },
    {
      data: "INQD_QTY",
      render: (data) => {
        return inputArea("qty", data, 50, false);
      },
    },
    {
      data: "INQD_UM",
      render: (data) => {
        return inputArea("unit", data, 50, true);
      },
    },
    {
      data: "INQD_TC_COST",
      render: (data, e, row) => {
        let readonly = true;
        if (row.INQD_SUPPLIER == "MELINA") readonly = false;
        return inputArea("tc_cost", digits(data, 0), 100, readonly, true);
      },
    },
    {
      data: "INQD_TC_BASE",
      render: (data, e, row) => {
        if (data == null) data = row.FORMULA;
        return inputArea("tc_base", digits(data, 2), 55, true, true);
      },
    },
    {
      data: "INQD_UNIT_PRICE",
      render: (data, e, row) => {
        const rate =
          row.INQD_TC_BASE != null
            ? intVal(row.INQD_TC_BASE)
            : intVal(row.FORMULA);
        const cost = intVal(row.INQD_TC_COST);
        data = rate * cost;
        return inputArea(
          "unitprice",
          digits(Math.ceil(data), 0),
          100,
          true,
          true
        );
      },
    },
    {
      data: "INQD_UNIT_PRICE",
      render: (data, e, row) => {
        const rate =
          row.INQD_TC_BASE != null
            ? intVal(row.INQD_TC_BASE)
            : intVal(row.FORMULA);
        const cost = intVal(row.INQD_TC_COST);
        const qty = intVal(row.INQD_QTY);
        data = rate * cost * qty;
        return inputArea(
          "subtotal",
          digits(Math.ceil(data), 0),
          100,
          true,
          true
        );
      },
    },
    {
      data: "INQD_DES_REMARK",
      render: (data) => {
        return `<div style="width: 200px; padding: 8px;">${
          data == null ? "" : data
        }</div>`;
      },
    },
    {
      data: "INQD_ID",
      className: "d-none",
      render: (data) => {
        return inputHidden("inqd_id", data);
      },
    },
  ];

  const colWidth = [55, 40, 100, 55];
  var left = 0;
  var leftArr = [];
  opt.createdRow = function (row, data) {
    //Fixed Column
    if (leftArr.length == 0) {
      leftArr.push(left);
      var head = $(tableid).find("thead tr:eq(0) th.td-fixed");
      head.map(function (i, th) {
        setTableWidth($(th), colWidth[i], left);
        //left += getTotalWidth($(th), colWidth[i] + 1);
        left += colWidth[i] + 1;
        leftArr.push(left);
      });
    }

    $(row)
      .find("td.td-fixed")
      .map(function (i, cols) {
        setTableWidth($(cols), colWidth[i], leftArr[i]);
      });

    $(row).find(".editable").inputmask("decimal", { rightAlign: true });
  };

  opt.footerCallback = function () {
    const api = this.api();
    const data = api.rows().data();
    let totalcost = 0;
    let totalunit = 0;
    let total = 0;
    let currency = "";
    data.map((el) => {
      const qty = intVal(el.INQD_QTY);
      const cost = intVal(Math.ceil(el.INQD_TC_COST));
      const rate =
        el.INQD_TC_BASE != null ? intVal(el.INQD_TC_BASE) : intVal(el.FORMULA);
      totalcost += intVal(Math.ceil(el.INQD_TC_COST));
      totalunit += Math.ceil(cost * rate);
      total += Math.ceil(cost * rate) * qty;
      currency = el.INQ_CUR;
    });
    api.column(13).footer().innerHTML = digits(totalcost, 0);
    api.column(15).footer().innerHTML = digits(totalunit, 0);
    api.column(16).footer().innerHTML = digits(total, 0);
    api.column(17).footer().innerHTML = currency;
  };
  return $(tableid).DataTable(opt);
}

function createTableWeight(dt) {
  const tableid = "#table-weight";
  const opt = { ...tableOption };
  opt.data = dt;
  opt.dom =
    '<lf<"fixed-table edit-table"t><"tablefoot d-inline-flex pt-1 mt-3"i>p>';
  opt.searching = false;
  opt.paging = false;

  const inputArea = (data) => {
    return `<input type="text" value="${data}" class="form-control text-end" readonly/>`;
  };

  opt.columns = [
    { data: "SEQ_WEIGHT", render: (data) => inputArea(data) },
    {
      data: "PACKAGE_TYPE",
      render: (data) =>
        `<input type="text" value="${data}" class="form-control" readonly/>`,
    },
    { data: "NO_WEIGHT", render: (data) => inputArea(data) },
    { data: "NET_WEIGHT", render: (data) => inputArea(digits(data, 0)) },
    { data: "GROSS_WEIGHT", render: (data) => inputArea(data) },
    { data: "WIDTH_WEIGHT", render: (data) => inputArea(data) },
    { data: "LENGTH_WEIGHT", render: (data) => inputArea(data) },
    { data: "HEIGHT_WEIGHT", render: (data) => inputArea(data) },
    { data: "VOLUMN_WEIGHT", render: (data) => inputArea(data) },
    { data: "ROUND_WEIGHT", render: (data) => inputArea(data) },
    { data: "INQ_ID", className: "text-center d-none" },
  ];

  opt.footerCallback = function () {
    const api = this.api();
    const data = api.rows().data();
    let total = 0,
      netweight = 0,
      grossweight = 0,
      width = 0,
      length = 0,
      height = 0,
      cube = 0,
      ceil = 0;
    data.map((el) => {
      const w = intVal(el.WIDTH_WEIGHT);
      const l = intVal(el.LENGTH_WEIGHT);
      const h = intVal(el.HEIGHT_WEIGHT);
      const val = (w * l * h) / 1000000;
      const ceilVal = Math.ceil(val);

      total += intVal(el.NO_WEIGHT);
      netweight += intVal(el.NET_WEIGHT);
      grossweight += intVal(el.GROSS_WEIGHT);
      width += w;
      length += l;
      height += h;
      cube += val;
      ceil += ceilVal;
    });
    api.column(2).footer().innerHTML = digits(total, 0);
    api.column(3).footer().innerHTML = digits(netweight, 0);
    api.column(4).footer().innerHTML = digits(grossweight, 0);
    api.column(5).footer().innerHTML = digits(width, 0);
    api.column(6).footer().innerHTML = digits(length, 0);
    api.column(7).footer().innerHTML = digits(height, 0);
    api.column(8).footer().innerHTML = digits(cube, 4);
    api.column(9).footer().innerHTML = digits(ceil, 0);
    volumn = ceil;
    gross = grossweight;
  };
  return $(tableid).DataTable(opt);
}
