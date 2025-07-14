function createTable(query, url = '') {
    if(url == '') url = host + "inquiry/getInquiryTable";
  const group = $("#logingroup").val();
  const tableid = "#inqdetail";
  if ($.fn.DataTable.isDataTable(tableid)) $(tableid).DataTable().destroy();
  const opt = { ...tableOption };
  opt.ajax = {
    url: url,
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
    { data: "MAR_PIC" },
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
      data: "INQ_COMPARE_DATE",
      className: "text-center compare-date",
      render: (data) => {
        if (data == null) return "";
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
        data: "EME_DES",
        className: `designer ${$(logingroup).val() == "MAR" ? "d-none": ""}`,
        visible: $('#design').val() === undefined ? false : true,
        render: (data, e, row) => {
            let name = '';
            const design = $('#design').val();
            if(design == undefined) return "";
            if(design == 'EME') name = row.EME_DES;
            if(design == 'EEL') name = row.EEL_DES;
            if(design == 'EAP') name = row.EAP_DES;
            if(design >= 'ESO') name = row.ESO_DES;
            return name;
        }
    },
    {
        data: "EME_CHK",
        className: `checker ${$(logingroup).val() == "MAR" ? "d-none": ""}`,
        visible: $('#design').val() === undefined ? false : true,
        render: (data, e, row) => {
            const design = $('#design').val();
            if(design == undefined) return "";
            let name = '';
            if(design == 'EME') name = row.EME_CHK;
            if(design == 'EEL') name = row.EEL_CHK;
            if(design == 'EAP') name = row.EAP_CHK;
            if(design >= 'ESO') name = row.ESO_CHK;
            return name;
        }
    },
    {
      data: "EME_STATUS_ID",
      className: "text-center",
      render: function (data) {
        return data != null ? check(data) : "";
      },
    },
    {
      data: "EEL_STATUS_ID",
      className: "text-center",
      render: function (data) {
        return data != null ? check(data) : "";
      },
    },
    {
      data: "EAP_STATUS_ID",
      className: "text-center",
      render: function (data) {
        return data != null ? check(data) : "";
      },
    },
    {
      data: "ESO_STATUS_ID",
      className: "text-center",
      render: function (data) {
        return data != null ? check(data) : "";
      },
    },
    {
      data: "INQ_ID",
      className: "text-center action",
      sortable: false,
      render: (data) => {
        let str = "";
        if (group == "MAR") {
          str = `
                <div class="d-flex justify-content-center gap-1">
                    <a href="${host}mar/inquiry/view/${data}" class="btn btn-sm btn-second">View</a>
                    <a href="#" class="btn btn-sm btn-main edit-inq">Edit</a>
                    <a href="#" class="btn btn-sm btn-delete delete-inq">Delete</a>
                </div>
                `;
        } else {
          const status = $("#status").val();
          if(status === undefined) str = `<a href="${host}des/inquiry/view/${data}" class="btn btn-sm btn-second" style="width: 100px">View</a>`;
          else str = `<a href="${host}des/inquiry/edit/${data}/${status}" class="btn btn-sm btn-second" style="width: 100px">Process data</a>`;
        }
        return str;
      },
    },
  ];
  opt.drawCallback = function () {
    const status = $("#status").val();
    if(status == 4) $(this).find(".designer").addClass("d-none");
    if(status == 4) $(this).find(".checker").addClass("d-none");
    if(status == 5) $(this).find(".checker").addClass("d-none");
    if(status == 7) $(this).find(".designer").addClass("d-none");

    if($(logingroup).val() == "MAR"){
        $(this).find(".compare-date").addClass("d-none");
        $(this).find(".designer").addClass("d-none");
        $(this).find(".checker").addClass("d-none");
    }
  }

  opt.initComplete = function () {
    let footer = "";
    if (group == "MAR") {
      footer = `
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
    } else {
      footer = `
            <button class="btn btn-second me-2" id="export-detail"><i class="icofont-ui-file"></i> Export Excel</button>
            <button class="btn btn-cancel me-2" onclick="history.back()">Go Back</button>
        `;
    }
    $(".tablefoot").html(footer);
  };
  return $(tableid).DataTable(opt);
}
