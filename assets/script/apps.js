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
