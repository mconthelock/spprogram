$(".form-select-no-filter").select2({ minimumResultsForSearch: Infinity });
$(".form-select-filter").select2();
$(".form-date").each(function () {
  const opt = { ...datepickerOption };
  opt.maxViewMode = 0;
  opt.endDate = "+30d";
  opt.startDate = "-7d";
  $(this).datepicker(opt);
});

$(document).on("click", "#import", async function () {
  await showLoading();
  $("#importfile").click();
});

$(document).on("cancel", "#importfile", async function () {
  await hideLoading();
});

$(document).on("change", "#importfile", async function () {
  try {
    const file = $(this).prop("files")[0];
    const ext = file.name.split(".").pop().toLowerCase();
    const data = await readSheeetFile(file);
    const dt = tabledetail.rows().data().toArray();
    dt.map((val, i) => {
      const item = data.find((p) => p.runno == val.INQD_RUNNO);
      if (item) {
        val.INQD_FC_COST = item.fc;
        val.INQD_FIN_REMARK = item.remark;
        tabledetail.row(i).data(val).draw();
      }
    });
  } catch (e) {
    showErrorNotify(e);
  }
  await hideLoading();
});

$(document).on("change", ".editable", function () {
  const selectedRow = $(this).closest("tr");
  const row = tabledetail.row(selectedRow).data();
  row.INQD_FC_COST = selectedRow.find(".fc_cost").val();
  row.INQD_FIN_REMARK = selectedRow.find(".fin_comment").val();
  row.INQD_FC_BASE = selectedRow.find(".fc_base").val();
  tabledetail.row(selectedRow).data(row).draw();

  const rate = selectedRow.find(".fc_base").val();
  tabledetail.rows().every(function (rw) {
    const rowdata = this.data();
    this.data({
      ...rowdata,
      INQD_FC_BASE: rate,
    });
  });

  selectedRow.find(".fc_cost").inputmask("decimal", { rightAlign: true });
  selectedRow.find(".fc_base").inputmask("decimal", { rightAlign: true });
});

$(document).on("click", ".savedata", async function (e) {
  e.preventDefault();
  const prev = $("#action").val();
  if ((await checkReqired("#inqform")) === false) return false;

  //Confirm Cost function
  if (prev == 1) {
    if ($("#finconfirm").val() == "")
      $("#finconfirm").val(moment().format("YYYY-MM-DD HH:mm:ss"));
    $("#finchecker").prop("disabled", true);
    $("#fincheck").prop("disabled", true);
    $("#finfinish").prop("disabled", true);
  }

  //Check Cost function
  if (prev == 2) {
    $("#finfinish").prop("disabled", true);
    if ($(this).attr("data-value") == 16) $("#fincheck").prop("disabled", true);
    else {
      if ($("#fincheck").val() == "")
        $("#fincheck").val(moment().format("YYYY-MM-DD HH:mm:ss"));
    }
  }

  if ($(this).attr("data-value") == 18) $("#fincheck").prop("disabled", true);
  $("#action").val($(this).attr("data-value"));
  $.ajax({
    url: `${host}inquiry/update`,
    method: "post",
    dataType: "json",
    data: $("#inqform").serialize("textarea, select, input"),
    async: false,
    success: async function (res) {
      if (prev == 1) {
        window.location = host + "fin/inquiry";
        return true;
      }

      if (prev == 2) {
        window.location = host + "fin/inquiry/checker";
        return true;
      }

      window.location = host + "fin/inquiry/approve";
    },
  });
});

$(document).on("click", ".return", async function (e) {
  e.preventDefault();
  if ($("#finremark").val() == "") {
    await showErrorNotify("Please enter your reason for return");
    $("#desremark").addClass("invalid");
    setTimeout(() => {
      $("#desremark").removeClass("invalid");
    }, 5000);
    return false;
  }
  await showLoading();
  await $.ajax({
    url: `${host}fin/inquiry/returnmar`,
    method: "post",
    dataType: "json",
    data: {
      id: $("#inqid").val(),
      inqno: $("#inqno").val(),
      inqrev: $("#inqrev").val(),
      message: $("#finremark").val(),
    },
    success: async function (res) {
      window.location = host + "fin/inquiry";
    },
  });
});

function createTableDetail(dt) {
  const tableid = "#inqdetail";
  const opt = { ...tableOption };
  opt.dom =
    '<lf<"fixed-table edit-table"t><"tablefoot d-inline-flex pt-1 mt-3"i>p>';
  opt.searching = false;
  opt.paging = false;
  opt.order = [[0, "asc"]];
  opt.data = dt;
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
        class="${name} ${readonly ? "" : "editable"} ${
      toright ? "text-end" : ""
    } ${req ? "required" : ""}"
        name="${name}[]"
        rows="1"
        style="width:${w == "" ? "100%" : w + "px"}; height: 55px;"
        ${readonly ? "readonly" : ""}
    >${data == null ? "" : data}</textarea>`;
  };

  opt.columns = [
    { data: "INQD_RUNNO", className: "d-none" },
    { data: "INQD_RUNNO", render: (data) => inputArea("runno", data, 55) },
    { data: "INQD_ITEM", render: (data) => inputArea("item", data, 55) },
    { data: "INQD_PARTNAME", render: (data) => inputArea("partname", data) },
    { data: "INQD_DRAWING", render: (data) => inputArea("drawing", data) },
    { data: "INQD_VARIABLE", render: (data) => inputArea("variable", data) },
    { data: "INQD_SUPPLIER", render: (data) => inputArea("supply", data, 30) },
    { data: "INQD_QTY", render: (data) => inputArea("qty", data, 30) },
    { data: "INQD_UM", render: (data) => inputArea("unit", data, 20) },
    {
      data: "INQD_FC_COST",
      render: (data) => {
        return inputArea("fc_cost", digits(data, 0), 75, false, true, true);
      },
    },
    {
      data: "INQD_FC_BASE",
      render: (data) =>
        inputArea(
          "fc_base",
          data == null ? $("#default_ratio").val() : digits(data, 2),
          55,
          false,
          true,
          true
        ),
    },
    {
      data: "INQD_TC_COST",
      render: (data, e, row) => {
        const ratio =
          row.INQD_FC_BASE == null
            ? $("#default_ratio").val()
            : row.INQD_FC_BASE;
        const cost = row.INQD_FC_COST == null ? 0 : row.INQD_FC_COST;
        const val = intVal(Math.ceil(cost * ratio));
        return inputArea("tc_cost", digits(val, 0), 75, true, true);
      },
    },
    {
      data: "INQD_FIN_REMARK",
      render: (data) => inputArea("fin_comment", data, 125, false),
    },
    {
      data: "INQD_TC_BASE",
      className: "d-none",
      render: (data, e, row) => {
        if (data == null) data = row.FORMULA;
        return inputArea("tc_base", data);
      },
    },
    {
      data: "INQD_UNIT_PRICE",
      className: "d-none",
      render: (data, e, row) => {
        const ratio =
          row.INQD_FC_BASE == null
            ? $("#default_ratio").val()
            : row.INQD_FC_BASE;
        const fccost = row.INQD_FC_COST == null ? 0 : row.INQD_FC_COST;
        const cost = intVal(digits(fccost * ratio, 2));

        const rate = row.FORMULA;
        const val = intVal(digits(rate * cost, 2));
        return inputArea("unitprice", val);
      },
    },
    {
      data: "INQD_ID",
      className: "d-none",
      render: (data) => inputHidden("inqd_id", data),
    },
  ];

  opt.createdRow = function (row, data) {
    if (data.INQD_UNREPLY != null) $(row).html("");
    $(row).find(".fc_cost").inputmask("decimal", { rightAlign: true });
    $(row).find(".tc_base").inputmask("decimal", { rightAlign: true });
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
      const cost = intVal(Math.ceil(el.INQD_FC_COST));
      const rate =
        el.INQD_FC_BASE != null
          ? intVal(el.INQD_FC_BASE)
          : intVal($("#default_ratio").val());

      totalcost += intVal(Math.ceil(el.INQD_FC_COST));
      totalunit += Math.ceil(cost * rate);
      total += Math.ceil(cost * rate) * qty;
      currency = el.INQ_CUR;
    });

    api.column(9).footer().innerHTML = digits(totalcost, 0);
    api.column(11).footer().innerHTML = digits(totalunit, 0);
    // api.column(12).footer().innerHTML = currency;
  };

  opt.initComplete = function () {
    let currency = "";
    const api = this.api();
    api.rows().every(function (i) {
      const data = this.data();
      currency = currency == "" ? data.CURRENCY : currency;
      if (data.INQD_SUPPLIER != "AMEC")
        api.rows(i).nodes().to$().addClass("remove");
    });
    api.rows(".remove").remove().draw();

    const flag = $("#action").val();
    const footer = `
        <button type="button" class="btn btn-second" id="import"><i class="icofont-upload-alt"></i></button>
        <input type="file" id="importfile" class="d-none" accept=".csv, text/plain, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">`;
    if (flag == 1) $(".tablefoot").html(footer);
    $("#currency").val(currency);
  };
  return $(tableid).DataTable(opt);
}

async function readSheeetFile(file) {
  var values = [];
  await readXlsxFile(file).then(async function (rows) {
    rows.map((el, i) => {
      if (i == 0) return;
      values.push({
        runno: el[0],
        fc: el[1],
        remark: el[2],
      });
    });
  });
  return values;
}

function createTableDetailView(dt) {
  const tableid = "#inqdetail";
  const opt = { ...tableOption };
  opt.dom = '<lf<"fixed-table"t><"tablefoot d-inline-flex pt-1 mt-3"i>p>';
  opt.searching = false;
  opt.paging = false;
  opt.order = [[0, "asc"]];
  opt.data = dt;
  const showdata = (data, w = 25) => {
    return `<div class="" style="width:${w}px">${
      data == null ? "" : data
    }</div>`;
  };
  opt.columns = [
    { data: "INQD_RUNNO", className: "d-none" },
    { data: "INQD_RUNNO" },
    {
      data: "INQD_ITEM",
      className: "text-center",
      render: (data) => showdata(data, 40),
    },
    { data: "INQD_PARTNAME", render: (data) => showdata(data, 150) },
    { data: "INQD_DRAWING", render: (data) => showdata(data, 150) },
    { data: "INQD_VARIABLE", render: (data) => showdata(data, 150) },
    { data: "INQD_SUPPLIER", render: (data) => showdata(data, 75) },
    { data: "INQD_QTY", className: "text-end" },
    { data: "INQD_UM" },
    {
      data: "INQD_FC_COST",
      className: "text-end",
      rendedr: (data) => digits(data, 2),
    },
    {
      data: "INQD_FC_BASE",
      className: "text-end",
      rendedr: (data) => digits(data, 4),
    },
    {
      data: "INQD_TC_COST",
      className: "text-end",
      render: (data, e, row) => {
        const ratio =
          row.INQD_FC_BASE == null
            ? $("#default_ratio").val()
            : row.INQD_FC_BASE;
        const cost = row.INQD_FC_COST == null ? 0 : row.INQD_FC_COST;
        const val = intVal(digits(cost * ratio, 2));
        return digits(val, 2); //inputArea("tc_cost", val, 75, true, true);
      },
    },
    {
      data: "INQD_FIN_REMARK",
      render: (data) => showdata(data, 120),
    },
  ];

  opt.createdRow = function (row, data) {
    if (data.INQD_UNREPLY != null) $(row).addClass("d-none");
  };

  opt.initComplete = function () {
    var api = this.api();
    api.rows().every(function (i) {
      const data = this.data();
      if (data.INQD_SUPPLIER != "AMEC")
        api.rows(i).nodes().to$().addClass("remove");
    });
    api.rows(".remove").remove().draw();

    const footer = `
          <button type="button" class="btn btn-second" id="import"><i class="icofont-upload-alt"></i></button>
          <input type="file" id="importfile" class="d-none" accept=".csv, text/plain, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">`;
    //$(".tablefoot").html(footer);
  };
  return $(tableid).DataTable(opt);
}
