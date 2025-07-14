function createTable(query) {
  const tableid = "#inqdetail";
  if ($.fn.DataTable.isDataTable(tableid)) $(tableid).DataTable().destroy();
  const opt = { ...tableOption };
  opt.ajax = {
    url: `${host}mar/orders/getOrders`,
    dataType: "json",
    type: "post",
    data: query,
  };
  opt.dom = '<lf<"fixed-table"t><"tablefoot d-inline-flex pt-1 mt-3"i>p>';
  opt.order = [[0, "desc"]];
  var color = "#919191";
  const check = () => {
    return `<i class="icofont-check-circled fs-5" style="color: ${color}"></i>`;
  };
  opt.columns = [
    {
      data: "IDS_DATE",
      className: "text-center",
      render: (data) => {
        return moment(data).format("YYYY-MM-DD");
      },
    },
    {
      data: "RECON_PARTS",
      className: "text-center",
      render: (data) => {
        return data == 1 ? check() : "";
      },
    },
    // { data: "ORDER_NO" },
    { data: "PCATE_NAME" },
    { data: "PRJ_NO" },
    // { data: "PRJ_NAME" },
    { data: "AGENT" },
    { data: "TRADER" },
    { data: "DSTN" },
    { data: "INQ_NO" },
    {
      data: "CUST_RQS",
      className: "text-center",
      render: (data) => {
        return moment(data).format("YYYY-MM-DD");
      },
    },
    {
      data: "CREATEBY",
      className: "fullname",
      render: (data) => (data == null ? "" : data.toLowerCase()),
    },
    {
      data: "INQ_NO",
      className: "text-center",
      sortable: false,
      render: (data, e, row) => {
        if (row.RECON_PARTS == 1) return "";
        return `<a class="load-excel" href="#" data-value="${data}"><i class="icofont-ui-clip fs-4"></i></a>`;
      },
    },
  ];

  opt.initComplete = function () {
    const footer = `
        <button class="btn btn-second me-2" id="export"><i class="icofont-file-excel"></i> Export Excel</button>
        <button class="btn btn-cancel me-2" onclick="history.back()">Go Back</button>
    `;
    $(".tablefoot").html(footer);
  };
  return $(tableid).DataTable(opt);
}

$(document).on("click", ".load-excel", async function (e) {
  e.preventDefault();
  const url = `${host}mar/orders/excel/`;
  const id = $(this).attr("data-value");
  await showLoading();
  await createExcel(url, { id: id });
  await hideLoading();
});
