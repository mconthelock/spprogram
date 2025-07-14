$(document).on("click", "#select-all", function (e) {
  //e.preventDefault();
  if ($(this).prop("checked")) {
    $(".inputCheck").prop("checked", true);
  } else {
    $(".inputCheck").prop("checked", false);
  }
});

$(document).on("click", ".approval", function (e) {
  e.preventDefault();
  const value = $(this).attr("data-value");
  const selected = [];
  $(".inputCheck:checked").each(function () {
    selected.push($(this).val());
  });

  if (selected.length == 0) {
    showErrorNotify("Please select at least one inquiry");
    return;
  }

  $.ajax({
    url: `${host}fin/inquiry/approval`,
    method: "post",
    dataType: "json",
    data: { selected: selected, status: value },
    success: function (res) {
      $(".inputCheck:checked").each(function () {
        const tr = $(this).closest("tr");
        table.rows(tr).remove().draw();
      });
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
  opt.order = [[1, "desc"]];
  const inputCheck = (name, data) => {
    return `<input class="form-check-input inputCheck ${name}" name="${name}[]" type="checkbox" value="${data}"/>`;
  };

  const flag = $("#action").val();
  opt.columns = [
    {
      data: "INQ_ID",
      sortable: false,
      className: "text-center",
      render: (data) => inputCheck("selected", data),
    },
    { data: "INQ_NO" },
    { data: "INQ_REV", className: "text-center" },
    { data: "STATUS_ACTION" },
    { data: "MAR_PIC" },
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
    { data: "FNAME" },
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
      data: "INQ_FIN_CONFIRM",
      className: "text-center",
      render: (data) => {
        if (data == null) return "";
        const text =
          data.slice(0, 18).replaceAll(".", ":") + " " + data.slice(-2);
        const parsedDate = new Date(text);
        return moment(parsedDate).format("YYYY-MM-DD HH:mm");
      },
    },
    { data: "INQ_FIN_REMARK" },
    {
      data: "INQ_ID",
      className: "text-center action",
      sortable: false,
      render: (data) => {
        var str = ``;
        if (flag == 3)
          str = `<a href="${host}fin/inquiry/show/${data}/${flag}/" class="btn btn-sm btn-second">View</a>`;
        else
          str = `<a href="${host}fin/inquiry/edit/${data}/${flag}/" class="btn btn-sm btn-second">View</a>`;
        return `<div class="d-flex justify-content-center gap-1">${str}</div>`;
      },
    },
  ];

  opt.initComplete = function () {
    const footer = `
        <button class="btn btn-main me-2 approval" data-value="17"><i class="icofont-ui-check"></i> Approve</button>
        <button class="btn btn-delete me-2 approval" data-value="18"><i class="icofont-error"></i> Reject</button>
        <button class="btn btn-second me-2" id="export-detail"><i class="icofont-file-excel"></i> Export Excel</button>
        <button class="btn btn-cancel me-2" onclick="history.back()">Go Back</button>`;
    $(".tablefoot").html(footer);
  };
  return $(tableid).DataTable(opt);
}

function getQuery() {
  var query = {};
  if ($("#query").length > 0) {
    if ($("#status_lt").val() != undefined)
      query.status_lt = $("#status_lt").val();
    if ($("#status").val() != undefined) query.status = $("#status").val();
    if ($("#status_list").val() != undefined)
      query.status_list = $("#status_list").val();
  } else {
    const q = localStorage.getItem("query_fin_report");
    query = JSON.parse(q);
  }
  return query;
}
