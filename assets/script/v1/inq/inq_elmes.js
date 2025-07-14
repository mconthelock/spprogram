$(document).on("click", ".select-all", function (e) {
  e.preventDefault();
  tableElmes.rows().select();
});

$(document).on("click", ".unselect-all", function (e) {
  e.preventDefault();
  tableElmes.rows().deselect();
});

$(document).on("click", ".add-elmes-item", async function (e) {
  e.preventDefault();

  const increaseSubline = (seq, inc) => {
    tabledetail.rows().every(function () {
      const data = this.data();
      const node = this.node();
      if (intVal(data.INQD_SEQ) > seq) {
        this.data({
          ...data,
          INQD_RUNNO: intVal(data.INQD_RUNNO) + inc,
        }).draw();
        $(node).attr("rowid", intVal(data.INQD_RUNNO) + inc);
        if ($(node).hasClass("child-row")) {
          const int = Math.floor(intVal(data.INQD_SEQ));
          if (int == Math.floor(intVal(seq))) {
            this.data({
              ...data,
              INQD_SEQ: digits(intVal(data.INQD_SEQ) + 0.01 * inc, 2),
            }).draw();
          }
        }
      }
    });
  };

  const increaseLine = (seq, inc) => {
    tabledetail.rows().every(function () {
      const data = this.data();
      const node = this.node();
      const digit = (intVal(data.INQD_SEQ) + inc) % 1 == 0 ? 0 : 1;
      if (intVal(data.INQD_SEQ) > seq) {
        this.data({
          ...data,
          INQD_RUNNO: intVal(data.INQD_RUNNO) + inc,
          INQD_SEQ:
            digit == 0
              ? intVal(data.INQD_SEQ) + inc
              : digits(intVal(data.INQD_SEQ) + inc, 2),
        }).draw();
        $(node).attr("rowid", intVal(data.INQD_RUNNO) + inc);
      }
    });
  };

  const addRow = (data, seq, no, id) => {
    const digit = intVal(seq) % 1 == 0 ? 0 : 1;
    const taval = {
      INQD_RUNNO: no,
      INQD_SEQ: digit == 0 ? parseInt(seq) : seq,
      INQD_CAR: data.carno,
      INQD_MFGORDER: data.orderno,
      INQD_ITEM: data.itemno,
      INQD_PARTNAME: data.partname,
      INQD_DRAWING: data.drawing,
      INQD_VARIABLE: data.variable,
      INQD_QTY: "1",
      INQD_UM: "PC",
      INQD_SUPPLIER: data.supply == null ? "AMEC" : data.supply,
      INQD_SENDPART: data.scndpart == "0" || data.scndpart == "O" ? 1 : "",
      INQD_UNREPLY: "",
      INQD_MAR_REMARK: "",
      INQD_ID: id,
      INQD_OWNER_GROUP: digit == 0 ? "MAR" : $("#logingroup").val(),
      TEST_MESSAGE: null,
      TEST_FLAG: null,
    };
    const newrow = tabledetail.row.add(taval).draw();
    return seq;
  };

  const select = tableElmes.rows(".selected").data();
  if (select.length == 0) {
    showErrorNotify("Please select some record");
    return false;
  }
  const count = select.length;
  const target = $("#return_elmes").val();
  const row = tabledetail.row(target);
  const data = row.data();
  const seq = intVal(data.INQD_SEQ);
  const no = intVal(data.INQD_RUNNO);
  const id = intVal(data.INQD_ID);
  const digit = intVal(seq) % 1 == 0 ? 0 : 1;

  if (digit == 1 || $("#logingroup").val() != "MAR")
    await increaseSubline(seq, count - 1);
  else await increaseLine(seq, count - 1);
  row.remove().draw();

  var incno = 0.01;
  if ($("#logingroup").val() == "MAR" && digit == 0) {
    incno = 1;
  }
  select.map(async (el, i) => {
    const seqno = digits(seq + i * incno, 2);
    if (i == 0) await addRow(el, seqno, no + i, id);
    else addRow(el, seqno, no + i, "");
  });
  elmes.hide();
});

function elmesTable(data) {
  const tableid = "#elmes-table";
  const opt = { ...tableOption };
  if ($.fn.DataTable.isDataTable(tableid)) {
    $(tableid).dataTable().api().destroy();
    $(tableid).find("tbody").empty();
  }

  opt.dom = '<lf<"elmes-data"t><"elmes-foot d-inline-flex pt-1 mt-3"i>p>';
  opt.data = data;
  opt.pageLength = 10;
  opt.select = { style: "multi" };
  opt.columns = [
    { data: "orderno" },
    { data: "carno" },
    { data: "partname" },
    { data: "drawing" },
    { data: "variable" },
    {
      data: "qty",
      className: "text-center",
    },
    {
      data: "scndpart",
      className: "text-center",
    },
    {
      data: "supply",
      className: "text-center",
      render: function (data, type, row) {
        var val = "";
        if (data == "R") {
          val = "LOCAL";
        } else if (data == "J") {
          val = "MELINA";
        } else if (data == "U") {
          val = "";
        } else {
          val = "AMEC";
        }
        return val;
      },
    },
  ];
  opt.initComplete = () => {
    const str = `
        <a class="btn btn-second me-2 select-all" href="#">Select All</a>
        <a class="btn btn-second me-2 unselect-all" href="#">Select none</a>
        <a class="btn btn-main me-2 add-elmes-item" href="#">Add to inquiry</a>
        <a class="btn btn-delete me-2 dismiss" data-bs-dismiss="modal" href="#">Dismiss</a>
    `;
    $(".elmes-foot").append(str);
  };
  return $(tableid).DataTable(opt);
}
