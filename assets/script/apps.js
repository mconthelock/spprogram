import "@flaticon/flaticon-uicons/css/all/all.css";

$(document).on("click", ".msg-close", function (e) {
  const msgbox = $(this).closest(".alert");
  msgbox.remove();
});

$("#confirm_close").on("click", function () {
  $("#confirm_reason").val("");
});
