$(document).on("click", "#import", async function () {
  await showLoading();
  $("#importfile").click();
});

$(document).on("change", "#importfile", async function () {
  const file = $(this).prop("files")[0];
  const ext = file.name.split(".").pop().toLowerCase();
  if (ext != "txt") {
    await readSheeetFile(file);
  } else {
    await readTxtFile(file);
  }
  //await hideLoading();
});

$(document).on("cancel", "#importfile", async function () {
  await hideLoading();
});

async function readTxtFile(file) {
  const data = [];
  const reader = new FileReader();
  reader.onload = async function (e) {
    const contents = e.target.result;
    const lines = contents.split("\n");
    if (lines.length > 0) {
      const head = lines[0].split("\t");
      const orderno = head[7].replaceAll("-", "");

      //Check Inquiry No.
      const inquiry = await getInquiry(head[0]);
      if (inquiry.length > 0) {
        await showErrorNotify("Duppliccate Inquiry");
        return false;
      }

      $("#inqno").val(head[0]);
      const prjno = await getProject({ ordno: orderno });
      if (prjno.length > 0) {
        $("#prjno").val(prjno[0].prj_no);
        await handleProjectChange(prjno[0]);
      }

      await handleInquiryChange();
      lines.forEach(function (line) {
        const row = line.split("\t");
        if (row.length == 10) {
          const rowdata = {
            INQD_RUNNO: row[1] || "",
            INQD_SEQ: row[1] || "",
            INQD_CAR: row[8] || "",
            INQD_MFGORDER: (row[7] || "").replaceAll("-", ""),
            INQD_ITEM: row[9].substring(0, 3) || "",
            INQD_PARTNAME: row[3] || "",
            INQD_DRAWING: row[2] || "",
            INQD_VARIABLE: row[6] || "",
            INQD_QTY: row[4] || "",
            INQD_UM: row[5] || "",
            INQD_SUPPLIER: "",
            INQD_SENDPART: "",
            INQD_UNREPLY: "",
            INQD_MAR_REMARK: "",
            INQD_ID: "",
            INQD_OWNER_GROUP: $("#logingroup").val(),
          };
          const newrow = tabledetail.row.add(rowdata).draw();
          const index = newrow.index();
          tabledetail
            .cell(index, 0)
            .data(index + 1)
            .draw();
        }
      });
    }
    await hideLoading();
  };
  await reader.readAsText(file);
  return data;
}

async function readSheeetFile(file) {
  await readXlsxFile(file).then(async function (rows) {
    const head = rows[1];
    const orderno = head[7].replaceAll("-", "");
    const prjno = await getProject({ ordno: orderno });
    if (prjno.length > 0) {
      $("#prjno").val(prjno[0].prj_no);
      await handleProjectChange(prjno[0]);
    }

    $("#inqno").val(head[0]);
    const inquiry = await getInquiry(head[0]);
    if (inquiry.length > 0) {
      await showErrorNotify("Duppliccate Inquiry");
      return false;
    }
    await handleInquiryChange();
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const rowdata = {
        INQD_RUNNO: row[1] || "",
        INQD_SEQ: row[1] || "",
        INQD_CAR: row[8] || "",
        INQD_MFGORDER: (row[7] || "").replaceAll("-", ""),
        INQD_ITEM: row[9] || "",
        INQD_PARTNAME: row[3] || "",
        INQD_DRAWING: row[2] || "",
        INQD_VARIABLE: row[6] || "",
        INQD_QTY: row[4] || "",
        INQD_UM: row[5] || "",
        INQD_SUPPLIER: "",
        INQD_SENDPART: "",
        INQD_UNREPLY: "",
        INQD_MAR_REMARK: "",
        INQD_ID: "",
        INQD_OWNER_GROUP: $("#logingroup").val(),
      };
      const newrow = tabledetail.row.add(rowdata).draw();
      const index = newrow.index();
      tabledetail
        .cell(index, 0)
        .data(index + 1)
        .draw();
    }
    await hideLoading();
  });
}
