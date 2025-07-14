var formdata = new FormData();
var table;
var tableattach;
var detailData = [];
var attachment = [];
var curreencies = [];

const setQuotation = async (val, cur1, cur2) => {
  const agents = await getAgent(val[1][3]);
  const agent = `${agents[0].AGENT_CODE} (${val[6][3]})`;
  $("#agent").val(agent).change();
  $("#country").val(val[6][3]);
  $("#trader").val(val[1][3]).change();
  $("#inqno").val(val[12][3]);
  $("#prjno").val(val[2][3]);
  $("#prjname").val(val[3][3]);
  $("#contractor").val(val[4][3]);
  $("#enduser").val(val[5][3]);
  $("#destport").val(val[12][23]);
  $("#usrpart").val(val[7][3]);

  //Delivery Term
  const terms = [];
  $("#term")
    .find("option")
    .map(function (el) {
      terms.push({ value: $(this).attr("value"), text: $(this).text() });
    });

  const term = terms.find((x) => x.text == val[12][22]).value;
  $("#term").val(term).change();

  //Delivery Method
  const methods = [];
  $("#method")
    .find("option")
    .map(function (el) {
      methods.push({ value: $(this).attr("value"), text: $(this).text() });
    });
  const method = methods.find((x) => x.text == val[12][24]).value;
  $("#method").val(method).change();

  $("#costcurrency").html(`(${cur1})`); //Table Header
  $("#tccurrency").val(cur1);
  $("#quocurrency").html(`(${cur2})`); //Table Header
  $("#amountcurrency").html(`(${cur2})`); //Table Header
  $("#currency").val(cur2);
};

const setQuotationDetail = async (el) => {
  table.row
    .add({
      INQD_RUNNO: el["runno"],
      INQD_CAR: ("000" + el[4]).substr(-2),
      INQD_ITEM: el[14],
      INQD_DRAWING: el[15],
      INQD_PARTNAME: el[16],
      INQD_VARIABLE: el[17],
      INQD_SUPPLIER: el["supplier"],
      INQD_QTY: intVal(el[18]),
      INQD_UM: el[19],
      INQD_FC_COST: 0,
      INQD_TC_COST: 0,
      INQD_UNIT_PRICE: 0,
      INQD_FC_BASE: el["exchange1"],
      INQD_TC_BASE: el["ratio"],
      INQD_EXRATE: el["exchange2"],
    })
    .draw();
};

//Onload Page
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
  curreencies = await getCurrency();

  //Edit quotation
  if ($("#inqid").val() > 0) {
    detailData = await getInquiryDetail($("#inqid").val());
    attachment = await getAttachment($("#inqno").val());

    $("#costcurrency").html($("#tccurrency").val()); //Table Header
    $("#quocurrency").html($("#currency").val()); //Table Header
    $("#amountcurrency").html($("#currency").val()); //Table Header
    $(".savedata").addClass("d-none");
    $(".editdata").removeClass("d-none");
  }

  //Initial Form
  $(".wrap-form-inqinfo").find(".row:nth-child(2) label").html("Quotation No.");
  $(".wrap-form-inqinfo").find(".row:nth-child(5) label").html("Sale Company");
  $(".wrap-form-inqinfo").find(".row:nth-child(7) label").html("Final Dest.");
  $(".pkcreq").closest(".form-group-row").addClass("d-none");
  $("#quotation").prop("disabled", true);
  table = createTable(detailData);
  tableattach = craeteTableAttach(attachment);
});

$(document).on("click", "#import", function () {
  $("#importfile").click();
});

$(document).on("change", "#importfile", async function (e) {
  const fl = e.target.files;
  await readXlsxFile(fl[0]).then(async function (rows) {
    //Verify File Format
    const title = rows[0][14];
    if (
      title === undefined ||
      title == null ||
      title.indexOf("QUOTATION REQUISITION") < 0
    ) {
      await showErrorNotify("Invalid file format.");
      return false;
    }

    //Set Quotation No
    const inquiry = rows[12][3];
    if (inquiry == null || inquiry == "") {
      await showErrorNotify("Invalid file format.");
      return false;
    }

    const check = await getInquiry(inquiry);
    if (check.length > 0) {
      await showErrorNotify("Duppliccate quotation No.");
      return false;
    }

    //Set Supplier
    let supplier;
    const suppliername = rows[0][14]; //await setSupplier(rows[0]);
    if (suppliername.search("TOKAN") >= 0) supplier = "TOKAN";
    else supplier = "TOKYO ROPE";
    const curr1 = supplier == "TOKAN" ? "USD" : "THB";
    const exchange1 = curreencies.find((x) => x.CURR_CODE == curr1).CURR_RATE;

    //Set Price Ratio
    const company = rows[1][3];
    const price = await getFormular(company, supplier, 25);
    if (price.length == 0) {
      await showErrorNotify("Not found price ratio for this agent");
      return false;
    }

    const curr2 = price[0].CURRENCY;
    const exchange2 = curreencies.find((x) => x.CURR_CODE == curr2).CURR_RATE;
    const ratio = price[0].FORMULA;
    //Quotation Information
    await setQuotation(rows, curr1, curr2);
    rows.forEach(async (el, i) => {
      if (i >= 12 && el[3] != null) {
        const runno = i - 11;
        el = {
          ...el,
          runno,
          supplier,
          ratio,
          exchange1: exchange1 == undefined ? 0 : exchange1,
          exchange2: exchange2 == undefined ? 0 : exchange2,
        };
        await setQuotationDetail(el, runno);
      }
    });

    $("#import").addClass("d-none");
    $(".savedata").removeClass("disabled");
  });
});

$(document).on("change", ".fc_cost ", async function () {
  const row = table.row($(this).closest("tr"));
  const data = row.data();
  const cost = isNaN(intVal($(this).val()))
    ? data.INQD_FC_COST
    : intVal($(this).val());
  row.data({
    ...data,
    INQD_FC_COST: digits(cost, 3),
  });
  table.draw();
});

$(document).on("change", ".qty ", async function () {
  const row = table.row($(this).closest("tr"));
  const data = row.data();
  const qty = isNaN(intVal($(this).val()))
    ? data.INQD_QTY
    : intVal($(this).val());
  row.data({
    ...data,
    INQD_QTY: qty,
  });
  table.draw();
});

$(document).on("click", ".savedata:not(.disabled)", async function (e) {
  e.preventDefault();
  if ((await checkReqired("#inqform")) === false) return false;
  if ((await checkSPUPrice()) === false) return false;
  if ((await checkQty()) === false) return false;
  $("#quotation").prop("disabled", false);
  await showLoading();
  const id = await savedata();
  await downloadQuotation(id);
  window.location = host + "mar/quotation/released/";
});

$(document).on("click", ".editdata:not(.disabled)", async function (e) {
  e.preventDefault();
  if ((await checkReqired("#inqform")) === false) return false;
  if ((await checkSPUPrice()) === false) return false;
  if ((await checkQty()) === false) return false;
  $("#quotation").prop("disabled", false);
  await showLoading();
  await editdata();
  window.location = host + "mar/quotation/released/";
});

function createTable(dt) {
  const tableid = "#inqdetail";
  const opt = { ...tableOption };
  opt.dom =
    '<lf<"fixed-table edit-table overlay-table"t><"tablefoot d-inline-flex pt-1 mt-3"i>p>';
  opt.searching = false;
  opt.ordering = false;
  opt.paging = false;
  opt.data = dt;
  opt.order = [[0, "asc"]];
  const inputTxt = (name, data, clsname = "", readonly = false, w = 25) => {
    return `<input type="text" class="${name} ${clsname}" name="${name}[]"
        onfocus="this.select();"
        value="${data == null ? "" : data}"
        style="width:${w}px"
        ${name == "fc_cost" ? 'tabindex="0"' : ""}
        ${readonly ? "readonly" : ""}/>`;
  };

  const calPrice = (data) => {
    const cost = intVal(data.INQD_FC_COST);
    const curr1 = intVal(data.INQD_FC_BASE);
    const tccost = cost * curr1;

    const profit = intVal(data.INQD_TC_BASE);
    const curr2 = intVal(data.INQD_EXRATE);
    const unitprice =
      curr2 == 0 ? 0 : Math.ceil(intVal(digits((tccost * profit) / curr2), 3));

    const qty = data.INQD_QTY;
    const amount = unitprice * qty;

    return {
      tccost: digits(tccost, 3),
      unitprice: digits(unitprice, 0),
      amount: digits(amount, 0),
    };
  };

  opt.columns = [
    {
      data: "INQD_CAR",
      className: "td-fixed",
      render: (data) => inputTxt("carno", data, "", false, 40),
    },
    {
      data: "INQD_ITEM",
      className: "td-fixed",
      render: (data) => inputTxt("item", data),
    },
    {
      data: "INQD_DRAWING",
      className: "td-fixed",
      render: (data) => inputTxt("drawing", data, "", false, 200),
    },
    {
      data: "INQD_PARTNAME",
      className: "td-fixed",
      render: (data) => inputTxt("partname", data, "", false, 200),
    },
    {
      data: "INQD_VARIABLE",
      className: "td-fixed",
      render: (data) => inputTxt("variable", data, "", false, 200),
    },
    {
      data: "INQD_SUPPLIER",
      render: (data) => inputTxt("supply", data, "", true, 100),
    },
    { data: "INQD_QTY", render: (data) => inputTxt("qty", data, "text-end") },
    {
      data: "INQD_UM",
      render: (data) => inputTxt("unit", data, "", false, 75),
    },
    {
      data: "INQD_FC_COST",
      render: (data) =>
        inputTxt("fc_cost", digits(data, 3), "text-end editable", false, 100),
    },
    {
      data: "INQD_FC_BASE",
      render: (data) => inputTxt("fc_base", data, "text-end", true, 20),
    },
    {
      data: "INQD_TC_COST",
      render: (data, e, row) => {
        // if (data != null)
        //   return inputTxt("tc_cost", digits(data, 3), "text-end", true, 100);
        const price = calPrice(row);
        return inputTxt("tc_cost", price.tccost, "text-end", true, 100);
      },
    },
    {
      data: "INQD_TC_BASE",
      render: (data) => inputTxt("tc_base", data, "text-end", true, 40),
    },
    {
      data: "INQD_EXRATE",
      render: (data) => inputTxt("exchage", data, "text-end", true),
    },
    {
      data: "INQD_UNIT_PRICE",
      render: (data, e, row) => {
        // if (data != null)
        //   return inputTxt("unitprice", digits(data, 3), "text-end", true, 100);
        const price = calPrice(row);
        return inputTxt("unitprice", price.unitprice, "text-end", true, 100);
      },
    },
    {
      data: "INQD_UNIT_PRICE",
      render: (data, e, row) => {
        const price = calPrice(row);
        return inputTxt("amount", price.amount, "text-end", true, 100);
      },
    },
    {
      data: "INQD_RUNNO",
      className: "d-none",
      render: (data) => inputTxt("runno", data),
    },
    {
      data: "INQD_RUNNO",
      className: "d-none",
      render: (data) => inputTxt("seqno", data),
    },
    {
      data: "INQD_ID",
      className: "d-none",
      render: (data) => inputTxt("inqd_id", data),
    },
  ];

  opt.initComplete = function () {
    const footer = `
        <button type="button" class="btn btn-second" id="import"><i class="icofont-upload-alt"></i></button>
        <input type="file" id="importfile" class="d-none" accept=".csv, text/plain, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
            `;
    if ($("#inqid").val() == "") $(".tablefoot").html(footer);
  };

  opt.footerCallback = function () {
    const api = this.api();
    const data = api.rows().data();
    let totalqty = 0;
    let totalfccost = 0;
    let totaltccost = 0;
    let totalunit = 0;
    let total = 0;
    data.map((el) => {
      const price = calPrice(el);
      totalqty += intVal(el.INQD_QTY);
      totalfccost += intVal(el.INQD_FC_COST);
      totaltccost += intVal(price.tccost);
      totalunit += intVal(price.unitprice);
      total += intVal(price.amount);
    });

    api.column(6).footer().innerHTML = digits(totalqty, 0);
    api.column(8).footer().innerHTML = digits(totalfccost, 3);
    api.column(10).footer().innerHTML = digits(totaltccost, 3);
    api.column(13).footer().innerHTML = digits(totalunit, 3);
    api.column(14).footer().innerHTML = digits(total, 3);
    // api.column(12).footer().innerHTML = currency;
  };

  return $(tableid).DataTable(opt);
}

function getCurrency() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: `${host}mar/master/getCurrency/`,
      dataType: "json",
      data: { year: $("#year").val(), period: $("#period").val() },
      success: function (res) {
        resolve(res);
      },
    });
  });
}

function getAgent(code) {
  return new Promise((resolve) => {
    $.ajax({
      type: "POST",
      url: `${host}mar/out2out/getSalecompay/`,
      dataTypes: "json",
      data: { code },
      success: function (data) {
        resolve(JSON.parse(data));
      },
    });
  });
}

function getFormular(code, supplier, quot) {
  return new Promise((resolve) => {
    $.ajax({
      type: "POST",
      url: `${host}mar/out2out/getPriceRatio/`,
      dataTypes: "json",
      async: false,
      data: { code, supplier, quot },
      success: function (data) {
        resolve(JSON.parse(data));
      },
    });
  });
}

function checkSPUPrice() {
  let check = true;
  table.rows().every(function () {
    if (this.data().INQD_FC_COST == 0) {
      check = false;
      $(this.node()).find(".fc_cost").addClass("invalid");
      setTimeout(() => {
        $(this.node()).find(".fc_cost").removeClass("invalid");
      }, 5000);
    }
  });
  return check;
}

function checkQty() {
  let check = true;
  table.rows().every(function () {
    if (this.data().INQD_QTY == 0) {
      check = false;
      $(this.node()).find(".qty").addClass("invalid");
      setTimeout(() => {
        $(this.node()).find(".qty").removeClass("invalid");
      }, 5000);
    }
  });
  return check;
}

function savedata() {
  return new Promise((resolve) => {
    $.ajax({
      url: `${host}inquiry/create`,
      method: "post",
      dataType: "json",
      data: $("#inqform").serialize("textarea, select, input"),
      async: false,
      success: async function (res) {
        if (formdata.getAll("files[]").length > 0) {
          await uploadFile($("#inqno").val());
        }

        await createQuotation(res.id);
        resolve(res.id);
      },
    });
  });
}

function createQuotation(id) {
  return new Promise((resolve) => {
    $("#inqid").val(id);
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

function downloadQuotation(id) {
  //const id = $("#inqid").val();
  const url = `${host}mar/quotation/excel/${id}/`;
  window.open(url);
}

function editdata() {
  return new Promise((resolve) => {
    $.ajax({
      url: `${host}inquiry/update`,
      method: "post",
      dataType: "json",
      data: $("#inqform").serialize("textarea, select, input"),
      async: false,
      success: async function (res) {
        if (formdata.getAll("files[]").length > 0) {
          await uploadFile($("#inqno").val());
        }
        resolve(res.id);
      },
    });
  });
}
