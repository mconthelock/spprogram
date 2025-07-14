function createTableHistory(data) {
  const tableid = "#table-history";
  if ($.fn.DataTable.isDataTable(tableid)) $(tableid).DataTable().destroy();

  const opt = { ...tableOption };
  opt.dom = '<lf<"fixed-table"t><"tb-button"i>p>';
  opt.data = data;
  opt.pageLength = 5;
  opt.searching = false;
  opt.order = [
    [1, "desc"],
    [5, "desc"],
  ];

  const showdata = (data, w = 25) => {
    return `<div class="" style="width:${w}px">${
      data == null ? "" : data
    }</div>`;
  };

  opt.columns = [
    { data: "INQ_REV", className: "text-center" },
    {
      data: "INQHDATE",
      className: "text-center text-nowrap",
      render: (data) => {
        return moment(data).format("YYYY-MM-DD HH:mm");
      },
    },
    {
      data: "SNAME",
      className: "fullname text-nowrap",
      render: (data) => data.toLowerCase(),
    },
    { data: "STATUS_ACTION", className: "text-nowrap" },
    { data: "INQH_REMARK" },
    { data: "INQH_ACTION", className: "d-none" },
  ];
  return $(tableid).DataTable(opt);
}
