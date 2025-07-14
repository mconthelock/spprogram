async function checkReqired(id) {
  let result = true;
  let message = "";
  $(id)
    .find(".required")
    .each(function () {
      const row = $(this).closest("tr");
      if (row.hasClass("d-none")) return;
      if (
        this.value === "" ||
        this.value === null ||
        this.value === undefined
      ) {
        $(this).addClass("invalid");
        message = "Please fill in required fields";
        setTimeout(() => {
          $(this).removeClass("invalid");
        }, 5000);
        result = false;
      }
    });
  if (result === false) {
    await showErrorNotify(message);
    await hideLoading();
    return false;
  }

  return true;
}

async function checkTabledetail(table) {
  if (table.rows(":not(.d-none)").count() == 0) {
    await showErrorNotify("Data detail not found");
    await hideLoading();
    return false;
  }
  return true;
}

async function checkPrice() {
  const q = {
    trader: $("#trader").val(),
    quotation: $("#quotation").val(),
    status: 1,
  };
  const ratio = await getPriceRatio(q);
  if (ratio.length == 0) {
    message = "";
    $("#trader").addClass("invalid");
    $("#quotation").addClass("invalid");
    setTimeout(() => {
      $("#trader").removeClass("invalid");
      $("#quotation").removeClass("invalid");
    }, 5000);
    await showErrorNotify("Price Ratio not found");
    await hideLoading();
    return false;
  }
  return true;
}

async function checkDrawingFormat() {
  const error = [];
  const errdwg = () => {
    tabledetail.rows().every(async function () {
      const data = this.data();
      const node = this.node();
      if ($(node).hasClass("d-none")) return;
      const isReq = $(node).find(".drawing").hasClass("required");
      if (intVal(data.INQD_UNREPLY) > 0) {
        return true;
      }
      if (data.INQD_DRAWING == "" && isReq) {
        $(node).find(".drawing").addClass("invalid");
        setTimeout(() => {
          $(node).find(".drawing").removeClass("invalid");
        }, 10000);
        //await showErrorNotify(`Drawing required for ${data.INQD_PARTNO}`);
        return error.push(`Drawing required for ${data.INQD_PARTNAME}`);
      }
      const dwgcheck = await checkDrawing(data.INQD_DRAWING);
      if (dwgcheck.status === false) {
        $(node).find(".drawing").addClass("invalid");
        setTimeout(() => {
          $(node).find(".drawing").removeClass("invalid");
        }, 10000);
        //await showErrorNotify(dwgcheck.msg);
        return error.push(dwgcheck.msg);
      }
    });
  };

  // Result
  await errdwg();
  if (error.length > 0) {
    await showErrorNotify(error[0]);
    return false;
  }
  return true;
}

async function checkVariableFormat() {
  let result = true;
  let message = "";
  let error = [];
  const errvar = await Promise.all(
    $(".variable").map(async (i, item) => {
      const row = $(item).closest("tr");
      if (row.hasClass("d-none")) return;
      const varcheck = await checkVariable($(item).val());
      if (varcheck.status === false) {
        $(item).addClass("invalid");
        setTimeout(() => {
          $(item).removeClass("invalid");
        }, 5000);
      }
      return varcheck.status === false ? error.push(varcheck.value) : null;
    })
  );
  if (error.length > 0) {
    await showErrorNotify("Variable format is not valid");
    await hideLoading();
    return false;
  }
  return true;
}
