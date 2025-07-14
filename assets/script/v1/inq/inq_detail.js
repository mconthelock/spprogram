function createTableDetail(dt) {
  const tableid = "#inqdetail";
  const opt = { ...tableOption };
  opt.dom =
    '<lf<"fixed-table edit-table"t><"tablefoot d-inline-flex pt-1 mt-3"i>p>';
  opt.searching = false;
  opt.paging = false;
  opt.orderFixed = [0, "asc"];
  opt.columnDefs = [
    {
      visible: false,
      searchable: false,
      orderable: false,
      targets: 0,
    },
  ];
  opt.data = dt;
  const inputHidden = (cols, name, data) => {
    return `<input type="hidden" data-map="${cols}" class="${name}" name="${name}[]" value="${data}"/>`;
  };

  const inputCheck = (name, data) => {
    return `<input type="checkbox" class="form-check-input inputCheck ${name}" name="${name}[]" ${
      data != "" && data != null ? "checked" : ""
    } value="1"/>`;
  };

  const inputArea = (cols, name, data, req = false, w = "") => {
    return `<textarea data-map="${cols}" class="txt-edit ${name} ${
      req ? "required" : ""
    }" name="${name}[]" rows="1" style="width:${
      w == "" ? "100%" : w + "px"
    }; height: 55px;">${data == null ? "" : data}</textarea>`;
  };

  const inputSelect = (cols, name, data) => {
    return `<select class="txt-edit ${name}" name="${name}[]" data-map="${cols}" style="width:80px">
        <option value=""></option>
        <option ${data == "AMEC" ? "selected" : ""}>AMEC</option>
        <option ${data == "MELINA" ? "selected" : ""}>MELINA</option>
        <option ${data == "LOCAL" ? "selected" : ""}>LOCAL</option>
    </select>`;
  };

  const colWidth = [50, 55, 40, 100];
  opt.columns = [
    {
      data: "INQD_SEQ",
      render: (data) => {
        return intVal(data);
      },
    },
    {
      data: "INQD_ID",
      className: "action td-fixed",
      render: (data, e, row) => {
        return `<div class="">
            <a href="#" class="back add-sub-line"><i class="icofont-ui-add fs-6"></i></a>
            <a href="#" class="delete delete-row ${
              row.INQD_OWNER_GROUP != $(logingroup).val() ? "disabled" : ""
            }">
                <i class="icofont-close fs-5"></i>
            </a>
        </div>`;
      },
    },
    {
      data: "INQD_SEQ",
      className: "td-fixed",
      render: (data) => inputArea("INQD_SEQ", "seqno", data, true, colWidth[1]),
    },
    {
      data: "INQD_CAR",
      className: "td-fixed",
      render: (data) => {
        if (!isNaN(parseInt(data))) {
          data = ("00" + data).substr(-2);
        }
        return inputArea("INQD_CAR", "carno", data, true, colWidth[2]);
      },
    },
    {
      data: "INQD_MFGORDER",
      className: "td-fixed",
      render: (data) =>
        inputArea("INQD_MFGORDER", "mfgno", data, true, colWidth[3]),
    },
    {
      data: "INQD_ITEM",
      className: "td-fixed",
      render: (data) => inputArea("INQD_ITEM", "item", data, true, 50),
    },
    {
      data: "INQD_PARTNAME",
      render: (data) => inputArea("INQD_PARTNAME", "partname", data, true, 175),
    },
    {
      data: "INQD_DRAWING",
      render: (data) => {
        const req = $(logingroup).val() == "MAR" ? false : true;
        return inputArea("INQD_DRAWING", "drawing", data, req, 200);
      },
    },
    {
      data: "INQD_VARIABLE",
      render: (data) =>
        inputArea("INQD_VARIABLE", "variable", data, false, 200),
    },
    {
      data: "INQD_QTY",
      render: (data) => inputArea("INQD_QTY", "qty", data, true, 40),
    },
    {
      data: "INQD_UM",
      render: (data) => inputArea("INQD_UM", "unit", data, true, 50),
    },
    {
      data: "INQD_SUPPLIER",
      render: (data) => inputSelect("INQD_SUPPLIER", "supply", data),
    },
    {
      data: "INQD_SENDPART",
      className: "text-center col-check-box",
      render: (data) => {
        let str = inputCheck("second", data);
        str += inputHidden("INQD_SENDPART", "second_data", data);
        return str;
      },
    },
    {
      data: "INQD_UNREPLY",
      className: "text-center col-check-box",
      render: (data) => {
        let str = inputCheck("unreply", data);
        str += inputHidden("INQD_UNREPLY", "unreply_data", data);
        return str;
      },
    },
    {
      renark: "INQD_REMARK",
      className: "remark",
      render: (data, e, row) => {
        let name = "";
        let val = "";
        if ($(logingroup).val() != "MAR") {
          val = row.INQD_DES_REMARK;
          name = "descomment";
        } else {
          val = row.INQD_MAR_REMARK;
          name = "marcomment";
        }
        return inputArea("INQD_REMARK", name, val, false, 200);
      },
    },
    {
      data: "INQD_MAR_REMARK",
      className: `${$(logingroup).val() == "MAR" ? "d-none" : ""} mar-remark`,
      render: (data) => {
        return `<div style="width: 200px; padding: 8px;">${
          data == null ? "" : data
        }</div>`;
      },
    },
    {
      data: "INQD_DES_REMARK",
      className: `des-remark ${
        $(logingroup).val() != "MAR" || $("#inqid").val() == "" ? "d-none" : ""
      }`,
      render: (data) => {
        return `<div style="width: 200px; padding: 8px;">${
          data == null ? "" : data
        }</div>`;
      },
    },
    {
      data: "TEST_FLAG",
      className: `${$(logingroup).val() == "MAR" ? "d-none" : ""}`,
      render: (data) => {
        return `<div style="width: 50px; padding: 8px; text-align: center; color: var(--text_color);">${
          data == null ? "" : data
        }</div>`;
      },
    },
    {
      data: "TEST_MESSAGE",
      className: `${$(logingroup).val() == "MAR" ? "d-none" : ""}`,
      render: (data) => {
        return `<div style="width: 200px; padding: 8px;color: var(--text_color);">${
          data == null ? "" : data
        }</div>`;
      },
    },
    {
      data: "INQD_ID",
      className: "d-none",
      render: (data) => inputHidden("INQD_ID", "inqd_id", data),
    },
    {
      data: "INQD_DELETE",
      className: "d-none",
      render: (data) =>
        inputHidden(
          "INQD_DELETE",
          "inqd_delete",
          data == undefined ? "" : data
        ),
    },
    {
      data: "INQD_RUNNO",
      className: "d-none",
      render: (data) => inputHidden("INQD_RUNNO", "runno", data),
    },
  ];

  var left = 0;
  var leftArr = [];
  opt.createdRow = function (row, data) {
    //Fixed Column
    if (leftArr.length == 0) {
      leftArr.push(left);
      var head = $(tableid).find("thead tr:eq(0) th.td-fixed");
      head.map(function (i, th) {
        setTableWidth($(th), colWidth[i], left);
        //left += getTotalWidth($(th), colWidth[i]);
        left += colWidth[i] + 1;
        leftArr.push(left);
      });
    }

    $(row)
      .find("td.td-fixed")
      .map(function (i, cols) {
        setTableWidth($(cols), colWidth[i], leftArr[i]);
      });

    //Add Class Master Row/Child Row
    if (intVal(data.INQD_SEQ) % 1 == 0) $(row).addClass("master-row");
    else $(row).addClass("child-row");

    //Hide Delete row
    if (data.INQD_DELETE == "1") $(row).addClass("d-none");
    $(row).attr("rowid", data.INQD_RUNNO);

    if ($(logingroup).val() != "MAR") {
      const group = intVal($("#design-group").val());
      const items = Math.floor(intVal(data.INQD_ITEM) / 100);
      const item = items >= 6 ? 6 : items == 5 ? 2 : items;
      if (group != item && data.INQD_ID != "") $(row).addClass("d-none");
      if (data.TEST_MESSAGE != null || data.TEST_FLAG != null)
        $(row).addClass("bg-error");
    }
  };

  opt.initComplete = function () {
    if ($(logingroup).val() == "MAR") {
      const footer = `
                <button type="button" class="btn btn-second me-2" id="addline"><i class="icofont-plus"></i></button>
                <button type="button" class="btn btn-second me-2" id="import"><i class="icofont-upload-alt"></i></button>
                <button type="button" class="btn btn-second me-2" id="download-template"><i class="icofont-download"></i></button>
                <input type="file" id="importfile" class="d-none" accept=".csv, text/plain, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
            `;
      $(".tablefoot").html(footer);
    }

    const api = this.api();
    let x = 1;
    /*api.cells(null, 0, { order: "applied" }).every(function () {
      this.data(x++);
    });
    api.draw();*/
  };

  return $(tableid).DataTable(opt);
}
