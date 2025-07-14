var reson, elmes;
if ($("#elmes-model").length > 0) {
  reson = new bootstrap.Modal($("#reason-model"), {
    keyboard: false,
    backdrop: "static",
  });
}
if ($("#elmes-model").length > 0) {
  elmes = new bootstrap.Modal($("#elmes-model"), {
    keyboard: false,
    backdrop: "static",
  });
}

$(document).on("click", "#addline:not(.disabled)", function () {
  const lastRow = tabledetail.row(":not(.d-none):last").data();
  let id = lastRow === undefined ? 1 : lastRow.INQD_RUNNO + 1;
  let seq = lastRow === undefined ? 1 : parseInt(lastRow.INQD_SEQ) + 1;
  tabledetail.row
    .add({
      INQD_RUNNO: id,
      INQD_SEQ: seq,
      INQD_CAR: "",
      INQD_MFGORDER: "",
      INQD_ITEM: "",
      INQD_PARTNAME: "",
      INQD_DRAWING: "",
      INQD_VARIABLE: "",
      INQD_QTY: "1",
      INQD_UM: "PC",
      INQD_SUPPLIER: "",
      INQD_SENDPART: "",
      INQD_UNREPLY: "",
      INQD_MAR_REMARK: "",
      INQD_ID: "",
      INQD_OWNER_GROUP: $("#logingroup").val(),
      TEST_MESSAGE: null,
      TEST_FLAG: null,
    })
    .draw();

  const last = tabledetail.row(":last").node();
  $(last).find(".carno").focus();
});

$(document).on("click", ".add-sub-line", async function (e) {
  e.preventDefault();
  // Find index value of row to insert after
  const createNewRow = (data, seq) => {
    const taval = {
      INQD_RUNNO: intVal(data.INQD_RUNNO) + 1,
      INQD_SEQ: seq,
      INQD_CAR: data.INQD_CAR,
      INQD_MFGORDER: data.INQD_MFGORDER,
      INQD_ITEM: "",
      INQD_PARTNAME: "",
      INQD_DRAWING: "",
      INQD_VARIABLE: "",
      INQD_QTY: "1",
      INQD_UM: "PC",
      INQD_SUPPLIER: "",
      INQD_SENDPART: "",
      INQD_UNREPLY: "",
      INQD_MAR_REMARK: "",
      INQD_ID: "",
      INQD_OWNER_GROUP: $("#logingroup").val(),
      TEST_MESSAGE: null,
      TEST_FLAG: null,
    };
    const newrow = tabledetail.row.add(taval).draw();
    const node = newrow.node();
    $(node).find(".item").focus();
    return seq;
  };

  const increaseIndex = (inx) => {
    tabledetail.rows().every(function (rw) {
      const data = this.data();
      const node = this.node();
      if (intVal(data.INQD_SEQ) >= inx) {
        this.data({ ...data, INQD_RUNNO: intVal(data.INQD_RUNNO) + 1 }).draw();
        $(node).attr("rowid", intVal(data.INQD_RUNNO) + 1);
        if ($(node).hasClass("child-row")) {
          const int = Math.floor(intVal(data.INQD_SEQ));
          if (int == Math.floor(intVal(inx))) {
            this.data({
              ...data,
              INQD_SEQ: digits(intVal(data.INQD_SEQ) + 0.01, 2),
            }).draw();
          }
        }
      }
    });
  };

  const row = tabledetail.row($(this).parents("tr"));
  const data = row.data();
  const seq = digits(intVal(data.INQD_SEQ) + 0.01, 2);
  await increaseIndex(seq);
  await createNewRow(data, seq);
});

//Change any value in DataTable
$(document).on("change", ".txt-edit", async function (e) {
  e.preventDefault();
  let map = $(this).attr("data-map");
  if (map == "INQD_REMARK")
    map = $(logingroup).val() != "MAR" ? "INQD_DES_REMARK" : "INQD_MAR_REMARK";
  let value = $(this)
    .val()
    .replace(/(?:\r\n|\r|\n)/g, " ");

  const name = $(this).attr("name");
  if (name == "drawing[]") value = value.toUpperCase();
  if (name == "variable[]") value = value.toUpperCase();

  const row = tabledetail.row($(this).parents("tr"));
  const data = row.data();
  row.data({
    ...data,
    [map]: value,
  });

  //Check Specific Column
  if (name == "carno[]") await changeCar(row);
  if (name == "item[]") await changeItem(row);
  if (name == "drawing[]") await changeDrawing(row);
  if (name == "variable[]") await changeVariable(row);
});

async function changeCar(row) {
  const data = row.data();
  const carno = data.INQD_CAR;
  const order = projectList.find((val) => val.car == carno);
  if (order != undefined) {
    row.data({
      ...data,
      INQD_MFGORDER: order.mfg,
    });
    tabledetail.draw();
    $(row.node()).find(".item").focus();
    return true;
  }
  $(row.node()).find(".mfgno").focus();
}

async function changeItem(row) {
  const data = row.data();
  const item = data.INQD_ITEM;
  const ordno = data.INQD_MFGORDER;
  const carno = data.INQD_CAR;
  //tabledetail.draw();
  if (intVal(item) < 99 || intVal(item) > 999 || isNaN(intVal(item))) {
    row.data({
      ...data,
      INQD_ITEM: "",
    });
    await showErrorNotify(`Item value must be 3 digit of number`);
    const node = row.node();
    $(node).find(".item").addClass("invalid");
    $(node).find(".item").focus();
    return false;
  }

  if ($(logingroup).val() == "MAR") {
    const reconseries = ["GPQ3", "GPW4", "GPS4", "GPQ4", "GPS5"];
    const reconitem = ["203", "214", "231"];
    const isreconseries = reconseries.indexOf(
      $("#series").val().substring(0, 4)
    );
    const isreconitem = reconitem.indexOf(item);
    if (isreconseries >= 0 && isreconitem >= 0) {
      await swalConfirm
        .fire({
          title: "Recon Part?",
          text: 'Is it a complete set? If "Yes" please handle as Recon',
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "OK",
          cancelButtonText: "No",
        })
        .then(async (res) => {
          await showLoading();
          if (res.isConfirmed) {
            window.open(`http://webapp/rpprogram/`);
            window.location.href = `${host}mar/inquiry/add/`;
          } else {
            await hideLoading();
          }
        });
    }
  }

  row.data({
    ...data,
    INQD_ITEM: intVal(item),
  });
  if (item != "" && ordno != "" && carno != "") {
    const elmesdata = await getElmes(ordno, carno, item);
    if (elmesdata.length > 0) {
      const index = row.index();
      $("#return_elmes").val(index);
      tableElmes = await elmesTable(elmesdata);
      elmes.show();
      return true;
    }
  }
  $(row.node()).find(".partname").focus();
}

async function changeDrawing(row) {
  const node = row.node();
  if ($(node).find(".drawing").val() == "") return false;

  const data = row.data();
  const dwg = data.INQD_DRAWING;
  if (dwg != "") {
    const chk = await checkDrawing(dwg);
    if (chk.status === false) {
      await showErrorNotify(chk.msg);
      $(node).find(".drawing").addClass("invalid");
    } else {
      let txt = chk.value[0];
      txt += chk.value[1] == undefined ? "" : " " + chk.value[1];
      row.data({ ...data, INQD_DRAWING: txt });
    }
  }
}

async function changeVariable(row) {
  const node = row.node();
  if ($(node).find(".variable").val() == "") return false;
}

async function deleteLine(dt) {
  const row = tabledetail.row(dt);
  const data = row.data();
  const seq = intVal(data.INQD_SEQ);
  const isMaster = seq % 1 == 0 ? true : false;
  if (!isMaster) {
    if (data.INQD_ID == "") row.remove().draw();
    else {
      row.data({ ...data, INQD_DELETE: "1" }).draw();
      $(row.node()).addClass("d-none");
    }
    return true;
  } else {
    tabledetail.rows().every(function (rw) {
      const no = intVal(this.data().INQD_SEQ);
      if (seq == Math.floor(no)) {
        if (this.data().INQD_ID == "") {
          this.remove().draw();
        } else {
          this.data({ ...this.data(), INQD_DELETE: "1" }).draw();
          $(this.node()).addClass("d-none");
        }
      }
    });
  }
}

// ลบ Row ออกจาก DataTable เนื่องจากไม่มีข้อมูลใน Database
$(document).on("click", ".delete-row", async function (e) {
  e.preventDefault();
  if ($(this).hasClass("disabled")) return false;
  const selectedRow = $(this).closest("tr");
  await deleteLine(selectedRow);
  //await alignRunno();
});

$(document).on("click", ".second", async function () {
  const value = $(this).prop("checked") === true ? 1 : "";
  $(this).closest("tr").find(".second_data").val(value);
  const row = tabledetail.row($(this).parents("tr"));
  const data = row.data();
  row.data({
    ...data,
    INQD_SENDPART: value,
  });
  tabledetail.draw();
});

$(document).on("change", ".unreply", async function (e) {
  e.preventDefault();
  let row = tabledetail.row($(this).parents("tr"));
  let data = row.data();
  let unreply = "";
  let remark = "";
  if ($(this).prop("checked") === false) {
    const targetname =
      $(logingroup).val() != "MAR" ? "INQD_DES_REMARK" : "INQD_MAR_REMARK";
    row.data({
      ...data,
      INQD_UNREPLY: unreply,
      [targetname]: remark,
    });
    tabledetail.draw();
  } else {
    const index = row.index();
    $("#return_result").val(index);
    reson.show();
  }
});

$(document).on("click", "#unreply-submit", async function (e) {
  e.preventDefault();
  const opt = $(".unable2reply:checked");
  const row = opt.closest(".form-check");
  var reason = row.find(".unable2reason").val();
  if (reason == "Other") {
    const txt = $("#reason-txt").val();
    if (txt == "") {
      await showErrorNotify(`Please specify what's reason for unable to reply`);
      return false;
    }
    reason += " (" + txt + ")";
  }
  const rowid = $("#return_result").val();
  const targetrow = tabledetail.row(rowid);
  const data = targetrow.data();
  const node = targetrow.node();

  const targetname =
    $(logingroup).val() != "MAR" ? "INQD_DES_REMARK" : "INQD_MAR_REMARK";
  targetrow.data({
    ...data,
    INQD_UNREPLY: opt.val(),
    [targetname]: reason,
  });
  tabledetail.draw();
  $(node).find(".drawing").removeClass("required");
  reson.hide();
});

$(document).on("click", "#unreply-cancel", function (e) {
  e.preventDefault();
  const rowid = $("#return_result").val();
  $("#inqdetail tbody")
    .find("tr:eq(" + rowid + ")")
    .find(".unreply")
    .prop("checked", false);
  reson.hide();
});

$(document).on("change", ".supply", function (e) {
  e.preventDefault();
  const index = tabledetail.row($(this).parents("tr")).index();
  const selected = $(this).val();
  const len = tabledetail.rows().count();
  var blank = false;
  for (let i = 0; i < len; i++) {
    const supply = $("#inqdetail tbody")
      .find("tr:eq(" + i + ")")
      .find(".supply")
      .val();
    if (supply == "" && i != index) blank = true;
  }

  if (blank === true) {
    swalConfirm
      .fire({
        title: "Apply for all?",
        text: "Would you like to apply this value to all line",
        icon: "warning",
        showCancelButton: true,
        buttons: ["No, thanks", "Of caurse!"],
        dangerMode: false,
      })
      .then((willDelete) => {
        if (willDelete.isConfirmed) {
          for (let i = 0; i < len; i++) {
            const row = $("#inqdetail tbody")
              .find("tr:eq(" + i + ")")
              .find(".supply");
            if (row.val() == "" && i != index) {
              row.val(selected);
            }
          }
        }
      });
  }
});
