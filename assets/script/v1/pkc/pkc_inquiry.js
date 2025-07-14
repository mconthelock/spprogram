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
        const now = moment();
        const then = moment(data);
        const diffInMonths = now.diff(then, "weeks", true);
        if (diffInMonths < 1) {
          return then.fromNow();
        } else {
          return then.format("YYYY-MM-DD HH:mm:ss");
        }
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
      render: (data, e, row) => {
        return `<div class="d-flex justify-content-center gap-1">
            <a href="${host}pkc/inquiry/view/${data}" class="btn btn-sm btn-cancel ${
          row.INQ_PKC_FINISH == null ? "d-none" : ""
        }">View</a>
            <a href="${host}pkc/inquiry/edit/${data}" class="btn btn-sm btn-second ${
          row.INQ_PKC_FINISH == null ? "" : "d-none"
        }">Process</a>
        </div>`;
      },
    },
  ];

  opt.initComplete = function () {
    const footer = `
              <button class="btn btn-second me-2" id="export-detail"><i class="icofont-file-excel"></i> Export Excel</button>
              <button class="btn btn-cancel me-2" onclick="history.back()">Go Back</button>
              <div>
                  <ul id="definition">
                      <li class="ms-3">${check(9)} : D/E Complete</li>
                      <li class="ms-3">${check(17)}: Bypass D/E</li>
                  </ul>
              </div>
          `;
    $(".tablefoot").html(footer);
  };
  return $(tableid).DataTable(opt);
}
