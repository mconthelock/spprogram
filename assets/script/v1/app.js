/* App script */
var host = $("meta[name=base_url]").attr("content");
var uri = $("meta[name=base_uri]").attr("content");
var swLocation = host + "service-worker.js";

let isdomain = host.indexOf("mitsubishielevatorasia.co.th");
if (isdomain == -1) {
  var s = host.split("/");
  window.location = "https://" + s[2] + ".mitsubishielevatorasia.co.th/" + s[3];
}

const deviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  } else if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return "mobile";
  }
  return "desktop";
};

var alertOption = {
  allow_dismiss: true,
  placement: {
    from: "bottom",
    align: "right",
  },
  delay: 5000,
  animate: {
    enter: "animated fadeInUp",
    exit: "animated fadeOutDown",
  },
  icon_type: "class",
  template:
    '<div class="alert alert-{0}" role="alert">' +
    '<div class="alert-body">' +
    '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
    '<span class="icon" data-notify="icon"></span> ' +
    '<span class="title" data-notify="title">{1}</span> ' +
    '<div data-notify="message">{2}</div>' +
    '<div class="progress" data-notify="progressbar">' +
    '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
    "</div>" +
    '<a href="{3}" target="{4}" data-notify="url"></a>' +
    "</div>" +
    "</div>",
};

var showErrorNotify = (message) => {
  const notify = $.notify(
    {
      title: "Process Fail!!!",
      icon: "icofont-exclamation-circle",
      message: message,
    },
    alertOption
  );
  notify.update("type", "error");
};

/*************************/
/*     Sweet Alert Init  */
/*************************/
const swalConfirm = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-confirm btn-main me-3",
    denyButton: "btn btn-confirm btn-second me-3",
    cancelButton: "btn btn-confirm btn-delete me-3",
  },
  buttonsStyling: false,
});

var intVal = function (i) {
  return typeof i === "string"
    ? i.replace(/[\$,]/g, "") * 1
    : typeof i === "number"
    ? i
    : 0;
};

var digits = function (n, digit) {
  var str = "";
  n = intVal(n);
  if (digit > 0) {
    n = n.toFixed(digit);
    str = n.toString().split(".");
    var fstr = str[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "." + str[1];
  } else {
    var str = Math.round(n).toString();
    var fstr = str.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  }
  return fstr;
};

var dateFormat = function (n) {
  if (n === null) return "";
  return (str = `${n.substring(0, 4)}-${n.substring(4, 6)}-${n.substring(
    6,
    8
  )}`);
};

var date2string = function (str) {
  var val = new Date(str);
  var d = ("0" + val.getDate().toString()).substr(-2);
  var m = ("0" + (val.getMonth() + 1).toString()).substr(-2);
  var y = val.getFullYear().toString();
  return y + "-" + m + "-" + d;
};

var showLoading = async function () {
  $("#loading").removeClass("d-none");
  return true;
};

var hideLoading = async function () {
  $("#loading").addClass("d-none");
  return true;
};

$(document)
  .find("a")
  .on("click", function () {
    if ($(this).attr("target") != "_blank" && $(this).attr("href") != "#") {
      $("#loading").removeClass("d-none");
    }
  });

//Setting Dayoff
if (
  localStorage.getItem("dayoff") === null ||
  localStorage.getItem("schedule") === null
) {
  getameccalendar();
} else {
  const itemStr = localStorage.getItem("dayoff");
  const item = JSON.parse(itemStr);
  const now = new Date();
  if (
    now.getTime() > item.expiry ||
    item.version === undefined ||
    item.version < 231114
  ) {
    localStorage.removeItem("dayoff");
    localStorage.removeItem("schedule");
    console.log("version: 231114");
    getameccalendar();
  }
}

var holiday = [];
var itemStr = localStorage.getItem("dayoff");
var item = JSON.parse(itemStr);
holiday = item.value;

var schedule = [];
var scheduleStr = localStorage.getItem("schedule");
var jun = JSON.parse(scheduleStr);
schedule = jun.value;

var datepickerOption = {
  format: "yyyy-mm-dd",
  disableTouchKeyboard: true,
  autoclose: true,
  todayHighlight: true,
  todayBtn: true,
  language: "th",
  beforeShowDay: function (date) {
    var classed = "";
    var contents = "";
    var allDates =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    if (holiday.indexOf(allDates) != -1) {
      classed = "dayoff";
    }
    return {
      classes: classed,
      content: contents,
    };
  },
};

function getameccalendar() {
  var today = new Date();
  var sdate = today.getFullYear() - 1 + "-01-01";
  var edate = today.getFullYear() + 1 + "-12-31";
  var dayoff = [];
  //var schedule = [];
  let calenda = [];
  let url = "https://amecweb1.mitsubishielevatorasia.co.th/";
  url += "webservice/api/calendar/getcalendarrange";
  $.ajax({
    url: url,
    type: "post",
    dataType: "json",
    data: { sdate: sdate, edate: edate },
    async: false,
    success: function (res) {
      res.map(function (data) {
        //console.log(data);
        var schd = {
          WORKID: data.WORKID,
          MFGSCHD: data.SCHDMFG,
          MFGSCHDNUM: data.SCHDNUMBER,
          MFGSCHDP: data.PRIORITY,
          MFGFEEDER1: data.FEEDER1,
          MFGFEEDER2: data.FEEDER1,
          MFGSUBASSY: data.SUBASSY_FINISH,
          MFGASSY: data.ASSY_FINISH,
          MFGPACKING: data.PACKING,
        };
        calenda.push(schd);
        if (data.DAYOFF == 1)
          dayoff.push(
            data.WORKYEAR + "-" + data.WORKMONTH + "-" + data.WORKDAY
          );
      });

      const item_dayoff = {
        value: dayoff,
        version: 231114,
        expiry: today.getTime() + 7889400000,
      };
      const item_schedule = {
        value: calenda,
        version: 231114,
        expiry: today.getTime() + 7889400000,
      };
      localStorage.setItem("dayoff", JSON.stringify(item_dayoff));
      localStorage.setItem("schedule", JSON.stringify(item_schedule));
    },
  });
}

//Sidebar Controller
var pin = sessionStorage.getItem("pin");
if ($("#sidebarCollapse").length == 1) {
  if (pin == "false") {
    pinOff();
  } else {
    sessionStorage.setItem("pin", true);
    pinOn();
  }
}

function pinOn() {
  $("#sidebar").addClass("pin");
  $("#sidebar").removeClass("active");
  $("#content").removeClass("active");
  $("#navbar_top").removeClass("active");
  $("#sidebarCollapse").removeClass("d-none");
  $("#sidebarCollapsePin").addClass("d-none");
  sessionStorage.setItem("pin", true);
}

function pinOff() {
  $("#sidebar").removeClass("pin");
  $("#sidebar").addClass("active");
  $("#content").addClass("active");
  $("#navbar_top").addClass("active");
  $("#sidebarCollapse").addClass("d-none");
  $("#sidebarCollapsePin").addClass("d-none");
  sessionStorage.setItem("pin", false);
}

$("#sidebarCollapse").on("click", function () {
  pinOff();
});

$("#sidebarCollapsePin").on("click", function () {
  pinOn();
});

$(document).on("mouseover", "#sidebar.active", function () {
  $("#sidebar").removeClass("active");
  //$('#content').removeClass('active');
  $("#sidebarCollapsePin").removeClass("d-none");
});

//Mobile support
$(document).on("touchstart touchend", "#sidebar.active", function (e) {
  $("#sidebar").removeClass("active");
  //$('#content').removeClass('active');
  $("#sidebarCollapsePin").removeClass("d-none");
});

$(document).on("mouseleave", "#sidebar:not(.pin)", function () {
  $("#sidebar").addClass("active");
  $("#content").addClass("active");
  $("#sidebarCollapsePin").addClass("d-none");
});

//top nav
window.addEventListener("scroll", function (e) {
  e.preventDefault();
  if ($("#thisthehome").length == 0) {
    if (window.scrollY > 40) {
      document.getElementById("navbar_top").classList.add("fixed-top");
    } else {
      document.getElementById("navbar_top").classList.remove("fixed-top");
    }
  }
});

$("#page-notification").on("click", function (e) {
  e.preventDefault();
  $(this).closest("li").find(".body-notification").toggleClass("show");
});

//DataTable Attr.
var tableOption = {
  pageLength: 25,
  autoWidth: false,
  destroy: true,
  language: {
    paginate: {
      previous: '<i class="icofont-circled-left"></i>',
      next: '<i class="icofont-circled-right"></i>',
    },
  },
  lengthChange: false,
  info: false,
  retrieve: true,
  columnDefs: [
    {
      targets: "action",
      searchable: false,
      orderable: false,
    },
  ],
};

var columnLeft = function (table, list) {
  var left = 0;
  var leftAtt = [];

  var head = $(table).find("thead tr:eq(0) th");
  head.map(function (i, el) {
    if (
      el.className.indexOf("td-fixed") != -1 &&
      el.className.indexOf("d-none") == -1
    ) {
      var val = {};
      val.width = list[i];
      val.left = left;
      left += getTotalWidth($(el), list[i]);
      leftAtt.push(val);
    }
  });
  return leftAtt;
};

function getTotalWidth(obj, colWidth) {
  var total = colWidth;
  total +=
    parseInt(obj.css("padding-left"), 10) +
    parseInt(obj.css("padding-right"), 10); //Total Padding Width
  total +=
    parseInt(obj.css("margin-left"), 10) +
    parseInt(obj.css("margin-right"), 10); //Total Margin Width
  total +=
    parseInt(obj.css("borderLeftWidth"), 10) +
    parseInt(obj.css("borderRightWidth"), 10); //Total Border Width

  return isNaN(total) ? 0 : total;
}

function setTableWidth(obj, width, left) {
  obj.css("left", left);
  obj.css("min-width", width + "px");
  obj.css("max-width", width + "px");
}

function fixedColumn(obj, left) {
  const row = $(obj).find("tr");
  row.map(function (e, el) {
    for (let i = 0; i < left.length; i++) {
      var col = $(el).find(".td-fixed:eq(" + i + ")");
      setTableWidth(col, left[i].width, left[i].left);
    }
  });
}

//Select2 function
function initselect2(id, placeholder, parent = "") {
  $(id).select2({ placeholder: placeholder, dropdownParent: parent });
}

function clearselect2(id) {
  $(id).empty();
  $(id).append(new Option("", "", false, false)).trigger("change");
}

//Export file function
function exportExcelHeaderWithJson(url) {
  var items = [];
  var head = [];
  $.ajax({
    url: url,
    type: "get",
    dataType: "json",
    async: false,
    success: function (res) {
      $.each(res, function (key, val) {
        items.push(key);
        head.push(val);
      });
    },
  });
  return { key: items, header: head };
}

//Create Excel file By SheetJS
async function getExcelFormat(url) {
  let items = [];
  let head = [];
  $.ajax({
    url: url,
    type: "get",
    dataType: "json",
    success: function (res) {
      $.each(res, function (key, val) {
        items.push(key);
        head.push(val);
      });
    },
  });
  return { key: items, header: head };
}
