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

$(document).on("click", ".edit-inq", function (e) {
  e.preventDefault();
  const row = table.row($(this).parents("tr")).data();
  if (row.INQ_STATUS < 3) {
    window.location = `${host}mar/inquiry/edit/${row.INQ_ID}`;
    return;
  }

  if (row.INQ_STATUS >= 3 && row.INQ_TYPE == "SP") {
    window.location = `${host}mar/inquiry/revise/${row.INQ_ID}`;
    return;
  }

  if (row.INQ_TYPE == "Secure") {
    window.location = `${host}mar/stockpart/edit/${row.INQ_ID}`;
    return;
  }

  if (row.INQ_TYPE == "Price") {
    window.location = `${host}mar/price/edit/${row.INQ_ID}`;
    return;
  }
});

$(document).on("click", ".delete-inq", function (e) {
  e.preventDefault();
  const rd = table.row($(this).parents("tr")).data();
  const rw = table.row($(this).parents("tr"));
  swalConfirm
    .fire({
      title: "Delete Inquiry",
      text: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Of caurse!",
      cancelButtonText: "Cancel",
      dangerMode: false,
    })
    .then((result) => {
      if (result.isConfirmed) {
        $("#loading").removeClass("d-none");
        $.ajax({
          url: host + "inquiry/delete",
          type: "post",
          async: false,
          dataType: "json",
          data: { inqid: rd.INQ_ID },
          success: function (result) {
            rw.remove().draw();
            $("#loading").addClass("d-none");
          },
        });
      }
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
  opt.columnDefs = [
    {
      visible: false,
      searchable: false,
      orderable: false,
      targets: 0,
    },
  ];

  opt.order = [[0, "desc"]];

  const check = (status) => {
    const color = status > 9 ? "#ff2929" : status == 9 ? "#1abc9c" : "#697a8d";
    let str = `<i class="icofont-check-circled fs-5" style="color: ${color}"></i>`;
    if (status > 9)
      str = `<i class="icofont-close-circled fs-5" style="color: ${color}"></i>`;
    return str;
  };

  opt.columns = [
    { data: "INQ_ID" },
    {
      data: "INQ_DATE",
      className: "text-center",
      render: (data) => {
        return moment(data).format("YYYY-MM-DD");
      },
    },
    { data: "INQ_NO" },
    { data: "INQ_REV", className: "text-center" },
    { data: "INQ_TRADER" },
    { data: "INQ_AGENT" },
    { data: "INQ_COUNTRY" },
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
      data: "EME_STATUS",
      className: "text-center",
      render: function (data) {
        return data != null ? check(data) : "";
      },
    },
    {
      data: "EEL_STATUS",
      className: "text-center",
      render: function (data) {
        return data != null ? check(data) : "";
      },
    },
    {
      data: "EAP_STATUS",
      className: "text-center",
      render: function (data) {
        return data != null ? check(data) : "";
      },
    },
    {
      data: "ESO_STATUS",
      className: "text-center",
      render: function (data, e, row) {
        return data != null ? check(data) : "";
      },
    },
    {
      data: "INQ_ID",
      className: "text-center action",
      sortable: false,
      render: (data) => {
        return `
            <div class="d-flex justify-content-center gap-1">
                <a href="#" class="btn btn-sm btn-second view-inq">View</a>
                <a href="#" class="btn btn-sm btn-main edit-inq">Edit</a>
                <a href="#" class="btn btn-sm btn-delete delete-inq">Delete</a>
            </div>`;
      },
    },
  ];

  opt.initComplete = function () {
    const footer = `
            <a href="${host}mar/inquiry/add" class="btn btn-main me-2"><i class="icofont-plus-circle"></i>Add Inquiry</a>
            <button class="btn btn-second me-2" id="export"><i class="icofont-file-excel"></i> Export Excel</button>
            <button class="btn btn-second me-2" id="export-detail"><i class="icofont-ui-file"></i> Export Excel (2)</button>
            <button class="btn btn-cancel me-2" onclick="history.back()">Go Back</button>
            <div>
                <ul id="definition">
                    <li class="ms-3">${check(2)} : Pending D/E Process</li>
                    <li class="ms-3">${check(9)} : D/E Complete</li>
                    <li class="ms-3">${check(17)}: Bypass D/E</li>
                </ul>
            </div>
        `;
    $(".tablefoot").html(footer);
  };
  return $(tableid).DataTable(opt);
}
