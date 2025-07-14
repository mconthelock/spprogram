$(".form-select-no-filter").select2({ minimumResultsForSearch: Infinity });
$(".form-select-filter").select2();
$(".form-date").each(function () {
  const opt = { ...datepickerOption };
  opt.maxViewMode = 0;
  opt.endDate = "+30d";
  opt.startDate = "-7d";
  $(this).datepicker(opt);
});

const cstatus = $("#design_action").val();
if (cstatus != 2) {
  $("#desclass").attr("disabled", true);
  $("#designer").attr("disabled", true);
  $("#checker").attr("disabled", true);
}

$(document).on("click", ".return", async function (e) {
  e.preventDefault();
  if ($("#desremark").val() == "") {
    await showErrorNotify("Please provide some recommendations");
    $("#desremark").addClass("invalid");
    setTimeout(() => {
      $("#desremark").removeClass("invalid");
    }, 5000);
    return false;
  }

  $("#design_action").val(10);
  $("#desclass").attr("disabled", false);
  $("#designer").attr("disabled", false);
  $("#checker").attr("disabled", false);
  const res = await reviseGroup();
  window.location = `${host}des/inquiries/check/`;
});

$(document).on("click", ".savedata:not(disabled)", async function (e) {
  e.preventDefault();
  $(".savedata").attr("disabled", true);
  var action = $("#design_action").val();
  const justsave = $(this).attr("data-value");
  if (justsave == 1) {
    const res = await declarepart(`${host}des/inquiries/declarepart`, 1);
    window.location.reload();
    return true;
  }

  if ($("#revise").val() == "1") {
    if ($("#desremark").val() == "") {
      await showErrorNotify("Please provide some recommendations");
      $("#desremark").addClass("invalid");
      setTimeout(() => {
        $("#desremark").removeClass("invalid");
      }, 5000);
      $(this).attr("disabled", false);
      return false;
    }
  }

  if (action == 2 && !(await checkUsers())) return false;
  if (justsave != 1) {
    const complete = await completed(action);
    if (complete.next === false) {
      $(this).attr("disabled", false);
      return false;
    }
    //By Pass design and check
    if (complete.data == 1) {
      if (complete.step == "designer") action = 7;
      if (complete.step == "checker") action = 9;
      $("#bypass").val(1);
    } else {
      $("#bypass").val(0);
    }
  }

  let chkvalue = true;
  if (action > 2) {
    //If Declare step and Checking Step must complete data
    if ((await checkReqired("#inqform")) === false) chkvalue = false;
    if ((await checkTabledetail(tabledetail)) === false) chkvalue = false;
    if ((await checkDrawingFormat()) === false) chkvalue = false;
    if ((await checkVariableFormat()) === false) chkvalue = false;

    if (chkvalue === false) {
      $(this).attr("disabled", false);
      return false;
    }
  }

  if (action == 2) {
    $("#desdate").attr("disabled", true);
    $("#chkdate").attr("disabled", true);
  }

  if (action == 4) {
    $("#chkdate").attr("disabled", true);
  }
  let url = ``;
  if (justsave == 1) {
    url = `${host}des/inquiries/declarepart`;
  } else if ($("#revise").val() == "1") {
    url = `${host}des/inquiries/revisepart`;
  } else {
    url = `${host}des/inquiries/declarepart`;
  }

  //console.log(url, action);
  const res = await declarepart(url, justsave);
  if (res.status == 0)
    window.location = `${host}des/inquiries/edit/${res.id}/4`;
  if (res.status == 2) window.location = `${host}des/inquiries/assign/`;
  if (res.status == 4) window.location = `${host}des/inquiries/design/`;
  if (res.status == 7) window.location = `${host}des/inquiries/check/`;
});

async function checkUsers() {
  let pass = true;
  $(".wrap-form-design")
    .find(".required")
    .map((i, el) => {
      if ($(el).val() == "") {
        $(el).addClass("invalid");
        message = "Please fill in required fields";
        setTimeout(() => {
          $(el).removeClass("invalid");
        }, 5000);
        pass = false;
      }
    });
  if (pass === false) {
    await showErrorNotify(message);
    $(".savedata").attr("disabled", false);
  }
  return pass;
}

async function completed(action) {
  console.log(action);
  $("#designer").attr("disabled", false);
  $("#checker").attr("disabled", false);

  const user = $("#loginuserid").val();
  const despic = $("#designer").val();
  const chkpic = $("#checker").val();
  let res;
  let posible = false;
  let step = "";
  if (action == 2 && user == despic) {
    posible = true;
    step = "designer";
    if (user == chkpic) {
      posible = true;
      step = "checker";
    }
  }
  if (action == 4 && user == chkpic) {
    posible = true;
    step = "checker";
  }

  if (posible) {
    await swalConfirm
      .fire({
        title: "Automatic completely",
        text: "You have setted PIC to be yours, Would you like to all completed it?",
        icon: "info",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Of caurse!",
        denyButtonText: "No, Thanks",
        cancelButtonText: "Cancel",
        dangerMode: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          res = { next: true, data: 1, step: step };
        } else if (result.isDenied) {
          res = { next: true, data: 0 };
        } else {
          res = { next: false };
        }
      });
  } else {
    res = { next: true, data: 0 };
  }

  if (action != 2) {
    $("#designer").attr("disabled", true);
    $("#designer").attr("disabled", true);
  }
  return res;
}

async function savedata(url, save) {
  return new Promise((resolve) => {
    $.ajax({
      url: url,
      method: "post",
      dataType: "json",
      data: $("#inqform").serialize("textarea, select, input"),
      success: async function (res) {
        if (formdata.getAll("files[]").length > 0) {
          await uploadFile($("#inqno").val());
        }
        const id = $("#inqid").val();
        const status = $("#design_action").val();
        if (save == "1") {
          await updateGroupStatus();
          resolve({ id: id, status: 0 });
          //window.location = `${host}des/inquiry/edit/${id}/4`;
          //return;
        }
        resolve({ id, status });
      },
    });
  });
}

async function declarepart(url, save) {
  return new Promise((resolve) => {
    $.ajax({
      url: url,
      method: "post",
      dataType: "json",
      data: $("#inqform").serialize("textarea, select, input"),
      success: async function (res) {
        if (formdata.getAll("files[]").length > 0) {
          await uploadFile($("#inqno").val());
        }
        const id = $("#inqid").val();
        const status = $("#design_action").val();
        if (save == "1") {
          await updateGroupStatus();
          resolve({ id: id, status: 0 });
          //window.location = `${host}des/inquiry/edit/${id}/4`;
          //return;
        }
        resolve({ id, status });
      },
    });
  });
}

async function reviseGroup() {
  return new Promise((resolve) => {
    $.ajax({
      url: `${host}des/inquiries/revisepart`,
      method: "post",
      dataType: "json",
      data: $("#inqform").serialize("textarea, select, input"),
      async: false,
      success: async function (res) {
        if (formdata.getAll("files[]").length > 0) {
          await uploadFile($("#inqno").val());
        }
        resolve({ res: res });
        //window.location = `${host}des/inquiry/edit/${id}/4`;
      },
    });
  });
}

async function updateGroupStatus() {
  return new Promise((resolve) => {
    $.ajax({
      url: `${host}inquiry/updateGroupStatus`,
      type: "post",
      data: {
        id: $("#inqid").val(),
        status: 4,
      },
      async: false,
      success: function (res) {
        resolve(res);
      },
    });
  });
}

function uploadFile(id) {
  return new Promise((resolve) => {
    $.ajax({
      url: `${host}inquiry/insertAttachment/${id}`,
      method: "post",
      dataType: "json",
      data: formdata,
      async: false,
      processData: false,
      contentType: false,
      success: function (res) {
        resolve(res);
      },
    });
  });
}
