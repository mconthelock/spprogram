$("#attachment-btn").on("click", function (e) {
  e.preventDefault();
  $("#attachment").click();
});

$("#attachment").on("change", function () {
  var files = this.files;
  for (var i = 0; i < files.length; i++) {
    const tmp = formdata.getAll("files[]");
    const isDuplicate = tmp.find((val) => val.name == files[i].name);
    if (isDuplicate) {
      const notify = $.notify(
        {
          title: "Process Fail!!!",
          icon: "icofont-exclamation-circle",
          message: `${files[i].name} is already existing`,
        },
        alertOption
      );
      notify.update("type", "error");
      continue;
    }

    formdata.append("files[]", files[i]);
    tableattach.row
      .add({
        FILE_ORIGINAL_NAME: files[i].name,
        FILE_NAME: files[i].name,
        FILE_SIZE: files[i].size,
        FILE_TYPE: files[i].name.split(".").pop().toLowerCase(),
        SNAME: $("#loginname").val(),
        FILE_STATUS: 0,
        FILE_DATE: moment().format("YYYY-MM-DD HH:mm"),
      })
      .draw();
  }
});

$("#attachment").on("cancel", function () {
  $("#attachment").val("");
});

$(document).on("click", ".local-download", function (e) {
  e.preventDefault();
  const row = tableattach.row($(this).parents("tr")).data();
  const file = formdata
    .getAll("files[]")
    .find((val) => val.name == row.FILE_NAME);
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = row.FILE_NAME;
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

$(document).on("click", ".local-delete", function (e) {
  e.preventDefault();
  const row = tableattach.row($(this).parents("tr")).data();
  const values = formdata.getAll("files[]");
  formdata.delete("files[]");
  values.map((val) => {
    if (val.name != row.FILE_NAME) {
      formdata.append("files[]", val);
    }
  });
  tableattach.row($(this).parents("tr")).remove().draw();
});

$(document).on("click", ".server-download", function (e) {
  e.preventDefault();
  const row = tableattach.row($(this).parents("tr")).data();
  const inqno = row.INQ_NO;
  const file = row.FILE_NAME;
  var url = `${host}attachment/downloadttach/${inqno}/${file}`;
  window.location.href = url;
});

$(document).on("click", ".deletefile:not(.disabled)", function () {
  var tr = $(this).closest("tr");
  if (tr.find(".mode").val() == "temp") {
    tr.find(".mode").val("dtemp");
  } else {
    tr.find(".mode").val("D");
  }
  tr.addClass("d-none");
});

function craeteTableAttach(data) {
  const filetype = [
    { type: "pdf", icon: '<i class="icofont-file-pdf"></i>' },
    { type: "xls", icon: '<i class="icofont-file-pdf"></i>' },
    { type: "xlsx", icon: '<i class="icofont-file-pdf"></i>' },
    { type: "csv", icon: '<i class="icofont-file-pdf"></i>' },
  ];
  const tableid = "#table-attach";
  if ($.fn.DataTable.isDataTable(tableid)) $(tableid).DataTable().destroy();
  const opt = { ...tableOption };
  opt.dom = '<lf<"fixed-table"t><"tb-button"i>p>';
  opt.data = data;
  //opt.paging = false;
  opt.pageLength = 5;
  opt.searching = false;
  opt.columns = [
    { data: "FILE_ORIGINAL_NAME" },
    { data: "SNAME" },
    {
      data: "FILE_DATE",
      render: (data) => {
        return moment(data).format("YYYY-MM-DD HH:mm");
      },
    },
    {
      data: "FILE_NAME",
      className: "text-center action",
      orderable: false,
      render: (data, e, row) => {
        return `
              <a href="#" class="${
                row.FILE_STATUS == 0 ? "local-download" : "server-download"
              }"><i class="icofont-download fs-5"></i></a>
              <a href="#" class="delete deletefile ${
                row.FILE_STATUS == 0 ? "local-delete" : "server-delete"
              }"><i class="icofont-trash fs-6"></i></a>
              `;
      },
    },
    { data: "FILE_STATUS", visible: false },
    { data: "FILE_TYPE", visible: false },
    { data: "FILE_SIZE", visible: false },
  ];
  return $(tableid).DataTable(opt);
}
