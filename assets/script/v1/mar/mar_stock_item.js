//Item Index dunction
function createTable(query) {
  const tableid = "#inqdetail";
  if ($.fn.DataTable.isDataTable(tableid)) $(tableid).DataTable().destroy();
  const opt = { ...tableOption };
  opt.ajax = {
    url: `${host}mar/price/getItems`,
    dataType: "json",
    type: "post",
    data: query,
  };

  opt.dom = '<lf<"fixed-table"t><"tablefoot d-inline-flex pt-1 mt-3"i>p>';
  opt.order = [[0, "asc"]];
  opt.columns = [
    { data: "ITEM_NO" },
    { data: "ITEM_NAME", className: "text-nowrap" },
    { data: "ITEM_DWG", className: "w-150 text-nowrap" },
    { data: "ITEM_VARIABLE", className: "w-350" },
    { data: "ITEM_CLASS" },
    { data: "ITEM_UNIT" },
    { data: "ITEM_SUPPLIER" },
    { data: "ITEM_AMEC_PUR" },
    {
      data: "ITEM_STATUS",
      render: (data) =>
        data == 1
          ? "Active"
          : `<span style="color: red; font-weight: 700;">Inactive</span>`,
    },
    {
      data: "ITEM_ID",
      sortable: false,
      className: "",
      render: (data) => {
        return `<div class="d-flex justify-content-center">
            <a href="${host}mar/price/itemdetail/${data}" class="btn btn-second btn-sm me-1"><i class="icofont-ui-edit"></i></a>
            <a href="#" class="btn btn-delete btn-sm me-1" data-val="${data}"><i class="icofont-ui-delete"></i></a>
        </div>`;
      },
    },
  ];
  opt.initComplete = function () {
    const footer = `
        <a href="${host}mar/price/additem" class="btn btn-main me-2"><i class="icofont-plus-circle"></i> Add Item</a>
        <button class="btn btn-second me-2" id="export"><i class="icofont-file-excel"></i> Export Excel</button>`;
    $(".tablefoot").html(footer);
  };
  return $(tableid).DataTable(opt);
}

$(document).ready(async function () {
  if (!$("#inqdetail").length) {
    const data = await getDetail({ id: $("#itemid").val() });
    const category = await getCategory();
    const customer = await getCustomers();
    await setCategory(category, data[0]);
    await setDetail(data[0]);
    await setCustomer(customer);
  }
});

function setCategory(data, val) {
  const select = $("#category");
  select.html("<option></option>");
  data.map((el) => {
    select.append(
      `<option value="${el.CATE_ID}" ${
        val.CATEGORY == el.CATE_ID ? "selected" : ""
      }>${el.CATE_NAME}</option>`
    );
  });
  $("#category").select2();
}

function setDetail(data) {
  const inputs = $("#form1").find("input");
  inputs.map((i, el) => {
    if ($(el).attr("data-map") != undefined) {
      $(el).val(data[$(el).attr("data-map")]);
    }
  });
}

function setCustomer(data) {
  const customer = $("#customer");
  data.map((el) => {
    customer.append(`<li>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" value="${el.CUS_ID}" name="customer[]">
            <label class="">${el.CUS_NAME}</label>
        </div>
    </li>`);
  });
}

function getDetail(data) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${host}mar/price/getItems`,
      type: "post",
      dataType: "json",
      data: data,
      success: function (res) {
        resolve(res.data);
      },
      error: function (err) {
        reject(err);
      },
    });
  });
}

function getCategory() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${host}mar/master/getCategory`,
      type: "post",
      dataType: "json",
      success: function (res) {
        resolve(res);
      },
      error: function (err) {
        reject(err);
      },
    });
  });
}

function getCustomers() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${host}mar/master/getCustomers`,
      type: "post",
      dataType: "json",
      success: function (res) {
        resolve(res.data);
      },
      error: function (err) {
        reject(err);
      },
    });
  });
}
