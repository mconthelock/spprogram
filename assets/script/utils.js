import moment from "moment";
export function showMessage(msg, type = "error") {
  const prop = [
    {
      id: "error",
      bg: "bg-red-800",
      text: "text-white",
      title: "Processing Fail!",
      icon: "exclamation-circle",
    },
    {
      id: "success",
      bg: "bg-green-800",
      text: "text-white",
      title: "Successfull!",
      icon: "exclamation-circle",
    },
    {
      id: "info",
      bg: "bg-blue-800",
      text: "text-white",
      title: "Information!",
      icon: "exclamation-circle",
    },
    {
      id: "warning",
      bg: "bg-yellow-800",
      text: "text-white",
      title: "Warning!",
      icon: "exclamation-circle",
    },
  ];

  const dt = prop.find((x) => x.id == type);
  const toast = `<div class="toast-message toast toast-end z-50 alert-message w-80 max-w-80 transition-all duration-1000">
          <div class="alert flex flex-col gap-2 overflow-hidden relative ${dt.bg}">
              <div class="msg-title text-xl font-semibold block w-full text-left ${dt.text}">${dt.title}</div>
              <div class="msg-txt block w-full text-left max-w-80 text-wrap ${dt.text}">${msg}</div>
              <div class="msg-close absolute top-2 right-5 z-10">
                  <i class="icofont-ui-close"></i>
              </div>
              <div class="absolute right-[-30px] top-[-10px] text-[120px] z-0 opacity-20">
                  <i class="icofont-${dt.icon}"></i>
              </div>
          </div>
      </div>
  </div>
    `;
  $(document.body).append(toast);
  setTimeout(() => {
    $(".msg-close").click();
  }, 3000);
}

export const errorMessage = async function (error) {
  if (error.responseJSON) {
    const message = error.responseJSON.message;
    if (typeof message == "string") {
      await showMessage(message);
      return;
    }
    let msg = ``;
    error.responseJSON.message.map((val) => {
      for (const [key, value] of Object.entries(val)) {
        console.log(`${key}: ${value}`);
        msg += `<li>${value}</li>`;
      }
    });
    await showMessage(msg);
    return;
  } else {
    await showMessage(error.message, "error");
  }
};

export const showLoader = (val) => {
  $("#loading-box").prop("checked", val);
};

export const showConfirm = (
  func,
  title,
  message,
  icon,
  key = "",
  text = false
) => {
  $("#confirm_accept").addClass(func);
  $("#confirm_accept").attr("data-function", func);
  $("#confirm_title").html(`${icon}${title}`);
  $("#confirm_message").html(message);
  $("#confirm_key").val(key);
  if (text) {
    $("#confirm_reason").removeClass("hidden");
  }
};

export const intVal = function (i) {
  return typeof i === "string"
    ? i.replace(/[\$,]/g, "") * 1
    : typeof i === "number"
    ? i
    : 0;
};

export const digits = function (n, digit) {
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

export const amecschdule = (data) => {
  const schd = [
    { id: "05", val: "X" },
    { id: "10", val: "A" },
    { id: "15`", val: "Y" },
    { id: "20", val: "B" },
    { id: "25", val: "Z" },
    { id: "28", val: "Z" },
    { id: "29", val: "Z" },
    { id: "30", val: "Z" },
    { id: "31", val: "Z" },
  ];
  const fd = moment(data).format("YYYYMM");
  const dd = moment(data).format("DD");
  const letter = schd.find((x) => x.id == dd);
  return `${fd}${letter.val}`;
};
