function createTable(query) {
  const tableid = "#inqdetail";
  if ($.fn.DataTable.isDataTable(tableid)) $(tableid).DataTable().destroy();
  const opt = { ...tableOption };
  opt.ajax = {
    url: `${host}des/inquiries/getinquiry`,
    dataType: "json",
    type: "post",
    data: query,
  };

  //   opt.dom = '<lf<"fixed-table"t><"tablefoot d-inline-flex pt-1 mt-3" i>p>';
  opt.dom = '<lf<"fixed-table"t><i>p>';
  opt.order = [[0, "desc"]];
  opt.info = true;
  opt.columnDefs = [
    {
      visible: false,
      searchable: false,
      orderable: false,
      targets: 0,
    },
  ];

  const check = (status) => {
    let color = `#697a8d`;
    if (status == 9) color = "#1abc9c";
    if (status == 4) color = "#ffb429";
    if (status == 7) color = "#2990ff";
    let str = `<i class="icofont-check-circled fs-5" style="color: ${color}"></i>`;
    return str;
  };

  let flag = $("#status").val();
  flag = flag == undefined ? 0 : parseInt(flag);
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
    { data: "STATUS_DESC" },
    {
      data: "MAR_PIC",
      className: "fullname",
      render: (data) => data.toLowerCase(),
    },
    {
      data: "INQ_MAR_SENT",
      className: "text-center text-nowrap",
      render: (data) => {
        const text =
          data.slice(0, 18).replaceAll(".", ":") + " " + data.slice(-2);
        const parsedDate = new Date(text);
        return moment(parsedDate).format("YYYY-MM-DD HH:mm");
      },
    },
    {
      data: "INQ_COMPARE_DATE",
      className: "text-center compare-date",
      render: (data) => {
        if (data == null) return "";
        const text =
          data.slice(0, 18).replaceAll(".", ":") + " " + data.slice(-2);
        const parsedDate = new Date(text);
        return moment(parsedDate).format("YYYY-MM-DD HH:mm");
      },
    },

    {
      data: "EME_DES",
      className: `designer ${flag == 7 || flag == 0 ? "" : "d-none"} fullname`,
      render: (data, e, row) => {
        let name = "";
        const design = $("#design").val();
        if (design == undefined) return "";
        if (design == "EME") name = row.EME_DES_NAME;
        if (design == "EEL") name = row.EEL_DES_NAME;
        if (design == "EAP") name = row.EAP_DES_NAME;
        if (design >= "ESO") name = row.ESO_DES_NAME;
        return name == null ? "" : name.toLowerCase();
      },
    },
    {
      data: "EME_CHK",
      className: `checker ${flag == 4 || flag == 0 ? "" : "d-none"} fullname`,
      render: (data, e, row) => {
        const design = $("#design").val();
        if (design == undefined) return "";
        let name = "";
        if (design == "EME") name = row.EME_CHK_NAME;
        if (design == "EEL") name = row.EEL_CHK_NAME;
        if (design == "EAP") name = row.EAP_CHK_NAME;
        if (design >= "ESO") name = row.ESO_CHK_NAME;
        return name == null ? "" : name.toLowerCase();
      },
    },
    {
      data: "EME_CLASS",
      className: "text-center",
      render: (data, e, row) => {
        let name = "";
        const design = $("#design").val();
        if (design == undefined) return "";
        if (design == "EME") name = row.EME_INQG_CLASS;
        if (design == "EEL") name = row.EEL_INQG_CLASS;
        if (design == "EAP") name = row.EAP_INQG_CLASS;
        if (design >= "ESO") name = row.ESO_INQG_CLASS;
        return name == null ? "" : name;
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
      render: function (data) {
        return data != null ? check(data) : "";
      },
    },
    {
      data: "INQ_ID",
      className: "text-center action",
      sortable: false,
      render: (data, e, row) => {
        const status = $("#status").val();
        if ($("#logingroup").val() == "DSV") {
          return `<a href="${host}des/inquiries/show/${data}" class="btn btn-sm btn-second" style="width: 100px">View</a>`;
        }

        if (status > 1)
          return `<a href="${host}des/inquiries/edit/${data}/${status}" class="btn btn-sm btn-second" style="width: 100px">Process data</a>`;

        if ($("#logingroup").val() !== "LDR")
          return `<a href="${host}des/inquiries/view/${data}" class="btn btn-sm btn-second" style="width: 100px">View</a>`;

        const grp = $("#design").val();
        const current_status = `${grp}_STATUS`;
        const current_val = row[current_status];
        if (current_val == 2)
          return `<a href="${host}des/inquiries/edit/${data}/2" class="btn btn-sm btn-second" style="width: 100px">Process data</a>`;

        return `<a href="${host}des/inquiries/revise/${data}/2" class="btn btn-sm btn-second" style="width: 100px">Process data</a>`;
      },
    },
  ];

  opt.initComplete = function () {
    let footer = `
            <button class="btn btn-second me-2" id="export"><i class="icofont-ui-file"></i> Export Excel</button>
            <button class="btn btn-cancel me-2" onclick="history.back()">Go Back</button>
            <div>
                <ul id="definition">
                    <li class="ms-3">${check(2)}: Pending Assign Process</li>
                    <li class="ms-3">${check(4)}: Designing</li>
                    <li class="ms-3">${check(7)}: Checking</li>
                    <li class="ms-3">${check(9)}: Complete</li>
                </ul>
            </div>`;
    $(".tablefoot").html(footer);
  };
  return $(tableid).DataTable(opt);
}
