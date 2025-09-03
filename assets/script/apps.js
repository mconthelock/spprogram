import "@flaticon/flaticon-uicons/css/all/all.css";

$(document).on("click", ".msg-close", function (e) {
  const msgbox = $(this).closest(".alert");
  msgbox.remove();
});
