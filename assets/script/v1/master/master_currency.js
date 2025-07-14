$(".nav-item").removeClass("active");
$(".navmenu-admin").addClass("active");
var table;
var tableDetail = [];
$(document).ready(async () => {
  tableDetail = await getCurrency();
  table = await createTable(tableDetail);
});

$(document).on("click", ".edit", function (e) {
  e.preventDefault();
  $(this).addClass("d-none");
  const row = $(this).closest("tr");
  row.find(".save").removeClass("d-none");
  row.find(".txt-edit").removeAttr("readonly");
  row.find(".txt-edit").focus();
});

$(document).on("click", ".save", async function (e) {
  e.preventDefault();
  const rate = $(this).closest("tr").find(".txt-edit").val();
  const row = table.row($(this).closest("tr"));
  const data = row.data();
  const value = {
    year: data.CURR_YEAR,
    period: data.CURR_PERIOD,
    code: data.CURR_CODE,
    rate: rate,
  };
  const update = await updateCurrency(value);
  row.data({
    ...data,
    CURR_RATE: update.CURR_RATE,
    CURR_UPDATE_BY: update.CURR_UPDATE_BY,
    CURR_UPDATE: update.CURR_UPDATE_DATE,
  });
  table.draw();
});

function updateCurrency(val) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: `${host}mar/master/updateCurrency/`,
      dataType: "json",
      data: val,
      success: function (res) {
        resolve(res);
      },
    });
  });
}

function createTable(dt) {
  const tableid = "#table";
  const opt = { ...tableOption };
  opt.dom = '<<"ttitle d-inline">f<t><"tablefoot d-inline-flex pt-1 mt-3"i>p>';
  opt.data = dt;
  opt.order = [
    [1, "desc"],
    [2, "desc"],
  ];
  opt.columns = [
    {
      data: "CURR_YEAR",
      orderable: false,
      className: "text-center",
      render: (data, e, row) => {
        const str = `
            <a href="#" class="edit"><i class="icofont-edit fs-5"></i></a>
            <a href="#" class="save d-none"><i class="icofont-save fs-5"></i></a>
        `;
        return row.CURR_LATEST == 1 ? str : "";
      },
    },
    { data: "CURR_YEAR", className: "text-center" },
    { data: "CURR_PERIOD", className: "text-center" },
    { data: "CURR_CODE", className: "text-center" },
    {
      data: "CURR_RATE",
      className: "editable",
      render: (data) => {
        return `<input type="text" class="text-end txt-edit" value="${digits(
          data,
          3
        )}" readonly onfocus="this.select();"/>`;
      },
    },
    {
      data: "CURR_UPDATE",
      render: (data) => {
        if (data == null) return "";
        return moment(data).format("YYYY-MM-DD HH:mm");
      },
    },
    { data: "CURR_UPDATE_BY" },
  ];
  opt.initComplete = function () {
    $(".ttitle").html(`<h3 class="d-inline fw-bold">Currency Master</h3>`);
  };
  return $(tableid).DataTable(opt);
}

function getCurrency() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: `${host}mar/master/getCurrency/`,
      dataType: "json",
      success: function (res) {
        resolve(res);
      },
    });
  });
}
