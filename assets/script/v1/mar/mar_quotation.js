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

  const check = (status) => {
    const color = status > 9 ? "#ff2929" : status == 9 ? "#1abc9c" : "#697a8d";
    let str = `<i class="icofont-check-circled fs-5" style="color: ${color}"></i>`;
    if (status > 9)
      str = `<i class="icofont-close-circled fs-5" style="color: ${color}"></i>`;
    return str;
  };

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
    { data: "STATUS_DESC" },
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
      data: "INQ_PKC_REQ",
      className: "text-center",
      render: (data, e, row) => {
        if (data == "0") return "";
        if (data == "1" && row.INQ_PKC_FINISH == null) return check(2);
        return check(9);
      },
    },
    {
      data: "INQ_ID",
      className: "text-center action",
      sortable: false,
      render: (data, e, row) => {
        let str = "";
        if (row.INQ_PKC_REQ == "1" && row.INQ_PKC_FINISH == null) {
          str = `<div class="d-flex justify-content-center gap-1">
                <a href="${host}mar/quotation/view/${data}" class="btn btn-sm btn-cancel view-inq" style="min-width:65px !important;">View</a>
            </div>`;
        } else {
          str = `<div class="d-flex justify-content-center gap-1">
                <a href="${host}mar/quotation/edit/${data}" class="btn btn-sm btn-second view-inq" style="min-width:65px !important;">Process</a>
            </div>`;
        }
        return str;
      },
    },
  ];

  opt.initComplete = function () {
    const footer = `
        <button class="btn btn-second me-2" id="export"><i class="icofont-file-excel"></i> Export Excel</button>
        <button class="btn btn-second me-2" id="export-detail"><i class="icofont-ui-file"></i> Export Excel (2)</button>
        <button class="btn btn-cancel me-2" onclick="history.back()">Go Back</button>`;
    $(".tablefoot").html(footer);
  };
  return $(tableid).DataTable(opt);
}

function createTableRelease(query) {
  const tableid = "#inqdetail";
  if ($.fn.DataTable.isDataTable(tableid)) $(tableid).DataTable().destroy();
  const opt = { ...tableOption };
  opt.ajax = {
    url: `${host}mar/quotation/getRealase`,
    dataType: "json",
    type: "post",
    data: query,
  };

  opt.dom = '<lf<"fixed-tables"t><"tablefoot d-inline-flex pt-1 mt-3"i>p>';
  opt.order = [0, "desc"];
  opt.columnDefs = [
    {
      visible: false,
      searchable: false,
      orderable: false,
      targets: 0,
    },
  ];

  opt.columns = [
    { data: "UPDATE_AT" },
    {
      data: "INQ_DATE",
      className: "text-center",
      render: (data) => {
        return moment(data).format("YYYY-MM-DD");
      },
    },
    { data: "INQ_NO" },
    { data: "INQ_REV", className: "text-center" },
    // { data: "INQ_TRADER" },
    // { data: "INQ_AGENT" },
    {
      data: "INQ_COUNTRY",
      className: "fullname",
      render: (data) => (data == null ? "" : data.toLowerCase()),
    },
    {
      data: "MAR_PIC",
      className: "fullname",
      render: (data) => (data == null ? "" : data.toLowerCase()),
    },
    {
      data: "INQ_MAR_SENT",
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
      data: "INQ_FINISH",
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
      data: "QUO_DATE",
      className: "text-center",
      render: (data) => {
        if (data == null) return "";
        return moment(data).format("YYYY-MM-DD");
      },
    },
    {
      data: "QUO_VALIDITY",
      className: "text-center",
      render: (data) => {
        if (data == null) return "";
        return moment(data).format("YYYY-MM-DD");
      },
    },
    {
      data: "INQ_DATE",
      className: "text-center",
      render: (data, e, row) => {
        const sdate = moment(data);
        const edate = moment(row.QUO_DATE);
        const diff = sdate.diff(edate, "day", true);
        return Math.abs(Math.ceil(diff));
      },
    },
    {
      data: "INQ_ID",
      className: "text-center action",
      sortable: false,
      render: (data, e, row) => {
        let url = "";
        if (row.INQ_TYPE == "Out2out") {
          url = `${host}mar/out2out/edit/${data}`;
        } else {
          url = `${host}mar/quotation/edit/${data}`;
        }
        return `
            <div class="d-flex justify-content-center align-items-center gap-1 has-children">
                <a class="btn btn-sm btn-second" href="${url}">Edit</a>
                <a class="btn btn-sm btn-cancel" href="${host}mar/quotation/excel/${data}">Export</a>
                <div class="dropdown">
                    <a class="" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <div class="moreoption"></div>
                    </a>
                    <ul class="dropdown-menu dropdown-option">
                        <li><a class="dropdown-item sparq" data-id="${data}" href="#">File import to Sparq</a></li>
                        <li><a class="dropdown-item" href="${host}mar/quotation/orders/${data}">File import new order </a></li>
                        <li><a class="dropdown-item" href="${host}mar/inquiry/revise/${data}">Revise Inquiry</a></li>
                    </ul>
                </div>
            </div>
        `;
      },
    },
  ];

  opt.createdRow = function (row, data) {
    if (data.INQ_STATUS == "98") $(row).addClass("bg-error");
  };

  opt.initComplete = function () {
    const footer = `
          <button class="btn btn-second me-2" id="export"><i class="icofont-file-excel"></i> Export Excel</button>
          <button class="btn btn-second me-2" id="export-detail"><i class="icofont-ui-file"></i> Export Excel (2)</button>
          <button class="btn btn-cancel me-2" onclick="history.back()">Go Back</button>`;
    $(".tablefoot").html(footer);
  };
  return $(tableid).DataTable(opt);
}

$(document).on("click", ".sparq", function () {
  const inqid = $(this).attr("data-id");
  $.ajax({
    url: host + "mar/quotation/sparq",
    type: "POST",
    data: { inqid },
    async: false,
    success: function (data) {
      var timeInMs = Date.now();
      JSONToTXTConvertor(data, "SPDATA" + timeInMs, false);
      $("#loading").addClass("d-none");
    },
  });
});
