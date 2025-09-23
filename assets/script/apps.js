import "@flaticon/flaticon-uicons/css/all/all.css";

$(document).on("click", ".msg-close", function (e) {
  const msgbox = $(this).closest(".alert");
  msgbox.remove();
});

$(document).on("click", ".mainmenu", function () {
  const m = $(".mainmenu").length;
  $(".mainmenu").map((i, el) => {
    $(el).find("details").removeAttr("open");
  });
});

$("#confirm_close").on("click", function () {
  $("#confirm_reason").val("");
});
