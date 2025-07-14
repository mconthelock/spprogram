$(document).on("click", ".view-inq", function (e) {
  e.preventDefault();
  const row = table.row($(this).parents("tr")).data();
  if (row.INQ_TYPE == "Secure") {
    window.location = `${host}mar/stockpart/view/${row.INQ_ID}`;
    return;
  }
  window.location = `${host}mar/inquiry/view/${row.INQ_ID}`;
  return;
});

$(document).on("change", ".fincomment", function () {
  const td = $(this).closest("td");
  td.find(".fincomment-loading").removeClass("d-none");
  const selectedRow = $(this).closest("tr");
  const row = table.row(selectedRow).data();
  const id = row.INQ_ID;
  const msg = $(this).val();
  console.log(row.INQ_FIN_RECV);
  const recv =
    row.INQ_FIN_RECV == null
      ? moment().format("YYYY-MM-DD HH:mm:ss")
      : moment(row.INQ_FIN_RECV).format("YYYY-MM-DD HH:mm:ss");
  $.ajax({
    url: host + "fin/inquiry/updateComment",
    method: "post",
    dataType: "json",
    async: false,
    data: {
      inqid: id,
      message: msg,
      recvdate: recv,
    },
    success: function (res) {
      row.STATUS_DESC = "Finance Processing";
      row.INQ_FIN_REMARK = msg;
      table.row(selectedRow).data(row).draw();
      td.find(".fincomment-loading").addClass("d-none");
    },
  });
});

function createTable(query) {
  const tableid = "#inqdetail";
  if ($.fn.DataTable.isDataTable(tableid)) $(tableid).DataTable().destroy();
  const opt = { ...tableOption };
  opt.ajax = {
    url: `${host}mar/inquiry/getInquiry`,
    dataType: "json",
    type: "post",
    data: query,
  };

  opt.dom = '<lf<"fixed-table"t><"tablefoot d-inline-flex pt-1 mt-3"i>p>';
  opt.order = [[0, "desc"]];

  const flag = $("#action").val();
  opt.columns = [
    {
      data: "INQ_DATE",
      className: "text-center",
      render: (data) => {
        return moment(data).format("YYYY-MM-DD");
      },
    },
    { data: "INQ_NO" },
    { data: "INQ_REV", className: "text-center" },
    { data: "STATUS_ACTION" },
    {
      data: "MAR_PIC",
      className: "fullname",
      render: (data) => data.toLowerCase(),
    },
    {
      data: "INQ_MAR_SENT",
      className: "text-center",
      render: (data) => {
        const text =
          data.slice(0, 18).replaceAll(".", ":") + " " + data.slice(-2);
        const parsedDate = new Date(text);
        return moment(parsedDate).format("YYYY-MM-DD HH:mm");
      },
    },
    {
      data: "INQ_BM_DATE",
      className: "text-center",
      render: (data) => {
        if (data == null) return "";
        const text =
          data.slice(0, 18).replaceAll(".", ":") + " " + data.slice(-2);
        const parsedDate = new Date(text);
        return moment(parsedDate).format("YYYY-MM-DD HH:mm");
      },
    },
    {
      data: "FNAME",
      className: `fullname ${flag == 1 ? "d-none" : ""}`,
      render: function (data) {
        return data != null ? data.toLowerCase() : "";
      },
    },
    {
      data: "INQ_FIN_FINISH",
      className: "text-center",
      render: (data) => {
        if (data == null) return "";
        const text =
          data.slice(0, 18).replaceAll(".", ":") + " " + data.slice(-2);
        const parsedDate = new Date(text);
        return moment(parsedDate).format("YYYY-MM-DD HH:mm");
      },
    },
    {
      data: "INQ_FIN_REMARK",
      className: `position-relative ${flag != 1 ? "d-none" : ""}`,
      sortable: false,
      render: function (data, e, row) {
        return `<textarea class="form-control fincomment" rows="1">${
          data == null ? "" : data
        }</textarea>
        <div class="fincomment-loading d-none">
            Loading....
        </div>`;
      },
    },
    {
      data: "INQ_ID",
      className: "text-center action",
      sortable: false,
      render: (data) => {
        var str = ``;
        if (flag == 3)
          str = `<a href="${host}fin/inquiry/show/${data}/${flag}/" class="btn btn-sm btn-second">View</a>`;
        else
          str = `<a href="${host}fin/inquiry/edit/${data}/${flag}/" class="btn btn-sm btn-second">Process</a>`;
        return `<div class="d-flex justify-content-center gap-1">${str}</div>`;
      },
    },
    {
      data: "INQ_FIN_RECV",
      className: "d-none",
      render: (data) => {
        if (data == null) return "";
        const text =
          data.slice(0, 18).replaceAll(".", ":") + " " + data.slice(-2);
        const parsedDate = new Date(text);
        return moment(parsedDate).format("YYYY-MM-DD HH:mm");
      },
    },
  ];

  opt.initComplete = function () {
    const footer = `
        <button class="btn btn-second me-2" id="export-detail"><i class="icofont-file-excel"></i> Export Excel</button>
        <button class="btn btn-cancel me-2" onclick="history.back()">Go Back</button>`;
    $(".tablefoot").html(footer);
  };
  return $(tableid).DataTable(opt);
}
