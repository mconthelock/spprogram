function createTableDetail(dt) {
  const tableid = "#inqdetail";
  const opt = { ...tableOption };
  opt.data = dt;
  opt.dom = '<lf<"fixed-table"t><"tablefoot d-inline-flex pt-1 mt-3"i>p>';
  opt.searching = false;
  opt.paging = false;
  const showdata = (data, w = 25) => {
    return `<div class="" style="width:${w}px">${
      data == null ? "" : data
    }</div>`;
  };
  opt.columns = [
    { data: "INQD_SEQ", className: "td-fixed text-center" },
    { data: "INQD_CAR", className: "td-fixed text-center" },
    { data: "INQD_MFGORDER", className: "td-fixed" },
    { data: "INQD_ITEM", className: "td-fixed" },
    {
      data: "INQD_PARTNAME",
      className: "td-fixed",
      render: (data) => showdata(data, 200),
    },
    { data: "INQD_DRAWING", render: (data) => showdata(data, 225) },
    { data: "INQD_VARIABLE", render: (data) => showdata(data, 225) },
    { data: "INQD_QTY", className: "text-center" },
    { data: "INQD_UM" },
    { data: "INQD_SUPPLIER" },
    {
      data: "INQD_SENDPART",
      className: "text-center",
      render: (data) => {
        return data != null ? `<i class="icofont-check-alt fs-3"></i>` : "";
      },
    },
    {
      data: "INQD_UNREPLY",
      className: "text-center",
      render: (data) => {
        return data != null ? `<i class="icofont-close fs-4"></i>` : "";
      },
    },
    { data: "INQD_MAR_REMARK", render: (data) => showdata(data, 225) },
    { data: "INQD_DES_REMARK", render: (data) => showdata(data, 225) },
  ];

  const colWidth = [18, 18, 75, 50, 200];
  var left = 0;
  var leftArr = [];
  opt.createdRow = function (row, data) {
    //Fixed Column
    if (leftArr.length == 0) {
      leftArr.push(left);
      var head = $(tableid).find("thead tr:eq(0) th.td-fixed");
      head.map(function (i, th) {
        setTableWidth($(th), colWidth[i], left);
        left += getTotalWidth($(th), colWidth[i]) + 1;
        leftArr.push(left);
      });
    }
    $(row)
      .find("td.td-fixed")
      .map(function (i, cols) {
        setTableWidth($(cols), colWidth[i], leftArr[i]);
      });

    if (data.INQD_UNREPLY != null) {
      $(row).addClass("disable-row");
    }
  };
  return $(tableid).DataTable(opt);
}
