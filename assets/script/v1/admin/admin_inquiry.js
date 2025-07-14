$(document).on("click", ".sendbm", async function (e) {
  e.preventDefault();
  const row = table.row($(this).closest("tr"));
  const inqid = $(this).attr("data-id");
  const res = await sendBM(inqid);
  table.row(row).data(res[0]).draw(false);
  const notify = $.notify(
    {
      title: "Process Success!!!",
      icon: "icofont-exclamation-circle",
      message: "Add/Update Pre-BM Data already",
    },
    alertOption
  );
  notify.update("type", "success");
});

async function sendBM(inqid) {
  return new Promise((resolve) => {
    $.ajax({
      url: host + "admin/inquiries/sendbm",
      type: "post",
      async: false,
      dataType: "json",
      data: { id: inqid },
      success: function (res) {
        resolve(res.data);
      },
    });
  });
}

function createTable(query) {
  const tableid = "#inqdetail";
  if ($.fn.DataTable.isDataTable(tableid)) $(tableid).DataTable().destroy();
  const opt = { ...tableOption };
  opt.ajax = {
    url: `${host}admin/inquiries/getInquiry`,
    dataType: "json",
    type: "post",
    //data: query,
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
    { data: "TOTAL", className: "text-center" },
    { data: "AMEC", className: "text-center" },
    { data: "AS400", className: "text-center" },
    {
      data: "INQ_ID",
      className: "text-center action",
      sortable: false,
      render: (data) => {
        return `
            <div class="d-flex justify-content-center gap-1">
                <a href="${host}mar/inquiry/view/${data}" class="btn btn-sm btn-second view-inq">View</a>
                <a href="#" class="btn btn-sm btn-main text-nowrap sendbm" data-id="${data}">Send B/M</a>
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
          `;
    //$(".tablefoot").html(footer);
  };
  return $(tableid).DataTable(opt);
}
