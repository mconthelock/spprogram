$(".form-select-no-filter").select2({ minimumResultsForSearch: Infinity });
$(".form-select-filter").select2();

$(document).on("change", ".editing", async function (e) {
  e.preventDefault();
  const selectedRow = $(this).closest("tr");
  const selectedCol = $(this).closest("td");
  let row = tableWeight.row(selectedRow).data();
  const name = $(this).attr("data-name");
  row[name] = $(this).val();
  row = await volumn(row);
  tableWeight.row(selectedRow).data(row).draw(false);
  console.log(row);
  selectedRow.find(".editable").inputmask("decimal", { rightAlign: true });

  const next = $(selectedCol).index() + 1;
  const nexCol = tableWeight.row(selectedRow).column(next).nodes().to$();
  if ($(nexCol).find("input").length > 0) $(nexCol).find("input").select();
});

$(document).on("click", "#add-line", function (e) {
  e.preventDefault();
  switchTab();
  const lastRow = tableWeight.row(":last").data();
  const seq = lastRow === undefined ? 1 : parseInt(lastRow.SEQ_WEIGHT) + 1;
  const id = $("#inqid").val();
  const dt = {
    SEQ_WEIGHT: seq,
    NO_WEIGHT: "1",
    PACKAGE_TYPE: "",
    NET_WEIGHT: "",
    GROSS_WEIGHT: "",
    WIDTH_WEIGHT: "",
    LENGTH_WEIGHT: "",
    HEIGHT_WEIGHT: "",
    VOLUMN_WEIGHT: "",
    ROUND_WEIGHT: "",
    INQ_ID: id,
  };
  tableWeight.row.add(dt).draw();
  const col = tableWeight.row(":last").column(3).nodes().to$();
  if ($(col).find("input").length > 0) $(col).find("input").select();
});

$(document).on("click", ".delete", async function (e) {
  e.preventDefault();
  console.log("In");
  const selectedRow = $(this).closest("tr");
  const found = tableWeight.row(selectedRow).data();
  const seq = intVal(found.SEQ_WEIGHT);
  tableWeight.row(selectedRow).remove().draw();

  var i = seq;
  tableWeight.rows().every(function (rw) {
    const dt = this.data();
    if (intVal(dt.SEQ_WEIGHT) >= seq) {
      this.cells(rw, 0).every(function () {
        this.data(i++);
      });
    }
  });
});

$(document).on("click", "#save-data", async function (e) {
  e.preventDefault();
  if ((await checkReqired("#inqform")) === false) return false;
  if ((await checkTabledetail(tableWeight)) === false) return false;

  $.ajax({
    url: host + "pkc/weight/create",
    type: "POST",
    data: { data: tableWeight.data().toArray() },
    success: function (res) {
      window.location = `${host}pkc/inquiry`;
    },
    error: function (err) {
      showErrorNotify(err);
    },
  });
});

function switchTab() {
  $("#weight-tab").addClass("active");
  $("#inq-tab").removeClass("active");

  $("#inq-tab-pane").removeClass("active");
  $("#inq-tab-pane").removeClass("show");

  $("#weight-tab-pane").addClass("active");
  $("#weight-tab-pane").addClass("show");
}

function createTableWeight(dt) {
  const tableid = "#table-weight";
  const opt = { ...tableOption };
  opt.data = dt;
  opt.dom =
    '<lf<"fixed-table edit-table"t><"tablefoot d-inline-flex pt-1 mt-3"i>p>';
  opt.searching = false;
  opt.paging = false;

  const inputArea = (
    name,
    data,
    readonly = false,
    req = true,
    w = "",
    toright = false
  ) => {
    return `<input type="text"
        value="${data == null ? "" : data}"
        class="text-end ${name} ${readonly ? "" : "editing editable"} ${
      toright ? "text-end" : ""
    } ${req ? "required" : ""}"
        name="${name}[]"
        data-name="${name}"
        style="width:${w == "" ? "100%" : w + "px"};"
        ${readonly ? "readonly" : ""}
    />`;
  };

  const inputSelect = (name, data) => {
    let option = `<option value=""></option>`;
    const type = [
      "Wooden package",
      "Carton package+Pallet",
      "Carton box",
      "Pallet",
      "Bare",
    ];
    for (let i = 0; i < type.length; i++) {
      option += `<option value="${type[i]}" ${
        data == type[i] ? "selected" : ""
      }>${type[i]}</option>`;
    }
    return `<select class="required editing ${name}" name="${name}[]" data-name="${name}" style="width:100%">${option}</select>`;
  };

  opt.columns = [
    {
      data: "SEQ_WEIGHT",
      render: (data) => inputArea("SEQ_WEIGHT", data, true),
    },
    {
      data: "PACKAGE_TYPE",
      render: (data) => inputSelect("PACKAGE_TYPE", data),
    },
    {
      data: "NO_WEIGHT",
      render: (data) => inputArea("NO_WEIGHT", data),
    },
    { data: "NET_WEIGHT", render: (data) => inputArea("NET_WEIGHT", data) },
    { data: "GROSS_WEIGHT", render: (data) => inputArea("GROSS_WEIGHT", data) },
    { data: "WIDTH_WEIGHT", render: (data) => inputArea("WIDTH_WEIGHT", data) },
    {
      data: "LENGTH_WEIGHT",
      render: (data) => inputArea("LENGTH_WEIGHT", data),
    },
    {
      data: "HEIGHT_WEIGHT",
      render: (data) => inputArea("HEIGHT_WEIGHT", data),
    },
    {
      data: "VOLUMN_WEIGHT",
      render: (data, e, row) => {
        return inputArea("VOLUMN_WEIGHT", data, true);
      },
    },
    {
      data: "ROUND_WEIGHT",
      render: (data, e, row) => {
        return inputArea("ROUND_WEIGHT", data, true);
      },
    },
    {
      data: "INQ_ID",
      sortable: false,
      className: "text-center action",
      render: (data) => {
        return `
            <a href="#" class="delete" data-val="${data}"><i class="icofont-bin fs-4"></i></a>
        `;
      },
    },
  ];

  opt.initComplete = function () {
    const id = $("#inqid").val();
    const foot = `
        <a href="${host}inquiry/exportexcel/${id}" class="btn btn-second me-2">Export</a>
        <a href="#" class="btn btn-second me-2" id="add-line">Add Weight</a>
        <a href="#" class="btn btn-main me-2" id="save-data">Confirm</a>
        <a class="btn btn-cancel" href="#" onclick="history.back()">Back</a>
    `;
    $(".tablefoot").append(foot);
  };

  opt.createdRow = function (row, data) {
    $(row).find(".editable").inputmask("decimal", { rightAlign: true });
  };

  opt.footerCallback = function () {
    const api = this.api();
    const data = api.rows().data();
    let total = 0,
      netweight = 0,
      grossweight = 0,
      width = 0,
      length = 0,
      height = 0,
      cube = 0,
      ceil = 0;
    data.map((el) => {
      const w = intVal(el.WIDTH_WEIGHT);
      const l = intVal(el.LENGTH_WEIGHT);
      const h = intVal(el.HEIGHT_WEIGHT);
      const val = (w * l * h) / 1000000;
      const ceilVal = Math.ceil(val);

      total += intVal(el.NO_WEIGHT);
      netweight += intVal(el.NET_WEIGHT);
      grossweight += intVal(el.GROSS_WEIGHT);
      width += w;
      length += l;
      height += h;
      cube += val;
      ceil += ceilVal;
    });
    api.column(2).footer().innerHTML = digits(total, 0);
    api.column(3).footer().innerHTML = digits(netweight, 0);
    api.column(4).footer().innerHTML = digits(grossweight, 0);
    api.column(5).footer().innerHTML = digits(width, 0);
    api.column(6).footer().innerHTML = digits(length, 0);
    api.column(7).footer().innerHTML = digits(height, 0);
    api.column(8).footer().innerHTML = digits(cube, 4);
    api.column(9).footer().innerHTML = digits(ceil, 0);
  };
  return $(tableid).DataTable(opt);
}

function volumn(el) {
  const w = intVal(el.WIDTH_WEIGHT);
  const l = intVal(el.LENGTH_WEIGHT);
  const h = intVal(el.HEIGHT_WEIGHT);
  const val = (w * l * h) / 1000000;
  el.VOLUMN_WEIGHT = digits(val, 4);
  el.ROUND_WEIGHT = Math.ceil(val);
  return el;
}
