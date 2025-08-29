import moment from "moment";
import { initAuthen } from "@public/authen.js";
import { showbgLoader } from "@public/preloader";

export const initApp = async (opt = {}) => {
  try {
    await initAuthen({
      loader: false,
      icon: `${process.env.APP_ENV}/assets/images/cube.png`,
      programName: "SP PROGRAM",
      sidebarClass: `size-xl text-gray-50 bg-primary md:h-[calc(100vh-2.5rem)]! md:rounded-3xl! md:py-5 md:shadow-lg`,
    });

    $(".mainmenu").find("details").attr("open", false);
    if (opt.submenu !== undefined) {
      $(`.mainmenu${opt.submenu}`).find("details").attr("open", true);
    }
  } catch (error) {
    console.log(error);
  }
  await new Promise((r) => setTimeout(r, 500));
  return;
};

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

export const showLoader = (opt = { show: true }) => {
  $("#loading-box").prop("checked", opt.show);
  $("#loading-box-modal")
    .find("h1")
    .html(`${opt.title == undefined ? "Loading" : opt.title}`);
  if (opt.clsbox !== undefined)
    $("#loading-box-modal")
      .find(".modal-box")
      .addClass(opt.clsbox)
      .removeClass("glass");
};

export const tableOpt = {
  language: {
    info: "Showing _START_ to _END_ from _TOTAL_ records",
    infoEmpty: "",
    paginate: {
      previous: '<i class="fi fi-br-arrow-alt-circle-left"></i>',
      next: '<i class="fi fi-br-arrow-alt-circle-right"></i>',
      first: '<i class="fi fi-rs-angle-double-small-left"></i>',
      last: '<i class="fi fi-rs-angle-double-small-right"></i>',
    },
    search: "",
    searchPlaceholder: "Search...",
    loadingRecords: `<span class="loading loading-spinner loading-xl"></span>`,
    emptyTable: `<span class="text-[14px] text-gray-600 font-medium">Have no record found</span>`,
    zeroRecords: "ไม่พบข้อมูลที่ต้องการ",
    lengthMenu: "_MENU_",
    infoFiltered: "(กรองข้อมูลจากทั้งหมด _MAX_ รายการ)",
  },
};

export const showConfirm = (
  class_function,
  title,
  message,
  icon,
  key = "",
  text = false
) => {
  $("#confirm_accept").addClass(class_function);
  $("#confirm_accept").attr("data-function", class_function);
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

export const revision_code = (current) => {
  if (current === "*") return "A";
  const recursive = (val) => {
    if (/^[A-Z]$/.test(val)) {
      if (val === "Z") {
        return "A";
      }
      return String.fromCharCode(val.charCodeAt(0) + 1);
    }
    return val;
  };
  let chars = current.split("");
  let nb = chars.length - 1;
  for (var i = nb; i >= 0; i--) {
    chars[i] = recursive(chars[i]);
    if (chars[i] != "A") break;
  }
  return chars.join("");
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

export const foundError = async (error) => {
  const message = async (error) => {
    if (error.responseJSON) {
      const message = error.responseJSON.message;
      if (typeof message == "string") {
        return message;
      }
      let msg = ``;
      error.responseJSON.message.map((val) => {
        for (const [key, value] of Object.entries(val)) {
          msg += `<li>${value}</li>`;
        }
      });
      return msg;
    } else {
      return error.message;
    }
  };

  const loop = localStorage.getItem("sperrorloop") || 0;
  const msg = await message(error);
  const text =
    msg !== undefined || typeof msg == "string" ? msg : "Connection Lost";
  $("#handleErrorBox").prop("checked", true);
  $("#handleErrorBox_msg h1").append(`${text}`);
  let count = 3;
  const el = document.getElementById("countdown");
  el.style.setProperty("--value", count);
  el.setAttribute("aria-label", count);
  const timer = setInterval(() => {
    count--;
    el.style.setProperty("--value", count);
    el.setAttribute("aria-label", count);
    el.textContent = count;
    if (count <= 0) {
      clearInterval(timer);
      localStorage.setItem("sperrorloop", intVal(loop) + 1);
      if (loop >= 3) {
        localStorage.removeItem("sperrorloop");
        window.location.href = `${process.env.APP_ENV}/authen/error/`;
        return;
      }
      window.location.reload();
    }
  }, 1000);
  //
};

export const displayname = (val) => {
  if (val == null) return "";
  const fullname = val.toLowerCase();
  const name = fullname.split(/\s+/);
  const fname = name[0].charAt(0).toUpperCase() + name[0].slice(1);
  const lname = name[1].charAt(0).toUpperCase() + name[1].slice(1);
  return { sname: `${fname} ${lname}`, fname, lname };
};

//Excel
export const cloneRows = async (worksheet, sourceRowNum, targetRowNum) => {
  const sourceRow = worksheet.getRow(sourceRowNum);
  const newRow = worksheet.insertRow(targetRowNum);
  sourceRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    const newCell = newRow.getCell(colNumber);
    if (cell.style) {
      newCell.style = { ...cell.style };
    }
  });
  newRow.height = sourceRow.height;
};
