import "@flaticon/flaticon-uicons/css/all/all.css";

$(document).on("click", ".msg-close", function () {
  const msgbox = $(this).closest(".toast-message");
  msgbox.addClass("opacity-0");
  setTimeout(function () {
    msgbox.remove();
  }, 1000);
});
