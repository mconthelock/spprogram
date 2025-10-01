import "@flaticon/flaticon-uicons/css/all/all.css";

$(document).on("click", ".msg-close", function (e) {
  const msgbox = $(this).closest(".alert");
  msgbox.remove();
});

$(document).on("click", ".mainmenu summary", function () {
  const m = $(".mainmenu").length;
  $(".mainmenu").map((i, el) => {
    $(el).find("details").removeAttr("open");
  });
});

$(document).on("click", "a.menu-name", async function (e) {
  e.preventDefault();
  const link = $(this).attr("href");
  if (link.includes("mar/inquiry/report")) {
    localStorage.removeItem("spinquiryquery");
  }
  window.location.href = link;
});

$("#confirm_close").on("click", function () {
  $("#confirm_reason").val("");
});

$(document).on("focus", ".input-number", function (e) {
  this.select();
});

$(document).on("keyup", ".input-number", function (e) {
  let value = $(this).val();
  value = value.replace(/[^\d.-]/g, ""); // เอาเฉพาะตัวเลข จุด และ -
  value = value.replace(/(?!^)-/g, ""); // ให้ - มีได้แค่ตัวเดียว และต้องอยู่ข้างหน้า
  // จัดการจุด ให้มีได้แค่ 1 จุด
  const parts = value.split(".");
  if (parts.length > 2) value = parts[0] + "." + parts.slice(1).join("");
  $(this).val(value);
});

$(document).on("click", "#goback", async function (e) {
  e.preventDefault();
  window.history.back();
});
