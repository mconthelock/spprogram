$(".nav-item").removeClass("active");
$(".navmenu-newinq").addClass("active");
//$("#marpic").attr("readonly", true);
//$("#inqrev").attr("readonly", true);
//$("#inqdate").addClass("form-date");

$(".form-select-no-filter").select2({ minimumResultsForSearch: Infinity });
$(".form-select-filter").select2();
$(".form-date").each(function () {
  const opt = { ...datepickerOption };
  opt.maxViewMode = 0;
  opt.endDate = "+30d";
  opt.startDate = "-7d";
  $(this).datepicker(opt);
});

/*************************/
/* -000: Form Change   */
/************************/
$(document).on("change", "#prjno", async function () {
  const prj = await getProject({ id: $(this).val() });
  if (prj.length > 0) {
    handleProjectChange(prj[0]);
    setProjectList(prj);
  }
});

$("#inqno").on("change", async function () {
  const no = $(this)
    .val()
    .trim()
    .replace(/(\r\n|\n|\r)/g, "")
    .replaceAll(" ", "")
    .toUpperCase();
  const inquiry = await getInquiry(no);
  if (inquiry.length > 0) {
    await showErrorNotify("Duppliccate Inquiry No.");
    $(this).val("");
  } else {
    $(this).val(no);
    await handleInquiryChange();
  }
});

$("#agent").on("change", async function () {
  if ($(this).val() != null) {
    var agent = $(this).val();
    var data = agent.split("(");
    const country = data[1] || "";
    $("#country").val(country.replace(")", ""));
    await handleInquiryChange();
  }
});

/*************************/
/* - 003: Save Inquiry  */
/************************/
$(document).on("click", ".savedata", async function (e) {
  await showLoading();
  const id = $("#inqid").val();
  const revise = $("#revise").val();
  if (revise != "" && $("#marremark").val() == "") {
    await hideLoading();
    await showErrorNotify("Please specify revise reason");
    $("#marremark").addClass("invalid");
    setTimeout(() => {
      $("#marremark").removeClass("invalid");
    }, 5000);
    return false;
  }

  let chk = true;
  if ((await checkReqired("#inqform")) === false) chk = false;
  if ((await checkPrice()) === false) chk = false;
  if ((await checkTabledetail(tabledetail)) === false) chk = false;
  if ((await checkDrawingFormat()) === false) chk = false;
  if ((await checkVariableFormat()) === false) chk = false;

  if (chk === false) {
    await hideLoading();
    return false;
  }

  let url;
  if (id != "" && revise == "") url = `${host}inquiry/update`;
  else url = `${host}inquiry/create`;
  $("#action").val($(this).attr("data-value"));
  $.ajax({
    url: url,
    method: "post",
    dataType: "json",
    data: $("#inqform").serialize("textarea, select, input"),
    async: false,
    success: async function (res) {
      if (formdata.getAll("files[]").length > 0) {
        await uploadFile($("#inqno").val());
      }

      if (revise != "") {
        const newid = res.id;
        await revised(id, newid);
      }
      window.location = host + "mar/inquiry";
    },
  });
});

/*************************/
/* -005: Create Table */
/************************/
async function handleInquiryChange() {
  const prop = await getInquiryProperties();
  if (prop.length > 0) {
    const data = prop[0];
    $("#term").val(data.CNT_TERM).change();
    if ($("#trader").val() != "Direct") {
      $("#trader").val(data.CNT_TRADER).change();
      $("#quotation").val(data.CNT_QUOTATION).change();
    } else {
      $("#quotation").val(4).change();
    }

    if (data.CNT_WEIGHT == 1) {
      $("#pkcreq1").prop("checked", true);
    } else {
      $("#pkcreq0").prop("checked", true);
    }
  }
}

async function handleProjectChange(data) {
  $("#prjname").val(data.prj_name);
  $("#series").val(data.series).change();
  $("#shoporder").val(data.order_no);
  $("#operation").val(data.operation);
  $("#spec").val(data.spec);
  $("#prdsch").val(data.amec_schdl);
  var agent = data.agent + " (" + data.dstn + ")";
  $("#agent").val(agent).change();
  $("#country").val(data.dstn);
  $("#inqno").focus();
}

function setProjectList(project) {
  projectList = []; // Reset data
  project.map((val) => {
    projectList.push({ car: val.car_no.trim(), mfg: val.mfgno });
  });
}

$(document).on("click", "#download-template", async function (e) {
  e.preventDefault();
  console.log("Click download template");
  await showLoading();
  await getTemplate();
  await hideLoading();
});

function getTemplate() {
  return new Promise((resolve) => {
    $.ajax({
      url: host + "inquiry/dowload_template/",
      type: "post",
      async: true,
      dataType: "json",
      success: function (res) {
        console.log("Click download template");
        var fileName = res.filename + ".xlsx";
        var fileType =
          "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,";
        var $a = $("<a>");
        $a.attr("href", fileType + res.dExcel);
        $("body").append($a);
        $a.attr("download", fileName);
        $a[0].click();
        $a.remove();
        resolve(res);
      },
    });
  });
}
