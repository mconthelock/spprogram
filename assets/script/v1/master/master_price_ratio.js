var priceratio;
var table;
var currencylist;

$(".nav-item").removeClass("active");
$(".navmenu-admin").addClass("active");

$(document).ready(async function () {
  currencylist = await getCurrency();
  priceratio = await getPriceRatio();
  table = await createTable(priceratio);
});

$(document).on("click", ".edit", async function (e) {
  e.preventDefault();
  const row = $(this).closest("tr");
  $(this).toggleClass("d-none");
  row.find(".savedata").toggleClass("d-none");
  row.find(".formula").prop("readonly", false);
  row.find(".formula").inputmask("decimal", { rightAlign: true });
  row.find(".formula").select();

  row.find(".currency").prop("disabled", false);
  row.find(".currency").addClass("editting");
});

$(document).on("change", ".formula", async function (e) {
  e.preventDefault();
  const row = table.row($(this).closest("tr"));
  const data = row.data();
  const val = isNaN(intVal($(this).val()))
    ? data.FORMULA
    : intVal($(this).val());
  console.log(val);
  $(this).val(digits(val, 4));
});

$(document).on("click", ".savedata", async function (e) {
  e.preventDefault();
  const row = $(this).closest("tr");
  const data = table.row(row).data();
  const val = {
    trader: data.TRADER,
    supply: data.SUPPLIER,
    quotation: data.QUOTATION,
    formula: row.find(".formula").val(),
    currency: row.find(".currency").val(),
    status: data.STATUS,
  };
  await updatePriceRatio(val);
  data.FORMULA = val.formula;
  data.CURRENCY = val.currency;
  table.row(row).data(data).draw(false);
});

$(document).on("click", ".status", async function () {
  const status = $(this).attr("data-value");
  const row = $(this).closest("tr");
  const data = table.row(row).data();
  const val = {
    trader: data.TRADER,
    supply: data.SUPPLIER,
    quotation: data.QUOTATION,
    formula: data.FORMULA,
    status: status,
  };
  await updatePriceRatio(val);
  data.STATUS = status;
  table.row(row).data(data).draw(false);
});

function updatePriceRatio(data) {
  return new Promise((resolve) => {
    $.ajax({
      url: `${host}mar/price/updateRatio`,
      type: "post",
      dataType: "json",
      data: data,
      async: false,
      success: function (res) {
        resolve(res.data);
      },
    });
  });
}

function createTable(dt) {
  const tableid = "#table";
  if ($.fn.DataTable.isDataTable(tableid)) $(tableid).DataTable().destroy();
  const opt = { ...tableOption };
  opt.data = dt;
  const currency = (data) => {
    let str = `<select class="form-select currency" disabled="true">`;
    currencylist.map((val) => {
      str += `<option value="${val.CURR_CODE}" ${
        val.CURR_CODE == data ? "selected" : ""
      }>${val.CURR_CODE}</option>`;
    });
    str += `</select>`;
    return str;
  };

  opt.columns = [
    { data: "QUOTYPE_DESC" },
    { data: "TRADER" },
    { data: "SUPPLIER" },
    {
      data: "STATUS",
      render: (data) =>
        data == 1
          ? "Active"
          : `<span style="color: red; font-weight: 700;">Inactive</span>`,
    },
    {
      data: "CURRENCY",
      className: "text-center",
      render: (data) => currency(data),
    },
    {
      data: "FORMULA",
      sortable: false,
      className: "text-center w-150",
      render: (data) => {
        return `<input type="text" class="formula" readonly="readonly" value="${digits(
          data,
          4
        )}"/>`;
      },
    },
    {
      data: "STATUS",
      sortable: false,
      className: "text-center action",
      render: (data) => {
        return `<div class="d-flex justify-content-center" style="max-width: 100px;">
            <a href="#" class="btn btn-second btn-sm me-1 edit"><i class="icofont-ui-edit"></i></a>
            <a href="#" class="btn btn-main btn-sm me-1 savedata d-none"><i class="icofont-verification-check"></i></a>
            <a href="#" class="btn btn-delete btn-sm me-1 status ${
              data == 1 ? "" : "d-none"
            }" data-value="0"><i class="icofont-ui-delete"></i></a>
            <a href="#" class="btn btn-cancel btn-sm me-1 status ${
              data == 1 ? "d-none" : ""
            }" data-value="1"><i class="icofont-ui-reply"></i></a>
        </div>`;
      },
    },
  ];
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
