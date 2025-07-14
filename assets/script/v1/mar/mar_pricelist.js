function createTable(query) {
  const tableid = "#inqdetail";
  if ($.fn.DataTable.isDataTable(tableid)) $(tableid).DataTable().destroy();
  const opt = { ...tableOption };
  opt.ajax = {
    url: `${host}mar/price/getPrice`,
    dataType: "json",
    type: "post",
    data: query,
  };

  opt.dom = '<lf<"fixed-table"t><"tablefoot d-inline-flex pt-1 mt-3"i>p>';
  opt.order = [[0, "desc"]];

  const check = (status) => {
    const color = status > 9 ? "#ff2929" : status == 9 ? "#1abc9c" : "#697a8d";
    let str = `<i class="icofont-check-circled fs-5" style="color: ${color}"></i>`;
    if (status > 9)
      str = `<i class="icofont-close-circled fs-5" style="color: ${color}"></i>`;
    return str;
  };

  const num = (data) => {
    if (data == null)
      return `<span style="color: #ddd;">${digits(data, 2)}</span>`;
    return digits(data, 2);
  };

  opt.columns = [
    { data: "CUS_NAME", className: "td-fixed" },
    { data: "CUS_AGENT", className: "td-fixed" },
    { data: "CUS_COUNTRY", className: "td-fixed" },
    { data: "ITEM_NO", className: "td-fixed" },
    { data: "ITEM_NAME", className: "td-fixed text-nowrap" },
    { data: "ITEM_DWG", className: "w-150 text-nowrap" },
    { data: "ITEM_VARIABLE", className: "w-350" },
    { data: "CUS_CURENCY", className: "text-center" },
    {
      data: "INQD_FC_COST",
      className: "text-end",
      render: (data) => num(data, 2),
    },
    {
      data: "INQD_FC_BASE",
      className: "text-end",
      render: (data) => num(data, 2),
    },
    {
      data: "INQD_TC_COST",
      className: "text-end",
      render: (data) => num(data, 2),
    },
    {
      data: "TCBASE",
      className: "text-end",
      render: (data) => num(data, 2),
    },
    {
      data: "UNITPRICE",
      className: "text-end",
      render: (data) => num(data, 2),
    },
    {
      data: "FCCOST",
      className: "text-end",
      render: (data) => num(data, 2),
    },
    {
      data: "FCBASE",
      className: "text-end",
      render: (data) => num(data, 2),
    },
    {
      data: "TCCOST",
      className: "text-end",
      render: (data) => num(data, 2),
    },
    {
      data: "TCBASE2",
      className: "text-end",
      render: (data) => num(data, 2),
    },
    {
      data: "PREVUNITPRICE",
      className: "text-end",
      render: (data) => num(data, 2),
    },
    {
      data: "PRICEDIFF",
      className: "text-end",
      render: (data) => num(data, 2),
    },
    {
      data: "PERCENT",
      className: "text-end",
      render: (data) => num(data, 2),
    },
  ];
  const colWidth = [75, 50, 100, 50, 175];
  var left = 0;
  var leftArr = [];
  opt.createdRow = function (row, data) {
    //Fixed Column
    if (leftArr.length == 0) {
      leftArr.push(left);
      var head = $(tableid).find("thead tr:eq(0) th.td-fixed");
      head.map(function (i, th) {
        setTableWidth($(th), colWidth[i], left);
        left += getTotalWidth($(th), colWidth[i]);
        leftArr.push(left);
      });
    }

    $(row)
      .find("td.td-fixed")
      .map(function (i, cols) {
        setTableWidth($(cols), colWidth[i], leftArr[i]);
      });
  };
  opt.initComplete = function () {
    const footer = `<button class="btn btn-second me-2" id="export"><i class="icofont-file-excel"></i> Export Excel</button>`;
    $(".tablefoot").html(footer);
  };
  return $(tableid).DataTable(opt);
}

$(document).on("click", "#export", async function (e) {
  e.preventDefault();
  await showLoading();
  const value = [];
  const url = `${host}export/mar/price_list.json?v=${Date.now()}`;
  const json = await exportHeader(url);
  const header = [].concat(...json.header);
  const cols = [].concat(...json.key);
  value.push(header);
  const data = await getPriceList({});
  console.log(data);

  //   const clear = await deleteReportTable();
  data.forEach((item) => {
    value.push(exportMap(item, cols));
  });
  const ws = XLSX.utils.aoa_to_sheet(value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, ws, "sheet1");
  XLSX.write(workbook, { bookType: "xlsx", bookSST: true, type: "base64" });
  XLSX.writeFile(workbook, "Price.xlsx", {
    compression: true,
    cellStyles: true,
  });
  await hideLoading();
});

function getPriceList(data) {
  return new Promise((resolve) => {
    $.ajax({
      url: `${host}mar/price/getPrice`,
      type: "post",
      dataType: "json",
      data: data,
      success: function (res) {
        resolve(res.data);
      },
    });
  });
}
