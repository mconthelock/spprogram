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
  const id = Math.floor(Math.random() * 100);
  //   <div class="toast-message toast toast-end z-50 alert-message w-80 max-w-80 transition-all duration-100"></div>
  const toast = `
          <div class="alert flex flex-col gap-2 overflow-hidden relative ${dt.bg} toast-message w-80 max-w-80 transition-all duration-300">
              <div class="msg-title text-xl font-semibold block w-full text-left ${dt.text}">${dt.title}</div>
              <div class="msg-txt block w-full text-left max-w-80 text-wrap ${dt.text}">${msg}</div>
              <div class="msg-close absolute top-2 right-5 z-10 cursor-pointer" id="msg-close-${id}">
                  <i class="icofont-ui-close"></i>
              </div>
              <div class="absolute right-[-30px] top-[-10px] text-[120px] z-0 opacity-20">
                  <i class="icofont-${dt.icon}"></i>
              </div>
          </div>
      </div>
    `;
  $(`#toast-alert`).append(toast);
  setTimeout(() => {
    $(`#msg-close-${id}`).click();
  }, 8325);
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
        // console.log(`${key}: ${value}`);
        msg += `<li>${value}</li>`;
      }
    });
    await showMessage(msg);
    return;
  } else {
    await showMessage(error.message, "error");
  }
};

export const showLoader = (val = true) => {
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

export const creatBtn = async (option = {}) => {
  const opt = {
    id: "btn-save",
    title: "Save Changes",
    icon: "icofont-save text-xl",
    className: "btn-primary",
    ...option,
  };

  if (opt.type == "link") {
    return `<a class="btn rounded-none transition delay-100 duration-300 ease-in-out ${opt.className}" type="button" id="${opt.id}" href="${opt.href}"}">
            <div class="loading loading-spinner hidden"></div>
            <div class="flex items-center gap-2">
                <i class="${opt.icon}"></i>
                <div>${opt.title}</div>
            </div>
        </a>`;
  }

  return `<button class="btn rounded-none transition delay-100 duration-300 ease-in-out ${opt.className}" type="button" id="${opt.id}">
            <div class="loading loading-spinner hidden"></div>
            <div class="flex items-center gap-2">
                <i class="${opt.icon}"></i>
                <div>${opt.title}</div>
            </div>
        </button>`;
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

export const fileExtension = (fileName) => {
  const dotIndex = fileName.lastIndexOf(".");
  if (dotIndex !== -1 && dotIndex < fileName.length - 1) {
    return fileName.substring(dotIndex + 1);
  } else {
    return null;
  }
};

export const fileIcons = () => {
  return [
    { ext: "xlsx", icon: `${process.env.APP_IMG}/fileicon/excel.png` },
    { ext: "csv", icon: `${process.env.APP_IMG}/fileicon/excel.png` },
    { ext: "docx", icon: `${process.env.APP_IMG}/fileicon/word.png` },
    { ext: "pptx", icon: `${process.env.APP_IMG}/fileicon/powerpoint.png` },
    { ext: "pdf", icon: `${process.env.APP_IMG}/fileicon/pdf.png` },
    { ext: "txt", icon: `${process.env.APP_IMG}/fileicon/txt-file.png` },
    { ext: "dwg", icon: `${process.env.APP_IMG}/fileicon/dwg-extension.png` },
    { ext: "tiff", icon: `${process.env.APP_IMG}/fileicon/dwg-extension.png` },
    { ext: "jpg", icon: `${process.env.APP_IMG}/fileicon/jpg.png` },
    { ext: "png", icon: `${process.env.APP_IMG}/fileicon/png.png` },
  ];
};

export const setInquiryNo = (val) => {
  return val
    .trim()
    .replace(/(\r\n|\n|\r)/g, "")
    .replaceAll(" ", "")
    .toUpperCase();
};

export const foundError = () => {
  window.location.href = `${process.env.APP_ENV}/authen/error/`;
};
